import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/lib/config';

export function Testimonials() {
  return (
    <section className="block" id="testimonials">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <Reveal className="section-head center">
          <div className="eyebrow">1100+ Reviews</div>
          <h3>
            Loved by <span className="serif-italic">thousands of homes</span>
          </h3>
          <p>
            Our customers say it best. Read verified reviews from across Chennai on Google — and see
            why families have trusted Lavish Furniture for over 26 years.
          </p>
        </Reveal>

        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a
              className="btn-reviews"
              href={siteConfig.googleReviews}
              target="_blank"
              rel="noopener"
            >
              <em className="star">★</em> Read 1100+ Google Reviews
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
