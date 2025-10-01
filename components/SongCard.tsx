"use client";

import React from "react";
import { useIsMobile } from "../lib/hooks/useismobile";

type Props = {
  title: string;
  artist?: string;
  previewUrl?: string;
  artwork?: string; // On le garde au cas où, mais on ne l'affiche plus
  deezerUrl?: string;
  theme: any; // On reçoit l'objet de thème
};

export default function SongCard({
  title,
  artist,
  previewUrl,
  deezerUrl,
  theme, // On récupère le thème
}: Props) {
  const isMobile = useIsMobile();

  // Layout pour mobile
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 py-4">
        <div>
          <a
            href={deezerUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className={`block font-semibold hover:underline ${theme.primaryText}`}
          >
            {title}
          </a>
          <p className={`text-sm ${theme.secondaryText}`}>{artist}</p>
        </div>
        {previewUrl && (
          <audio
            controls
            src={previewUrl}
            className="w-full"
            style={{ height: "30px" }}
          />
        )}
      </div>
    );
  }

  // Layout pour ordinateur (inchangé)
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Titre et Artiste */}
      <div className="min-w-0">
        <a
          href={deezerUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className={`block truncate font-semibold hover:underline ${theme.primaryText}`}
        >
          {title}
        </a>
        <p className={`truncate text-sm ${theme.secondaryText}`}>{artist}</p>
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