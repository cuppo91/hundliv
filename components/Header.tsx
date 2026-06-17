"use client";

import Image from "next/image";
import { getCityConfig } from "@/config/cities";

const LOGO: Record<string, string> = {
  malmo:     '/logo-malmo.svg',
  goteborg:  '/logo-goteborg.svg',
  stockholm: '/logo-goteborg.svg',
};

export default function Header({ onSubmitClick }: { onSubmitClick?: () => void }) {
  const city = getCityConfig();
  const logo = LOGO[city.id] ?? '/logo-goteborg.svg';

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ background: '#29C4D8' }}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Image
          src={logo}
          alt={`Hundliv ${city.name}`}
          height={50}
          width={360}
          priority
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold" style={{ color: 'rgba(0,60,70,0.8)' }}>
            <a href="/restauranger" className="hover:text-white transition-colors">Restauranger</a>
            <a href="/parker" className="hover:text-white transition-colors">Parker</a>
            <a href="/guide" className="hover:text-white transition-colors">Guide</a>
          </nav>
          <button
            onClick={onSubmitClick}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: '#FFE600', color: '#1a1a1a' }}
          >
            <span className="hidden sm:inline">🐾 Tipsa om ett ställe</span>
            <span className="sm:hidden">🐾 Tipsa</span>
          </button>
        </div>
      </div>
    </header>
  );
}
