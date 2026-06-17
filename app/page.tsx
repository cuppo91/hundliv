"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
      if (category !== 'all') query = query.eq('category', category);
      const { data } = await query;
      setPlaces(data ?? []);
      setLoading(false);
    }
    load();
  }, [category, city.id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />
      <Hero />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        <AdBanner slot="top" />

        {/* Filter + count */}
        <div className="space-y-3">
          <CategoryFilter active={category} onChange={setCategory} />
          {!loading && (
            <p className="text-sm text-stone-400">
              {places.length} ställen hittade
              {category !== 'all' ? ` i kategorin "${category}"` : ''} i {city.name}
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
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}

        <AdBanner slot="bottom" />
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-stone-400">
          <span className="font-semibold text-stone-600">🐾 Hundliv {city.name}</span>
          <span>© {new Date().getFullYear()} Hundliv {city.name}</span>
        </div>
      </footer>
    </div>
  );
}
