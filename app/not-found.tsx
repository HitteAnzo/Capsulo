"use client";

import Link from "next/link";
import ParticlesBackground from "../components/ParticlesBackground";

export default function NotFound() {
  return (
    <>
      <ParticlesBackground />
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#0a101f]"></div>
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_50%)]"></div>

      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <div className="animate-fade-in-up">
          <h1 className="text-7xl sm:text-9xl font-bold tracking-tighter text-gray-100">
            Oups !
          </h1>
          <p className="mt-6 max-w-2xl text-center text-lg text-blue-300/80">
            Tu t'es perdu dans l'espace-temps. Choisis une année entre 1960 et 2024.
          </p>
          <Link
            href="/"
            className="mt-10 inline-block rounded-md border border-blue-500/20 bg-blue-950/30 px-6 py-3 text-lg font-mono text-blue-300/70 transition-colors hover:bg-blue-900/50 hover:text-blue-300"
          >
            Retourner au présent
          </Link>
        </div>
      </main>
    </>
  );
}