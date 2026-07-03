'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { fadeRise, lineGrow, stagger, viewportOnce, STAGGER } from '@/lib/motion';

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) { setVal(to); return; }
    const dur = 1700;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reducedMotion]);

  const fmt = to >= 10000 ? Math.floor(val).toLocaleString('en-IN') : Math.floor(val).toString();
  return <span ref={ref}>{fmt}</span>;
}

/**
 * Manifesto — the editorial breathing space after the opening film.
 * A single large statement, a hairline stat strip, and the reviews CTA.
 */
export function Credibility() {
  return (
    <section className="block manifesto" id="credibility">
      <div className="wrap manifesto-inner">
        <motion.div
          className="manifesto-state"
          variants={stagger(STAGGER.loose)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.span className="eyebrow" variants={fadeRise}>
            A Chennai Institution · Since 1998
          </motion.span>
          <motion.h2 variants={fadeRise}>
            For over <em>26 years</em>, Lavish has furnished Chennai&apos;s most elegant
            homes — from a 30,000 sq.ft showroom where every piece is chosen,
            carved and finished to <em>last generations</em>.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(STAGGER.standard)}
        >
          <motion.div className="rule" variants={lineGrow} style={{ marginBottom: 0 }} />
          <div className="stat-strip" style={{ borderTop: 'none' }}>
            <motion.div className="stat-cell" variants={fadeRise}>
              <div className="big"><em><CountUp to={26} />+</em></div>
              <div className="lbl">Years of Excellence</div>
            </motion.div>
            <motion.div className="stat-cell" variants={fadeRise}>
              <div className="big"><CountUp to={30000} /></div>
              <div className="lbl">Sq.Ft Showroom</div>
            </motion.div>
            <motion.div className="stat-cell" variants={fadeRise}>
              <div className="big"><CountUp to={1100} />+</div>
              <div className="lbl">Customer Reviews</div>
            </motion.div>
            <motion.div className="stat-cell" variants={fadeRise}>
              <div className="big"><CountUp to={10} /></div>
              <div className="lbl">Curated Collections</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="manifesto-cta"
          variants={fadeRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
            <em className="star">★</em> Read 1100+ Google Reviews
          </a>
          <span className="eyebrow" style={{ letterSpacing: '.24em' }}>
            Near Phoenix Marketcity · Velachery
          </span>
        </motion.div>
      </div>
    </section>
  );
}
