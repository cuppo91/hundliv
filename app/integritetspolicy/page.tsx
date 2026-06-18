import { getCityConfig } from '@/config/cities'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export function generateMetadata() {
  return {
    title: 'Integritetspolicy — Hundliv',
    description: 'Hur vi hanterar dina personuppgifter på Hundliv.',
  }
}

export default function IntegritetspolicyPage() {
  const city = getCityConfig()
  const domain = `hundliv${city.id === 'malmo' ? 'malmo' : 'goteborg'}.se`
  const email = `noreply@${domain}`

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f4]">
      <Header />
      <main className="max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Integritetspolicy</h1>
        <p className="text-stone-400 text-sm mb-10">Senast uppdaterad: juni 2026</p>

        <div className="space-y-8 text-stone-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">1. Personuppgiftsansvarig</h2>
            <p>
              Hundliv {city.name} (<strong>{domain}</strong>) är personuppgiftsansvarig för den behandling av personuppgifter som beskrivs i denna policy.
              Kontakta oss på <a href={`mailto:${email}`} className="underline" style={{ color: '#29C4D8' }}>{email}</a> vid frågor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">2. Vilka uppgifter samlar vi in?</h2>
            <p>Vi samlar in följande personuppgifter:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>E-postadress</strong> — när du skickar din lista via planeringsverktyget och/eller samtycker till vårt nyhetsbrev.</li>
              <li><strong>Geografisk position</strong> — om du väljer att använda funktionen "Närmast mig". Positionen behandlas enbart lokalt i din webbläsare och skickas aldrig till oss.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">3. Varför behandlar vi dina uppgifter?</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-stone-800">Skicka din planerade lista (engångsutskick)</p>
                <p className="text-sm mt-1">Rättslig grund: <em>fullgörande av avtal / berättigat intresse.</em> Din e-postadress används enbart för att leverera mailet du begärt. Vi sparar den inte i vår databas efter utskick.</p>
              </div>
              <div>
                <p className="font-semibold text-stone-800">Nyhetsbrev med hundvänliga tips</p>
                <p className="text-sm mt-1">Rättslig grund: <em>samtycke.</em> Om du kryssar i rutan för nyhetsbrev sparas din e-postadress i vår kontaktlista hos Resend (vår e-postleverantör, se avsnitt 5). Du kan återkalla ditt samtycke när som helst.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">4. Hur länge sparar vi dina uppgifter?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Engångsutskick: e-postadressen sparas inte efter att mailet skickats.</li>
              <li>Nyhetsbrev: e-postadressen sparas tills du avprenumererar eller begär radering.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">5. Tredjepartsleverantörer</h2>
            <p>Vi använder följande tjänster som kan behandla dina uppgifter:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Resend</strong> (e-postutskick och kontakthantering) — <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#29C4D8' }}>integritetspolicy</a></li>
              <li><strong>Supabase</strong> (databas för platsinformation) — hanterar inga personuppgifter från besökare.</li>
              <li><strong>Vercel</strong> (webbhosting) — kan logga IP-adresser i serverloggar enligt standard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">6. Dina rättigheter</h2>
            <p>Enligt GDPR har du rätt att:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Få tillgång till de uppgifter vi har om dig</li>
              <li>Begära rättelse av felaktiga uppgifter</li>
              <li>Begära radering ("rätten att bli glömd")</li>
              <li>Återkalla samtycke för nyhetsbrev när som helst</li>
              <li>Lämna in klagomål till Integritetsskyddsmyndigheten (IMY)</li>
            </ul>
            <p className="mt-3">Kontakta oss på <a href={`mailto:${email}`} className="underline" style={{ color: '#29C4D8' }}>{email}</a> för att utöva dina rättigheter.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 mb-2">7. Avprenumerera</h2>
            <p>Du kan avprenumerera från nyhetsbrevet när som helst via avprenumerera-länken i varje mail, eller genom att kontakta oss direkt på <a href={`mailto:${email}`} className="underline" style={{ color: '#29C4D8' }}>{email}</a>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
