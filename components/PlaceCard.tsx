import { Place } from "@/lib/supabase";

const CATEGORY_EMOJI: Record<string, string> = {
  restaurant: '🍽️',
  cafe: '☕',
  park: '🌳',
  activity: '🎾',
  shop: '🛍️',
  vet: '🏥',
};

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
      {place.photo_url && (
        <img
          src={place.photo_url}
          alt={place.name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-900">{place.name}</h3>
          <span className="text-lg flex-shrink-0">{CATEGORY_EMOJI[place.category]}</span>
        </div>
        <p className="text-sm text-stone-500 mt-1">{place.address}</p>
        {place.rating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-sm font-medium">{place.rating}</span>
          </div>
        )}
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-amber-600 hover:underline"
          >
            Besök hemsida →
          </a>
        )}
      </div>
    </div>
  );
}
