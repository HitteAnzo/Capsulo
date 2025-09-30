"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lang } from "../components/LanguageToggle";
import { t } from "../lib/i18n";
import HeroSection from "../components/HeroSection";
import YearInputForm from "../components/YearInputForm";
import DecadeSelector from "../components/DecadeSelector";
import FeatureSection from "../components/FeatureSection";
import ParticlesBackground from "../components/ParticlesBackground";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function Page() {
  const [year, setYear] = useState<number | undefined>();
  const params = useSearchParams();
  const lang = (params.get("lang") || "fr") as Lang;
  const router = useRouter();

  const clampYear = (y: number) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));

  function go() {
    const y = clampYear(year || new Date().getFullYear() - 25);
    router.push(`/year/${y}?lang=${lang}`);
  }

  function handleDecadeSelect(decade: number) {
    const candidate = decade + Math.floor(Math.random() * 10);
    const y = clampYear(candidate);
    router.push(`/year/${y}?lang=${lang}`);
  }

  const decadeShortcuts = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

  return (
    <>
      {/* Particles.js en fond */}
      <ParticlesBackground />

      {/* Fond étoilé avec nébuleuse - placé derrière les particules */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[#0a101f] bg-[radial-gradient(white_0.5px,transparent_0.5px)] [background-size:20px_20px]"></div>
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_50%)]"></div>

      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <HeroSection
          title="Un voyage dans chaque détail"
          subtitle={t(lang, "subtitle")}
        />

        <div
          className="flex w-full max-w-md flex-col items-center gap-6 mt-12 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <YearInputForm
            year={year}
            onYearChange={(value) => setYear(value ? Number(value) : undefined)}
            onSubmit={go}
            onKeyDown={(e) => e.key === "Enter" && go()}
            buttonText={t(lang, "go")}
            placeholder="Ex: 1999"
          />
          <DecadeSelector
            decades={decadeShortcuts}
            onSelect={handleDecadeSelect}
            label="Ou par décennie:"
          />
        </div>
      </main>
      <FeatureSection />
    </>
  );
}
