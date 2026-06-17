import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getCityConfig } from "@/config/cities";

const geist = Geist({ subsets: ["latin"] });

const city = getCityConfig();

export const metadata: Metadata = {
  title: `Hundliv ${city.name} — Hundvänliga ställen`,
  description: `Hitta hundvänliga restauranger, caféer, parker och aktiviteter i ${city.name}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={geist.className}>
      <body className="min-h-screen bg-stone-50 text-stone-900">{children}</body>
    </html>
  );
}
