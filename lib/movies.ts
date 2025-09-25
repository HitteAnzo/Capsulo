import fs from "fs";
import path from "path";

export type MovieRow = { year: number; title: string };

let cache: MovieRow[] | null = null;

export function loadMoviesCSV(): MovieRow[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "movies_boxoffice_fr.csv");
  const raw = fs.readFileSync(p, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  const out: MovieRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Handles titles with commas by assuming CSV is simple (no quoted commas in your data)
    const firstComma = line.indexOf(",");
    if (firstComma === -1) continue;
    const ys = line.slice(0, firstComma).trim();
    const title = line.slice(firstComma + 1).trim();
    const year = Number(ys);
    if (!Number.isNaN(year) && title) out.push({ year, title });
  }
  cache = out;
  return out;
}

export function moviesForYear(year: number): string[] {
  return loadMoviesCSV()
    .filter(r => r.year === year)
    .slice(0, 3) // par sécurité, borne à 3
    .map(r => r.title);
}
