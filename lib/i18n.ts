const dict: Record<string, string> = {
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
};

export function t(key: string): string {
  return dict[key] ?? key;
}
