import { getCityConfig } from "@/config/cities";
import cities from "@/config/cities";

export default function Footer() {
  const city = getCityConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="font-bold text-white text-lg">Hundliv {city.name}</span>
            </div>
            <p className="text-sm leading-relaxed">
              Din guide till ett bättre hundliv i {city.name}. Vi hjälper hundägare hitta hundvänliga restauranger, parker, caféer och mycket mer.
            </p>
          </div>

          {/* Utforska */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Utforska</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Alla ställen</a></li>
              <li><a href="/restauranger" className="hover:text-white transition-colors">Hundvänliga restauranger</a></li>
              <li><a href="/parker" className="hover:text-white transition-colors">Hundparker & rastgårdar</a></li>
              <li><a href="/guide" className="hover:text-white transition-colors">Hundägarguiden</a></li>
            </ul>
          </div>

          {/* Kategorier */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kategorier</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/restauranger" className="hover:text-white transition-colors">🍽️ Restauranger i {city.name}</a></li>
              <li><a href="/restauranger" className="hover:text-white transition-colors">☕ Caféer i {city.name}</a></li>
              <li><a href="/parker" className="hover:text-white transition-colors">🌳 Parker i {city.name}</a></li>
              <li><a href="/?category=vet" className="hover:text-white transition-colors">🏥 Veterinärer i {city.name}</a></li>
              <li><a href="/?category=shop" className="hover:text-white transition-colors">🛍️ Hundbutiker i {city.name}</a></li>
            </ul>
          </div>

          {/* Fler städer */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Fler städer</h3>
            <ul className="space-y-2 text-sm">
              {Object.values(cities)
                .filter(c => c.id !== city.id)
                .map(c => (
                  <li key={c.id}>
                    <a
                      href={`https://${c.domain}`}
                      className="hover:text-white transition-colors"
                    >
                      🐾 Hundliv {c.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Annonsera */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">För företag</h3>
            <p className="text-sm leading-relaxed mb-4">
              Vill du nå hundägare i {city.name}? Vi erbjuder annonsplatser och sponsrade listningar.
            </p>
            <a
              href="mailto:annons@hundliv.se"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#FFE600', color: '#1a1a1a' }}
            >
              📩 Kontakta oss
            </a>
            <p className="text-xs mt-3 text-stone-500">annons@hundliv.se</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p>© {year} Hundliv {city.name}. Alla rättigheter förbehållna.</p>
          <div className="flex gap-4">
            <a href="/guide" className="hover:text-stone-400 transition-colors">Om oss</a>
            <a href="mailto:annons@hundliv.se" className="hover:text-stone-400 transition-colors">Annonsera</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
