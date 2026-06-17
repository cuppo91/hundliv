import { Place } from "@/lib/supabase";

const CATEGORY_LABEL: Record<string, string> = {
  restaurant: 'Restaurang',
  cafe: 'Café',
  park: 'Park',
  activity: 'Aktivitet',
  shop: 'Butik',
  vet: 'Veterinär',
};

const CATEGORY_COLOR: Record<string, string> = {
  restaurant: 'bg-orange-100 text-orange-700',
  cafe: 'bg-amber-100 text-amber-700',
  park: 'bg-emerald-100 text-emerald-700',
  activity: 'bg-blue-100 text-blue-700',
  shop: 'bg-purple-100 text-purple-700',
  vet: 'bg-red-100 text-red-700',
};

const FALLBACK_COLORS: Record<string, string> = {
  restaurant: 'from-orange-200 to-orange-100',
  cafe: 'from-amber-200 to-amber-100',
  park: 'from-emerald-200 to-emerald-100',
  activity: 'from-blue-200 to-blue-100',
  shop: 'from-purple-200 to-purple-100',
  vet: 'from-red-200 to-red-100',
};

const FALLBACK_EMOJI: Record<string, string> = {
  restaurant: '🍽️',
  cafe: '☕',
  park: '🌳',
  activity: '🎾',
  shop: '🛍️',
  vet: '🏥',
};

export default function PlaceCard({ place, onClick }: { place: Place; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-stone-100 cursor-pointer">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {place.photo_url ? (
          <img
            src={place.photo_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${FALLBACK_COLORS[place.category] ?? 'from-stone-200 to-stone-100'} flex items-center justify-center`}>
            <span className="text-5xl opacity-40">{FALLBACK_EMOJI[place.category]}</span>
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[place.category] ?? 'bg-stone-100 text-stone-600'}`}>
          {CATEGORY_LABEL[place.category] ?? place.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-stone-900 text-base leading-tight">{place.name}</h3>
        <p className="text-sm text-stone-400 mt-1 line-clamp-2">{place.address}</p>

        <div className="flex items-center justify-between mt-3">
          {place.rating ? (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(place.rating!) ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-xs text-stone-500 ml-1">{place.rating}</span>
            </div>
          ) : (
            <span className="text-xs text-stone-300">Inget betyg</span>
          )}

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Besök →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
