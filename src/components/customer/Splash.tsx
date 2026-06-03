'use client';

import { useEffect, useRef } from 'react';

// Entrance moment. A hairline draws across, diamonds pop, UNCLE'S settles in.
// Dismisses on tap, scroll, or after the sequence completes. CSS keyframes only.
export default function Splash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splash = ref.current;
    if (!splash) return;

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      splash.classList.add('lifting');
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    splash.addEventListener('click', lift, { once: true });
    splash.addEventListener('touchstart', lift, { once: true, passive: true });
    window.addEventListener('scroll', lift, { once: true, passive: true });
    window.addEventListener('wheel', lift, { once: true, passive: true });
    const timer = setTimeout(lift, reduce ? 600 : 3400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', lift);
      window.removeEventListener('wheel', lift);
    };
  }, []);

  return (
    <div className="splash" ref={ref}>
      <div className="splash-stack">
        <div className="splash-rule">
          <span className="splash-rule-line left" />
          <span className="splash-rule-diamond">◆</span>
          <span className="splash-rule-line right" />
        </div>
        <h1 className="splash-brand">UNCLE&apos;S</h1>
        <div className="splash-sub">
          <span className="splash-sub-line left" />
          <span className="splash-sub-diamond">◆</span>
          <span className="splash-sub-text">Panuozzo &amp; Sandwiches</span>
          <span className="splash-sub-diamond">◆</span>
          <span className="splash-sub-line right" />
        </div>
      </div>
      <div className="splash-skip">Tap or scroll to begin</div>
    </div>
  );
}
