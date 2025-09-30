"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    particlesJS?: any;
  }
}

export default function ParticlesBackground() {
  // Initialise une fois le script chargé
  const initParticles = () => {
    if (typeof window !== "undefined" && window.particlesJS) {
      // Charge la config directement depuis /public
      window.particlesJS.load("particles-js", "/particlesjs-config (2).json");
    }
  };

  useEffect(() => {
    // au cas où le script est déjà dispo (navigation client)
    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Charge la lib après hydratation */}
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={initParticles}
      />
      {/* Conteneur du canvas Particles.js */}
      <div
        id="particles-js"
        className="fixed inset-0 -z-10 pointer-events-none"
      />
    </>
  );
}
