import Link from 'next/link';

type FooterLink = { href: string; label: string };

// Shared footer. Pass the nav links that make sense for the current page.
export default function SiteFooter({ links }: { links: FooterLink[] }) {
  return (
    <footer className="footer">
      <div className="footer-brand">UNCLE&apos;S</div>
      <div className="footer-sub">Panuozzo &amp; Sandwiches</div>
      <div className="footer-trio">
        Freshly Baked Daily<span className="footer-diamond">◆</span>Premium Ingredients
        <br />
        North Shields · NE30
      </div>
      <nav className="footer-nav">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
