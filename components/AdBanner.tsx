export default function AdBanner({ slot }: { slot: 'top' | 'bottom' }) {
  return (
    <div
      className="w-full bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-300 text-xs font-medium tracking-widest uppercase"
      style={{ minHeight: slot === 'top' ? 90 : 60 }}
    >
      Annons
    </div>
  );
}
