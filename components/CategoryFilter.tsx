"use client";

export type Category = 'all' | 'restaurant' | 'cafe' | 'park' | 'activity' | 'shop' | 'vet';

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all',        label: 'Alla ställen', emoji: '🗺️' },
  { id: 'restaurant', label: 'Restauranger',  emoji: '🍽️' },
  { id: 'cafe',       label: 'Caféer',        emoji: '☕' },
  { id: 'park',       label: 'Parker',        emoji: '🌳' },
  { id: 'activity',   label: 'Aktiviteter',   emoji: '🎾' },
  { id: 'shop',       label: 'Butiker',       emoji: '🛍️' },
  { id: 'vet',        label: 'Veterinärer',   emoji: '🏥' },
];

type Props = { active: Category; onChange: (c: Category) => void };

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all
            ${active === cat.id
              ? 'text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-[#29C4D8] hover:text-[#29C4D8]'
            }`}
          style={active === cat.id ? { background: '#29C4D8' } : {}}
        >
          <span className="text-base">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
