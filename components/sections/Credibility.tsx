'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/lib/config';

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, to]);

  const fmt = to >= 10000 ? Math.floor(val).toLocaleString('en-IN') : Math.floor(val).toString();
  return <span ref={ref}>{fmt}</span>;
}

export function Credibility() {
  return (
    <section className="block credibility" id="credibility">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <Reveal className="section-head center">
          <div className="eyebrow">A Chennai Institution · Velachery</div>
          <h3>Over 26 Years of Excellence</h3>
          <p>
            Creating elegant living experiences through timeless craftsmanship and premium furniture
            collections — from our flagship 30,000 sq.ft showroom in Velachery, Chennai.
          </p>
        </Reveal>

        <div className="stat-row">
          <Reveal className="stat">
            <div className="big">
              <em><CountUp to={26} />+</em>
            </div>
            <div className="lbl">Years Experience</div>
          </Reveal>
          <Reveal className="stat" delay={0.08}>
            <div className="big">
              <CountUp to={30000} />
            </div>
            <div className="lbl">Sq.Ft Showroom</div>
          </Reveal>
          <Reveal className="stat" delay={0.16}>
            <div className="big">
              <CountUp to={1100} />+
            </div>
            <div className="lbl">Customer Reviews</div>
          </Reveal>
          <Reveal className="stat" delay={0.24}>
            <div className="big"><em>∞</em></div>
            <div className="lbl">Happy Customers</div>
          </Reveal>
        </div>

        {/* Google Reviews CTA */}
        <div className="cred-reviews">
          <a
            className="btn-reviews"
            href={siteConfig.googleReviews}
            target="_blank"
            rel="noopener"
          >
            <em className="star">★</em> Read 1100+ Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
}
