import { getCityConfig } from "@/config/cities";

export default function Header() {
  const city = getCityConfig();
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-xl tracking-tight text-stone-900">
            Hundliv<span className="text-emerald-600">{city.name}</span>
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-500 font-medium">
          <a href="#" className="hover:text-stone-900 transition-colors">Restauranger</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Parker</a>
          <a href="#" className="hover:text-stone-900 transition-colors">Caféer</a>
        </nav>
      </div>
    </header>
  );
}
