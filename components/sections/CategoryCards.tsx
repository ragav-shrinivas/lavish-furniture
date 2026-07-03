'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { categories } from '@/lib/categories';
import { TransitionLink } from '@/components/layout/PageTransition';
import { EASE, DUR, fadeRise, stagger, viewportOnce } from '@/lib/motion';

/* ============================================================
   SHOWROOM PANELS — cinematic collection discovery
   Each collection is an editorial panel that enters one by one,
   alternating from left and right, with spatial depth: travel,
   settle-scale, a whisper of rotateY, blur clearing, and a media
   clip reveal. While in view, the image, numeral and typography
   drift on separate parallax planes driven by section-local
   scroll progress. Canonical order comes from lib/categories.ts.
============================================================ */

/** True below the desktop breakpoint — used to soften motion on touch. */
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

const springIn = { type: 'spring', stiffness: 64, damping: 19, mass: 1.05 } as const;

function panelVariants(fromRight: boolean, compact: boolean, reduced: boolean) {
  // every `show` neutralizes every property any mode's `hidden` can set,
  // so switching breakpoints mid-page never strands blur/rotate residue
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        x: '0%',
        y: 0,
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.4 },
      },
    };
  }
  if (compact) {
    // mobile: shorter travel, no 3D, no blur — smooth on weak GPUs
    return {
      hidden: { opacity: 0, x: fromRight ? '9%' : '-9%', y: 34, scale: 0.975 },
      show: {
        opacity: 1,
        x: '0%',
        y: 0,
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        transition: { ...springIn, when: 'beforeChildren' as const, staggerChildren: 0.09 },
      },
    };
  }
  return {
    hidden: {
      opacity: 0.001,
      x: fromRight ? '24%' : '-24%',
      scale: 0.93,
      rotateY: fromRight ? -7 : 7,
      filter: 'blur(10px)',
    },
    show: {
      opacity: 1,
      x: '0%',
      y: 0,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: { ...springIn, when: 'beforeChildren' as const, staggerChildren: 0.09 },
    },
  };
}

const mediaClip = {
  hidden: { clipPath: 'inset(6% 12% 6% 12%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: EASE } },
};

const textMask = {
  hidden: { y: '120%' },
  show: { y: '0%', transition: { duration: DUR.reveal, ease: EASE } },
};

const softRise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
};

function ShowroomPanel({ index }: { index: number }) {
  const cat = categories[index];
  const fromRight = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const compact = useIsCompact();

  /* section-local scroll progress drives the parallax planes */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const intensity = reduced ? 0 : compact ? 0.45 : 1;

  // Layer 2 — image plane: continuous settle-zoom + slow vertical drift
  const imgScale = useTransform(progress, [0, 0.45, 1], [1 + 0.16 * intensity, 1.03, 1.0]);
  const imgY = useTransform(progress, [0, 1], [`${-5 * intensity}%`, `${5 * intensity}%`]);
  // Layer 3 — typography: drifts against the scroll
  const bodyY = useTransform(progress, [0, 1], [26 * intensity, -26 * intensity]);
  // Layer 4 — oversized numeral: fastest independent drift
  const numY = useTransform(progress, [0, 1], [56 * intensity, -64 * intensity]);

  return (
    <motion.div
      ref={ref}
      className={`panel-row${fromRight ? ' from-right' : ''}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: compact ? 0.25 : 0.38, margin: '0px 0px -4% 0px' }}
      variants={panelVariants(fromRight, compact, !!reduced)}
      custom={index}
      style={{ willChange: 'transform' }}
    >
      <TransitionLink
        href={`/collections/${cat.slug}`}
        className="panel"
        aria-label={`${cat.name} — view collection`}
      >
        <motion.div className="panel-media" variants={reduced ? undefined : mediaClip}>
          {/* Showroom still reused from the frame sequences — no new assets. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={cat.image}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: cat.focus, scale: imgScale, y: imgY }}
          />
          <span className="panel-veil" aria-hidden="true" />
          <motion.span className="panel-num" aria-hidden="true" style={{ y: numY }}>
            {String(index + 1).padStart(2, '0')}
          </motion.span>
        </motion.div>

        <motion.div className="panel-body" style={{ y: bodyY }}>
          <motion.span className="panel-tag" variants={reduced ? undefined : softRise}>
            {cat.tag} · {String(index + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
          </motion.span>
          <span className="panel-title-mask">
            <motion.h3 variants={reduced ? undefined : textMask}>{cat.name}</motion.h3>
          </span>
          <motion.p className="panel-tagline" variants={reduced ? undefined : softRise}>
            {cat.tagline}
          </motion.p>
          <motion.span className="panel-go" variants={reduced ? undefined : softRise}>
            View Collection
            <span className="panel-arrow" aria-hidden="true">
              <i>→</i>
              <i>→</i>
            </span>
          </motion.span>
        </motion.div>
      </TransitionLink>
    </motion.div>
  );
}

export function CategoryCards() {
  return (
    <section className="block showcase" id="categories">
      <div className="wrap">
        <motion.div
          className="showcase-head"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeRise}>
            <div className="eyebrow">The Collections</div>
            <h2>
              Ten worlds of
              <br />
              <span className="serif-italic">luxury living</span>
            </h2>
          </motion.div>
          <motion.span className="count" variants={fadeRise}>
            10 Collections · Velachery Showroom
          </motion.span>
        </motion.div>

        <div className="panel-stack">
          {categories.map((cat, i) => (
            <ShowroomPanel key={cat.slug} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
