"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TimeCapsule } from "../../../lib/types";
import { t } from "../../../lib/i18n";
import type { Lang } from "../../../components/LanguageToggle";
import SongCard from "../../../components/SongCard";
import { Music, Clapperboard, Banknote, Film, X } from "lucide-react";

// --- Le composant de carte ---
const InfoCard = ({
  icon,
  title,
  children,
  delay,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: string;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 sm:p-6 shadow-2xl animate-fade-in-up ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center gap-4 mb-4 sm:mb-6">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <div className="text-muted-foreground">{children}</div>
  </div>
);

// --- Le composant pour l'aperçu du film ---
const MovieModal = ({
  movie,
  onClose,
}: {
  movie: TimeCapsule["movies"][0];
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up p-4"
      onClick={onClose}
      style={{ animationDuration: "0.3s" }}
    >
      <div
        className="relative w-full max-w-xs rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>
        <h3 className="text-center text-lg font-bold text-white mb-2 truncate px-4">
          {movie.title}
        </h3>
        <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-2xl">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

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
  const [selectedMovie, setSelectedMovie] = useState<TimeCapsule["movies"][0] | null>(null); // État pour le film sélectionné

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

  const hasCigaretteFRF = !!data?.cigarettePrice?.frf_pack && y <= 2001;
  const cigaretteEurFromFRF = hasCigaretteFRF
    ? data!.cigarettePrice!.frf_pack! / 6.55957
    : undefined;

  return (
    <>
      <main className="container mx-auto max-w-5xl py-8 sm:py-16">
        {/* --- Titre de la page --- */}
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
            {y}
          </h1>
          <p className="mt-2 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            {t(lang, "subtitle")}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}
        {loading && <div className="text-center text-muted-foreground">{t(lang, "loading")}</div>}

        {data && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* --- Carte Musique --- */}
            <InfoCard
              icon={<Music className="h-6 w-6 text-primary" />}
              title={t(lang, "music")}
              delay="300ms"
              className="md:col-span-2"
            >
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
            </InfoCard>

            {/* --- Carte Coût de la vie --- */}
            <InfoCard
              icon={<Banknote className="h-6 w-6 text-primary" />}
              title={t(lang, "lifePrices")}
              delay="400ms"
            >
              <div className="space-y-3 text-sm">
                {hasFRF && <button className="px-3 py-1 rounded-xl border border-border" onClick={() => setShowEUR(!showEUR)}>{showEUR ? "Convertir en Franc" : "Convertir en Euro"}</button>}
                
                {/* Prix du pain */}
                {hasFRF && !showEUR && <div>Prix de la baguette (250g) : <b>{data.breadPrice.frf_250g!.toFixed(2)} FRF</b></div>}
                {hasFRF && showEUR && <div>Prix de la baguette (250g) converti : <b>{eurFromFRF!.toFixed(2)} €</b></div>}
                {!hasFRF && data.breadPrice?.eur_250g !== undefined && <div>Prix de la baguette (250g) : <b>{data.breadPrice.eur_250g!.toFixed(2)} €</b></div>}
                {data.breadPrice?.real2025 !== undefined && <div className="pt-2 border-t border-border/40 mt-3">{t(lang, "eqCurrent")} 2025 : <b>{data.breadPrice.real2025.toFixed(2)} €</b></div>}

                {/* Prix des cigarettes (uniquement si les données existent) */}
                {data.cigarettePrice && (
                  <div className="pt-3 mt-3 border-t border-border/40">
                    {hasCigaretteFRF && !showEUR && <div>Prix du paquet de cigarettes : <b>{data.cigarettePrice!.frf_pack!.toFixed(2)} FRF</b></div>}
                    {hasCigaretteFRF && showEUR && <div>Prix du paquet de cigarettes converti : <b>{cigaretteEurFromFRF!.toFixed(2)} €</b></div>}
                    {!hasCigaretteFRF && data.cigarettePrice?.eur_pack !== undefined && <div>Prix du paquet de cigarettes : <b>{data.cigarettePrice.eur_pack!.toFixed(2)} €</b></div>}
                    {data.cigarettePrice?.real2025 !== undefined && <div className="pt-2 border-t border-border/40 mt-3">{t(lang, "eqCurrent")} 2025 : <b>{data.cigarettePrice.real2025.toFixed(2)} €</b></div>}
                  </div>
                )}
              </div>
            </InfoCard>

            {/* --- Carte Cinéma --- */}
            <InfoCard
              icon={<Film className="h-6 w-6 text-primary" />}
              title={t(lang, "movies")}
              delay="500ms"
            >
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4">
                {data.movies?.map((mv, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedMovie(mv); // Ouvre la modale au clic
                    }}
                    title={mv.title}
                    className="cursor-pointer"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-secondary transition-transform hover:scale-105">
                      {mv.poster && (
                        <img
                          src={mv.poster}
                          alt={mv.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        )}
      </main>

      {/* Affiche la modale si un film est sélectionné */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
