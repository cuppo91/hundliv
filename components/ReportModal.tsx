"use client";

import { useState } from "react";

const REASONS = [
  "Hundar är inte längre välkomna",
  "Stället finns inte längre",
  "Fel adress eller information",
  "Aldrig hundvänligt",
];

export default function ReportModal({ placeId, placeName, onClose }: {
  placeId: string;
  placeName: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/report-place', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ place_id: placeId, reason }),
      });
      const data = await res.json();
      if (res.status === 409) { setMessage('Du har redan rapporterat detta ställe.'); setState('error'); return; }
      if (!res.ok) throw new Error(data.error);
      setMessage('Tack för rapporten! Vi granskar det.');
      setState('success');
    } catch {
      setMessage('Något gick fel. Försök igen.');
      setState('error');
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-bold text-stone-900">Rapportera ställe</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">&times;</button>
        </div>

        {state === 'success' || state === 'error' ? (
          <div className="p-5 text-center space-y-4">
            <p className="text-stone-700">{message}</p>
            <button onClick={onClose} className="px-6 py-2 rounded-full text-white text-sm font-semibold" style={{ background: '#29C4D8' }}>Stäng</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-stone-500">Vad stämmer inte med <strong>{placeName}</strong>?</p>
            <div className="space-y-2">
              {REASONS.map(r => (
                <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${reason === r ? 'border-[#29C4D8] bg-[#29C4D8]/5' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-[#29C4D8]" />
                  <span className="text-sm text-stone-700">{r}</span>
                </label>
              ))}
            </div>
            <button type="submit" disabled={!reason || state === 'loading'}
              className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-opacity disabled:opacity-40"
              style={{ background: '#29C4D8' }}>
              {state === 'loading' ? 'Skickar...' : 'Skicka rapport'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
