"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lang } from "../components/LanguageToggle";
import { t } from "../lib/i18n";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function Page() {
  const [year, setYear] = useState<number | undefined>();
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
    <main className="flex flex-col items-center justify-center text-center flex-grow">
      <div className="flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
          C'était mieux avant ?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {t(lang, "subtitle")}
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <div className="flex w-full items-center gap-2 rounded-full bg-secondary p-2">
          <input
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year ?? ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") go();
            }}
            className="w-full bg-transparent px-4 text-lg outline-none"
            placeholder="Ex: 1999"
          />
          <button
            onClick={go}
            className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            {t(lang, "go")}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Ou par décennie:</span>
          {decadeShortcuts.map((d) => (
            <button
              key={d}
              onClick={() => {
                const candidate = d + Math.floor(Math.random() * 10);
                const y = clampYear(candidate);
                router.push(`/year/${y}?lang=${lang}`);
              }}
              className="rounded-full border bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              aria-label={`Explorer les années ${d}s`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
