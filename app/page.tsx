import { FrameSequenceHero } from '@/components/sections/FrameSequenceHero';
import { CategoryCards } from '@/components/sections/CategoryCards';
import { Credibility } from '@/components/sections/Credibility';
import { Craft } from '@/components/sections/Craft';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { startingSequence, carvedSequence } from '@/lib/frames';
import { siteConfig } from '@/lib/config';

/**
 * Homepage — an immersive showroom journey:
 * opening film → editorial manifesto → collection index →
 * carved heritage film → craftsmanship → reviews → contact.
 */
export default function Home() {
  return (
    <>
      <span id="top" />

      {/* ── ACT 1: the modern showroom film (scroll-scrubbed) ── */}
      <FrameSequenceHero
        config={startingSequence}
        intro={{
          eyebrow: 'Velachery · Chennai · Est. 1998',
          title: (
            <>
              Crafting <em>Luxury</em>
              <br />
              Living
            </>
          ),
          subtitle:
            'Furniture designed for sophisticated modern lifestyles, presented in a 30,000 sq.ft luxury showroom.',
          actions: [
            {
              label: <>Explore Collections <span className="arrow">→</span></>,
              href: '#categories',
            },
            {
              label: <>Visit Showroom</>,
              href: '#contact',
              ghost: true,
            },
            {
              label: <><em style={{ fontStyle: 'normal' }}>★</em> Google Reviews</>,
              href: siteConfig.googleReviews,
              ghost: true,
              external: true,
            },
          ],
        }}
      />

      {/* ── Breathing space: editorial manifesto + credibility ── */}
      <Credibility />

      {/* ── Collection discovery index (business order 1–10) ── */}
      <CategoryCards />

      {/* ── ACT 2: the carved heritage film (scroll-scrubbed) ── */}
      <FrameSequenceHero config={carvedSequence} />

      {/* ── Heritage resolution ── */}
      <Craft />

      <Testimonials />
      <Contact />
    </>
  );
}
