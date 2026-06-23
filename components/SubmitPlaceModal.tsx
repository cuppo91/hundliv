"use client";

import { useState, useRef } from "react";
import { getCityConfig } from "@/config/cities";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurang' },
  { id: 'cafe',       label: 'Café' },
  { id: 'park',       label: 'Park / Hundrastgård' },
  { id: 'shop',       label: 'Butik' },
  { id: 'vet',        label: 'Veterinär' },
];

export default function SubmitPlaceModal({ onClose }: { onClose: () => void }) {
  const city = getCityConfig();
  const [form, setForm] = useState({
    name: '', category: 'restaurant', address: '', website: '', submission_note: '', submitted_by: '',
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) {
      setMessage('Vänta på säkerhetskontrollen.');
      setState('error');
      return;
    }
    setState('loading');
    try {
      const res = await fetch('/api/submit-place', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, city_id: city.id, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.status === 'approved') {
        setMessage('Tack! Stället godkändes direkt och syns nu på kartan. 🎉');
      } else {
        setMessage('Tack för tipset! Det granskas och publiceras inom kort. 🐾');
      }
      setState('success');
    } catch {
      setMessage('Något gick fel. Försök igen.');
      setState('error');
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Tipsa om ett ställe</h2>
            <p className="text-sm text-stone-400 mt-0.5">Hjälp andra hundägare i {city.name}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
        </div>

        {state === 'success' || (state === 'error' && !turnstileToken && message === 'Vänta på säkerhetskontrollen.') ? (
          <div className="p-6 text-center space-y-4">
            <p className="text-stone-700">{message}</p>
            {state === 'success' && (
              <button onClick={onClose} className="px-6 py-2 rounded-full text-white text-sm font-semibold" style={{ background: '#29C4D8' }}>
                Stäng
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Ställets namn *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8]"
                placeholder="T.ex. Kafé Hunden" />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Kategori *</label>
              <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8] bg-white">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Adress *</label>
              <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8]"
                placeholder="T.ex. Avenyn 1, Göteborg" />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Hemsida</label>
              <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8]"
                placeholder="https://..." type="url" />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Varför är det hundvänligt?</label>
              <textarea value={form.submission_note} onChange={e => setForm(f => ({ ...f, submission_note: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8] resize-none"
                rows={3} placeholder="T.ex. Hundar välkomna inomhus, vattenskål finns..." />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Ditt namn (frivilligt)</label>
              <input value={form.submitted_by} onChange={e => setForm(f => ({ ...f, submitted_by: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#29C4D8]"
                placeholder="Anna" />
            </div>

            {siteKey && (
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                options={{ theme: 'light' }}
              />
            )}

            {state === 'error' && <p className="text-red-500 text-sm">{message}</p>}

            <button type="submit" disabled={state === 'loading' || (!!siteKey && !turnstileToken)}
              className="w-full py-3 rounded-full text-white font-semibold text-sm transition-opacity disabled:opacity-60"
              style={{ background: '#29C4D8' }}>
              {state === 'loading' ? 'Skickar...' : 'Skicka tips 🐾'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
