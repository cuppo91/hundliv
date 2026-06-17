import { getCityConfig } from '@/config/cities'
import { getArticleBySlug, getArticlesForCity } from '@/lib/articles'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  // Generate params for all articles across all cities
  const { default: articles } = await import('@/lib/articles')
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  const city = getCityConfig()
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

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  const city = getCityConfig()

  if (!article || !article.cityIds.includes(city.id)) notFound()

  const relatedArticles = getArticlesForCity(city.id).filter(a => a.slug !== article.slug)

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
            Publicerad {new Date(article.publishedAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto w-full px-4 py-10">
        <p className="text-stone-600 text-lg leading-relaxed mb-8 border-l-4 pl-4" style={{ borderColor: '#29C4D8' }}>
          {article.intro}
        </p>

        <div className="space-y-8">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-stone-900 mb-3">{section.heading}</h2>
              <p className="text-stone-600 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

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
