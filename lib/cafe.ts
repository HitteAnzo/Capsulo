import fs from "fs";
import path from "path";

export type CafeRow = {
  year: number;
  price_frf_unit?: number;
  price_eur_unit?: number;
};

let cache: CafeRow[] | null = null;

export function loadCafe(): CafeRow[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "cafe_1960_2024.csv");
  try {
    const raw = fs.readFileSync(p, "utf8");
    const lines = raw.trim().split(/\r?\n/);
    const out: CafeRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [ys, frf, eur] = lines[i].split(",");
      const year = Number(ys);
      const price_frf_unit = frf ? Number(frf) : undefined;
      const price_eur_unit = eur ? Number(eur) : undefined;
      if (!Number.isNaN(year)) {
        out.push({ year, price_frf_unit, price_eur_unit });
      }
    }
    cache = out;
    return out;
  } catch (error) {
    console.error(
      "[ERREUR] Impossible de lire le fichier data/cafe_1960_2024.csv.",
      error
    );
    return [];
  }
}

export function getCafeForYear(year: number): CafeRow | undefined {
  return loadCafe().find((r) => r.year === year);
}