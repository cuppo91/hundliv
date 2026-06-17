import { getCityConfig } from "@/config/cities";

export default function Hero() {
  const city = getCityConfig();
  return (
    <div className="relative overflow-hidden" style={{ background: '#1a9aaa' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}
      />
      <div className="relative max-w-6xl mx-auto px-4 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          🐕 Din guide till ett bättre hundliv
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          Hundvänliga ställen<br />i {city.name}
        </h1>
        <p className="text-emerald-100 mt-4 text-lg max-w-xl mx-auto">
          Restauranger, caféer, parker och mycket mer — för dig och din hund.
        </p>
      </div>
    </div>
  );
}
