"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import React from "react";
import { useIsMobile } from "../lib/hooks/useismobile";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function Header() {
  const [year, setYear] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // On ne lance la recherche que si l'année contient exactement 4 chiffres
      if (year.length === 4) {
        const numericYear = Number(year);
        if (numericYear < MIN_YEAR || numericYear > MAX_YEAR) {
          router.push('/not-found');
        } else {
          router.push(`/year/${numericYear}`);
        }
        setYear("");
        setIsSearchOpen(false); // Ferme la recherche après exécution
      }
    }
  };

  // Donne le focus à l'input quand il apparaît
  useEffect(() => {
    if (isSearchOpen && isMobile) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen, isMobile]);

  const searchBar = (
    <div className={`relative ${isMobile ? 'w-[150px]' : 'w-[220px]'}`}>
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-500"
        style={{ color: 'var(--header-title-color, hsl(var(--muted-foreground)))' }}
      />
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Aller à l'année..."
        value={year}
        onChange={(e) => {
          // Nettoie agressivement l'input pour ne garder que 4 chiffres MAXIMUM
          const cleanedValue = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
          setYear(cleanedValue);
        }}
        onKeyDown={handleSearch}
        onBlur={() => setIsSearchOpen(false)} // Ferme quand on clique ailleurs
        className="w-full rounded-md border bg-transparent pl-10 pr-4 py-2 text-sm placeholder:text-current focus:outline-none transition-colors duration-500"
        style={{ 
          borderColor: 'var(--header-title-color, hsl(var(--border)))',
          color: 'var(--header-title-color, inherit)'
        }}
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg">
      <div className={`container flex h-16 max-w-screen-2xl items-center ${hasMounted && isMobile ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="flex items-center">
          <span 
            className="font-bold text-2xl tracking-tight transition-colors duration-500"
            style={{ color: 'var(--header-title-color, inherit)' }}
          >
            Capsulo
          </span>
        </Link>

        {hasMounted && !isMobile && searchBar}
      </div>
    </header>
  );
}

export function YearInputForm({
  year,
  onYearChange,
  onSubmit,
  onKeyDown,
  buttonText,
  placeholder,
}: {
  year: number | undefined;
  onYearChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  buttonText: string;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full items-center rounded-md border bg-blue-950/30 p-2 shadow-lg backdrop-blur-sm transition-all focus-within:border-blue-500/80 focus-within:bg-blue-950/50"
      style={{ borderColor: 'var(--header-title-color, #2563eb)' }}
    >
      <input
        type="number"
        value={year ?? ""}
        onChange={(e) => onYearChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent px-4 text-lg font-mono placeholder:text-current/70 focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={MIN_YEAR}
        max={MAX_YEAR}
        style={{ color: 'var(--header-title-color, #93c5fd)' }}
      />
      <button
        type="submit"
        className="rounded-md px-6 py-2 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: 'var(--header-title-color, #2563eb)' }}
      >
        {buttonText}
      </button>
    </form>
  );
}