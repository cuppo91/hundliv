import { getCityConfig } from '@/config/cities'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata() {
  const city = getCityConfig()
  return {
    title: `Hundägarguiden till ${city.name} — Tips & Råd`,
    description: `Allt du behöver veta som hundägare i ${city.name}. Hundvänliga tips, regler och råd.`,
  }
}

export default function GuidePage() {
  const city = getCityConfig()

  const tips = [
    {
      emoji: '📋',
      title: 'Koppeltvång i staden',
      body: `I ${city.name} gäller koppeltvång på de flesta offentliga platser. Undantag finns i utpekade hundrastgårdar och vissa naturområden. Kontrollera alltid skyltar på plats.`,
    },
    {
      emoji: '🍽️',
      title: 'Restauranger & caféer',
      body: `Många restauranger i ${city.name} välkomnar hundar på uteserveringen — färre inomhus. Ring alltid i förväg och bekräfta. Ha alltid vatten med till din hund.`,
    },
    {
      emoji: '🚇',
      title: 'Kollektivtrafik',
      body: `Hundar får åka med kollektivtrafiken i ${city.name} om de sitter i knäet eller bärs. Större hundar behöver vara lugnа och får inte blockera gången.`,
    },
    {
      emoji: '🌳',
      title: 'Bästa hundrastgårdarna',
      body: `${city.name} har ett flertal inhägnade hundrastgårdar där hunden kan springa löst. Se vår parkguide för en komplett lista med adresser.`,
    },
    {
      emoji: '🏥',
      title: 'Veterinärer & akutvård',
      body: `Ha alltid numret till närmaste djurklinik sparat. I ${city.name} finns flera akutkliniker öppna kvällar och helger. Se vår lista med veterinärer.`,
    },
    {
      emoji: '❄️',
      title: 'Vinter & asfaltssalt',
      body: `På vintern saltas gatorna i ${city.name} flitigt. Salt skadar hundens tassar — skölj alltid av tassarna efter promenaden eller använd tassalv som skydd.`,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />

      <div className="relative overflow-hidden py-12" style={{ background: '#1a9aaa' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-5xl mb-3">🐕</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Hundägarguiden till {city.name}
          </h1>
          <p className="text-emerald-100 mt-3 text-lg">
            Tips och råd för ett bättre hundliv i staden
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tips.map(tip => (
            <article key={tip.title} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <div className="text-3xl mb-3">{tip.emoji}</div>
              <h2 className="font-bold text-stone-900 text-lg mb-2">{tip.title}</h2>
              <p className="text-stone-500 text-sm leading-relaxed">{tip.body}</p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
