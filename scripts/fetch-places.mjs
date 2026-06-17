/**
 * Fetches dog-friendly places from Google Places API and upserts into Supabase.
 * Usage: node scripts/fetch-places.mjs <city_id>
 * Example: node scripts/fetch-places.mjs goteborg
 */

import { createClient } from '@supabase/supabase-js'
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

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

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
  url.searchParams.set('fields', 'formatted_phone_number,website,photos')
  url.searchParams.set('key', GOOGLE_API_KEY)
  const res = await fetch(url.toString())
  const data = await res.json()
  return data.result ?? {}
}

function photoUrl(ref) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_API_KEY}`
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

      const record = {
        city_id: cityId,
        name: place.name,
        category,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating ?? null,
        google_place_id: place.place_id,
        phone: details.formatted_phone_number ?? null,
        website: details.website ?? null,
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
