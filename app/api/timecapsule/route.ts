import { NextRequest, NextResponse } from "next/server";
import type { TimeCapsule } from "../../../lib/types";
import { inflationFactor } from "../../../lib/cpi";
import { baguetteForYear } from "../../../lib/baguette";
import { cigaretteForYear } from "../../../lib/cigarette";
import { gazoleForYear } from "../../../lib/gazole";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

const CURRENT_YEAR = 2025;
const TMDB_KEY = process.env.TMDB_KEY;

// ----------------------
// Helpers
// ----------------------
const WIKI_SUMMARY = (title: string, lang: string) =>
  `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

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

// ----------------------
// Musique (CSV + Deezer enrichi)
// ----------------------
async function fetchMusic(year: number) {
  const filePath = path.join(process.cwd(), "data/music.csv");
  type Row = { year: string; title: string; artist: string; deezerId?: string };
  const rows: Row[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: any) => {
        const y = parseInt(row.year);
        const id = (row.deezerId || "").toString().trim();
        if (y === year && id) {
          rows.push({
            year: row.year,
            title: row.title,
            artist: row.artist,
            deezerId: id,
          });
        }
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });

  // Appel Deezer pour récupérer preview + lien
  const enriched = await Promise.all(
    rows.map(async (row) => {
      try {
        const res = await fetch(`https://api.deezer.com/track/${row.deezerId}`, {
          next: { revalidate: 86400 },
        });
        const j = await res.json();
        if (!j?.id) {
          return {
            title: row.title,
            artist: row.artist,
            deezerId: row.deezerId!,
            preview: undefined,
            deezerUrl: undefined,
          };
        }
        return {
          title: j.title ?? row.title,
          artist: j.artist?.name ?? row.artist,
          deezerId: String(j.id),
          // On garde la vraie URL pour debug, mais on conseillera le proxy en front
          preview: j.preview || undefined,
          deezerUrl: j.link || undefined,
        };
      } catch {
        return {
          title: row.title,
          artist: row.artist,
          deezerId: row.deezerId!,
          preview: undefined,
          deezerUrl: undefined,
        };
      }
    })
  );

  return enriched.filter(Boolean);
}

// ----------------------
// Films (CSV + TMDB affiches)
// ----------------------
async function fetchMovies(year: number, lang: string) {
  const filePath = path.join(process.cwd(), "data/movies_boxoffice_fr.csv");
  const movies: { title: string; poster?: string }[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (parseInt(row.year) === year) movies.push({ title: row.title });
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });

  if (!TMDB_KEY) return movies;

  const enriched = await Promise.all(
    movies.map(async (m) => {
      try {
        const q = encodeURIComponent(m.title);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${q}&year=${year}&language=${lang}`;
        const res = await fetch(url, { next: { revalidate: 604800 } });
        const j = await res.json();
        if (j?.results?.length) {
          const film = j.results[0];
          return {
            title: m.title,
            poster: film.poster_path
              ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
              : undefined,
          };
        }
      } catch {}
      return { title: m.title, poster: undefined };
    })
  );

  return enriched;
}

// ----------------------
// Pain
// ----------------------
async function fetchBread(year: number) {
  const b = baguetteForYear(year);
  const factor = inflationFactor(year, CURRENT_YEAR);
  let real = undefined as number | undefined;
  if (factor && (b?.price_eur_250g || b?.price_frf_250g)) {
    const nominalEUR = b.price_eur_250g ?? b.price_frf_250g! / 6.55957;
    real = nominalEUR * factor;
  }
  return {
    nominal: b?.price_eur_250g ?? undefined,
    currency: b?.price_eur_250g ? "EUR" : undefined,
    frf_250g: b?.price_frf_250g,
    eur_250g:
      b?.price_eur_250g ??
      (b?.price_frf_250g ? b.price_frf_250g / 6.55957 : undefined),
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

async function fetchCigarette(year: number) {
  const c = cigaretteForYear(year);
  if (!c) return undefined;

  const factor = inflationFactor(year, CURRENT_YEAR);
  let real: number | undefined;
  if (factor && (c.price_eur_pack || c.price_frf_pack)) {
    const nominalEUR = c.price_eur_pack ?? c.price_frf_pack! / 6.55957;
    real = nominalEUR * factor;
  }
  return {
    nominal: c.price_eur_pack,
    currency: c.price_eur_pack ? "EUR" : undefined,
    frf_pack: c.price_frf_pack,
    eur_pack:
      c.price_eur_pack ??
      (c.price_frf_pack ? c.price_frf_pack / 6.55957 : undefined),
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

async function fetchGazole(year: number) {
  const g = gazoleForYear(year);
  if (!g) return undefined;

  const factor = inflationFactor(year, CURRENT_YEAR);
  let real: number | undefined;
  if (factor && (g.price_eur_litre || g.price_frf_litre)) {
    const nominalEUR = g.price_eur_litre ?? g.price_frf_litre! / 6.55957;
    real = nominalEUR * factor;
  }
  return {
    nominal: g.price_eur_litre,
    currency: g.price_eur_litre ? "EUR" : undefined,
    frf_litre: g.price_frf_litre,
    eur_litre:
      g.price_eur_litre ??
      (g.price_frf_litre ? g.price_frf_litre / 6.55957 : undefined),
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

// ----------------------
// Mode
// ----------------------
async function fetchFashion(year: number, lang: string) {
  const decade = Math.floor(year / 10) * 10;
  const title =
    lang === "fr"
      ? `Mode des années ${decade}`
      : `Fashion in the ${decade}s`;
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

// ----------------------
// GET handler
//  - ?previewId=123 : stream le MP3 Deezer (proxy côté serveur)
//  - sinon : renvoie la capsule pour l'année
// ----------------------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // --------- Mode "proxy preview"
  const previewId = url.searchParams.get("previewId");
  if (previewId) {
    try {
      const meta = await fetch(`https://api.deezer.com/track/${previewId}`, {
        next: { revalidate: 86400 },
      }).then((r) => r.json());

      const previewUrl = meta?.preview;
      if (!previewUrl) {
        return NextResponse.json(
          { error: "Aucun preview pour ce trackId." },
          { status: 404 }
        );
      }

      const upstream = await fetch(previewUrl, {
        // Pas de revalidate ici: on streame
      });

      if (!upstream.ok || !upstream.body) {
        return NextResponse.json(
          { error: "Impossible de récupérer le flux preview." },
          { status: 502 }
        );
      }

      // On renvoie le flux MP3 depuis notre domaine => pas de CSP externe
      return new NextResponse(upstream.body, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Erreur proxy preview." },
        { status: 500 }
      );
    }
  }

  // --------- Mode "capsule annuelle"
  const year = Number(url.searchParams.get("year"));
  const lang = (url.searchParams.get("lang") || "fr").toLowerCase();

  if (!year || year < 1960 || year > 2025) {
    return NextResponse.json(
      {
        error:
          lang === "fr"
            ? "Année invalide (1960–2025)"
            : "Invalid year (1960–2025)",
      },
      { status: 400 }
    );
  }

  const [events, music, movies, bread, fashion, cigarette, gazole] =
    await Promise.all([
      fetchEvents(year, lang),
      fetchMusic(year),
      fetchMovies(year, lang),
      fetchBread(year),
      fetchFashion(year, lang),
      fetchCigarette(year),
      fetchGazole(year),
    ]);

  const payload: TimeCapsule = {
    year,
    events,
    music, // contient toujours { title, artist, deezerId, preview?, deezerUrl? }
    movies,
    breadPrice: bread,
    cigarettePrice: cigarette,
    gazolePrice: gazole,
    fashion,
  };

  return NextResponse.json(payload);
}
