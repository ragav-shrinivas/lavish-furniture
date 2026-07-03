'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { categories } from '@/lib/categories';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { TransitionLink } from '@/components/layout/PageTransition';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';

/* Secondary anchors shown beside the Collections menu. */
const anchors = [
  { label: 'Carved', href: '/#hero-carved' },
  { label: 'Reviews', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
];

const megaVariants = {
  hidden: { opacity: 0, y: -14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, when: 'beforeChildren', staggerChildren: 0.035 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: EASE } },
};

const megaItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const menuVariants = {
  hidden: { opacity: 0, y: '-4%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.55, ease: EASE, when: 'beforeChildren', staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    y: '-3%',
    transition: { duration: 0.35, ease: EASE, when: 'afterChildren', staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const linkVariants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.65, ease: EASE } },
  exit: { y: '110%', transition: { duration: 0.28, ease: EASE } },
};

const softVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [mega, setMega] = useState(false); // desktop collections menu
  const toggleRef = useRef<HTMLButtonElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaWrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close menus on route change */
  useEffect(() => {
    setMega(false);
    setOpen(false);
  }, [pathname]);

  /* mega menu: Escape + outside click */
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        megaTriggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (megaWrapRef.current && !megaWrapRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [mega]);

  /* mobile menu: scroll lock + Escape + focus */
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
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hoverOpen = () => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setMega(true);
  };
  const hoverClose = () => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  const close = () => setOpen(false);
  const isCollectionRoute = (slug: string) => pathname === `/collections/${slug}`;

  return (
    <header className={cn('nav', scrolled && 'scrolled', open && 'menu-open', mega && 'mega-open')}>
      <a href="/#top" className="brand" onClick={close}>
        LAVISH
      </a>

      {/* Desktop navigation */}
      <nav className="links" aria-label="Primary">
        <div
          className="mega-wrap"
          ref={megaWrapRef}
          onMouseEnter={hoverOpen}
          onMouseLeave={hoverClose}
        >
          <button
            ref={megaTriggerRef}
            className={cn('navlink mega-trigger', mega && 'active')}
            aria-expanded={mega}
            aria-controls="collections-menu"
            onClick={() => setMega((v) => !v)}
          >
            Collections
            <span className="chev" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {mega && (
              <motion.div
                id="collections-menu"
                className="mega"
                role="menu"
                aria-label="Collections"
                variants={reducedMotion ? undefined : megaVariants}
                initial={reducedMotion ? { opacity: 0 } : 'hidden'}
                animate={reducedMotion ? { opacity: 1 } : 'show'}
                exit={reducedMotion ? { opacity: 0 } : 'exit'}
              >
                <div className="mega-inner">
                  <motion.div className="mega-head" variants={reducedMotion ? undefined : megaItem}>
                    <span className="eyebrow">The Collections</span>
                    <span className="mega-count">{categories.length} worlds of luxury living</span>
                  </motion.div>
                  <div className="mega-grid">
                    {categories.map((cat, i) => (
                      <motion.div key={cat.slug} variants={reducedMotion ? undefined : megaItem}>
                        <TransitionLink
                          href={`/collections/${cat.slug}`}
                          className={cn('mega-link', isCollectionRoute(cat.slug) && 'current')}
                          role="menuitem"
                          aria-current={isCollectionRoute(cat.slug) ? 'page' : undefined}
                          onNavigate={() => setMega(false)}
                        >
                          <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                          <span className="nm">{cat.name}</span>
                          <span className="ar" aria-hidden="true">→</span>
                        </TransitionLink>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {anchors.map((n) => (
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

      {/* Mobile menu — all collections in canonical order */}
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
            <motion.div className="mobile-group-label" variants={reducedMotion ? undefined : softVariants}>
              The Collections
            </motion.div>
            <nav className="mobile-links collections" aria-label="Collections">
              {categories.map((cat, i) => (
                <div className="row" key={cat.slug}>
                  <motion.div variants={reducedMotion ? undefined : linkVariants}>
                    <TransitionLink
                      href={`/collections/${cat.slug}`}
                      onNavigate={close}
                      aria-current={isCollectionRoute(cat.slug) ? 'page' : undefined}
                      className={cn(isCollectionRoute(cat.slug) && 'current')}
                    >
                      <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                      {cat.name}
                    </TransitionLink>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div className="mobile-group-label" variants={reducedMotion ? undefined : softVariants}>
              Explore
            </motion.div>
            <nav className="mobile-links secondary" aria-label="Mobile primary">
              {anchors.map((n) => (
                <div className="row" key={n.href}>
                  <motion.a href={n.href} onClick={close} variants={reducedMotion ? undefined : linkVariants}>
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
