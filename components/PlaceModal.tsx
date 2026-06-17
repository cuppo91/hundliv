"use client";

import { useState } from "react";
import { Place } from "@/lib/supabase";
import ReportModal from "./ReportModal";

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: 'Restaurang', cafe: 'Café', park: 'Park',
  activity: 'Aktivitet', shop: 'Butik', vet: 'Veterinär',
};

const CATEGORY_COLOR: Record<string, string> = {
  restaurant: 'bg-orange-100 text-orange-700', cafe: 'bg-amber-100 text-amber-700',
  park: 'bg-emerald-100 text-emerald-700', activity: 'bg-blue-100 text-blue-700',
  shop: 'bg-purple-100 text-purple-700', vet: 'bg-red-100 text-red-700',
};

const FALLBACK_COLORS: Record<string, string> = {
  restaurant: 'from-orange-200 to-orange-100', cafe: 'from-amber-200 to-amber-100',
  park: 'from-emerald-200 to-emerald-100', activity: 'from-blue-200 to-blue-100',
  shop: 'from-purple-200 to-purple-100', vet: 'from-red-200 to-red-100',
};

const FALLBACK_EMOJI: Record<string, string> = {
  restaurant: '🍽️', cafe: '☕', park: '🌳', activity: '🎾', shop: '🛍️', vet: '🏥',
};

export default function PlaceModal({ place, onClose }: { place: Place; onClose: () => void }) {
  const [showReport, setShowReport] = useState(false);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-48 sm:h-52">
          {place.photo_url ? (
            <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${FALLBACK_COLORS[place.category] ?? 'from-stone-200 to-stone-100'} flex items-center justify-center`}>
              <span className="text-7xl opacity-30">{FALLBACK_EMOJI[place.category]}</span>
            </div>
          )}
          <button onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 shadow">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[place.category] ?? 'bg-stone-100 text-stone-600'}`}>
                {CATEGORY_LABEL[place.category] ?? place.category}
              </span>
              {place.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="text-sm font-medium text-stone-600">{place.rating}</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-2">{place.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{place.address}</p>
            {place.phone && (
              <p className="text-sm text-stone-500 mt-1">📞 {place.phone}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border border-stone-200 hover:border-[#29C4D8] hover:bg-[#29C4D8]/5 transition-colors text-center"
            >
              <span className="text-2xl">🗺️</span>
              <span className="text-sm font-semibold text-stone-700">Vägbeskrivning</span>
              <span className="text-xs text-stone-400">Öppna i Google Maps</span>
            </a>

            {place.website ? (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border border-stone-200 hover:border-[#29C4D8] hover:bg-[#29C4D8]/5 transition-colors text-center"
              >
                <span className="text-2xl">🌐</span>
                <span className="text-sm font-semibold text-stone-700">Hemsida</span>
                <span className="text-xs text-stone-400">Besök deras sida</span>
              </a>
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border border-stone-200 hover:border-[#29C4D8] hover:bg-[#29C4D8]/5 transition-colors text-center"
              >
                <span className="text-2xl">🔍</span>
                <span className="text-sm font-semibold text-stone-700">Sök på Google</span>
                <span className="text-xs text-stone-400">Hitta mer info</span>
              </a>
            )}
          </div>
          {/* Report link */}
          <button onClick={() => setShowReport(true)}
            className="w-full text-center text-xs text-stone-300 hover:text-stone-400 transition-colors pt-1">
            Rapportera felaktig information
          </button>
        </div>
      </div>
      {showReport && <ReportModal placeId={place.id} placeName={place.name} onClose={() => setShowReport(false)} />}
    </div>
  );
}
