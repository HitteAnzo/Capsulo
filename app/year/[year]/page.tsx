"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TimeCapsule } from "../../../lib/types";
import Card from "../../../components/Card";
import { t } from "../../../lib/i18n";
import type { Lang } from "../../../components/LanguageToggle";

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
      <header className="flex items-end gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">{y}</h1>
          <p className="text-sub mt-1">{t(lang, "subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/?lang=${lang}`)}
            className="px-4 py-2 rounded-xl border border-border hover:bg-white/10 transition"
          >
            {t(lang, "changeYear")}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-900/30 border border-red-800 p-3 rounded-xl mb-4">
          {error}
        </div>
      )}
      {loading && <div className="text-sub">{t(lang, "loading")}</div>}

      {data && (
        <div className="space-y-6">
          {/* Grille principale pour les 4 premières cartes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={`${t(lang, "events")} (${data.year})`}>
              <ul className="space-y-3">
                {data.events?.map((e, i) => (
                  <li key={i}>
                    <a className="font-semibold underline" href={e.url} target="_blank" rel="noreferrer">{e.title}</a>
                    <p className="text-sm text-[#cfcfcf] mt-1">{e.summary}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title={t(lang, "music")}>
              <ul className="space-y-3">
                {data.music?.map((m, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-sm text-[#cfcfcf]">{m.artist}</div>
                    </div>
                    {m.deezerId && <audio controls preload="none" src={`/api/timecapsule?previewId=${m.deezerId}`} className="max-w-[120px]" />}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title={t(lang, "lifePrices")}>
              <div className="space-y-3">
                {hasFRF && <button className="px-3 py-1 rounded-xl border border-border" onClick={() => setShowEUR(!showEUR)}>{showEUR ? "Afficher en FRF" : "Convertir en €"}</button>}
                {hasFRF && !showEUR && <div>Prix de la baguette (250g) : <b>{data.breadPrice.frf_250g!.toFixed(2)} FRF</b></div>}
                {hasFRF && showEUR && <div>Prix de la baguette (250g) converti : <b>{eurFromFRF!.toFixed(2)} €</b></div>}
                {!hasFRF && data.breadPrice?.eur_250g !== undefined && <div>Prix de la baguette (250g) : <b>{data.breadPrice.eur_250g!.toFixed(2)} €</b></div>}
                {data.breadPrice?.real2025 !== undefined && <div>{t(lang, "eqCurrent")} 2025 : <b>{data.breadPrice.real2025.toFixed(2)} €</b></div>}
              </div>
            </Card>

            <Card title={t(lang, "fashion")}>
              <ul className="space-y-3">
                {data.fashion?.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {f.image && <img src={f.image} alt={f.headline} className="w-16 h-16 object-cover rounded-lg" />}
                    <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline">{f.headline}</a>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Sections séparées — une section par Card */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{t(lang, "events")} — {data.year}</h2>
            <Card title={`${t(lang, "events")} (${data.year})`}>
              <ul className="space-y-3">
                {data.events?.map((e, i) => (
                  <li key={i}>
                    <a className="font-semibold underline" href={e.url} target="_blank" rel="noreferrer">{e.title}</a>
                    <p className="text-sm text-[#cfcfcf] mt-1">{e.summary}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{t(lang, "music")}</h2>
            <Card title={t(lang, "music")}>
              <ul className="space-y-3">
                {data.music?.map((m, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{m.title}</div>
                      <div className="text-sm text-[#cfcfcf]">{m.artist}</div>
                    </div>
                    {m.deezerId && <audio controls preload="none" src={`/api/timecapsule?previewId=${m.deezerId}`} className="max-w-[120px]" />}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{t(lang, "lifePrices")}</h2>
            <Card title={t(lang, "lifePrices")}>
              <div className="space-y-3">
                {hasFRF && <button className="px-3 py-1 rounded-xl border border-border" onClick={() => setShowEUR(!showEUR)}>{showEUR ? "Afficher en FRF" : "Convertir en €"}</button>}
                {hasFRF && !showEUR && <div>Prix de la baguette (250g) : <b>{data.breadPrice.frf_250g!.toFixed(2)} FRF</b></div>}
                {hasFRF && showEUR && <div>Prix de la baguette (250g) converti : <b>{eurFromFRF!.toFixed(2)} €</b></div>}
                {!hasFRF && data.breadPrice?.eur_250g !== undefined && <div>Prix de la baguette (250g) : <b>{data.breadPrice.eur_250g!.toFixed(2)} €</b></div>}
                {data.breadPrice?.real2025 !== undefined && <div>{t(lang, "eqCurrent")} 2025 : <b>{data.breadPrice.real2025.toFixed(2)} €</b></div>}
              </div>
            </Card>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{t(lang, "fashion")}</h2>
            <Card title={t(lang, "fashion")}>
              <ul className="space-y-3">
                {data.fashion?.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {f.image && <img src={f.image} alt={f.headline} className="w-16 h-16 object-cover rounded-lg" />}
                    <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline">{f.headline}</a>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Movies: posters only, 3 côte à côte */}
          <section>
            <div className="max-w-full">
              <div className="grid grid-cols-3 gap-4 items-start">
                {data.movies?.slice(0, 3).map((mv, i) => (
                  <a
                    key={i}
                    href={mv.omdbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mv.poster}
                      alt={mv.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
