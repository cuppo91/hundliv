import { getCityConfig } from "@/config/cities";

export default function Header() {
  const city = getCityConfig();
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-xl tracking-tight">
            Hundliv <span className="text-amber-600">{city.name}</span>
          </span>
        </div>
        <p className="text-sm text-stone-500 hidden sm:block">
          Hundvänliga ställen i {city.name}
        </p>
      </div>
    </header>
  );
}
