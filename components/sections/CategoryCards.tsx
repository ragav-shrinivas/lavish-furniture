'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { categories } from '@/lib/categories';
import { EASE, DUR, fadeRise, stagger, viewportOnce } from '@/lib/motion';

/**
 * Collection Index — an editorial discovery list.
 * Each collection is a full-width row: index numeral, oversized serif
 * title, tagline, a portrait showroom still (desktop), and a rotating
 * arrow. Rows rise out of a mask in sequence; imagery settles from a
 * gentle overscale. Business order is preserved 1→10.
 */
function IndexRow({ index }: { index: number }) {
  const cat = categories[index];
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="coll-row-mask"
      initial={reducedMotion ? undefined : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -6% 0px' }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: '60%' },
          show: {
            opacity: 1,
            y: '0%',
            transition: { duration: DUR.reveal, ease: EASE, delay: (index % 3) * 0.08 },
          },
        }}
      >
        <Link
          href={`/collections/${cat.slug}`}
          className="coll-row"
          aria-label={`${cat.name} — view collection`}
        >
          <span className="coll-num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="coll-name">
            <span className="coll-tag">{cat.tag}</span>
            <h3>{cat.name}</h3>
            <span className="tagline">{cat.tagline}</span>
          </span>

          <span className="coll-media" aria-hidden="true">
            {/* Showroom still reused from the frame sequences — no new assets. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.image}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: cat.focus }}
            />
          </span>

          <span className="coll-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function CategoryCards() {
  return (
    <section className="block coll-index" id="categories">
      <div className="wrap">
        <motion.div
          className="coll-head"
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

        <div className="coll-list">
          {categories.map((_, i) => (
            <IndexRow key={categories[i].slug} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
