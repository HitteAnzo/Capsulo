import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8">
      <div className="container mx-auto text-center">
        <p
          className="text-sm transition-colors duration-500"
          style={{ color: 'var(--footer-text-color, hsl(var(--muted-foreground)))' }}
        >
          &copy; {currentYear} Capsulo. Chaque année a son histoire.
        </p>
      </div>
    </footer>
  );
}