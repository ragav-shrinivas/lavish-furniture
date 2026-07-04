'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { categories } from '@/lib/categories';
import { TransitionLink } from '@/components/layout/PageTransition';
import { fadeRise, stagger, viewportOnce } from '@/lib/motion';

/* ============================================================
   COLLECTION DECK — 3D stacked luxury plates
   Vertical page scroll drives the deck horizontally: the active
   card exits right→left while the next advances from the stacked
   depth behind it. One sticky 100svh stage; the scroll runway is
   derived from the card count (no arbitrary heights), so the
   stage releases exactly as card 10 settles — no tail gap.
   Every card is a physical shell (ivory surface, framed inset
   image, integrated numeral/label/arrow) and is wholly clickable.
============================================================ */

const N = categories.length;
/** Vertical scroll consumed per card transition (svh units). */
const STEP_SVH = 55;

function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return compact;
}

/* ── one card in the deck ─────────────────────────────────── */
function DeckCard({
  i,
  active,
  compact,
}: {
  i: number;
  active: MotionValue<number>;
  compact: boolean;
}) {
  const cat = categories[i];
  /* stops are ACTIVE-index values, ascending. As `active` passes this
     card's index i the card goes: far-behind → next → front → exit left.
     active = i-2 → deep in the stack · i-1 → next · i → front · i+1 → exited */
  const stops = [i - 2.6, i - 2, i - 1, i, i + 1, i + 1.45];
  const k = compact ? 0.72 : 1; // spatial intensity on small screens

  const x = useTransform(active, stops, [
    `${24 * k}%`,
    `${20 * k}%`,
    `${11 * k}%`,
    '0%',
    '-135%',
    '-160%',
  ]);
  const y = useTransform(active, stops, [36 * k, 26 * k, 12 * k, 0, -8, -14]);
  const scale = useTransform(active, stops, [0.87, 0.9, 0.95, 1, 0.93, 0.9]);
  const rotateY = useTransform(active, stops, [-12 * k, -11 * k, -7 * k, 0, 10 * k, 14 * k]);
  const rotateZ = useTransform(active, stops, [0, 0, 0, 0, -5 * k, -7 * k]);
  const opacity = useTransform(active, stops, [0, 0.85, 1, 1, 0.5, 0]);
  /* invisible cards must never intercept taps meant for the deck */
  const pointerEvents = useTransform(opacity, (o) => (o > 0.45 ? 'auto' : 'none'));

  /* secondary motion: the image drifts against the card inside its
     clipped frame (card exits left → image eases right) */
  const imgStops = [i - 1, i, i + 1];
  const imgX = useTransform(active, imgStops, [`${-7 * k}%`, '0%', '9%']);
  const imgScale = useTransform(active, imgStops, [1.05, 1, 1.08]);

  return (
    <motion.div
      className="deck-slot"
      style={{
        x,
        y,
        scale,
        rotateY,
        rotateZ,
        opacity,
        pointerEvents,
        zIndex: N - i, // earlier cards always ride above later ones
      }}
    >
      <TransitionLink
        href={`/collections/${cat.slug}`}
        className="deck-card"
        aria-label={`${cat.name} — view collection`}
      >
        <span className="deck-corners" aria-hidden="true" />

        <span className="deck-card-top">
          <span className="deck-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="deck-tag">{cat.tag}</span>
        </span>

        <span className="deck-media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={cat.image}
            alt=""
            loading={i < 3 ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: cat.focus, x: imgX, scale: imgScale }}
          />
          <span className="deck-media-frame" />
        </span>

        <span className="deck-card-bottom">
          <span className="deck-text">
            <h3>{cat.name}</h3>
            <span className="deck-sub">{cat.tagline}</span>
          </span>
          <span className="deck-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </TransitionLink>
    </motion.div>
  );
}

/* ── reduced-motion / fallback: plain vertical list ───────── */
function StaticDeck() {
  return (
    <div className="deck-fallback">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 0.4 } }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <TransitionLink
            href={`/collections/${cat.slug}`}
            className="deck-card"
            aria-label={`${cat.name} — view collection`}
          >
            <span className="deck-corners" aria-hidden="true" />
            <span className="deck-card-top">
              <span className="deck-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="deck-tag">{cat.tag}</span>
            </span>
            <span className="deck-media" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: cat.focus }} />
              <span className="deck-media-frame" />
            </span>
            <span className="deck-card-bottom">
              <span className="deck-text">
                <h3>{cat.name}</h3>
                <span className="deck-sub">{cat.tagline}</span>
              </span>
              <span className="deck-arrow" aria-hidden="true">→</span>
            </span>
          </TransitionLink>
        </motion.div>
      ))}
    </div>
  );
}

export function CategoryCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const compact = useIsCompact();
  const [current, setCurrent] = useState(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  /* fractional active card index 0 → N-1 across the runway */
  const active = useTransform(smooth, [0, 1], [0, N - 1]);
  const barScale = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(active, 'change', (v) => {
    const n = Math.min(N, Math.max(1, Math.round(v) + 1));
    setCurrent((p) => (p === n ? p : n));
  });

  if (reduced) {
    return (
      <section className="block deck-section-static" id="categories">
        <div className="wrap">
          <div className="deck-head">
            <div className="eyebrow">The Collections</div>
            <h2>
              Ten worlds of <span className="serif-italic">luxury living</span>
            </h2>
          </div>
          <StaticDeck />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="deck-section"
      id="categories"
      /* runway derived from card count: one stage + (N-1) transitions */
      style={{ height: `calc(100svh + ${(N - 1) * STEP_SVH}svh)` }}
    >
      <div className="deck-stage">
        <motion.div
          className="deck-head"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div className="eyebrow" variants={fadeRise}>
            The Collections
          </motion.div>
          <motion.h2 variants={fadeRise}>
            Ten worlds of <span className="serif-italic">luxury living</span>
          </motion.h2>
        </motion.div>

        <div className="deck-cards">
          {categories.map((cat, i) => (
            <DeckCard key={cat.slug} i={i} active={active} compact={compact} />
          ))}
        </div>

        <div className="deck-progress" aria-hidden="true">
          <span className="deck-count">
            {String(current).padStart(2, '0')} <i>/</i> {String(N).padStart(2, '0')}
          </span>
          <span className="deck-bar">
            <motion.i style={{ scaleX: barScale, transformOrigin: 'left', display: 'block', height: '100%' }} />
          </span>
          <span className="deck-hint">Scroll</span>
        </div>
      </div>
    </section>
  );
}

