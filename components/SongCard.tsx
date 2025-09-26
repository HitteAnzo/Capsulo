import React from "react";

type Props = {
  title: string;
  artist?: string;
  previewUrl?: string;
  artwork?: string;
  deezerUrl?: string;
};

export default function SongCard({ title, artist, previewUrl, artwork, deezerUrl }: Props) {
  return (
    <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm">
      <a href={deezerUrl ?? "#"} target="_blank" rel="noreferrer" className="block">
        <div className="h-28 w-full bg-[#111217] rounded-md flex items-center justify-center overflow-hidden">
          {artwork ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={artwork} alt={title} className="max-h-full w-auto" />
          ) : (
            <div className="text-muted-foreground">No artwork</div>
          )}
        </div>
      </a>

      <div className="p-2">
        <div className="text-sm font-medium truncate">{title}</div>
        {artist && <div className="text-xs text-muted-foreground mt-1 truncate">{artist}</div>}

        {previewUrl ? (
          <audio controls src={previewUrl} className="w-full mt-2" />
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">No preview</div>
        )}
      </div>
    </div>
  );
}