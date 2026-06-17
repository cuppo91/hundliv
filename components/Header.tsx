import Image from "next/image";
import { getCityConfig } from "@/config/cities";

const LOGO: Record<string, string> = {
  malmo:     '/logo-malmo.svg',
  goteborg:  '/logo-goteborg.svg',
  stockholm: '/logo-goteborg.svg', // placeholder tills Stockholm-logga finns
};

export default function Header() {
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
        <nav className="hidden sm:flex items-center gap-5 text-sm font-bold uppercase tracking-wider" style={{ color: 'rgba(0,60,70,0.75)' }}>
          <a href="#" className="hover:text-white transition-colors">Restauranger</a>
          <a href="#" className="hover:text-white transition-colors">Parker</a>
          <a href="#" className="hover:text-white transition-colors">Caféer</a>
        </nav>
      </div>
    </header>
  );
}
