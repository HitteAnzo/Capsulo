export type TimeCapsule = {
  year: number;
  events: { title: string; summary: string; url: string }[];
  music: { title: string; artist: string; previewUrl?: string; deezerUrl: string }[];
  movies: { title: string; poster?: string; omdbUrl?: string }[];
  breadPrice: {
    nominal?: number;
    currency?: string;
    real2025?: number;
    method: "dataset" | "cpi" | "fallback";
    frf_250g?: number;
    eur_250g?: number;
  };
  fashion: { headline: string; image?: string; sourceUrl: string }[];
};
