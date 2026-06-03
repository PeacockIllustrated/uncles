import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SignOutButton from './SignOutButton';

// Persistent admin bar: optional back arrow, centred title, initial + sign out.
export default function AdminTopBar({
  title,
  backHref,
  initial,
}: {
  title: string;
  backHref?: string;
  initial?: string;
}) {
  return (
    <header className="admin-bar">
      <div className="admin-bar-side">
        {backHref ? (
          <Link href={backHref} className="admin-back" aria-label="Back">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </Link>
        ) : null}
      </div>
      <div className="admin-bar-title">{title}</div>
      <div className="admin-bar-side admin-bar-right">
        {initial ? <span className="admin-initial">{initial}</span> : null}
        <SignOutButton />
      </div>
    </header>
  );
}
