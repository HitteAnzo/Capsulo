import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="fr">
      <body className={inter.className}>
        {/* Background gradient + subtle overlay */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(800px_400px_at_10%_80%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.7))]" />

        <div className="max-w-[1200px] mx-auto px-5 py-8 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
