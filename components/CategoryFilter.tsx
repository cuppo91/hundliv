"use client";

export type Category = 'all' | 'restaurant' | 'cafe' | 'park' | 'activity' | 'shop' | 'vet';

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all',        label: 'Alla',        emoji: '🗺️' },
  { id: 'restaurant', label: 'Restauranger', emoji: '🍽️' },
  { id: 'cafe',       label: 'Caféer',       emoji: '☕' },
  { id: 'park',       label: 'Parker',       emoji: '🌳' },
  { id: 'activity',   label: 'Aktiviteter',  emoji: '🎾' },
  { id: 'shop',       label: 'Butiker',      emoji: '🛍️' },
  { id: 'vet',        label: 'Veterinärer',  emoji: '🏥' },
];

type Props = {
  active: Category;
  onChange: (c: Category) => void;
};

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${active === cat.id
              ? 'bg-amber-600 text-white'
              : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
            }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
