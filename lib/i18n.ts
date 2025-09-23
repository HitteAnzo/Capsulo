export type Lang = "fr" | "en";
export function t(lang: Lang, key: string) {
  const dict: Record<Lang, Record<string,string>> = {
    fr: {
      subtitle: "Choisis une année pour explorer événements, musiques, films, prix et tendances.",
      go: "Voyager",
      changeYear: "Changer d'année",
      loading: "Chargement…",
      events: "Événements",
      music: "Musiques (extraits)",
      movies: "Films populaires",
      lifePrices: "Vie & prix",
      bread: "Prix du pain (approx.)",
      method: "méthode",
      eqCurrent: "Équivalent",
      fashion: "Tendances",
      invalidYear: "Année invalide (1960–2025)",
    },
    en: {
      subtitle: "Pick a year to explore events, music, movies, prices and trends.",
      go: "Travel",
      changeYear: "Change year",
      loading: "Loading…",
      events: "Events",
      music: "Music (previews)",
      movies: "Popular movies",
      lifePrices: "Life & prices",
      bread: "Bread price (approx.)",
      method: "method",
      eqCurrent: "Equivalent",
      fashion: "Trends",
      invalidYear: "Invalid year (1960–2025)",
    }
  };
  return dict[lang][key] ?? key;
}
