export default function AdBanner({ slot }: { slot: 'top' | 'bottom' }) {
  return (
    <a
      href="mailto:annons@hundlivmalmo.se"
      className="w-full bg-stone-50 border border-dashed border-stone-300 rounded-xl flex items-center justify-center gap-3 hover:bg-stone-100 transition-colors"
      style={{ minHeight: slot === 'top' ? 90 : 60 }}
    >
      <span className="text-stone-400 text-sm font-medium">Vill du synas här?</span>
      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FFE600', color: '#1a1a1a' }}>
        Kontakta oss
      </span>
    </a>
  );
}
