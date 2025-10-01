import fs from "fs";
import path from "path";

type SmicData = {
  frf?: number;
  eur?: number;
};

// Met en cache les données pour éviter de lire le fichier à chaque requête
let smicCache: Map<number, SmicData> | null = null;

function parseSmicCsv(): Map<number, SmicData> {
  if (smicCache) {
    return smicCache;
  }

  const csvPath = path.join(process.cwd(), "data", "smic_mensuel_1960_2024.csv");
  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const lines = fileContent.trim().split("\n");
  const data = new Map<number, SmicData>();

  // Ignore la ligne d'en-tête (annee,smig_smic_francs,smig_smic_euros)
  for (let i = 1; i < lines.length; i++) {
    const [yearStr, frfStr, eurStr] = lines[i].split(",");
    const year = parseInt(yearStr, 10);
    
    // Gère les valeurs post-2002 où le franc n'est plus la référence
    const frf = year < 2002 ? parseFloat(frfStr) : undefined;
    const eur = parseFloat(eurStr);

    if (!isNaN(year)) {
      data.set(year, {
        frf: frf,
        eur: !isNaN(eur) ? eur : undefined,
      });
    }
  }

  smicCache = data;
  return data;
}

/**
 * Récupère la valeur du SMIC mensuel brut pour une année donnée.
 * @param year L'année pour laquelle récupérer les données.
 * @returns Un objet avec les valeurs en francs et/ou en euros, ou undefined si l'année n'est pas trouvée.
 */
export function getSmicForYear(year: number): SmicData | undefined {
  const smicData = parseSmicCsv();
  return smicData.get(year);
}