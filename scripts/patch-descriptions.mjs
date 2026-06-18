/**
 * Fills in missing descriptions for places where description IS NULL.
 * Fetches reviews from Google Places API and generates AI descriptions.
 * Usage: node scripts/patch-descriptions.mjs <city_id>
 */

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
const envFile = readFileSync(envPath, 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length && !key.startsWith('#')) {
    process.env[key.trim()] = rest.join('=').trim()
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

async function getReviews(placeId) {
  if (!placeId) return []
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'reviews')
  url.searchParams.set('key', GOOGLE_API_KEY)
  const res = await fetch(url.toString())
  const data = await res.json()
  return data.result?.reviews ?? []
}

async function generateDescription(name, category, address, reviews) {
  try {
    const reviewTexts = (reviews ?? [])
      .slice(0, 5)
      .map(r => r.text)
      .filter(t => t && t.length > 20)
      .join('\n---\n')

    const prompt = reviewTexts
      ? `Skriv exakt 2-3 meningar på svenska om detta ställe. Plocka ut det mest specifika och unika från omdömena — vad sticker ut just här jämfört med andra liknande ställen? Undvik generiska fraser som "fantastiskt", "perfekt" eller "rekommenderas varmt". Använd svenska ord, inte engelska låneord. Skriv i tredje person. Håll dig strikt till max 3 meningar.

Namn: ${name}
Kategori: ${category}
Adress: ${address}

Omdömen:
${reviewTexts}

Svara endast med de 2-3 meningarna, absolut inget annat.`
      : `Skriv exakt 2 meningar på svenska om detta ställe baserat på namn, kategori och plats. Skriv i tredje person, neutralt och konkret. Inga tomma adjektiv.

Namn: ${name}
Kategori: ${category}
Adress: ${address}

Svara endast med de 2 meningarna, absolut inget annat.`

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
    return msg.content[0].text.trim()
  } catch {
    return null
  }
}

async function patchCity(cityId) {
  const { data: places, error } = await supabase
    .from('places')
    .select('id, name, category, address, google_place_id')
    .eq('city_id', cityId)
    .is('description', null)

  if (error) { console.error('Supabase error:', error.message); process.exit(1) }
  if (!places.length) { console.log(`No missing descriptions for ${cityId}.`); return }

  console.log(`\nFound ${places.length} places without description for ${cityId}`)

  for (const place of places) {
    console.log(`  → ${place.name}`)
    const reviews = await getReviews(place.google_place_id)
    const description = await generateDescription(place.name, place.category, place.address, reviews)

    if (!description) {
      console.log(`    ✗ AI failed, skipping`)
      continue
    }

    const { error: updateError } = await supabase
      .from('places')
      .update({ description, updated_at: new Date().toISOString() })
      .eq('id', place.id)

    if (updateError) console.log(`    ✗ ${updateError.message}`)
    else console.log(`    ✓ "${description.slice(0, 60)}..."`)
  }

  console.log(`\nDone!`)
}

const cityArg = process.argv[2]
if (!cityArg) { console.error('Usage: node scripts/patch-descriptions.mjs <city_id>'); process.exit(1) }
patchCity(cityArg)
