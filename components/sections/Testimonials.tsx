'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { fadeRise, stagger, viewportOnce, STAGGER } from '@/lib/motion';

/**
 * Testimonials — a single editorial pull-quote carries more weight
 * than a grid of boxes. The verified proof lives one tap away on Google.
 */
export function Testimonials() {
  return (
    <section className="block testimonial" id="testimonials">
      <motion.div
        className="wrap testimonial-inner"
        variants={stagger(STAGGER.loose)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.span className="quote-mark" aria-hidden="true" variants={fadeRise}>
          &ldquo;
        </motion.span>
        <motion.blockquote variants={fadeRise}>
          Trusted by thousands of Chennai homes for over 26 years — read what
          our customers say about the showroom, the craftsmanship and the care.
        </motion.blockquote>
        <motion.div className="attribution" variants={fadeRise}>
          1100+ Verified Reviews · Google
        </motion.div>
        <motion.div className="actions" variants={fadeRise}>
          <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
            <em className="star">★</em> Read 1100+ Google Reviews
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
