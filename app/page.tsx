"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryFilter, { Category } from "@/components/CategoryFilter";
import PlaceCard from "@/components/PlaceCard";
import AdBanner from "@/components/AdBanner";
import { supabase, Place } from "@/lib/supabase";
import { getCityConfig } from "@/config/cities";
import SubmitPlaceModal from "@/components/SubmitPlaceModal";
import PlaceModal from "@/components/PlaceModal";
import Footer from "@/components/Footer";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function Home() {
  const city = getCityConfig();
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const filters: Record<string, string> = {
          city_id: city.id,
          status: 'approved',
          ...(category !== 'all' ? { category } : {}),
        };

        let query = supabase.from('places').select('*')
          .order('sponsored', { ascending: false })
          .order('score', { ascending: false })
          .gte('dog_bonus', 0.5);
        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value);
        }

        const { data, error } = await query;
        if (error) console.error('Supabase error:', error);
        setPlaces(data ?? []);
      } catch (e) {
        console.error('Fetch error:', e);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, city.id]);

  const handleNärmastMig = () => {
    if (sortByDistance) { setSortByDistance(false); return }
    if (userPos) { setSortByDistance(true); return }
    setGeoLoading(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSortByDistance(true)
        setGeoLoading(false)
      },
      () => {
        setGeoError('Kunde inte hämta din position.')
        setGeoLoading(false)
      }
    )
  }

  const displayedPlaces = sortByDistance && userPos
    ? [...places].sort((a, b) =>
        haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) -
        haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
      )
    : places

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header onSubmitClick={() => setShowSubmit(true)} />
      <Hero onSubmitClick={() => setShowSubmit(true)} />
      {showSubmit && <SubmitPlaceModal onClose={() => setShowSubmit(false)} />}
      {selectedPlace && <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        <AdBanner slot="top" />

        {/* Filter + sortering */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CategoryFilter active={category} onChange={setCategory} />
            <button
              onClick={handleNärmastMig}
              disabled={geoLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0"
              style={sortByDistance
                ? { background: '#29C4D8', color: '#fff' }
                : { background: '#fff', color: '#555', border: '1px solid #e5e7eb' }
              }
            >
              {geoLoading ? '⏳' : '📍'} Närmast mig
            </button>
          </div>
          {geoError && <p className="text-red-500 text-xs">{geoError}</p>}
          {!loading && (
            <p className="text-sm text-stone-400">
              {displayedPlaces.length} ställen hittade
              {category !== 'all' ? ` i kategorin "${category}"` : ''} i {city.name}
              {sortByDistance ? ' · sorterade efter avstånd' : ''}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 h-72 animate-pulse" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-lg font-semibold text-stone-700">Inga ställen hittades</p>
            <p className="text-sm text-stone-400 mt-1">Prova en annan kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => setSelectedPlace(place)}
                distance={sortByDistance && userPos ? haversineKm(userPos.lat, userPos.lng, place.lat, place.lng) : undefined}
              />
            ))}
          </div>
        )}

        <AdBanner slot="bottom" />
      </main>

      <Footer />
    </div>
  );
}
