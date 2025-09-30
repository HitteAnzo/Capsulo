"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TimeCapsule } from "../../../lib/types";
import { t } from "../../../lib/i18n";
import type { Lang } from "../../../components/LanguageToggle";
import SongCard from "../../../components/SongCard";
import { Music, Clapperboard, Banknote, Film, X, Wheat, Cigarette, Fuel, ChevronLeft, ChevronRight } from "lucide-react";

// --- DÉBUT : Logique de Thème par Décennie ---
type DecadeTheme = {
  background: string;
  card: string;
  titleFont: string;
  primaryText: string;
  secondaryText: string;
  iconBg: string;
  subtitleText: string;
  button: string;
  iconBorder: string;
};

function getDecadeTheme(year: number): DecadeTheme {
  const decade = Math.floor(year / 10) * 10;

  switch (decade) {
    case 1960:
      return {
        background: `bg-orange-200 bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'%3e%3cpath fill='%23e58948' fill-opacity='0.4' d='M40 0c22.09 0 40 17.91 40 40S62.09 80 40 80 0 62.09 0 40S17.91 0 40 0zm0 8c17.67 0 32 14.33 32 32s-14.33 32-32 32S8 57.67 8 40 22.33 8 40 8zm0 8c13.25 0 24 10.75 24 24s-10.75 24-24 24-24-10.75-24-24 10.75-24 24-24zm0 8c8.84 0 16 7.16 16 16s-7.16 16-16 16-16-7.16-16-16 7.16-16 16-16z'%3e%3c/path%3e%3c/svg%3e")]`,
        card: "bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg",
        titleFont: "font-dm-serif text-orange-950 text-shadow-[1px_1px_2px_#ffffff80]",
        primaryText: "text-rose-950 font-bold",
        secondaryText: "text-rose-800/90",
        iconBg: "bg-green-200/40",
        subtitleText: "text-orange-950/90 text-shadow-[1px_1px_1px_#ffffff50]",
        button: "bg-orange-200 text-rose-950 border-rose-950/50 hover:brightness-95",
        iconBorder: "border-rose-950",
      };
    case 1970:
      return {
        background: "bg-[#3D2B24] bg-[radial-gradient(#785549_1px,transparent_1px)] bg-[size:16px_16px]",
        card: "bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 rounded-2xl shadow-lg",
        titleFont: "font-bebas-neue tracking-wider text-orange-200",
        primaryText: "text-amber-950 font-bold",
        secondaryText: "text-amber-900/90",
        iconBg: "bg-amber-800/20",
        subtitleText: "text-orange-200/90",
        button: "bg-[#3D2B24] text-orange-200 border-orange-200/50 hover:brightness-125",
        iconBorder: "border-amber-950",
      };
    case 1980:
      return {
        background: "bg-gradient-to-b from-black to-[#2d004f]",
        card: "bg-black/50 backdrop-blur-sm border-fuchsia-500/50 shadow-fuchsia-500/20 shadow-lg",
        titleFont: "font-press-start text-2xl sm:text-3xl md:text-4xl",
        primaryText: "text-foreground",
        secondaryText: "text-muted-foreground",
        iconBg: "bg-secondary",
        subtitleText: "text-muted-foreground",
        button: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20",
        iconBorder: "border-fuchsia-400",
      };
    case 1990:
      return {
        background: "bg-blue-600 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:16px_16px]",
        card: "bg-yellow-300 border-4 border-blue-800 rounded-lg shadow-[8px_8px_0px_#1e3a8a]",
        titleFont: "font-sans font-black text-white text-shadow-[4px_4px_0px_#000]",
        primaryText: "text-black",
        secondaryText: "text-gray-800",
        iconBg: "bg-blue-400",
        subtitleText: "text-white",
        button: "bg-blue-800 text-white border-blue-900 hover:bg-blue-700",
        iconBorder: "border-black",
      };
    case 2000:
      return {
        background: "bg-gradient-to-br from-sky-50/50 via-white to-blue-100/50",
        card: "bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg",
        titleFont: "font-sans font-bold tracking-tight",
        primaryText: "text-slate-800",
        secondaryText: "text-slate-600",
        iconBg: "bg-white/50",
        subtitleText: "text-slate-700",
        button: "bg-white/70 border border-gray-300 text-gray-700 hover:bg-white",
        iconBorder: "border-slate-800",
      };
    case 2010:
      return {
        background: "bg-slate-900",
        card: "bg-slate-800 border border-slate-700/50 rounded-xl shadow-lg",
        titleFont: "font-sans font-bold tracking-tighter text-gray-100",
        primaryText: "text-blue-400 font-semibold",
        secondaryText: "text-slate-400",
        iconBg: "bg-blue-500/10",
        subtitleText: "text-slate-300",
        button: "bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600",
        iconBorder: "border-blue-400",
      };
    default: // 2020+ et thème par défaut
      return {
        background: "bg-black bg-[radial-gradient(circle_800px_at_50%_200px,rgba(255,255,255,0.08),transparent)]",
        card: "bg-gray-800/40 backdrop-blur-xl border border-white/10 rounded-3xl",
        titleFont: "font-sans font-bold tracking-tight text-gray-50",
        primaryText: "text-gray-200",
        secondaryText: "text-gray-400",
        iconBg: "bg-gray-700/50",
        subtitleText: "text-gray-300",
        button: "bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700",
        iconBorder: "border-gray-500",
      };
  }
}
// --- FIN : Logique de Thème ---

const InfoCard = ({
  icon,
  title,
  children,
  delay,
  className = "",
  themeClasses = "",
  theme,
  headerAccessory,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: string;
  className?: string;
  themeClasses?: string;
  theme: DecadeTheme;
  headerAccessory?: React.ReactNode;
}) => (
  <div
    className={`relative overflow-hidden p-4 sm:p-6 shadow-2xl animate-fade-in-up ${themeClasses} ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border-2 ${theme.iconBorder}`}>
          {icon}
        </div>
        <h3 className={`text-lg sm:text-xl font-semibold ${theme.primaryText}`}>{title}</h3>
      </div>
      {headerAccessory && <div>{headerAccessory}</div>}
    </div>
    <div className={theme.secondaryText}>{children}</div>
  </div>
);

const PriceItem = ({
  icon,
  label,
  price,
  currency,
  realPrice2025,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  price?: number;
  currency: string;
  realPrice2025?: number;
  theme: DecadeTheme;
}) => {
  if (price === undefined) return null;

  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-medium ${theme.secondaryText}`}>{label}</p>
        <p className={`text-lg font-bold ${theme.primaryText}`}>
          {price.toFixed(2)} {currency}
        </p>
      </div>
      {realPrice2025 !== undefined && (
        <p className={`text-xs font-mono ${theme.secondaryText}/80`}>
          (~{realPrice2025.toFixed(2)}€ 2025)
        </p>
      )}
    </div>
  );
};

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
  const [selectedMovie, setSelectedMovie] = useState<TimeCapsule["movies"][0] | null>(null);

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

  const hasGazoleFRF = !!data?.gazolePrice?.frf_litre && y <= 2001;
  const gazoleEurFromFRF = hasGazoleFRF
    ? data!.gazolePrice!.frf_litre! / 6.55957
    : undefined;

  const theme = getDecadeTheme(y);

  const canGoBack = y > 1960;
  const canGoForward = y < 2025;

  return (
    <>
      <div className={`fixed inset-0 -z-20 transition-all duration-1000 ${theme.background}`} />
      <main className="container mx-auto max-w-5xl py-8 sm:py-16">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <button
              onClick={() => canGoBack && router.push(`/year/${y - 1}?lang=${lang}`)}
              className={`p-2 rounded-full transition-opacity ${canGoBack ? 'opacity-70 hover:opacity-100' : 'opacity-0 cursor-default'}`}
              aria-label="Année précédente"
              disabled={!canGoBack}
            >
              <ChevronLeft size={32} className={theme.subtitleText} />
            </button>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl text-foreground ${theme.titleFont}`}>
              {y}
            </h1>

            <button
              onClick={() => canGoForward && router.push(`/year/${y + 1}?lang=${lang}`)}
              className={`p-2 rounded-full transition-opacity ${canGoForward ? 'opacity-70 hover:opacity-100' : 'opacity-0 cursor-default'}`}
              aria-label="Année suivante"
              disabled={!canGoForward}
            >
              <ChevronRight size={32} className={theme.subtitleText} />
            </button>
          </div>
          <p className={`mt-2 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg ${theme.subtitleText}`}>
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
            <InfoCard
              icon={<Music className={`h-6 w-6 ${theme.primaryText}`} />}
              title={t(lang, "music")}
              delay="300ms"
              className="md:col-span-2"
              themeClasses={theme.card}
              theme={theme}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.music?.map((m, i) => (
                  <SongCard
                    key={i}
                    title={m.title}
                    artist={m.artist}
                    deezerUrl={m.deezerUrl}
                    previewUrl={`/api/timecapsule?previewId=${m.deezerId}`}
                    theme={theme}
                  />
                ))}
              </div>
            </InfoCard>

            <InfoCard
              icon={<Banknote className={`h-6 w-6 ${theme.primaryText}`} />}
              title={t(lang, "lifePrices")}
              delay="400ms"
              themeClasses={theme.card}
              theme={theme}
              headerAccessory={(hasFRF || hasCigaretteFRF || hasGazoleFRF) && (
                <button className={`px-3 py-1 text-xs rounded-full border transition-colors ${theme.button}`} onClick={() => setShowEUR(!showEUR)}>FRF/EUR</button>
              )}
            >
              <div className="flex flex-col gap-6">
                <PriceItem
                  icon={<Wheat size={20} />}
                  label="Baguette"
                  price={showEUR ? eurFromFRF ?? data.breadPrice?.eur_250g : data.breadPrice?.frf_250g}
                  currency={showEUR ? "€" : "FRF"}
                  realPrice2025={data.breadPrice?.real2025}
                  theme={theme}
                />
                <PriceItem
                  icon={<Cigarette size={20} />}
                  label="Cigarettes"
                  price={showEUR ? cigaretteEurFromFRF ?? data.cigarettePrice?.eur_pack : data.cigarettePrice?.frf_pack}
                  currency={showEUR ? "€" : "FRF"}
                  realPrice2025={data.cigarettePrice?.real2025}
                  theme={theme}
                />
                <PriceItem
                  icon={<Fuel size={20} />}
                  label="Gazole"
                  price={showEUR ? gazoleEurFromFRF ?? data.gazolePrice?.eur_litre : data.gazolePrice?.frf_litre}
                  currency={showEUR ? "€" : "FRF"}
                  realPrice2025={data.gazolePrice?.real2025}
                  theme={theme}
                />
              </div>
            </InfoCard>

            <InfoCard
              icon={<Film className={`h-6 w-6 ${theme.primaryText}`} />}
              title={t(lang, "movies")}
              delay="500ms"
              themeClasses={theme.card}
              theme={theme}
            >
              <div className="flex justify-center">
                <div className="grid w-fit grid-cols-2 gap-4 md:grid-cols-3">
                  {data.movies?.map((mv, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMovie(mv);
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
              </div>
            </InfoCard>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}