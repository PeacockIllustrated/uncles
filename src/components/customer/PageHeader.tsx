import Link from 'next/link';

// Compact header for interior pages (About, Contact). The brand links home.
export default function PageHeader({ marker }: { marker: string }) {
  return (
    <>
      <div className="top-markers">
        <span>North Shields</span>
        <span>{marker}</span>
      </div>
      <header className="header">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 className="brand">UNCLE&apos;S</h1>
        </Link>
        <div className="sub">
          <span className="sub-line" />
          <span className="sub-diamond">◆</span>
          <span className="sub-text">Panuozzo &amp; Sandwiches</span>
          <span className="sub-diamond">◆</span>
          <span className="sub-line right" />
        </div>
      </header>
    </>
  );
}
