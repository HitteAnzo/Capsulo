import fs from "fs";
import path from "path";

export type GoldRow = {
  year: number;
  price_frf_kg?: number;
  price_eur_kg?: number;
};

let cache: GoldRow[] | null = null;

export function loadGold(): GoldRow[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "or_kilo_1960_2024_option1.csv");
  try {
    const raw = fs.readFileSync(p, "utf8");
    const lines = raw.trim().split(/\r?\n/);
    const out: GoldRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [ys, frf, eur] = lines[i].split(",");
      const year = Number(ys);
      const price_frf_kg = frf ? Number(frf) : undefined;
      const price_eur_kg = eur ? Number(eur) : undefined;
      if (!Number.isNaN(year)) {
        out.push({ year, price_frf_kg, price_eur_kg });
      }
    }
    console.log(`[OK] Fichier or_kilo_1960_2024_option1.csv chargé, ${out.length} lignes trouvées.`);
    cache = out;
    return out;
  } catch (error) {
    console.error(
      "[ERREUR] Impossible de lire le fichier data/or_kilo_1960_2024_option1.csv.",
      error
    );
    return [];
  }
}

export function getGoldForYear(year: number): GoldRow | undefined {
  return loadGold().find((r) => r.year === year);
}