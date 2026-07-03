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
import { fadeRise, stagger, viewportOnce } from '@/lib/motion';

/* ============================================================
   COLLECTION CARDS — unified clickable luxury objects
   One bounded surface per collection: full-bleed showroom image,
   double-frame champagne border with corner marks, integrated
   numeral / title / arrow. The card itself never leaves its
   layout slot — all immersion (zoom, drift) happens INSIDE the
   clipped media viewport, so no dead space can ever appear.
   Entrances alternate left/right in canonical order and fire as
   soon as the card edge enters the viewport (no blank slots).
============================================================ */

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

const springIn = { type: 'spring', stiffness: 80, damping: 21, mass: 1 } as const;

/* Every `show` neutralizes every key any mode's `hidden` can set. */
function cardVariants(fromRight: boolean, compact: boolean, reduced: boolean) {
  const show = {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: springIn,
  };
  if (reduced) return { hidden: { opacity: 0 }, show: { ...show, transition: { duration: 0.4 } } };
  if (compact) {
    // restrained sideways step — never large enough to expose blank slots
    return {
      hidden: { opacity: 0, x: fromRight ? 32 : -32, scale: 0.965, filter: 'blur(4px)' },
      show,
    };
  }
  return {
    hidden: {
      opacity: 0,
      x: fromRight ? '11%' : '-11%',
      scale: 0.945,
      rotateY: fromRight ? -5 : 5,
      filter: 'blur(8px)',
    },
    show,
  };
}

function CollectionCard({ index }: { index: number }) {
  const cat = categories[index];
  const fromRight = index % 2 === 1;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const compact = useIsCompact();

  /* immersive zoom lives INSIDE the clipped media viewport —
     the card's layout box stays perfectly stable */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  const zoom = reduced ? 0 : compact ? 0.5 : 1;
  const imgScale = useTransform(progress, [0, 0.5, 1], [1 + 0.1 * zoom, 1 + 0.04 * zoom, 1.0]);
  const imgY = useTransform(progress, [0, 1], [-12 * zoom, 12 * zoom]);

  return (
    <motion.div
      ref={ref}
      className={`lux-row${fromRight ? ' from-right' : ''}`}
      initial="hidden"
      whileInView="show"
      /* fires as soon as ~8% of the card crosses the fold — the slot
         is never visible while empty */
      viewport={{ once: true, amount: 0.08 }}
      variants={cardVariants(fromRight, compact, !!reduced)}
    >
      <TransitionLink
        href={`/collections/${cat.slug}`}
        className="lux-card"
        aria-label={`${cat.name} — view collection`}
      >
        {/* decorative frame layers */}
        <span className="lux-inner-frame" aria-hidden="true" />
        <span className="lux-corners" aria-hidden="true" />

        <div className="lux-media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={cat.image}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: cat.focus, scale: imgScale, y: imgY }}
          />
          <span className="lux-scrim" />
        </div>

        <span className="lux-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="lux-tag">{cat.tag}</span>

        <span className="lux-info">
          <span className="lux-text">
            <h3>{cat.name}</h3>
            <span className="lux-sub">{cat.tagline}</span>
          </span>
          <span className="lux-arrow" aria-hidden="true">
            →
          </span>
        </span>
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
              Ten worlds of <span className="serif-italic">luxury living</span>
            </h2>
          </motion.div>
          <motion.span className="count" variants={fadeRise}>
            10 Collections · Velachery Showroom
          </motion.span>
        </motion.div>

        <div className="lux-stack">
          {categories.map((cat, i) => (
            <CollectionCard key={cat.slug} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
