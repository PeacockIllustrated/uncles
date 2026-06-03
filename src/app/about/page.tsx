import type { Metadata } from 'next';
import PageHeader from '@/components/customer/PageHeader';
import SiteFooter from '@/components/customer/SiteFooter';
import { getSettings } from '@/lib/menu';

export const metadata: Metadata = {
  title: "About — Uncle's Panuozzo & Sandwiches",
  description:
    'A family-run Italian takeaway in North Shields. Panuozzo and sandwiches, baked fresh every day.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="stage">
      <PageHeader marker="About" />

      <div className="section-band">
        <span className="section-line left" />
        <span className="section-band-diamond">◆</span>
        <span className="section-title">About</span>
        <span className="section-band-diamond">◆</span>
        <span className="section-line right" />
      </div>

      <div className="prose">
        <p>
          Uncle&apos;s is a family-run Italian kitchen in North Shields, serving the panuozzo: a
          soft oven-baked bread from southern Italy, baked fresh through the day and filled to
          order.
        </p>
        <p>
          Prosciutto crudo, stracciatella, mortadella al pistachio, grilled Mediterranean
          vegetables. Simple Italian ingredients, treated with care. Alongside the panuozzi we pour
          proper Italian coffee and finish with tiramisu and cannoli.
        </p>
      </div>

      <div className="section-band">
        <span className="section-line left" />
        <span className="section-band-diamond">◆</span>
        <span className="section-title">Find Us</span>
        <span className="section-band-diamond">◆</span>
        <span className="section-line right" />
      </div>

      <div className="info-list">
        <div className="info-row">
          <span className="info-label">Location</span>
          <span className="info-value">North Shields · {settings.postcode ?? 'NE30'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Hours</span>
          <span className="info-value muted">Opening hours coming soon</span>
        </div>
      </div>

      <SiteFooter
        links={[
          { href: '/', label: 'Menu' },
          { href: '/team', label: 'Team' },
          { href: '/contact', label: 'Contact' },
        ]}
      />
    </main>
  );
}
