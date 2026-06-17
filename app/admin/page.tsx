"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Place } from "@/lib/supabase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'hundliv2024';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setPlaces(data ?? []);
    setLoading(false);
  }

  useEffect(() => { if (authed) load(); }, [authed]);

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('places').update({ status }).eq('id', id);
    setPlaces(p => p.filter(x => x.id !== id));
  }

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-stone-900">Admin — Hundliv</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Lösenord" onKeyDown={e => e.key === 'Enter' && setAuthed(password === ADMIN_PASSWORD)} />
        <button onClick={() => setAuthed(password === ADMIN_PASSWORD)}
          className="w-full py-2 rounded-full text-white text-sm font-semibold" style={{ background: '#29C4D8' }}>
          Logga in
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Admin — Väntande tips</h1>
        <span className="text-sm text-stone-400">{places.length} att granska</span>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-stone-400 text-center py-20">Laddar...</p>
        ) : places.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-4xl mb-3">✅</p>
            <p>Inga tips att granska!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {places.map(place => (
              <div key={place.id} className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-stone-900">{place.name}</h2>
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{place.category}</span>
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{place.city_id}</span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{place.address}</p>
                    {place.submission_note && (
                      <p className="text-sm text-stone-600 mt-2 bg-stone-50 rounded-lg p-2 italic">"{place.submission_note}"</p>
                    )}
                    <div className="flex gap-3 mt-1 text-xs text-stone-400 flex-wrap">
                      {place.submitted_by && <span>Tipsat av: {place.submitted_by}</span>}
                      {place.website && <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">{place.website}</a>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => updateStatus(place.id, 'approved')}
                      className="px-4 py-2 rounded-full text-white text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 transition-colors">
                      Godkänn
                    </button>
                    <button onClick={() => updateStatus(place.id, 'rejected')}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                      Avvisa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
