export default function AdBanner({ slot }: { slot: 'top' | 'bottom' }) {
  return (
    <div className="w-full bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm"
      style={{ minHeight: slot === 'top' ? 90 : 60 }}>
      Annons
    </div>
  );
}
