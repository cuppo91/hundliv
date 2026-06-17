import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const REPORT_THRESHOLD = 3

async function reviewWithAI(placeId: string, reasons: string[]): Promise<'hide' | 'flag'> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return 'flag'

  const { data: place } = await supabase.from('places').select('name, address, category').eq('id', placeId).single()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Ett ställe på en hundvänlig guide har rapporterats ${reasons.length} gånger.

Ställe: ${place?.name} (${place?.category}) — ${place?.address}
Rapportorsaker: ${reasons.join(' | ')}

Ska stället döljas direkt eller skickas för manuell granskning?
Svara ENDAST med JSON: {"action": "hide" eller "flag"}`,
      }],
    }),
  })

  if (!response.ok) return 'flag'
  const data = await response.json()
  try {
    const result = JSON.parse(data.content?.[0]?.text ?? '{}')
    return result.action === 'hide' ? 'hide' : 'flag'
  } catch {
    return 'flag'
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { place_id, reason } = body

  if (!place_id || !reason) {
    return NextResponse.json({ error: 'Fält saknas' }, { status: 400 })
  }

  // Hash IP to avoid storing personal data
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const ip_hash = createHash('sha256').update(ip).digest('hex')

  const { error } = await supabase.from('reports').insert({ place_id, reason, ip_hash })

  if (error?.code === '23505') {
    return NextResponse.json({ error: 'Du har redan rapporterat detta ställe.' }, { status: 409 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Check report count
  const { data: counts } = await supabase
    .from('place_report_counts')
    .select('report_count')
    .eq('place_id', place_id)
    .single()

  if ((counts?.report_count ?? 0) >= REPORT_THRESHOLD) {
    const { data: allReports } = await supabase
      .from('reports')
      .select('reason')
      .eq('place_id', place_id)

    const reasons = allReports?.map(r => r.reason) ?? []
    const action = await reviewWithAI(place_id, reasons)

    if (action === 'hide') {
      await supabase.from('places').update({ status: 'rejected' }).eq('id', place_id)
    } else {
      await supabase.from('places').update({ status: 'pending' }).eq('id', place_id)
    }
  }

  return NextResponse.json({ ok: true })
}
