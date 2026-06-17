import { createClient } from '@supabase/supabase-js'
import { getCityConfig } from '@/config/cities'
import { getArticleBySlug, getActiveArticlesForCity } from '@/lib/articles'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import type { Place } from '@/lib/supabase'

export const revalidate = 3600 // revalidate every hour

export async function generateStaticParams() {
  const { default: articles } = await import('@/lib/articles')
  const city = getCityConfig()
  return articles
    .filter(a => a.cityId === city.id)
    .map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  }
}

function starRating(rating: number | null) {
  if (!rating) return null
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  const city = getCityConfig()

  if (!article || article.cityId !== city.id) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: places } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', city.id)
    .in('category', article.placeCategories)
    .eq('status', 'approved')
    .order('score', { ascending: false })
    .limit(5)

  const topPlaces: Place[] = places ?? []
  const relatedArticles = getActiveArticlesForCity(city.id).filter(a => a.slug !== article.slug)

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />

      <div className="relative overflow-hidden py-10" style={{ background: '#1a9aaa' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 text-white/80 border border-white/30">
            {article.category}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {article.title}
          </h1>
          <p className="text-white/70 text-sm mt-3">
            Uppdaterad {new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto w-full px-4 py-10">
        <p className="text-stone-600 text-lg leading-relaxed mb-8 border-l-4 pl-4" style={{ borderColor: '#29C4D8' }}>
          {article.intro}
        </p>

        {/* Live-rankade ställen från databasen */}
        <div className="space-y-5 mb-10">
          {topPlaces.map((place, i) => (
            <div key={place.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-lg"
                  style={{ background: '#29C4D8' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-stone-900 text-lg leading-snug">{place.name}</h2>
                  <p className="text-stone-400 text-sm mt-0.5">{place.address}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {place.rating && (
                      <span className="text-amber-500 text-sm font-medium">
                        {starRating(place.rating)} {place.rating.toFixed(1)}
                      </span>
                    )}
                    {place.user_ratings_total && (
                      <span className="text-stone-400 text-xs">
                        {place.user_ratings_total.toLocaleString('sv-SE')} omdömen
                      </span>
                    )}
                    {place.dog_bonus && place.dog_bonus >= 1.5 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#FFE600', color: '#1a1a1a' }}>
                        🐾 Hundspecialiserat
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-3">
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold hover:underline"
                        style={{ color: '#29C4D8' }}
                      >
                        Hemsida →
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-stone-400 hover:underline"
                    >
                      Vägbeskrivning →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips-sektioner */}
        {article.tips.map((tip, i) => (
          <section key={i} className="mb-6">
            <h2 className="text-xl font-bold text-stone-900 mb-3">{tip.heading}</h2>
            <p className="text-stone-600 leading-relaxed">{tip.body}</p>
          </section>
        ))}

        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Fler guider</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map(a => (
                <a
                  key={a.slug}
                  href={`/guide/${a.slug}`}
                  className="block bg-white rounded-xl border border-stone-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold mb-1" style={{ color: '#29C4D8' }}>{a.category}</div>
                  <div className="font-semibold text-stone-900 text-sm leading-snug">{a.title}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <a href="/guide" className="text-sm font-semibold hover:underline" style={{ color: '#29C4D8' }}>
            ← Tillbaka till guiden
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
