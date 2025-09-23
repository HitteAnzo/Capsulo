import fs from "fs";
import path from "path";

let cache: { [year: number]: number } | null = null;

export function loadCpi(): Record<number, number> {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "insee_cpi.csv");
  const raw = fs.readFileSync(p, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  const out: Record<number, number> = {};
  for (let i = 1; i < lines.length; i++) {
    const [y, idx] = lines[i].split(",");
    const year = Number(y);
    const index = Number(idx);
    if (!Number.isNaN(year) && !Number.isNaN(index)) out[year] = index;
  }
  cache = out;
  return out;
}

export function inflationFactor(fromYear: number, toYear: number): number | null {
  const cpi = loadCpi();
  const a = cpi[fromYear];
  const b = cpi[toYear];
  if (a && b) return b / a;
  return null;
}
