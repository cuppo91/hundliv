import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { Place } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

const CATEGORY_LABELS: Record<string, string> = {
  park: 'Park',
  cafe: 'Café',
  restaurant: 'Restaurang',
}

function buildEmailHtml(places: Place[], cityName: string): string {
  const placeRows = places.map(place => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #f0ede8; vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${place.photo_url ? `
            <td width="90" style="padding-right: 16px; vertical-align: top;">
              <img src="${place.photo_url}" alt="${place.name}"
                style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover; display: block;" />
            </td>` : ''}
            <td style="vertical-align: top;">
              <p style="margin: 0 0 2px; font-size: 11px; font-weight: 600; color: #29C4D8; text-transform: uppercase; letter-spacing: 0.5px;">
                ${CATEGORY_LABELS[place.category] ?? place.category}
              </p>
              <p style="margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #1a1a1a;">${place.name}</p>
              <p style="margin: 0 0 6px; font-size: 13px; color: #888;">${place.address}</p>
              ${place.description ? `<p style="margin: 0 0 8px; font-size: 13px; color: #555; line-height: 1.5;">${place.description}</p>` : ''}
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${place.rating ? `<td style="padding-right: 12px;"><span style="font-size: 13px; color: #f59e0b; font-weight: 600;">★ ${place.rating.toFixed(1)}</span></td>` : ''}
                  ${place.website ? `<td style="padding-right: 12px;"><a href="${place.website}" style="font-size: 13px; color: #29C4D8; font-weight: 600; text-decoration: none;">Hemsida →</a></td>` : ''}
                  ${place.phone ? `<td><span style="font-size: 13px; color: #888;">${place.phone}</span></td>` : ''}
                </tr>
              </table>
              <p style="margin: 8px 0 0;">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}"
                  style="font-size: 12px; color: #aaa; text-decoration: none;">📍 Visa på karta</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background: #f9f7f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 32px auto;">
    <tr>
      <td style="background: #29C4D8; padding: 32px 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 40px;">🐾</p>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #fff;">Din hundvänliga lista</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 15px;">
          ${places.length} ställen i ${cityName} att kolla in
        </p>
      </td>
    </tr>
    <tr>
      <td style="background: #fff; padding: 8px 32px 32px; border-radius: 0 0 16px 16px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${placeRows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #aaa;">
          Skickat från <a href="https://hundliv${cityName.toLowerCase() === 'malmö' ? 'malmo' : 'goteborg'}.se" style="color: #29C4D8;">Hundliv ${cityName}</a> ·
          Din guide till ett bättre hundliv
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const { email, places, cityName } = await req.json() as {
    email: string
    places: Place[]
    cityName: string
  }

  if (!email || !places?.length) {
    return NextResponse.json({ error: 'Saknar email eller platser' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Hundliv <noreply@hundliv.nu>',
    to: email,
    subject: `Din hundvänliga lista för ${cityName} 🐾`,
    html: buildEmailHtml(places, cityName),
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Kunde inte skicka mail' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
