export type Article = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  category: string
  intro: string
  sections: { heading: string; body: string }[]
  cityIds: string[] // which cities this article applies to
}

const articles: Article[] = [
  {
    slug: 'basta-hundrastgardarna-i-malmo',
    title: 'Bästa hundrastgårdarna i Malmö — vår guide',
    metaTitle: 'Bästa Hundrastgårdarna i Malmö 2025 — Guide för hundägare',
    metaDescription: 'Vi har rankat de bästa hundrastgårdarna i Malmö baserat på tusentals omdömen. Hitta hundrastgård nära dig med karta och adresser.',
    publishedAt: '2025-06-17',
    category: 'Parker',
    cityIds: ['malmo'],
    intro: 'Malmö har ett rikt utbud av hundrastgårdar och hundparker — från inhägnade rastgårdar i bostadsområden till stora naturområden vid havet. Vi har gått igenom tusentals omdömen och rankat de bästa ställena för dig och din hund.',
    sections: [
      {
        heading: '1. Ribersborgs Hundrastplats — bäst i Malmö',
        body: 'Med över 1 000 omdömen och ett genomsnittligt betyg på 4,6 stjärnor är Ribersborgs Hundrastplats Malmös mest omtyckta hundpark. Läget vid havet gör den unik — hunden kan springa löst längs stranden i ett stort inhägnat område. Perfekt för energiska hundar som gillar att springa och leka med andra hundar. Parkering finns längs Limhamnsvägen.',
      },
      {
        heading: '2. Hundbadet vid Ribersborg',
        body: 'Alldeles intill hundrastplatsen finns Hundbadet — ett av få ställen i Sverige där hundar får bada fritt. Sommartid är det populärt och socialt, med hundägare från hela Malmö. Vattnet är grunt och säkert för de flesta hundar. Kom tidigt på sommarmorgnar för att undvika trängseln.',
      },
      {
        heading: '3. Dog Park Stadium Park East',
        body: 'En välskött hundrastgård i centrala Malmö med gott om plats. Populär bland boende i Hyllie och Husie. Inhägnad med separata sektioner för stora och små hundar, vilket uppskattas av hundar i alla storlekar. Betyg 4,5 av 5 baserat på 42 omdömen.',
      },
      {
        heading: '4. Flygfältsparkens hundrastgård',
        body: 'En rymlig hundrastgård i Husie med gott om plats att springa. Marken är gräsbevuxen och väl underhållen. Populär framför allt på vardagskvällar. Lätt att ta sig till med buss från centrala Malmö.',
      },
      {
        heading: '5. Remonthagen dog park',
        body: 'Belägen i Husie är Remonthagen en omtyckt hundpark med 108 omdömen och betyg 4,3. Bra storlek för sociala hundar och omgiven av grönska. Parken har belysning vilket gör den användbar även under vinterhalvåret.',
      },
      {
        heading: 'Tips för besök i hundrastgård',
        body: 'Ta alltid med vattenskål och vatten till din hund, särskilt under sommaren. Ha koll på din hunds kroppsspråk — inte alla hundar trivs i grupp. Plocka alltid upp efter din hund. De flesta rastgårdar i Malmö är gratis att använda.',
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
    cityIds: ['goteborg'],
    intro: 'Göteborg har ett brett utbud av hundrastgårdar — från inhägnade stadsparker till stora naturområden. Vi har gått igenom tusentals omdömen och rankat de bästa ställena för dig och din hund i Göteborg.',
    sections: [
      {
        heading: '1. Hundrast — Göteborgs mest omtyckta hundpark',
        body: 'Med imponerande 4,8 i betyg och 126 omdömen toppar Hundrast vår lista. En välskött och rymlig hundrastgård som hundägare i Göteborg återkommer till gång på gång. Rikligt med plats, bra staket och trevlig miljö gör den till ett självklart förstaval.',
      },
      {
        heading: '2. Hinsholmskilens hundrastgård',
        body: 'En av Göteborgs populäraste hundrastgårdar med 192 omdömen och betyg 4,4. Belägen i ett naturskört område med grönska runt om. Stor yta ger hundar möjlighet att verkligen röra på sig. Uppskattad av både stora och små hundar.',
      },
      {
        heading: '3. Bifrostparkens hundrastgård',
        body: 'Välskött hundrastgård i Biskopsgården med betyg 4,5. Inhägnad med staket i bra skick. Populär bland boende i nordvästra Göteborg. Lagom stor — inte överväldigande för blygsamma hundar.',
      },
      {
        heading: '4. Hundrastgård Sjupundsgatan',
        body: 'Med 163 omdömen är detta en av Göteborgs mest besökta hundrastgårdar. Centralt belägen och lättillgänglig med kollektivtrafik. Betyg 4,1 — en pålitlig vardagsrastgård för hundägare i centrala Göteborg.',
      },
      {
        heading: '5. Slottsskogen Dog Park',
        body: 'Intill det populära Slottsskogen ligger denna hundrastgård som kombinerar naturupplevelse med rastgård. Perfekt att kombinera med en promenad i Slottsskogen. Betyg 4,0 med 51 omdömen.',
      },
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
    metaDescription: 'Hitta de bästa hundvänliga caféerna i Malmö. Vi har rankat ställena baserat på omdömen och hur hundvänliga de faktiskt är.',
    publishedAt: '2025-06-17',
    category: 'Restauranger',
    cityIds: ['malmo'],
    intro: 'Att hitta ett café i Malmö där hunden är välkommen kan vara knepigt. Vi har gått igenom hundratals omdömen och besök för att hitta de caféer som verkligen välkomnar fyrbenta gäster — inte bara tolererar dem.',
    sections: [
      {
        heading: '1. Marvin — populärast bland hundägare',
        body: 'Marvin toppar vår lista med 4,8 i betyg och ett starkt rykte bland hundägare i Malmö. Känt för sin avslappnade atmosfär och välkomnande personal. Uteserveringen är hundvänlig och det finns ofta vattenskålar tillgängliga. Perfekt för en längre fika med hunden.',
      },
      {
        heading: '2. Café Myka — mysigt och hundvänligt',
        body: 'Café Myka har ett perfekt betyg från sina stamgäster och är ett av Malmös mest omtyckta caféer bland hundägare. Liten och intim atmosfär. Personalen är kända för att välkomna hundar varmt — det är inte ovanligt att hunden får lite extra uppmärksamhet.',
      },
      {
        heading: '3. Beans & Tales Café',
        body: 'Med 655 omdömen och betyg 4,6 är Beans & Tales ett etablerat favorit bland Malmöbor. Bra kaffe, goda bakverk och en hunvänlig uteservering gör det till ett självklart val för hundägare i centrala Malmö.',
      },
      {
        heading: '4. Café Ved',
        body: 'Ett omtyckt café med betyg 4,5 och 144 omdömen. Café Ved är känt för sin mysiga inredning och goda fika. Hundvänlig uteservering, och personalen sägs gärna bjuda hunden på lite vatten.',
      },
      {
        heading: '5. Freja',
        body: 'Freja är ett populärt café med 123 omdömen och betyg 4,4. Bra läge och trevlig personal som välkomnar hundar. En bra vardagsfika-destination för hundägare i centrala Malmö.',
      },
      {
        heading: 'Tips inför cafébesöket',
        body: 'Ring alltid och bekräfta att hundar är välkomna inomhus — de flesta caféer välkomnar hundar på uteserveringen men färre inomhus. Ha alltid vatten med till hunden. Be personalen om tips på hundvänliga ställen i närheten.',
      },
    ],
  },
  {
    slug: 'hundvanliga-cafeer-i-goteborg',
    title: 'Hundvänliga caféer i Göteborg — 5 ställen du måste testa',
    metaTitle: 'Hundvänliga Caféer i Göteborg 2025 — Bästa fikastälena för hundägare',
    metaDescription: 'Hitta de bästa hundvänliga caféerna i Göteborg. Vi har rankat ställena baserat på omdömen och hur hundvänliga de faktiskt är.',
    publishedAt: '2025-06-17',
    category: 'Restauranger',
    cityIds: ['goteborg'],
    intro: 'Göteborg har ett rikt caféutbud men inte alla välkomnar hundar. Vi har gått igenom hundratals omdömen för att hitta de caféer som verkligen är hundvänliga — där både du och din hund känner er välkomna.',
    sections: [
      {
        heading: '1. Heavenly Dogs — Göteborgs hundcafé',
        body: 'Heavenly Dogs är ett självklart förstaval — ett café som är explicit riktat till hundägare. Med betyg 4,5 och 358 omdömen är det Göteborgs mest omtyckta hundvänliga café. Här är hunden inte bara välkommen utan en självklar del av upplevelsen. Hundgodis, vattenskålar och personal som älskar hundar.',
      },
      {
        heading: '2. Flickorna på Färjenäs',
        body: 'Ett Göteborg-original med fantastiskt läge vid älven. Betyg 4,6 och 828 omdömen vittnar om ett café som levererar år efter år. Hundvänlig uteservering med utsikt över Göta älv — svårt att slå för en solig dag med hunden.',
      },
      {
        heading: '3. A43 Coffee',
        body: 'Ett modernt specialty coffee-café med betyg 4,6 och 748 omdömen. A43 välkomnar hundar och är känt för sitt högkvalitativa kaffe. Populärt bland hundägare i centrala Göteborg.',
      },
      {
        heading: '4. Crippas Café',
        body: 'Crippas är ett omtyckt café med betyg 4,6 och 601 omdömen. Klassisk svensk fikastämning med hundvänlig uteservering. En pålitlig favorit bland Göteborgs hundägare.',
      },
      {
        heading: '5. Kafé Magasinet',
        body: 'Med 1 805 omdömen är Kafé Magasinet ett av Göteborgs mest besökta caféer. Betyg 4,3 och ett välkomnade förhållningssätt till hundar gör det till en bra destination oavsett var i stan du befinner dig.',
      },
      {
        heading: 'Tips inför cafébesöket',
        body: 'Ring alltid och bekräfta att hundar är välkomna inomhus — de flesta caféer välkomnar hundar på uteserveringen men färre inomhus. Ha alltid vatten med till hunden. Be personalen om tips på hundvänliga ställen i närheten.',
      },
    ],
  },
]

export function getArticlesForCity(cityId: string): Article[] {
  return articles.filter(a => a.cityIds.includes(cityId))
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export default articles
