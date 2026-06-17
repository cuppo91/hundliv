import { createClient } from '@supabase/supabase-js'
import { getCityConfig } from '@/config/cities'
import Header from '@/components/Header'
import PlaceCard from '@/components/PlaceCard'
import type { Place } from '@/lib/supabase'

export async function generateMetadata() {
  const city = getCityConfig()
  return {
    title: `Hundvänliga Restauranger & Caféer i ${city.name} — Hundliv ${city.name}`,
    description: `Hundvänliga restauranger och caféer i ${city.name} där din hund är välkommen. Uppdaterad guide.`,
  }
}

async function getPlaces(): Promise<Place[]> {
  const city = getCityConfig()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', city.id)
    .in('category', ['restaurant', 'cafe'])
    .eq('status', 'approved')
    .order('rating', { ascending: false })
  return data ?? []
}

export default async function RestaurangerPage() {
  const city = getCityConfig()
  const places = await getPlaces()
  const restaurants = places.filter(p => p.category === 'restaurant')
  const cafes = places.filter(p => p.category === 'cafe')

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />
      <div className="relative overflow-hidden py-12" style={{ background: '#1a9aaa' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-5xl mb-3">🍽️</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Hundvänliga restauranger i {city.name}
          </h1>
          <p className="text-emerald-100 mt-3 text-lg">
            {places.length} ställen där du och din hund är välkomna
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-4 py-8 space-y-10">
        <div className="prose max-w-none">
          <p className="text-stone-600 text-lg">
            Att hitta hundvänliga restauranger och caféer i {city.name} kan vara en utmaning.
            Vi har samlat alla ställen där din hund är välkommen — inomhus eller på uteserveringen.
            Tips: ring alltid och bekräfta att hundar är välkomna innan du besöker.
          </p>
        </div>

        {restaurants.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">🍽️ Restauranger ({restaurants.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map(place => <PlaceCard key={place.id} place={place} />)}
            </div>
          </section>
        )}

        {cafes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">☕ Caféer ({cafes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cafes.map(place => <PlaceCard key={place.id} place={place} />)}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Hundliv {city.name}
        </div>
      </footer>
    </div>
  )
}
