import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// Ajout de la police pour les années 60
import { Press_Start_2P, Bebas_Neue, DM_Serif_Display } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Capsulo",
  description: "Explorez musiques, films, mode et prix d'une année donnée.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${GeistSans.className} ${pressStart2P.variable} ${bebasNeue.variable} ${dmSerifDisplay.variable} bg-background text-foreground antialiased`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(600px_circle_at_top,rgba(120,113,198,0.15),transparent_80%)]" />
        <div className="container flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
