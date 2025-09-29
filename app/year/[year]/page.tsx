"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TimeCapsule } from "../../../lib/types";
import Card from "../../../components/Card";
import { t } from "../../../lib/i18n";
import type { Lang } from "../../../components/LanguageToggle";
import SongCard from "../../../components/SongCard";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function YearPage() {
  const params = useParams<{ year: string }>();
  const router = useRouter();
  const sp = useSearchParams();
  const lang = (sp.get("lang") || "fr") as Lang;
  const y = Number(params?.year);

  const [data, setData] = useState<TimeCapsule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEUR, setShowEUR] = useState(true);
  const [year, setYear] = useState<number | undefined>();

  useEffect(() => {
    if (!y || Number.isNaN(y)) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/timecapsule?year=${y}&lang=${lang}`);
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Error");
        setData(j);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [y, lang]);

  const hasFRF = !!data?.breadPrice?.frf_250g && y <= 2001;
  const eurFromFRF = hasFRF
    ? data!.breadPrice!.frf_250g! / 6.55957
    : undefined;

  return (
    <main>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tighter">{y}</h1>
          <p className="mt-1 text-muted-foreground">{t(lang, "subtitle")}</p>
        </div>
        <button
          onClick={() => router.push(`/?lang=${lang}`)}
          className="rounded-full border bg-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
        >
          {t(lang, "changeYear")}
        </button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}
      {loading && <div className="text-muted-foreground">{t(lang, "loading")}</div>}

      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card title={t(lang, "music")} className="md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.music?.map((m, i) => (
                <SongCard
                  key={i}
                  title={m.title}
                  artist={m.artist}
                  deezerUrl={m.deezerUrl}
                  previewUrl={`/api/timecapsule?previewId=${m.deezerId}`}
                />
              ))}
            </div>
          </Card>

          <Card title={t(lang, "lifePrices")}>
            <div className="space-y-3 text-sm">
              {hasFRF && <button className="px-3 py-1 rounded-xl border border-border" onClick={() => setShowEUR(!showEUR)}>{showEUR ? "Convertir en Franc" : "Convertir en Euro"}</button>}
              {hasFRF && !showEUR && <div>Prix de la baguette (250g) : <b>{data.breadPrice.frf_250g!.toFixed(2)} FRF</b></div>}
              {hasFRF && showEUR && <div>Prix de la baguette (250g) converti : <b>{eurFromFRF!.toFixed(2)} €</b></div>}
              {!hasFRF && data.breadPrice?.eur_250g !== undefined && <div>Prix de la baguette (250g) : <b>{data.breadPrice.eur_250g!.toFixed(2)} €</b></div>}
              {data.breadPrice?.real2025 !== undefined && <div>{t(lang, "eqCurrent")} 2025 : <b>{data.breadPrice.real2025.toFixed(2)} €</b></div>}
            </div>
          </Card>

          <Card title={t(lang, "movies")} className="md:col-span-3">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {data.movies?.map((mv, i) => (
                <a key={i} href={mv.omdbUrl} target="_blank" rel="noreferrer">
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-secondary transition-transform hover:scale-105">
                    {mv.poster && (
                      <img
                        src={mv.poster}
                        alt={mv.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
