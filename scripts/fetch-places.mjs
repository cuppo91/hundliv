/**
 * Fetches dog-friendly places from Google Places API and upserts into Supabase.
 * Usage: node scripts/fetch-places.mjs <city_id>
 * Example: node scripts/fetch-places.mjs goteborg
 */

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
const envFile = readFileSync(envPath, 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length && !key.startsWith('#')) {
    process.env[key.trim()] = rest.join('=').trim()
  }
}

const CITIES = {
  malmo:     { id: 'malmo',     name: 'Malmö',     location: 'Malmö, Sweden' },
  goteborg:  { id: 'goteborg',  name: 'Göteborg',  location: 'Gothenburg, Sweden' },
  stockholm: { id: 'stockholm', name: 'Stockholm', location: 'Stockholm, Sweden' },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Bayesian average: pulls rating toward global mean when few reviews
// Global prior: mean=4.0, weight=25 reviews
const PRIOR_MEAN = 4.0
const PRIOR_WEIGHT = 25

function bayesianRating(rating, count) {
  if (!rating || !count) return PRIOR_MEAN
  return (PRIOR_WEIGHT * PRIOR_MEAN + rating * count) / (PRIOR_WEIGHT + count)
}

async function getDogBonus(name, category, address) {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `Rate how dog-focused this place is from 0.0 to 2.0.
2.0 = explicitly dog-themed (dog café, hundbad, hundrastgård, pet store)
1.0 = clearly dog-friendly (outdoor seating restaurant, park)
0.0 = generic (regular restaurant, vet, shop with no dog focus)

Name: ${name}
Category: ${category}
Address: ${address}

Reply with only a number like 0.0, 1.0, or 2.0`
      }]
    })
    const val = parseFloat(msg.content[0].text.trim())
    return isNaN(val) ? 0 : Math.min(2, Math.max(0, val))
  } catch {
    return 0
  }
}

const SEARCH_QUERIES = [
  { query: 'hundvänlig restaurang', category: 'restaurant' },
  { query: 'hundvänligt café',      category: 'cafe' },
  { query: 'hundrastgård',          category: 'park' },
  { query: 'hundpark',              category: 'park' },
  { query: 'hundbutik',             category: 'shop' },
  { query: 'veterinär',             category: 'vet' },
]

async function searchPlaces(query, location) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  url.searchParams.set('query', `${query} ${location}`)
  url.searchParams.set('key', GOOGLE_API_KEY)
  const res = await fetch(url.toString())
  const data = await res.json()
  if (data.error_message) throw new Error(`Google API error: ${data.error_message}`)
  return data.results ?? []
}

async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'formatted_phone_number,website,photos,reviews')
  url.searchParams.set('key', GOOGLE_API_KEY)
  const res = await fetch(url.toString())
  const data = await res.json()
  return data.result ?? {}
}

async function generateDescription(name, category, address, reviews) {
  try {
    const reviewTexts = (reviews ?? [])
      .slice(0, 5)
      .map(r => r.text)
      .filter(t => t && t.length > 20)
      .join('\n---\n')

    const prompt = reviewTexts
      ? `Skriv en kort beskrivning (2-3 meningar) på svenska om detta ställe baserat på besökarnas omdömen nedan. Fokusera på vad som gör stället speciellt — atmosfär, vad besökare uppskattar, vad som sticker ut. Inga tomma ord som "fantastiskt" eller "perfekt". Skriv i tredje person.

Namn: ${name}
Kategori: ${category}
Adress: ${address}

Omdömen:
${reviewTexts}

Svara endast med beskrivningen, inget annat.`
      : `Skriv en kort beskrivning (2 meningar) på svenska om detta ställe. Basera dig på namn, kategori och plats. Skriv i tredje person, neutralt och informativt.

Namn: ${name}
Kategori: ${category}
Adress: ${address}

Svara endast med beskrivningen, inget annat.`

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    })
    return msg.content[0].text.trim()
  } catch {
    return null
  }
}

function photoUrl(ref) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${GOOGLE_API_KEY}`
}

async function fetchForCity(cityId) {
  const city = CITIES[cityId]
  if (!city) { console.error(`Unknown city: ${cityId}`); process.exit(1) }

  console.log(`\nFetching places for ${city.name}...`)

  for (const { query, category } of SEARCH_QUERIES) {
    console.log(`\n  Searching: "${query}"`)
    const results = await searchPlaces(query, city.location)
    console.log(`  Found ${results.length} results`)

    for (const place of results) {
      const details = await getPlaceDetails(place.place_id)
      const photoRef = details.photos?.[0]?.photo_reference ?? place.photos?.[0]?.photo_reference

      const rating = place.rating ?? null
      const userRatingsTotal = place.user_ratings_total ?? 0
      const bayes = bayesianRating(rating, userRatingsTotal)
      const dogBonus = await getDogBonus(place.name, category, place.formatted_address)
      const score = bayes + dogBonus
      const description = await generateDescription(place.name, category, place.formatted_address, details.reviews)

      console.log(`  → ${place.name}: rating=${rating}(${userRatingsTotal}) bayes=${bayes.toFixed(2)} dog=${dogBonus} score=${score.toFixed(2)}`)

      const record = {
        city_id: cityId,
        name: place.name,
        category,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating,
        user_ratings_total: userRatingsTotal,
        dog_bonus: dogBonus,
        score,
        google_place_id: place.place_id,
        phone: details.formatted_phone_number ?? null,
        website: details.website ?? null,
        description: description ?? null,
        photo_url: photoRef ? photoUrl(photoRef) : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('places')
        .upsert(record, { onConflict: 'google_place_id' })

      if (error) console.error(`  ✗ ${place.name}: ${error.message}`)
      else console.log(`  ✓ ${place.name}`)
    }
  }

  console.log(`\nDone! Fetched places for ${city.name}.`)
}

const cityArg = process.argv[2]
if (!cityArg) { console.error('Usage: node scripts/fetch-places.mjs <city_id>'); process.exit(1) }
fetchForCity(cityArg)
