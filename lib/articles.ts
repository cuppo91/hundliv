export type Season = 'summer' | 'winter' | 'spring' | 'autumn' | null

export type ArticleTemplate = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  category: string
  placeCategories: string[]
  cityId: string
  intro: string
  tips: { heading: string; body: string }[]
  season: Season
}

// Returns current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 12 || month <= 2) return 'winter'
  if (month >= 3 && month <= 5) return 'spring'
  return 'autumn'
}

// Returns true if article should be shown now
export function isArticleActive(season: Season): boolean {
  if (!season) return true
  return getCurrentSeason() === season
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
    season: null,
  },
  {
    slug: 'basta-hundrastgardarna-i-goteborg',
    title: 'Bästa hundrastgårdarna i Göteborg — vår guide',
    metaTitle: 'Bästa Hundrastgårdarna i Göteborg — Guide för hundägare',
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
    season: null,
  },
  {
    slug: 'hundvanliga-cafeer-i-malmo',
    title: 'Hundvänliga caféer i Malmö — 5 ställen du måste testa',
    metaTitle: 'Hundvänliga Caféer i Malmö — Bästa fikastälena för hundägare',
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
    season: null,
  },
  {
    slug: 'hundvanliga-cafeer-i-goteborg',
    title: 'Hundvänliga caféer i Göteborg — 5 ställen du måste testa',
    metaTitle: 'Hundvänliga Caféer i Göteborg — Bästa fikastälena för hundägare',
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
    season: null,
  },
  {
    slug: 'hundvanliga-restauranger-i-malmo',
    title: 'Hundvänliga restauranger i Malmö — topp 5',
    metaTitle: 'Hundvänliga Restauranger i Malmö — Rankade efter omdömen',
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
    season: null,
  },
  {
    slug: 'hundvanliga-restauranger-i-goteborg',
    title: 'Hundvänliga restauranger i Göteborg — topp 5',
    metaTitle: 'Hundvänliga Restauranger i Göteborg — Rankade efter omdömen',
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
    season: null,
  },

  // ── Sommarartiklar ────────────────────────────────────────────────────────
  {
    slug: 'hundvanliga-uteserveringar-malmo',
    title: 'Bästa uteserveringarna med hund i Malmö',
    metaTitle: 'Hundvänliga Uteserveringar i Malmö — Bästa ställena sommartid',
    metaDescription: 'Hitta de bästa uteserveringarna i Malmö där hunden är välkommen. Rankade efter omdömen och hundvänlighet — perfekt för sommaren.',
    publishedAt: '2026-06-01',
    category: 'Sommar',
    placeCategories: ['restaurant', 'cafe'],
    cityId: 'malmo',
    season: 'summer',
    intro: 'Sommaren i Malmö är perfekt för uteservering — och varför inte ta med hunden? Vi har rankat de bästa hundvänliga uteserveringarna i Malmö baserat på omdömen och hur välkomnande de faktiskt är mot fyrbenta gäster.',
    tips: [
      {
        heading: 'Så lyckas du med uteservering med hund',
        body: 'Ring alltid i förväg och bekräfta att hundar är välkomna — reglerna varierar. Välj ett bord i utkanten så sitter hunden tryggt utan att störa andra gäster. Ta med en filt för hunden att ligga på och egna vattenskål. Undvik peak-tider om din hund är stresskänslig.',
      },
      {
        heading: 'Vad säger lagen?',
        body: 'Hundar är tillåtna på uteserveringar i Sverige enligt livsmedelslagen, men restaurangen har rätt att sätta egna regler. En väluppfostrad hund som ligger still brukar alltid vara välkommen.',
      },
    ],
  },
  {
    slug: 'hundvanliga-uteserveringar-goteborg',
    title: 'Bästa uteserveringarna med hund i Göteborg',
    metaTitle: 'Hundvänliga Uteserveringar i Göteborg — Bästa ställena sommartid',
    metaDescription: 'Hitta de bästa uteserveringarna i Göteborg där hunden är välkommen. Rankade efter omdömen och hundvänlighet — perfekt för sommaren.',
    publishedAt: '2026-06-01',
    category: 'Sommar',
    placeCategories: ['restaurant', 'cafe'],
    cityId: 'goteborg',
    season: 'summer',
    intro: 'Sommarens Göteborg bjuder på härliga uteserveringar längs älven och i stadens parker — och många välkomnar hundar. Vi har rankat de bästa hundvänliga uteserveringarna baserat på omdömen och hur välkomnande de faktiskt är.',
    tips: [
      {
        heading: 'Så lyckas du med uteservering med hund',
        body: 'Ring alltid i förväg och bekräfta att hundar är välkomna — reglerna varierar. Välj ett bord i utkanten så sitter hunden tryggt utan att störa andra gäster. Ta med en filt för hunden att ligga på och egna vattenskål. Undvik peak-tider om din hund är stresskänslig.',
      },
      {
        heading: 'Vad säger lagen?',
        body: 'Hundar är tillåtna på uteserveringar i Sverige enligt livsmedelslagen, men restaurangen har rätt att sätta egna regler. En väluppfostrad hund som ligger still brukar alltid vara välkommen.',
      },
    ],
  },
  {
    slug: 'hundbad-och-badplatser-malmo',
    title: 'Badplatser för hundar i Malmö — var får hunden bada?',
    metaTitle: 'Hundbad i Malmö — Badplatser där hunden får bada',
    metaDescription: 'Komplett guide till hundbad och hundvänliga badplatser i Malmö. Var får hunden bada fritt? Rankade efter omdömen.',
    publishedAt: '2026-06-01',
    category: 'Sommar',
    placeCategories: ['park'],
    cityId: 'malmo',
    season: 'summer',
    intro: 'Sommarvärmen gör att många hundägare söker badplatser i Malmö där hunden får vara med. Det finns flera hundvänliga badplatser och officiella hundbad — vi har rankat de bästa baserat på omdömen och hur hundspecifika de är.',
    tips: [
      {
        heading: 'Regler för hundbad i Malmö',
        body: 'På de flesta allmänna badplatser i Malmö är hundar inte välkomna under badsäsongen (juni–augusti). Däremot finns det utpekade hundstränder och hundbad där hunden får bada fritt. Kolla alltid skyltar på plats.',
      },
      {
        heading: 'Tips för bad med hund',
        body: 'Ta med färskvatten — saltvatten törstigör hunden. Undvik bad under de varmaste timmarna på dagen. Skölj av hunden efter bad i saltvatten. Ha alltid koll på strömmar och djup.',
      },
    ],
  },
  {
    slug: 'hundbad-och-badplatser-goteborg',
    title: 'Badplatser för hundar i Göteborg — var får hunden bada?',
    metaTitle: 'Hundbad i Göteborg — Badplatser där hunden får bada',
    metaDescription: 'Komplett guide till hundbad och hundvänliga badplatser i Göteborg. Var får hunden bada fritt? Rankade efter omdömen.',
    publishedAt: '2026-06-01',
    category: 'Sommar',
    placeCategories: ['park'],
    cityId: 'goteborg',
    season: 'summer',
    intro: 'Göteborg med sin skärgård och många badplatser erbjuder fantastiska möjligheter för hundägare på sommaren. Vi har rankat de bästa hundvänliga badplatserna och hundbadet baserat på omdömen och hur hundspecifika de är.',
    tips: [
      {
        heading: 'Regler för hundbad i Göteborg',
        body: 'På de flesta badplatser i Göteborg är hundar inte välkomna under badsäsongen. Det finns dock utpekade platser där hundar får bada fritt. Kolla alltid skyltar och Göteborgs stads hemsida för aktuella regler.',
      },
      {
        heading: 'Tips för bad med hund',
        body: 'Ta med färskvatten — saltvatten törstigör hunden. Undvik bad under de varmaste timmarna. Skölj av hunden efter bad i saltvatten. Ha alltid koll på strömmar och djup vid havet.',
      },
    ],
  },
]

export function getArticlesForCity(cityId: string, includeSeasonal = true): ArticleTemplate[] {
  return articles.filter(a => {
    if (a.cityId !== cityId) return false
    if (!includeSeasonal && a.season !== null) return false
    return true
  })
}

export function getActiveArticlesForCity(cityId: string): ArticleTemplate[] {
  return articles.filter(a => {
    if (a.cityId !== cityId) return false
    return isArticleActive(a.season)
  })
}

export function getArticleBySlug(slug: string): ArticleTemplate | undefined {
  return articles.find(a => a.slug === slug)
}

export default articles
