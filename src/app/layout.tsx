import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import AmbientBackground from '@/components/customer/AmbientBackground';
import SiteNav from '@/components/customer/SiteNav';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const description =
  'Freshly baked panuozzo and Italian sandwiches in North Shields. Premium ingredients, baked daily.';

export const metadata: Metadata = {
  metadataBase: new URL('https://uncles.onesign.io'),
  title: "Uncle's — Panuozzo & Sandwiches",
  description,
  openGraph: {
    title: "Uncle's — Panuozzo & Sandwiches",
    description,
    type: 'website',
    locale: 'en_GB',
    siteName: "Uncle's",
  },
};

export const viewport: Viewport = {
  themeColor: '#13241D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AmbientBackground />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
