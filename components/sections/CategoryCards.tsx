'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories } from '@/lib/categories';

const EASE = [0.16, 1, 0.3, 1] as const;

function CategoryCard({
  index,
  fromRight,
}: {
  index: number;
  fromRight: boolean;
}) {
  const cat = categories[index];
  const ref = useRef<HTMLDivElement>(null);
  const MAX = 8;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer:fine)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-8px) scale(1.015)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <motion.div
      className={`cat-row ${fromRight ? 'right' : 'left'}`}
      initial={{ opacity: 0, x: fromRight ? 90 : -90 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <Link href={`/collections/${cat.slug}`} className="cat-card-link">
        <div className="cat-card float" ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
          <div className="cat-card-media" style={{ backgroundImage: cat.gradient }}>
            <span className="cat-card-num">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="cat-card-body">
            <span className="tag">{cat.tag}</span>
            <h3>{cat.name}</h3>
            <p>{cat.tagline}</p>
            <span className="cat-go">
              View Collection <span className="ar">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryCards() {
  return (
    <section className="block cat-section" id="categories">
      <div className="wrap">
        <motion.div
          className="section-head center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="eyebrow">Explore The Collections</div>
          <h3>
            Ten worlds of <span className="serif-italic">luxury living</span>
          </h3>
          <p>Scroll to discover each collection — every piece crafted for elegant, modern homes.</p>
        </motion.div>

        <div className="cat-stack">
          {categories.map((_, i) => (
            <CategoryCard key={i} index={i} fromRight={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
