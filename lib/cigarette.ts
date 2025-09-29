import fs from "fs";
import path from "path";

export type CigaretteRow = {
  year: number;
  price_frf_pack?: number;
  price_eur_pack?: number;
};

let cache: CigaretteRow[] | null = null;

export function loadCigarette(): CigaretteRow[] {
  if (cache) return cache;
  // On s'assure que le chemin est correct
  const p = path.join(process.cwd(), "data", "cigarette.csv");

  try {
    const raw = fs.readFileSync(p, "utf8");
    const lines = raw.trim().split(/\r?\n/);
    const out: CigaretteRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const [ys, frf, eur] = lines[i].split(",");
      const year = Number(ys);
      const price_frf_pack = frf ? Number(frf) : undefined;
      const price_eur_pack = eur ? Number(eur) : undefined;
      if (!Number.isNaN(year)) {
        out.push({ year, price_frf_pack, price_eur_pack });
      }
    }
    console.log(
      `[OK] Fichier cigarette.csv chargé, ${out.length} lignes trouvées.`
    );
    cache = out;
    return out;
  } catch (error) {
    console.error(
      "[ERREUR] Impossible de lire le fichier data/cigarette.csv. Vérifiez que le fichier existe et que le nom est correct.",
      error
    );
    return []; // On retourne un tableau vide pour éviter un crash
  }
}

export function cigaretteForYear(year: number): CigaretteRow | undefined {
  const data = loadCigarette();
  const result = data.find((r) => r.year === year);
  if (!result) {
    console.log(`[INFO] Aucune donnée de cigarette trouvée pour l'année ${year}.`);
  }
  return result;
}