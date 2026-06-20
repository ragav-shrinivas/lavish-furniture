'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/config';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/lib/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={cn('nav', scrolled && 'scrolled', open && 'menu-open')}>
      <a href="/#top" className="brand" onClick={close}>
        LAVISH
      </a>

      {/* Desktop navigation */}
      <nav className="links">
        {siteConfig.nav.map((n) => (
          <a key={n.href} className="navlink" href={n.href}>
            {n.label}
          </a>
        ))}
        <MagneticButton href="/#contact">
          Visit Showroom <span className="arrow">→</span>
        </MagneticButton>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu panel */}
      <div className={cn('mobile-menu', open && 'show')}>
        <nav className="mobile-links">
          {siteConfig.nav.map((n) => (
            <a key={n.href} href={n.href} onClick={close}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-actions">
          <a className="btn" href="/#contact" onClick={close}>
            Visit Showroom <span className="arrow">→</span>
          </a>
          <a
            className="btn-reviews"
            href={siteConfig.googleReviews}
            target="_blank"
            rel="noopener"
            onClick={close}
          >
            <em className="star">★</em> See 1100+ Google Reviews
          </a>
        </div>
        <div className="mobile-menu-foot">
          {siteConfig.location} · Est. {siteConfig.established}
        </div>
      </div>
    </header>
  );
}
