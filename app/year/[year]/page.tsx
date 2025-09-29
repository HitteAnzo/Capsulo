"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { TimeCapsule } from "../../../lib/types";
import { t } from "../../../lib/i18n";
import type { Lang } from "../../../components/LanguageToggle";
import SongCard from "../../../components/SongCard";
// Ajout des nouvelles icônes
import { Music, Clapperboard, Banknote, Film, X, Wheat, Cigarette, Fuel, ChevronLeft, ChevronRight } from "lucide-react";

// --- DÉBUT : Logique de Thème par Décennie ---
type DecadeTheme = {
  background: string;
  card: string;
  titleFont: string;
  // Définir explicitement les couleurs de texte
  primaryText: string;
  secondaryText: string;
  iconBg: string;
  subtitleText: string; // Ajout de la couleur du sous-titre
  button: string; // Ajout du style pour les boutons
  iconBorder: string; // NOUVEAU : Couleur de la bordure de l'icône
};

function getDecadeTheme(year: number): DecadeTheme {
  const decade = Math.floor(year / 10) * 10;

  switch (decade) {
    case 1960:
      return {
        background: "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500", // Floral gradient
        card: "bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg", // Soft, blurry card
        titleFont: "font-dm-serif text-white text-shadow-[2px_2px_4px_#00000080]", // Groovy font with shadow
        primaryText: "text-rose-950 font-bold", // Dark rosy-brown text
        secondaryText: "text-rose-800/90",
        iconBg: "bg-green-200/40", // Pastel green for "foliage"
        subtitleText: "text-white/90 text-shadow-[1px_1px_2px_#00000050]",
        button: "bg-white/20 text-white border-white/30 hover:bg-white/30", // Glassy button
        iconBorder: "border-rose-950",
      };
    case 1970:
      return {
        background: "bg-[#3D2B24] bg-[radial-gradient(#785549_1px,transparent_1px)] bg-[size:16px_16px]", // Brown with a dot pattern
        card: "bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 rounded-2xl shadow-lg",
        titleFont: "font-bebas-neue tracking-wider text-orange-200",
        primaryText: "text-amber-950 font-bold",
        secondaryText: "text-amber-900/90",
        iconBg: "bg-amber-800/20",
        subtitleText: "text-orange-200/90",
        button: "bg-orange-200/20 text-orange-100 border-orange-200/30 hover:bg-orange-200/30",
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
        background: "bg-gradient-to-b from-slate-400 to-slate-600",
        card: "bg-slate-100 border border-slate-400 rounded-lg shadow-lg",
        titleFont: "font-sans font-bold text-black",
        primaryText: "text-blue-700 font-bold",
        secondaryText: "text-black",
        iconBg: "bg-slate-300",
        subtitleText: "text-black",
        button: "bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300",
        iconBorder: "border-blue-700",
      };
    default: // 2010+ et thème par défaut
      return {
        background: "",
        card: "bg-gradient-to-b from-white/5 to-transparent border-white/10",
        titleFont: "font-bold tracking-tighter",
        primaryText: "text-foreground",
        secondaryText: "text-muted-foreground",
        iconBg: "bg-secondary",
        subtitleText: "text-muted-foreground",
        button: "bg-secondary text-secondary-foreground border-border hover:bg-primary/20",
        iconBorder: "border-foreground",
      };
  }
}
// --- FIN : Logique de Thème ---

// --- Le composant de carte ---
const InfoCard = ({
  icon,
  title,
  children,
  delay,
  className = "",
  themeClasses = "",
  theme, // Passer l'objet de thème complet
  headerAccessory, // Nouvel élément à droite du titre
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: string;
  className?: string;
  themeClasses?: string;
  theme: DecadeTheme; // Définir le type
  headerAccessory?: React.ReactNode; // Définir le type
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
        {/* On utilise la couleur du thème ici */}
        <h3 className={`text-lg sm:text-xl font-semibold ${theme.primaryText}`}>{title}</h3>
      </div>
      {headerAccessory && <div>{headerAccessory}</div>}
    </div>
    {/* Et ici aussi */}
    <div className={theme.secondaryText}>{children}</div>
  </div>
);

// --- NOUVEAU : Composant pour un élément de prix ---
const PriceItem = ({
  icon,
  label,
  price,
  currency,
  realPrice2025,
  theme, // Passer l'objet de thème complet
}: {
  icon: React.ReactNode;
  label: string;
  price?: number;
  currency: string;
  realPrice2025?: number;
  theme: DecadeTheme; // Définir le type
}) => {
  if (price === undefined) return null;

  return (
    <div className="flex items-center gap-4">
      {/* On utilise la couleur de fond d'icône du thème */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
        {icon}
      </div>
      <div className="flex-grow">
        {/* On utilise les couleurs du thème ici */}
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

  const hasGazoleFRF = !!data?.gazolePrice?.frf_litre && y <= 2001;
  const gazoleEurFromFRF = hasGazoleFRF
    ? data!.gazolePrice!.frf_litre! / 6.55957
    : undefined;

  // Appliquer le thème
  const theme = getDecadeTheme(y);

  const canGoBack = y > 1960;
  const canGoForward = y < 2025;

  return (
    <>
      {/* --- Flèches de navigation --- */}
      {canGoBack && (
        <button
          onClick={() => router.push(`/year/${y - 1}?lang=${lang}`)}
          className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          aria-label="Année précédente"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      {canGoForward && (
        <button
          onClick={() => router.push(`/year/${y + 1}?lang=${lang}`)}
          className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          aria-label="Année suivante"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Le fond dynamique */}
      <div className={`fixed inset-0 -z-20 transition-all duration-1000 ${theme.background}`} />
      <main className="container mx-auto max-w-5xl py-8 sm:py-16">
        {/* --- Titre de la page --- */}
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className={`text-4xl sm:text-5xl md:text-6xl text-foreground ${theme.titleFont}`}>
            {y}
          </h1>
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
            {/* --- Carte Musique --- */}
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

            {/* --- Carte Coût de la vie --- */}
            <InfoCard
              icon={<Banknote className={`h-6 w-6 ${theme.primaryText}`} />}
              title={t(lang, "lifePrices")}
              delay="400ms"
              themeClasses={theme.card}
              theme={theme}
              headerAccessory={(hasFRF || hasCigaretteFRF || hasGazoleFRF) && (
                <button className={`px-3 py-1 text-xs rounded-full border transition-colors ${theme.button}`} onClick={() => setShowEUR(!showEUR)}>{showEUR ? "FRF" : "EUR"}</button>
              )}
            >
              <div className="flex flex-col gap-6">
                {/* Liste des prix */}
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

            {/* --- Carte Cinéma --- */}
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
