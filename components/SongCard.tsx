import React from "react";

type Props = {
  title: string;
  artist?: string;
  previewUrl?: string;
  artwork?: string; // On le garde au cas où, mais on ne l'affiche plus
  deezerUrl?: string;
};

export default function SongCard({
  title,
  artist,
  previewUrl,
  deezerUrl,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Titre et Artiste */}
      <div className="min-w-0">
        <a
          href={deezerUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-semibold text-white hover:underline"
        >
          {title}
        </a>
        <p className="truncate text-sm text-muted-foreground">{artist}</p>
      </div>

      {/* Lecteur Audio */}
      {previewUrl && (
        <audio
          controls
          src={previewUrl}
          className="w-[150px] flex-shrink-0"
          style={{ height: "30px" }}
        />
      )}
    </div>
  );
}