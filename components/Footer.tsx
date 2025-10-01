import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full py-8 mt-16 transition-colors duration-500"
      style={{ borderColor: 'var(--footer-text-color, hsl(var(--border)))' }}
    >
      <div className="container mx-auto flex flex-col items-center gap-4 text-center">
        <Link 
          href="/" 
          className="font-bold text-2xl transition-colors duration-500"
          style={{ color: 'var(--footer-text-color, inherit)' }}
        >
          Capsulo
        </Link>
        
        <p
          className="text-sm italic max-w-md opacity-90 transition-colors duration-500"
          style={{ color: 'var(--footer-text-color, hsl(var(--muted-foreground)))' }}
        >
          Chaque année a son histoire, et toi quelle est la tienne ?
        </p>

        <p
          className="text-xs opacity-60 transition-colors duration-500"
          style={{ color: 'var(--footer-text-color, hsl(var(--muted-foreground)))' }}
        >
          &copy; {currentYear} Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}