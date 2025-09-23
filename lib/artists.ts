import fs from "fs";
import path from "path";

let yearMapCache: Record<number, string[]> | null = null;

/** Charge le JSON année→artistes (francophones+étrangers) */
export function loadArtistsByYear(): Record<number, string[]> {
  if (yearMapCache) return yearMapCache;
  const p = path.join(process.cwd(), "data", "french_artists_by_year.json");
  const raw = fs.readFileSync(p, "utf8");
  const obj = JSON.parse(raw) as Record<string, string[]>;
  const casted: Record<number, string[]> = {};
  for (const k of Object.keys(obj)) casted[Number(k)] = obj[k];
  yearMapCache = casted;
  return casted;
}

/** Fallback par décennie (si jamais tu enlèves des années du JSON) */
export function frenchArtistsForDecade(decade: number): string[] {
  const base: Record<number, string[]> = {
    1960: ["Johnny Hallyday","Charles Aznavour","Dalida","The Beatles","Elvis Presley"],
    1970: ["Michel Sardou","Julien Clerc","Joe Dassin","Queen","Pink Floyd"],
    1980: ["Jean-Jacques Goldman","Indochine","Mylène Farmer","Michael Jackson","Madonna"],
    1990: ["MC Solaar","IAM","Céline Dion","Nirvana","Oasis"],
    2000: ["Indochine","Calogero","Céline Dion","Coldplay","Eminem"],
    2010: ["Stromae","PNL","Angèle","Adele","Bruno Mars"],
    2020: ["Aya Nakamura","Orelsan","Angèle","Taylor Swift","The Weeknd"],
  };
  return base[decade] || [];
}

/** Export principal utilisé dans l’API */
export function frenchArtistsForYearOrDecade(year: number): string[] {
  const map = loadArtistsByYear();
  if (map[year]?.length) return map[year];

  const decade = Math.floor(year / 10) * 10;
  return frenchArtistsForDecade(decade);
}
