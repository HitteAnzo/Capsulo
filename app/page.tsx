"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lang } from "../components/LanguageToggle";
import { t } from "../lib/i18n";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function Page() {
  const [year, setYear] = useState<number>(1990);
  const params = useSearchParams();
  const lang = (params.get("lang") || "fr") as Lang;
  const router = useRouter();

  const clampYear = (y: number) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));

  function go() {
    const y = clampYear(year || 1990);
    router.push(`/year/${y}?lang=${lang}`);
  }

  function randomYear() {
    const y = MIN_YEAR + Math.floor(Math.random() * (MAX_YEAR - MIN_YEAR + 1));
    setYear(y);
  }

  const decadeShortcuts = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

  return (
    <main>
      <header className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            C'était mieux avant ?
          </h1>
          <p className="text-sub mt-2 max-w-2xl">{t(lang, "subtitle")}</p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
            <input
              type="number"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") go();
              }}
              className="bg-transparent placeholder:text-white/40 text-text outline-none w-28"
              placeholder="1984"
            />
            <button
              onClick={randomYear}
              className="text-xs px-2 py-1 rounded-xl border border-white/10 hover:bg-white/10 transition"
              aria-label="Choisir une année aléatoire"
            >
              Random
            </button>
          </div>

          <button
            onClick={go}
            className="w-full md:w-auto px-5 py-2 rounded-2xl bg-white text-black font-medium shadow hover:shadow-lg transition"
          >
            {t(lang, "go")}
          </button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="text-sub text-sm">Raccourcis par décennie</div>
        <div className="flex flex-wrap gap-2">
          {decadeShortcuts.map((d) => (
            <button
              key={d}
              onClick={() => {
                // Choisit une année aléatoire dans la décennie,
                // puis borne dans [MIN_YEAR, MAX_YEAR] (utile pour 2020s → max 2025)
                const candidate = d + Math.floor(Math.random() * 10);
                const y = clampYear(candidate);
                setYear(y);
                router.push(`/year/${y}?lang=${lang}`);
              }}
              className="px-3 py-1 rounded-xl border border-white/10 hover:bg-white/5 transition"
              aria-label={`Explorer les années ${d}s`}
            >
              {d}s
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
