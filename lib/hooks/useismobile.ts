"use client";

import { useState, useEffect } from 'react';

// On utilise 640px (breakpoint 'sm' de Tailwind) comme seuil pour le mobile
const MOBILE_BREAKPOINT = 640;

export function useIsMobile(): boolean {
  // S'assure que le code ne s'exécute que côté client
  const isClient = typeof window === 'object';

  const [isMobile, setIsMobile] = useState(
    isClient ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', checkIsMobile);

    // Nettoyage de l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [isClient]);

  return isMobile;
}