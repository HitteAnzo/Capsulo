"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function Header() {
  const [year, setYear] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const numericYear = Number(year);
      if (!isNaN(numericYear) && year.length === 4) {
        const clampedYear = Math.min(MAX_YEAR, Math.max(MIN_YEAR, numericYear));
        router.push(`/year/${clampedYear}`);
        setYear("");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo à gauche */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-lg">Capsulo</span>
        </Link>

        {/* Barre de recherche réduite à droite */}
        <div className="relative w-full max-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="number"
            placeholder="Aller à l'année..."
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full rounded-md border bg-transparent pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>
    </header>
  );
}