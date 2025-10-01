import { NextRequest, NextResponse } from "next/server";
import type { TimeCapsule } from "../../../lib/types";
import { inflationFactor } from "../../../lib/cpi";
import { baguetteForYear } from "../../../lib/baguette";
import { cigaretteForYear } from "../../../lib/cigarette";
import { gazoleForYear } from "../../../lib/gazole";
import { getSmicForYear } from "../../../lib/smic";
import { getGoldForYear } from "../../../lib/gold";
import { getCafeForYear } from "../../../lib/cafe";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

const CURRENT_YEAR = 2025;
const TMDB_KEY = process.env.TMDB_KEY;

// ----------------------
// Helpers
// ----------------------
const WIKI_SUMMARY = (title: string) =>
  `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

async function fetchJSON(input: string, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

// ----------------------
// Événements (Wikipedia)
// ----------------------
async function fetchEvents(year: number) {
  const titles = [
    `${year} en musique`,
    `${year} au cinéma`,
    `${year} en mode`,
    `${year}`,
  ];
  const seen = new Set<string>();
  const items: { title: string; summary: string; url: string }[] = [];
  for (const t of titles) {
    try {
      const j = await fetchJSON(WIKI_SUMMARY(t));
      if (j?.title && !seen.has(j.title)) {
        seen.add(j.title);
        items.push({
          title: j.title,
          summary: j.summary,
          url: j.content_urls?.desktop?.page,
        });
      }
      if (items.length >= 5) break;
    } catch {}
  }
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
          cache: "no-store", // Ne pas mettre en cache la réponse de Deezer
        });
        const j = await res.json();
        if (!j?.id) {
          return {
            title: row.title,
            artist: row.artist,
            deezerId: row.deezerId!,
            previewUrl: undefined, // Renommer 'preview' en 'previewUrl'
            deezerUrl: undefined,
          };
        }
        return {
          title: j.title ?? row.title,
          artist: j.artist?.name ?? row.artist,
          deezerId: String(j.id),
          previewUrl: j.preview || undefined, // Renommer 'preview' en 'previewUrl'
          deezerUrl: j.link || undefined,
        };
      } catch {
        return {
          title: row.title,
          artist: row.artist,
          deezerId: row.deezerId!,
          previewUrl: undefined, // Renommer 'preview' en 'previewUrl'
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
async function fetchMovies(year: number) {
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
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${q}&year=${year}&language=fr`;
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
// SMIC
// ----------------------
async function fetchSmic(year: number) {
  const s = getSmicForYear(year);
  if (!s) return undefined;

  const factor = inflationFactor(year, CURRENT_YEAR);
  let real: number | undefined;
  if (factor && s.eur) {
    real = s.eur * factor;
  }
  return {
    nominal: s.eur,
    currency: "EUR",
    frf_monthly: s.frf,
    eur_monthly: s.eur,
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

// ----------------------
// Or
// ----------------------
async function fetchGold(year: number) {
  const g = getGoldForYear(year);
  if (!g) return undefined;

  const factor = inflationFactor(year, CURRENT_YEAR);
  let real: number | undefined;
  if (factor && (g.price_eur_kg || g.price_frf_kg)) {
    const nominalEUR = g.price_eur_kg ?? g.price_frf_kg! / 6.55957;
    real = nominalEUR * factor;
  }
  return {
    nominal: g.price_eur_kg,
    currency: "EUR",
    frf_kg: g.price_frf_kg,
    eur_kg: g.price_eur_kg,
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

// ----------------------
// Café
// ----------------------
async function fetchCafe(year: number) {
  const c = getCafeForYear(year);
  if (!c) return undefined;

  const factor = inflationFactor(year, CURRENT_YEAR);
  let real: number | undefined;
  if (factor && (c.price_eur_unit || c.price_frf_unit)) {
    const nominalEUR = c.price_eur_unit ?? c.price_frf_unit! / 6.55957;
    real = nominalEUR * factor;
  }
  return {
    nominal: c.price_eur_unit,
    currency: "EUR",
    frf_unit: c.price_frf_unit,
    eur_unit: c.price_eur_unit,
    method: factor ? ("cpi" as const) : ("dataset" as const),
    real2025: real,
  };
}

// ----------------------
// Mode
// ----------------------
async function fetchFashion(year: number) {
  const decade = Math.floor(year / 10) * 10;
  const title = `Mode des années ${decade}`;
  try {
    const j = await fetchJSON(WIKI_SUMMARY(title));
    return [
      {
        headline: j.title,
        image: j.thumbnail?.source,
        sourceUrl: j.content_urls?.desktop?.page,
      },
    ];
  } catch {
    return [];
  }
}

// ----------------------
// GET handler
// ----------------------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // --------- Mode "proxy preview"
  const previewId = url.searchParams.get("previewId");
  if (previewId) {
    try {
      const meta = await fetch(`https://api.deezer.com/track/${previewId}`, {
        cache: "no-store", // URL toujours fraîche
      }).then((r) => r.json());

      const previewUrl = meta?.preview;
      if (!previewUrl) {
        return NextResponse.json(
          { error: "Aucun preview pour ce trackId." },
          { status: 404 }
        );
      }

      // Ajout retry + timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      let upstream: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          upstream = await fetch(previewUrl, {
            signal: controller.signal,
            cache: "no-store",
          });
          if (upstream.ok && upstream.body) break;
        } catch {}
        await new Promise((r) => setTimeout(r, 150));
      }
      clearTimeout(timeout);

      if (!upstream || !upstream.ok || !upstream.body) {
        return NextResponse.json(
          { error: "Impossible de récupérer le flux preview." },
          { status: 502 }
        );
      }

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

  if (!year || year < 1960 || year > 2025) {
    return NextResponse.json(
      {
        error: "Année invalide (1960–2025)",
      },
      { status: 400 }
    );
  }

  const [
    events,
    music,
    movies,
    bread,
    fashion,
    cigarette,
    gazole,
    smic,
    gold,
    cafe,
  ] = await Promise.all([
    fetchEvents(year),
    fetchMusic(year),
    fetchMovies(year),
    fetchBread(year),
    fetchFashion(year),
    fetchCigarette(year),
    fetchGazole(year),
    fetchSmic(year),
    fetchGold(year),
    fetchCafe(year),
  ]);

  const payload: TimeCapsule = {
    year,
    events,
    music,
    movies,
    breadPrice: bread,
    cigarettePrice: cigarette,
    gazolePrice: gazole,
    smicPrice: smic,
    goldPrice: gold,
    cafePrice: cafe,
    fashion,
  };

  return NextResponse.json(payload);
}
