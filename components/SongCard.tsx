import React from "react";

type Props = {
  title: string;
  artist?: string;
  previewUrl?: string;
  artwork?: string;
  deezerUrl?: string;
};

export default function SongCard({
  title,
  artist,
  previewUrl,
  artwork,
  deezerUrl,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-secondary p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {artwork ? (
          <img src={artwork} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex-grow overflow-hidden">
        <a
          href={deezerUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-semibold hover:underline"
        >
          {title}
        </a>
        <p className="truncate text-sm text-muted-foreground">{artist}</p>
      </div>
      {previewUrl && (
        <audio
          controls
          src={previewUrl}
          className="w-full max-w-[150px]"
          style={{ height: "30px" }}
        />
      )}
    </div>
  );
}