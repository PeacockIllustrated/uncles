import Link from 'next/link';
import Splash from '@/components/customer/Splash';
import Menu from '@/components/customer/Menu';
import { getSettings } from '@/lib/menu';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: "Uncle's Panuozzo & Sandwiches",
    servesCuisine: 'Italian',
    priceRange: '££',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'North Shields',
      postalCode: settings.postcode ?? 'NE30',
      addressCountry: 'GB',
    },
    ...(settings.phone ? { telephone: settings.phone } : {}),
    url: 'https://uncles.onesign.io',
  };

  return (
    <>
      <Splash />
      <main className="stage">
        <div className="top-markers">
          <span>North Shields</span>
          <span>Menu N° 01</span>
        </div>

        <header className="header">
          <h1 className="brand">UNCLE&apos;S</h1>
          <div className="sub">
            <span className="sub-line" />
            <span className="sub-diamond">◆</span>
            <span className="sub-text">Panuozzo &amp; Sandwiches</span>
            <span className="sub-diamond">◆</span>
            <span className="sub-line right" />
          </div>
          {settings.tagline ? <p className="tagline">{settings.tagline}</p> : null}
        </header>

        <Menu />

        <footer className="footer">
          <div className="footer-brand">UNCLE&apos;S</div>
          <div className="footer-sub">Panuozzo &amp; Sandwiches</div>
          <div className="footer-trio">
            Freshly Baked Daily<span className="footer-diamond">◆</span>Premium Ingredients
            <br />
            North Shields · NE30
          </div>
          <nav className="footer-nav">
            <Link href="/about">About</Link>
            <Link href="/team">Team</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </footer>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
