/**
 * Fetches dog-friendly places from Google Places API and upserts into Supabase.
 * Run with: npx ts-node scripts/fetch-places.ts <city_id>
 * Example:  npx ts-node scripts/fetch-places.ts malmo
 */

import { createClient } from '@supabase/supabase-js'
import cities from '../config/cities'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

type GooglePlace = {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  formatted_phone_number?: string
  website?: string
  photos?: { photo_reference: string }[]
  types: string[]
}

const SEARCH_QUERIES = [
  { query: 'hundvänlig restaurang', category: 'restaurant' },
  { query: 'hundvänligt café', category: 'cafe' },
  { query: 'hundskogspark', category: 'park' },
  { query: 'hundbutik', category: 'shop' },
  { query: 'veterinär', category: 'vet' },
  { query: 'hundrastgård', category: 'park' },
]

async function searchPlaces(query: string, location: string): Promise<GooglePlace[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  url.searchParams.set('query', `${query} ${location}`)
  url.searchParams.set('key', GOOGLE_API_KEY)

  const res = await fetch(url.toString())
  const data = await res.json() as { results?: GooglePlace[] }
  return data.results ?? []
}

async function getPlaceDetails(placeId: string): Promise<Partial<GooglePlace>> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'formatted_phone_number,website,photos')
  url.searchParams.set('key', GOOGLE_API_KEY)

  const res = await fetch(url.toString())
  const data = await res.json() as { result?: Partial<GooglePlace> }
  return data.result ?? {}
}

function photoUrl(ref: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_API_KEY}`
}

async function fetchForCity(cityId: string) {
  const city = cities[cityId]
  if (!city) {
    console.error(`Unknown city: ${cityId}`)
    process.exit(1)
  }

  console.log(`Fetching places for ${city.name}...`)

  for (const { query, category } of SEARCH_QUERIES) {
    console.log(`  Searching: ${query}`)
    const results = await searchPlaces(query, city.googlePlacesLocation)

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

      if (error) console.error(`  Error upserting ${place.name}:`, error.message)
      else console.log(`  ✓ ${place.name}`)
    }
  }

  console.log(`Done fetching for ${city.name}`)
}

const cityArg = process.argv[2]
if (!cityArg) {
  console.error('Usage: npx ts-node scripts/fetch-places.ts <city_id>')
  process.exit(1)
}

fetchForCity(cityArg)
