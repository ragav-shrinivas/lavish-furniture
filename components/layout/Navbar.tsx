'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';

const menuVariants = {
  hidden: { opacity: 0, y: '-4%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.55, ease: EASE, when: 'beforeChildren', staggerChildren: 0.07 },
  },
  exit: {
    opacity: 0,
    y: '-3%',
    transition: { duration: 0.35, ease: EASE, when: 'afterChildren', staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const linkVariants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.7, ease: EASE } },
  exit: { y: '110%', transition: { duration: 0.3, ease: EASE } },
};

const softVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* body scroll lock + escape + focus handling while menu is open */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    // move focus into the menu for keyboard/screen-reader users
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={cn('nav', scrolled && 'scrolled', open && 'menu-open')}>
      <a href="/#top" className="brand" onClick={close}>
        LAVISH
      </a>

      {/* Desktop navigation */}
      <nav className="links" aria-label="Primary">
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
        ref={toggleRef}
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu — full-screen, staggered editorial links */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            variants={reducedMotion ? undefined : menuVariants}
            initial={reducedMotion ? { opacity: 0 } : 'hidden'}
            animate={reducedMotion ? { opacity: 1 } : 'show'}
            exit={reducedMotion ? { opacity: 0 } : 'exit'}
          >
            <nav className="mobile-links" aria-label="Mobile primary">
              {siteConfig.nav.map((n, i) => (
                <div className="row" key={n.href}>
                  <motion.a href={n.href} onClick={close} variants={reducedMotion ? undefined : linkVariants}>
                    <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                    {n.label}
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div className="mobile-menu-actions" variants={reducedMotion ? undefined : softVariants}>
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
            </motion.div>

            <motion.div className="mobile-menu-foot" variants={reducedMotion ? undefined : softVariants}>
              {siteConfig.location} · Est. {siteConfig.established}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
