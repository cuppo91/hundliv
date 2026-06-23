import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getCityConfig } from "@/config/cities";

const geist = Geist({ subsets: ["latin"] });

const city = getCityConfig();

const baseUrl = `https://${city.domain}`

export const metadata: Metadata = {
  title: `Hundliv ${city.name} — Hundvänliga ställen`,
  description: `Hitta hundvänliga restauranger, caféer, parker och aktiviteter i ${city.name}.`,
  verification: {
    google: ['Uoi4kK8wxBg7hAmKaQrWJ2M3bjU8a17Ion39Cz651wA', '5dSUYjFr96mjxgvbiCaXFoqSH4_2Q1bmrCoHq465lC0', 'Djple5r_K0pVAcHFlo2xRcnQWLRgr5YBmnj5QqGou34', 'PWsqofHor5hnFPa3zFdIVu6XF8eeeENhZwQl5mNNCAI', 'gbSlWJQsS_WVE18bRf-oSvFYukD06xIAuNVtzW-BYlI'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: `Hundliv ${city.name} — Hundvänliga ställen`,
    description: `Hitta hundvänliga restauranger, caféer, parker och aktiviteter i ${city.name}.`,
    url: baseUrl,
    siteName: `Hundliv ${city.name}`,
    images: [{
      url: `${baseUrl}/og-${city.id}.jpg`,
      width: 1200,
      height: 630,
      alt: `Hundliv ${city.name}`,
    }],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Hundliv ${city.name} — Hundvänliga ställen`,
    description: `Hitta hundvänliga restauranger, caféer, parker och aktiviteter i ${city.name}.`,
    images: [`${baseUrl}/og-${city.id}.jpg`],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={geist.className}>
      <body className="min-h-screen bg-stone-50 text-stone-900">
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
