import type { Metadata } from 'next';
import PageHeader from '@/components/customer/PageHeader';
import SiteFooter from '@/components/customer/SiteFooter';
import { getSettings } from '@/lib/menu';

export const metadata: Metadata = {
  title: "Contact — Uncle's Panuozzo & Sandwiches",
  description: 'Find Uncle\'s in North Shields, NE30. Get in touch.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="stage">
      <PageHeader marker="Contact" />

      <div className="section-band">
        <span className="section-line left" />
        <span className="section-band-diamond">◆</span>
        <span className="section-title">Contact</span>
        <span className="section-band-diamond">◆</span>
        <span className="section-line right" />
      </div>

      <div className="info-list">
        <div className="info-row">
          <span className="info-label">Phone</span>
          {settings.phone ? (
            <span className="info-value">
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a>
            </span>
          ) : (
            <span className="info-value muted">Coming soon</span>
          )}
        </div>
        <div className="info-row">
          <span className="info-label">Email</span>
          {settings.email ? (
            <span className="info-value">
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </span>
          ) : (
            <span className="info-value muted">Coming soon</span>
          )}
        </div>
        <div className="info-row">
          <span className="info-label">Area</span>
          <span className="info-value">North Shields · {settings.postcode ?? 'NE30'}</span>
        </div>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            border: '1px solid var(--gold-faint)',
            overflow: 'hidden',
            lineHeight: 0,
          }}
        >
          <iframe
            title="Map of North Shields, NE30"
            src="https://www.google.com/maps?q=North+Shields+NE30&output=embed"
            width="100%"
            height="240"
            loading="lazy"
            style={{ border: 0, filter: 'grayscale(0.3) brightness(0.85)' }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <SiteFooter
        links={[
          { href: '/', label: 'Menu' },
          { href: '/about', label: 'About' },
          { href: '/team', label: 'Team' },
        ]}
      />
    </main>
  );
}
