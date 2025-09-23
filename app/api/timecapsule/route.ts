import { NextRequest, NextResponse } from "next/server";
import type { TimeCapsule } from "../../../lib/types";
import { inflationFactor } from "../../../lib/cpi";
import { baguetteForYear } from "../../../lib/baguette";
import { frenchArtistsForYearOrDecade } from "../../../lib/artists";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;
const CURRENT_YEAR = 2025;

const WIKI_SUMMARY = (title: string, lang: string) =>
  `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
const DEEZER_SEARCH = (q: string) =>
  `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=12`;
const OMDB_SEARCH = (year: number) =>
  `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&y=${year}&type=movie&s=the`;

async function fetchJSON(input: string, init?: RequestInit) {
  const r = await fetch(input, { ...init, next: { revalidate: 86400 } });
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`);
  return r.json();
}

async function fetchEvents(year: number, lang: string) {
  const titles = [
    lang === "fr" ? `${year} en musique` : `${year} in music`,
    lang === "fr" ? `${year} au cinéma` : `${year} in film`,
    lang === "fr" ? `${year} en mode` : `${year} in fashion`,
    `${year}`,
  ];
  const seen = new Set<string>();
  const items: { title: string; summary: string; url: string }[] = [];
  for (const t of titles) {
    try {
      const j = await fetchJSON(WIKI_SUMMARY(t, lang));
      if (j?.title && !seen.has(j.title)) {
        seen.add(j.title);
        items.push({
          title: j.title,
          summary: j.extract,
          url: j.content_urls?.desktop?.page,
        });
      }
      if (items.length >= 5) break;
    } catch {}
  }
  if (!items.length && lang === "fr") return fetchEvents(year, "en");
  return items;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchMusic(year: number) {
  const artists = frenchArtistsForYearOrDecade(year);
  const buckets: any[] = [];

  // 1) recherche générale par année
  try {
    const j = await fetchJSON(DEEZER_SEARCH(`year:"${year}"`));
    if (j?.data) buckets.push(...j.data);
  } catch {}

  // 2) recherches ciblées artistes FR de l'année/décennie
  await Promise.all(
    artists.slice(0, 10).map(async (name) => {
      try {
        const jq = await fetchJSON(DEEZER_SEARCH(`artist:"${name}" year:"${year}"`));
        if (jq?.data?.length) buckets.push(...jq.data);
      } catch {}
    })
  );

  // 3) dédupe (artist+title), priorité preview, mélange
  const seen = new Set<string>();
  const uniq = buckets.filter((t) => {
    const key = `${t.artist?.name ?? ""}::${t.title ?? ""}`.toLowerCase();
    if (!t.title || !t.artist?.name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const withPrev = uniq.filter((t) => !!t.preview);
  const withoutPrev = uniq.filter((t) => !t.preview);
  const mixed = shuffle([...withPrev, ...withoutPrev]).slice(0, 10);

  return mixed.map((t: any) => ({
    title: t.title,
    artist: t.artist?.name,
    previewUrl: t.preview || undefined,
    deezerUrl: t.link,
  }));
}

async function fetchMovies(year: number) {
  if (!process.env.OMDB_KEY) return [];
  try {
    const j = await fetchJSON(OMDB_SEARCH(year));
    return (j.Search || []).slice(0, 9).map((m: any) => ({
      title: m.Title,
      poster: m.Poster && m.Poster !== "N/A" ? m.Poster : undefined,
      omdbUrl: `https://www.imdb.com/title/${m.imdbID}/`,
    }));
  } catch {
    return [];
  }
}

async function fetchBread(year: number) {
  const b = baguetteForYear(year);
  const factor = inflationFactor(year, CURRENT_YEAR);
  let real = undefined as number | undefined;
  if (factor && (b?.price_eur_250g || b?.price_frf_250g)) {
    const nominalEUR = b.price_eur_250g ?? b!.price_frf_250g! / 6.55957;
    real = nominalEUR * factor;
  }

  return {
    nominal: b?.price_eur_250g ?? undefined,
    currency: b?.price_eur_250g ? "EUR" : undefined,
    frf_250g: b?.price_frf_250g,
    eur_250g: b?.price_eur_250g ?? (b?.price_frf_250g ? b.price_frf_250g / 6.55957 : undefined),
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

async function fetchFashion(year: number, lang: string) {
  const decade = Math.floor(year / 10) * 10;
  const title = lang === "fr" ? `Mode des années ${decade}` : `Fashion in the ${decade}s`;
  try {
    const j = await fetchJSON(WIKI_SUMMARY(title, lang));
    return [
      {
        headline: j.title,
        image: j.thumbnail?.source,
        sourceUrl: j.content_urls?.desktop?.page,
      },
    ];
  } catch {
    if (lang === "fr") return fetchFashion(year, "en");
    return [];
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year"));
  const lang = (url.searchParams.get("lang") || "fr").toLowerCase();

  if (!year || year < MIN_YEAR || year > MAX_YEAR) {
    return NextResponse.json(
      {
        error:
          lang === "fr"
            ? `Année invalide (${MIN_YEAR}–${MAX_YEAR})`
            : `Invalid year (${MIN_YEAR}–${MAX_YEAR})`,
      },
      { status: 400 }
    );
  }

  const [events, music, movies, bread, fashion] = await Promise.all([
    fetchEvents(year, lang),
    fetchMusic(year),
    fetchMovies(year),
    fetchBread(year),
    fetchFashion(year, lang),
  ]);

  const payload: TimeCapsule = { year, events, music, movies, breadPrice: bread, fashion };
  return NextResponse.json(payload);
}

