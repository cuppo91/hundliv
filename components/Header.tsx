import { getCityConfig } from "@/config/cities";

export default function Header() {
  const city = getCityConfig();
  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ background: '#29C4D8' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* Dog silhouette SVG */}
          <svg width="36" height="36" viewBox="0 0 100 100" fill="#FFE600" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 75 C20 75 15 70 15 60 C15 50 20 40 28 35 C26 30 27 22 32 18 C34 16 37 16 39 18 C41 14 46 12 50 14 C54 10 62 10 66 15 C72 12 80 15 82 22 C86 24 88 30 86 36 C90 40 90 50 85 58 C82 68 75 75 65 76 L65 85 C65 87 63 88 62 87 L55 80 L45 80 L38 87 C37 88 35 87 35 85 L35 75 Z"/>
          </svg>
          <div className="flex items-baseline gap-0.5">
            <span className="font-black text-2xl tracking-widest uppercase leading-none" style={{ color: '#FFE600', letterSpacing: '0.12em' }}>
              HUNDLIV
            </span>
            <span className="font-black text-lg tracking-widest uppercase leading-none ml-1.5" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em' }}>
              {city.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-5 text-sm font-bold uppercase tracking-wider" style={{ color: 'rgba(0,60,70,0.7)' }}>
          <a href="#" className="hover:text-white transition-colors">Restauranger</a>
          <a href="#" className="hover:text-white transition-colors">Parker</a>
          <a href="#" className="hover:text-white transition-colors">Caféer</a>
        </nav>
      </div>
    </header>
  );
}
