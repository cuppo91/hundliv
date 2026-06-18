'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import type { Place } from '@/lib/supabase'

type Filter = 'alla' | 'park' | 'cafe' | 'restaurant'

const CATEGORY_LABELS: Record<string, string> = {
  park: 'Parker',
  cafe: 'Caféer',
  restaurant: 'Restauranger',
}

const CATEGORY_EMOJI: Record<string, string> = {
  park: '🌳',
  cafe: '☕',
  restaurant: '🍽️',
}

const PIN_COLORS: Record<string, string> = {
  park: '#22c55e',
  cafe: '#f59e0b',
  restaurant: '#ef4444',
}

function HotelSearch({ onSelect }: { onSelect: (lat: number, lng: number, label: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const map = useMap()

  useEffect(() => {
    if (!inputRef.current || !window.google) return
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        onSelect(lat, lng, place.name ?? place.formatted_address ?? '')
        map?.panTo({ lat, lng })
        map?.setZoom(14)
      }
    })
  }, [map, onSelect])

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg pointer-events-none">🏨</div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Skriv ditt hotell eller en adress som utgångspunkt..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#29C4D8]"
      />
    </div>
  )
}

export default function PlaneringsKarta({
  places,
  cityCenter,
  cityName,
}: {
  places: Place[]
  cityCenter: [number, number]
  cityName: string
}) {
  const [filter, setFilter] = useState<Filter>('alla')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [myList, setMyList] = useState<Place[]>([])
  const [hotelMarker, setHotelMarker] = useState<{ lat: number; lng: number; label: string } | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const filteredPlaces = filter === 'alla' ? places : places.filter(p => p.category === filter)

  const isInList = (place: Place) => myList.some(p => p.id === place.id)

  const toggleList = (place: Place) => {
    setMyList(prev =>
      isInList(place) ? prev.filter(p => p.id !== place.id) : [...prev, place]
    )
  }

  const handleHotelSelect = useCallback((lat: number, lng: number, label: string) => {
    setHotelMarker({ lat, lng, label })
  }, [])

  const handleSendEmail = async () => {
    if (!email || myList.length === 0) return
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/send-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, places: myList, cityName }),
      })
      if (!res.ok) throw new Error('Kunde inte skicka mail')
      setSent(true)
    } catch {
      setSendError('Något gick fel. Försök igen.')
    } finally {
      setSending(false)
    }
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
      <div className="space-y-4">
        {/* Hotellsökning */}
        <HotelSearch onSelect={handleHotelSelect} />

        {/* Filterknappar */}
        <div className="flex gap-2 flex-wrap">
          {(['alla', 'park', 'cafe', 'restaurant'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelectedPlace(null) }}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={filter === f
                ? { background: '#29C4D8', color: '#fff' }
                : { background: '#fff', color: '#555', border: '1px solid #e5e7eb' }
              }
            >
              {f === 'alla' ? '🗺️ Alla' : `${CATEGORY_EMOJI[f]} ${CATEGORY_LABELS[f]}`}
            </button>
          ))}
        </div>

        {/* Karta */}
        <div className="rounded-2xl overflow-hidden shadow-md" style={{ height: 480 }}>
          <Map
            defaultCenter={{ lat: cityCenter[1], lng: cityCenter[0] }}
            defaultZoom={12}
            mapId="hundliv-planera"
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {/* Hotelmarkör */}
            {hotelMarker && (
              <AdvancedMarker position={{ lat: hotelMarker.lat, lng: hotelMarker.lng }}>
                <div className="bg-white border-2 border-[#29C4D8] rounded-full px-3 py-1 text-xs font-bold shadow-lg whitespace-nowrap">
                  🏨 {hotelMarker.label}
                </div>
              </AdvancedMarker>
            )}

            {/* Platsmarkörer */}
            {filteredPlaces.map(place => (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                onClick={() => setSelectedPlace(place)}
              >
                <Pin
                  background={isInList(place) ? '#FFE600' : PIN_COLORS[place.category] ?? '#29C4D8'}
                  borderColor={isInList(place) ? '#d4b800' : undefined}
                  glyphColor="#fff"
                />
              </AdvancedMarker>
            ))}
          </Map>
        </div>

        {/* Info-popup för valt ställe */}
        {selectedPlace && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-md p-5 flex gap-4">
            {selectedPlace.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedPlace.photo_url}
                alt={selectedPlace.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold" style={{ color: '#29C4D8' }}>
                    {CATEGORY_EMOJI[selectedPlace.category]} {CATEGORY_LABELS[selectedPlace.category]}
                  </span>
                  <h3 className="font-bold text-stone-900 text-lg leading-snug">{selectedPlace.name}</h3>
                  <p className="text-stone-400 text-sm">{selectedPlace.address}</p>
                  {selectedPlace.description && (
                    <p className="text-stone-600 text-sm mt-1 leading-relaxed line-clamp-2">{selectedPlace.description}</p>
                  )}
                </div>
                <button onClick={() => setSelectedPlace(null)} className="text-stone-300 hover:text-stone-500 text-xl flex-shrink-0">✕</button>
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {selectedPlace.rating && (
                  <span className="text-amber-500 text-sm font-medium">
                    ★ {selectedPlace.rating.toFixed(1)}
                    <span className="text-stone-400 font-normal ml-1">({selectedPlace.user_ratings_total?.toLocaleString('sv-SE')})</span>
                  </span>
                )}
                <button
                  onClick={() => toggleList(selectedPlace)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={isInList(selectedPlace)
                    ? { background: '#FFE600', color: '#1a1a1a' }
                    : { background: '#29C4D8', color: '#fff' }
                  }
                >
                  {isInList(selectedPlace) ? '✓ Tillagd i listan' : '+ Lägg till i listan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Min lista */}
        {myList.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-stone-900 text-lg">Din lista ({myList.length} ställen)</h2>
              {!showEmailForm && !sent && (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ background: '#FFE600', color: '#1a1a1a' }}
                >
                  📩 Maila listan
                </button>
              )}
            </div>

            <div className="space-y-3 mb-4">
              {myList.map(place => (
                <div key={place.id} className="flex items-center gap-3">
                  {place.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={place.photo_url} alt={place.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm truncate">{place.name}</p>
                    <p className="text-stone-400 text-xs truncate">{place.address}</p>
                  </div>
                  <button
                    onClick={() => toggleList(place)}
                    className="text-stone-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {showEmailForm && !sent && (
              <div className="border-t border-stone-100 pt-4">
                <p className="text-sm text-stone-500 mb-3">Skriv in din mailadress så skickar vi listan.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="din@email.se"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29C4D8]"
                  />
                  <button
                    onClick={handleSendEmail}
                    disabled={sending || !email}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity"
                    style={{ background: '#29C4D8', color: '#fff' }}
                  >
                    {sending ? 'Skickar...' : 'Skicka'}
                  </button>
                </div>
                {sendError && <p className="text-red-500 text-sm mt-2">{sendError}</p>}
              </div>
            )}

            {sent && (
              <div className="border-t border-stone-100 pt-4 text-center">
                <p className="text-2xl mb-1">✉️</p>
                <p className="font-semibold text-stone-900">Skickat!</p>
                <p className="text-stone-500 text-sm">Kolla din inkorg — listan är på väg.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </APIProvider>
  )
}
