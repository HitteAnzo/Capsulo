import fs from "fs";
import path from "path";

export type BaguetteRow = { year: number; price_frf_250g?: number; price_eur_250g?: number };

let cache: BaguetteRow[] | null = null;

export function loadBaguette(): BaguetteRow[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "baguette_fr_1954_2019.csv");
  const raw = fs.readFileSync(p, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  const out: BaguetteRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [ys, frf, eur] = lines[i].split(",");
    const year = Number(ys);
    const price_frf_250g = frf ? Number(frf) : undefined;
    const price_eur_250g = eur ? Number(eur) : undefined;
    if (!Number.isNaN(year)) out.push({ year, price_frf_250g, price_eur_250g });
  }
  cache = out;
  return out;
}

export function baguetteForYear(year: number): BaguetteRow | undefined {
  return loadBaguette().find(r => r.year === year);
}
