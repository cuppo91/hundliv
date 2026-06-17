import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  const { name, category, address, website, submission_note, submitted_by, city_id, lat, lng } = body

  if (!name || !category || !address || !city_id) {
    return NextResponse.json({ error: 'Fält saknas' }, { status: 400 })
  }

  const ai = await reviewWithAI({ name, category, address, submission_note })

  const { error } = await supabase.from('places').insert({
    name,
    category,
    address,
    website: website || null,
    submission_note: submission_note || null,
    submitted_by: submitted_by || null,
    city_id,
    lat: lat ?? 0,
    lng: lng ?? 0,
    status: ai.status,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ status: ai.status, reason: ai.reason })
}
