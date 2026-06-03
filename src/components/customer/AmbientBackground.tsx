'use client';

import { useEffect, useRef } from 'react';

// Fixed ambient gradient + paper grain + vignette. The radial blooms drift a
// few percent on scroll — the only customer-site motion besides the splash.
export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ambient = ref.current;
    if (!ambient) return;

    let ticking = false;
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      ambient.style.setProperty('--bg-x1', `${25 + progress * 3}%`);
      ambient.style.setProperty('--bg-y1', `${18 + progress * 4}%`);
      ambient.style.setProperty('--bg-x2', `${78 - progress * 3}%`);
      ambient.style.setProperty('--bg-y2', `${85 - progress * 4}%`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="ambient" ref={ref} />
      <div className="vignette" />
    </>
  );
}
