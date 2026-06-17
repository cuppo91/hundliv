export type ArticleTemplate = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  category: string
  placeCategories: string[] // matches DB category field
  cityId: string
  intro: string
  tips: { heading: string; body: string }[]
}

const articles: ArticleTemplate[] = [
  {
    slug: 'basta-hundrastgardarna-i-malmo',
    title: 'Bästa hundrastgårdarna i Malmö — vår guide',
    metaTitle: 'Bästa Hundrastgårdarna i Malmö 2025 — Guide för hundägare',
    metaDescription: 'Vi har rankat de bästa hundrastgårdarna i Malmö baserat på tusentals omdömen. Hitta hundrastgård nära dig med adresser.',
    publishedAt: '2025-06-17',
    category: 'Parker',
    placeCategories: ['park'],
    cityId: 'malmo',
    intro: 'Malmö har ett rikt utbud av hundrastgårdar och hundparker — från inhägnade rastgårdar i bostadsområden till stora naturområden vid havet. Vi har rankat de bästa ställena baserat på tusentals Google-omdömen kombinerat med hur hundspecifika de är.',
    tips: [
      {
        heading: 'Tips för besök i hundrastgård',
        body: 'Ta alltid med vattenskål och vatten, särskilt under sommaren. Ha koll på din hunds kroppsspråk — inte alla hundar trivs i grupp. Plocka alltid upp efter din hund. De flesta rastgårdar i Malmö är gratis att använda.',
      },
    ],
  },
  {
    slug: 'basta-hundrastgardarna-i-goteborg',
    title: 'Bästa hundrastgårdarna i Göteborg — vår guide',
    metaTitle: 'Bästa Hundrastgårdarna i Göteborg 2025 — Guide för hundägare',
    metaDescription: 'Vi har rankat de bästa hundrastgårdarna i Göteborg baserat på tusentals omdömen. Hitta hundrastgård nära dig med adresser.',
    publishedAt: '2025-06-17',
    category: 'Parker',
    placeCategories: ['park'],
    cityId: 'goteborg',
    intro: 'Göteborg har ett brett utbud av hundrastgårdar — från inhägnade stadsparker till stora naturområden. Vi har rankat de bästa ställena baserat på tusentals Google-omdömen kombinerat med hur hundspecifika de är.',
    tips: [
      {
        heading: 'Tips för besök i hundrastgård',
        body: 'Ta alltid med vattenskål och vatten, särskilt under sommaren. Ha koll på din hunds kroppsspråk — inte alla hundar trivs i grupp. Plocka alltid upp efter din hund. De flesta rastgårdar i Göteborg är gratis att använda.',
      },
    ],
  },
  {
    slug: 'hundvanliga-cafeer-i-malmo',
    title: 'Hundvänliga caféer i Malmö — 5 ställen du måste testa',
    metaTitle: 'Hundvänliga Caféer i Malmö 2025 — Bästa fikastälena för hundägare',
    metaDescription: 'Hitta de bästa hundvänliga caféerna i Malmö. Rankade baserat på omdömen och hur hundvänliga de faktiskt är.',
    publishedAt: '2025-06-17',
    category: 'Caféer',
    placeCategories: ['cafe'],
    cityId: 'malmo',
    intro: 'Att hitta ett café i Malmö där hunden är välkommen kan vara knepigt. Vi har gått igenom hundratals omdömen för att hitta de caféer som verkligen välkomnar fyrbenta gäster — rankade efter betyg och hundvänlighet.',
    tips: [
      {
        heading: 'Tips inför cafébesöket',
        body: 'Ring alltid och bekräfta att hundar är välkomna inomhus — de flesta caféer välkomnar hundar på uteserveringen men färre inomhus. Ha alltid vatten med till hunden.',
      },
    ],
  },
  {
    slug: 'hundvanliga-cafeer-i-goteborg',
    title: 'Hundvänliga caféer i Göteborg — 5 ställen du måste testa',
    metaTitle: 'Hundvänliga Caféer i Göteborg 2025 — Bästa fikastälena för hundägare',
    metaDescription: 'Hitta de bästa hundvänliga caféerna i Göteborg. Rankade baserat på omdömen och hur hundvänliga de faktiskt är.',
    publishedAt: '2025-06-17',
    category: 'Caféer',
    placeCategories: ['cafe'],
    cityId: 'goteborg',
    intro: 'Göteborg har ett rikt caféutbud men inte alla välkomnar hundar. Vi har gått igenom hundratals omdömen för att hitta de caféer som verkligen är hundvänliga — rankade efter betyg och hundvänlighet.',
    tips: [
      {
        heading: 'Tips inför cafébesöket',
        body: 'Ring alltid och bekräfta att hundar är välkomna inomhus — de flesta caféer välkomnar hundar på uteserveringen men färre inomhus. Ha alltid vatten med till hunden.',
      },
    ],
  },
  {
    slug: 'hundvanliga-restauranger-i-malmo',
    title: 'Hundvänliga restauranger i Malmö — topp 5',
    metaTitle: 'Hundvänliga Restauranger i Malmö 2025 — Rankade efter omdömen',
    metaDescription: 'De bästa hundvänliga restaurangerna i Malmö rankade efter betyg och hundvänlighet. Hitta restauranger där hunden är välkommen.',
    publishedAt: '2025-06-17',
    category: 'Restauranger',
    placeCategories: ['restaurant'],
    cityId: 'malmo',
    intro: 'Malmö har många restauranger med hundvänliga uteserveringar, men det kan vara svårt att veta vilka som verkligen välkomnar hundar. Vi har rankat de bästa baserat på kundomdömen och hundvänlighet.',
    tips: [
      {
        heading: 'Tips för restaurangbesök med hund',
        body: 'Ring alltid i förväg och bekräfta hundpolicyn. Ha en koppel och vatten med. Välj bord i utkanten av uteserveringen så stör inte hunden andra gäster.',
      },
    ],
  },
  {
    slug: 'hundvanliga-restauranger-i-goteborg',
    title: 'Hundvänliga restauranger i Göteborg — topp 5',
    metaTitle: 'Hundvänliga Restauranger i Göteborg 2025 — Rankade efter omdömen',
    metaDescription: 'De bästa hundvänliga restaurangerna i Göteborg rankade efter betyg och hundvänlighet. Hitta restauranger där hunden är välkommen.',
    publishedAt: '2025-06-17',
    category: 'Restauranger',
    placeCategories: ['restaurant'],
    cityId: 'goteborg',
    intro: 'Göteborg har ett varierat restaurangutbud och många välkomnar hundar på uteserveringen. Vi har rankat de bästa baserat på tusentals kundomdömen kombinerat med hur hundvänliga de faktiskt är.',
    tips: [
      {
        heading: 'Tips för restaurangbesök med hund',
        body: 'Ring alltid i förväg och bekräfta hundpolicyn. Ha en koppel och vatten med. Välj bord i utkanten av uteserveringen så stör inte hunden andra gäster.',
      },
    ],
  },
]

export function getArticlesForCity(cityId: string): ArticleTemplate[] {
  return articles.filter(a => a.cityId === cityId)
}

export function getArticleBySlug(slug: string): ArticleTemplate | undefined {
  return articles.find(a => a.slug === slug)
}

export default articles
