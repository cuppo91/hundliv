import { createClient } from '@supabase/supabase-js'
import { getCityConfig } from '@/config/cities'
import Header from '@/components/Header'
import PlaceCard from '@/components/PlaceCard'
import type { Place } from '@/lib/supabase'

export async function generateMetadata() {
  const city = getCityConfig()
  return {
    title: `Hundparker & Hundrastgårdar i ${city.name} — Hundliv ${city.name}`,
    description: `Hitta alla hundparker och hundrastgårdar i ${city.name}. Komplett guide för dig och din hund.`,
  }
}

async function getParks(): Promise<Place[]> {
  const city = getCityConfig()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', city.id)
    .eq('category', 'park')
    .eq('status', 'approved')
    .order('rating', { ascending: false })
  return data ?? []
}

export default async function ParkerPage() {
  const city = getCityConfig()
  const parks = await getParks()

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />
      <div className="relative overflow-hidden py-12" style={{ background: '#1a9aaa' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-5xl mb-3">🌳</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Hundparker i {city.name}
          </h1>
          <p className="text-emerald-100 mt-3 text-lg">
            {parks.length} hundrastgårdar och parker — låt hunden springa löst
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-4 py-8">
        <div className="prose max-w-none mb-8">
          <p className="text-stone-600 text-lg">
            {city.name} har många fina hundrastgårdar och grönområden där hundar får springa fritt.
            Nedan hittar du alla hundparker vi känner till i {city.name} — från stora naturreservat
            till mindre inhägnade rastgårdar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parks.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Hundliv {city.name}
        </div>
      </footer>
    </div>
  )
}
