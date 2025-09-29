import fs from "fs";
import path from "path";

export type GazoleRow = {
  year: number;
  price_frf_litre?: number;
  price_eur_litre?: number;
};

let cache: GazoleRow[] | null = null;

export function loadGazole(): GazoleRow[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "gazole.csv");
  try {
    const raw = fs.readFileSync(p, "utf8");
    const lines = raw.trim().split(/\r?\n/);
    const out: GazoleRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [ys, frf, eur] = lines[i].split(",");
      const year = Number(ys);
      const price_frf_litre = frf ? Number(frf) : undefined;
      const price_eur_litre = eur ? Number(eur) : undefined;
      if (!Number.isNaN(year)) {
        out.push({ year, price_frf_litre, price_eur_litre });
      }
    }
    console.log(`[OK] Fichier gazole.csv chargé, ${out.length} lignes trouvées.`);
    cache = out;
    return out;
  } catch (error) {
    console.error(
      "[ERREUR] Impossible de lire le fichier data/gazole.csv.",
      error
    );
    return [];
  }
}

export function gazoleForYear(year: number): GazoleRow | undefined {
  return loadGazole().find((r) => r.year === year);
}