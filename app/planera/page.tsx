import { createClient } from '@supabase/supabase-js'
import { getCityConfig } from '@/config/cities'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlaneringsKarta from './PlaneringsKarta'
import type { Place } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const city = getCityConfig()
  return {
    title: `Planera hundvänligt besök i ${city.name} — Hundliv ${city.name}`,
    description: `Planera ditt hundvänliga besök i ${city.name}. Hitta parker, caféer och restauranger på kartan och skicka din lista till mailen.`,
  }
}

export default async function PlaneraSida() {
  const city = getCityConfig()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', city.id)
    .eq('status', 'approved')
    .in('category', ['restaurant', 'cafe', 'park'])
    .order('score', { ascending: false })

  const places: Place[] = data ?? []

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />

      <div className="relative overflow-hidden py-10" style={{ background: '#1a9aaa' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-5xl mb-3">🗺️</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Planera ditt besök i {city.name}
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-xl mx-auto">
            Hitta hundvänliga ställen på kartan, bygg din lista och skicka den till din mail.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <PlaneringsKarta
          places={places}
          cityCenter={city.center}
          cityName={city.name}
        />
      </main>

      <Footer />
    </div>
  )
}
