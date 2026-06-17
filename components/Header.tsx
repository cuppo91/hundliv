"use client";

import Image from "next/image";
import { useState } from "react";
import { getCityConfig } from "@/config/cities";

const LOGO: Record<string, { src: string; width: number; height: number }> = {
  malmo:     { src: '/logo-malmo.svg',    width: 340, height: 53 },
  goteborg:  { src: '/logo-goteborg.svg', width: 340, height: 46 },
  stockholm: { src: '/logo-goteborg.svg', width: 340, height: 46 },
};

const NAV = [
  { href: '/restauranger', label: 'Restauranger', emoji: '🍽️' },
  { href: '/parker',       label: 'Parker',        emoji: '🌳' },
  { href: '/guide',        label: 'Guide',         emoji: '🐕' },
];

export default function Header({ onSubmitClick }: { onSubmitClick?: () => void }) {
  const city = getCityConfig();
  const logo = LOGO[city.id] ?? LOGO.goteborg;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm" style={{ background: '#29C4D8' }}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/">
            <Image
              src={logo.src}
              alt={`Hundliv ${city.name}`}
              height={logo.height}
              width={logo.width}
              priority
              style={{ objectFit: 'contain', objectPosition: 'left' }}
            />
          </a>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold" style={{ color: 'rgba(0,60,70,0.8)' }}>
              {NAV.map(n => (
                <a key={n.href} href={n.href} className="hover:text-white transition-colors">{n.label}</a>
              ))}
            </nav>

            <button
              onClick={onSubmitClick}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: '#FFE600', color: '#1a1a1a' }}
            >
              <span className="hidden sm:inline">🐾 Tipsa om ett ställe</span>
              <span className="sm:hidden">🐾 Tipsa</span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col justify-center gap-1.5 w-9 h-9 items-center"
              aria-label="Meny"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20" style={{ background: '#1fb8ca' }}>
            {NAV.map(n => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-white font-semibold border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                <span>{n.emoji}</span>
                {n.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
