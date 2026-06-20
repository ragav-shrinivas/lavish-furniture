'use client';

import { useEffect } from 'react';

/**
 * Native smooth scrolling + smart in-page anchor handling.
 * - "#section"        → smooth-scroll on the current page
 * - "/#section"       → smooth-scroll if already on the homepage,
 *                       otherwise let the browser navigate home (then it scrolls)
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.includes('#')) return;

      const onHome = window.location.pathname === '/';
      const isSamePage = href.startsWith('#') || (href.startsWith('/#') && onHome);
      if (!isSamePage) return; // cross-page link → let the browser navigate

      const hash = href.slice(href.indexOf('#'));
      if (hash.length < 2) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      root.style.scrollBehavior = prev;
    };
  }, []);

  return <>{children}</>;
}
