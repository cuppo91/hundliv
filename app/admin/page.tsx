"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Place } from "@/lib/supabase";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'hundliv2024';

type Report = {
  id: string
  place_id: string
  reason: string
  created_at: string
  places: { name: string; city_id: string; address: string }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'pending' | 'reports' | 'sponsored'>('pending');
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadPending() {
    setLoading(true);
    const { data } = await supabase.from('places').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    setPlaces(data ?? []);
    setLoading(false);
  }

  async function loadReports() {
    setLoading(true);
    const { data } = await supabase.from('reports').select('*, places(name, city_id, address)').order('created_at', { ascending: false }).limit(50);
    setReports(data ?? []);
    setLoading(false);
  }

  async function loadAllPlaces() {
    setLoading(true);
    const { data } = await supabase.from('places').select('*').eq('status', 'approved').order('sponsored', { ascending: false }).order('name');
    setAllPlaces(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!authed) return;
    if (tab === 'pending') loadPending();
    else if (tab === 'reports') loadReports();
    else loadAllPlaces();
  }, [authed, tab]);

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('places').update({ status }).eq('id', id);
    setPlaces(p => p.filter(x => x.id !== id));
  }

  async function toggleSponsored(id: string, current: boolean) {
    await supabase.from('places').update({ sponsored: !current }).eq('id', id);
    setPlaces(p => p.map(x => x.id === id ? { ...x, sponsored: !current } : x));
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
        <h1 className="text-lg font-bold">Admin — Hundliv</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === 'pending' ? 'text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            style={tab === 'pending' ? { background: '#29C4D8' } : {}}>
            Tips ({places.length})
          </button>
          <button onClick={() => setTab('reports')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === 'reports' ? 'text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            style={tab === 'reports' ? { background: '#29C4D8' } : {}}>
            Rapporter ({reports.length})
          </button>
          <button onClick={() => setTab('sponsored')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === 'sponsored' ? 'bg-yellow-400 text-yellow-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
            Sponsra ställen
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-stone-400 text-center py-20">Laddar...</p>
        ) : tab === 'sponsored' ? (
          allPlaces.length === 0 ? (
            <p className="text-stone-400 text-center py-20">Inga ställen hittade.</p>
          ) : (
            <div className="space-y-3">
              {allPlaces.map(place => (
                <div key={place.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 ${place.sponsored ? 'border-yellow-300 bg-yellow-50' : 'border-stone-200'}`}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-stone-900">{place.name}</p>
                      {place.sponsored && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">★ Sponsrad</span>}
                      <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{place.city_id}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{place.category} — {place.address}</p>
                  </div>
                  <button
                    onClick={() => { toggleSponsored(place.id, place.sponsored); setAllPlaces(p => p.map(x => x.id === place.id ? { ...x, sponsored: !x.sponsored } : x)); }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${place.sponsored ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' : 'bg-stone-100 text-stone-600 hover:bg-yellow-100'}`}>
                    {place.sponsored ? 'Ta bort sponsor' : 'Sponsra'}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : tab === 'pending' ? (
          places.length === 0 ? (
            <div className="text-center py-20 text-stone-400"><p className="text-4xl mb-3">✅</p><p>Inga tips att granska!</p></div>
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
                      {place.submission_note && <p className="text-sm text-stone-600 mt-2 bg-stone-50 rounded-lg p-2 italic">"{place.submission_note}"</p>}
                      <div className="flex gap-3 mt-1 text-xs text-stone-400 flex-wrap">
                        {place.submitted_by && <span>Tipsat av: {place.submitted_by}</span>}
                        {place.website && <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">{place.website}</a>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap">
                      <button onClick={() => updateStatus(place.id, 'approved')} className="px-4 py-2 rounded-full text-white text-sm font-semibold bg-emerald-500 hover:bg-emerald-600">Godkänn</button>
                      <button onClick={() => updateStatus(place.id, 'rejected')} className="px-4 py-2 rounded-full text-sm font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200">Avvisa</button>
                      <button onClick={() => toggleSponsored(place.id, place.sponsored)} className={`px-4 py-2 rounded-full text-sm font-semibold ${place.sponsored ? 'bg-yellow-400 text-yellow-900' : 'bg-stone-100 text-stone-600 hover:bg-yellow-100'}`}>
                        {place.sponsored ? '★ Sponsrad' : 'Sponsra'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          reports.length === 0 ? (
            <div className="text-center py-20 text-stone-400"><p className="text-4xl mb-3">✅</p><p>Inga rapporter!</p></div>
          ) : (
            <div className="space-y-3">
              {reports.map(report => (
                <div key={report.id} className="bg-white rounded-xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-stone-900">{report.places?.name ?? report.place_id}</p>
                      <p className="text-xs text-stone-400">{report.places?.city_id} — {report.places?.address}</p>
                      <p className="text-sm text-red-600 mt-1">"{report.reason}"</p>
                      <p className="text-xs text-stone-300 mt-1">{new Date(report.created_at).toLocaleString('sv-SE')}</p>
                    </div>
                    <button onClick={() => updateStatus(report.place_id, 'rejected')}
                      className="px-3 py-1.5 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 flex-shrink-0">
                      Dölj ställe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
