import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const data = await res.json()
  return data.success === true
}

async function lookupGooglePlace(name: string, address: string): Promise<{
  google_place_id: string | null
  lat: number
  lng: number
  rating: number | null
  user_ratings_total: number | null
  phone: string | null
  website: string | null
  photo_url: string | null
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return { google_place_id: null, lat: 0, lng: 0, rating: null, user_ratings_total: null, phone: null, website: null, photo_url: null }

  try {
    // Text search to find the place
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
    searchUrl.searchParams.set('query', `${name} ${address}`)
    searchUrl.searchParams.set('key', apiKey)
    const searchRes = await fetch(searchUrl.toString())
    const searchData = await searchRes.json()
    const place = searchData.results?.[0]
    if (!place) return { google_place_id: null, lat: 0, lng: 0, rating: null, user_ratings_total: null, phone: null, website: null, photo_url: null }

    // Get details
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    detailsUrl.searchParams.set('place_id', place.place_id)
    detailsUrl.searchParams.set('fields', 'formatted_phone_number,website,photos')
    detailsUrl.searchParams.set('key', apiKey)
    const detailsRes = await fetch(detailsUrl.toString())
    const detailsData = await detailsRes.json()
    const details = detailsData.result ?? {}

    const photoRef = details.photos?.[0]?.photo_reference ?? place.photos?.[0]?.photo_reference
    const photoUrl = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${apiKey}`
      : null

    return {
      google_place_id: place.place_id,
      lat: place.geometry?.location?.lat ?? 0,
      lng: place.geometry?.location?.lng ?? 0,
      rating: place.rating ?? null,
      user_ratings_total: place.user_ratings_total ?? null,
      phone: details.formatted_phone_number ?? null,
      website: details.website ?? null,
      photo_url: photoUrl,
    }
  } catch {
    return { google_place_id: null, lat: 0, lng: 0, rating: null, user_ratings_total: null, phone: null, website: null, photo_url: null }
  }
}

async function reviewWithAI(place: {
  name: string
  category: string
  address: string
  submission_note: string
}): Promise<{ status: 'approved' | 'pending'; reason: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { status: 'pending', reason: 'AI ej konfigurerad' }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Du granskar tips om hundvänliga ställen i Sverige. Bedöm om detta verkar legitimt och hundvänligt.

Namn: ${place.name}
Kategori: ${place.category}
Adress: ${place.address}
Beskrivning från användaren: ${place.submission_note || 'Ingen beskrivning'}

Svara ENDAST med JSON: {"approve": true/false, "reason": "kort motivering på svenska"}`,
      }],
    }),
  })

  if (!response.ok) return { status: 'pending', reason: 'AI-fel' }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    const result = JSON.parse(text)
    return {
      status: result.approve ? 'approved' : 'pending',
      reason: result.reason,
    }
  } catch {
    return { status: 'pending', reason: 'Kunde ej tolka AI-svar' }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, category, address, website, submission_note, submitted_by, city_id, turnstileToken } = body

  if (!name || !category || !address || !city_id) {
    return NextResponse.json({ error: 'Fält saknas' }, { status: 400 })
  }

  // Verify Turnstile token
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Säkerhetsverifiering saknas' }, { status: 400 })
    }
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      return NextResponse.json({ error: 'Säkerhetsverifiering misslyckades' }, { status: 403 })
    }
  }

  // Lookup place on Google to enrich data
  const googleData = await lookupGooglePlace(name, address)

  // Check if place already exists in database
  let duplicate_of: string | null = null
  if (googleData.google_place_id) {
    const { data: existing } = await supabase
      .from('places')
      .select('id, name, status')
      .eq('google_place_id', googleData.google_place_id)
      .eq('city_id', city_id)
      .single()
    if (existing) {
      duplicate_of = existing.id
    }
  }

  // AI review
  const ai = await reviewWithAI({ name, category, address, submission_note })

  const { error } = await supabase.from('places').insert({
    name,
    category,
    address,
    website: website || googleData.website || null,
    submission_note: [
      submission_note || null,
      duplicate_of ? `⚠️ Möjlig dubblett av befintligt ställe (id: ${duplicate_of})` : null,
    ].filter(Boolean).join(' | ') || null,
    submitted_by: submitted_by || null,
    city_id,
    lat: googleData.lat,
    lng: googleData.lng,
    google_place_id: null,
    rating: googleData.rating,
    user_ratings_total: googleData.user_ratings_total,
    phone: googleData.phone,
    photo_url: googleData.photo_url,
    status: ai.status,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ status: ai.status, reason: ai.reason, duplicate: !!duplicate_of })
}
