"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CategoryFilter, { Category } from "@/components/CategoryFilter";
import PlaceCard from "@/components/PlaceCard";
import AdBanner from "@/components/AdBanner";
import { supabase, Place } from "@/lib/supabase";
import { getCityConfig } from "@/config/cities";

export default function Home() {
  const city = getCityConfig();
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from('places')
        .select('*')
        .eq('city_id', city.id)
        .order('rating', { ascending: false });

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data } = await query;
      setPlaces(data ?? []);
      setLoading(false);
    }
    load();
  }, [category, city.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Top ad */}
        <AdBanner slot="top" />

        {/* Hero */}
        <div>
          <h1 className="text-3xl font-bold">
            Hundvänliga ställen i {city.name}
          </h1>
          <p className="text-stone-500 mt-1">
            Hitta restauranger, caféer, parker och mer — för dig och din hund.
          </p>
        </div>

        {/* Filter */}
        <CategoryFilter active={category} onChange={setCategory} />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 h-64 animate-pulse" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-4xl mb-3">🐾</p>
            <p className="text-lg">Inga ställen hittades ännu.</p>
            <p className="text-sm mt-1">Data hämtas snart!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        {/* Bottom ad */}
        <AdBanner slot="bottom" />
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-400">
        © {new Date().getFullYear()} Hundliv {city.name}
      </footer>
    </div>
  );
}
