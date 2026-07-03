'use client';

import { motion } from 'framer-motion';
import { fadeRise, stagger, viewportOnce, STAGGER } from '@/lib/motion';

const pillars = [
  {
    num: 'I',
    title: 'Carved by hand',
    body: 'Solid hardwood frames shaped by master artisans — heritage motifs and regal silhouettes carried into modern homes.',
  },
  {
    num: 'II',
    title: 'Curated worldwide',
    body: 'Premium and imported pieces selected from international design houses, brought together under one roof in Velachery.',
  },
  {
    num: 'III',
    title: 'Finished to last',
    body: 'Premium fabrics, fine leathers and artisan finishes — furniture built as heirlooms, not replacements.',
  },
];

/**
 * Craft — heritage storytelling that lands after the carved film,
 * giving the sequence a quiet editorial resolution.
 */
export function Craft() {
  return (
    <section className="block craft" id="craft">
      <div className="wrap">
        <motion.div
          className="section-head left"
          variants={stagger(STAGGER.standard)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div className="eyebrow" variants={fadeRise}>
            The Lavish Standard
          </motion.div>
          <motion.h2 variants={fadeRise}>
            Craftsmanship you can <span className="serif-italic">feel</span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="craft-grid"
          variants={stagger(STAGGER.loose)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {pillars.map((p) => (
            <motion.div className="craft-cell" key={p.num} variants={fadeRise}>
              <span className="num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
