import { FrameSequenceHero } from '@/components/sections/FrameSequenceHero';
import { CategoryCards } from '@/components/sections/CategoryCards';
import { Credibility } from '@/components/sections/Credibility';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { startingSequence, carvedSequence } from '@/lib/frames';
import { siteConfig } from '@/lib/config';

export default function Home() {
  return (
    <>
      <span id="top" />

      {/* ── SECTION 1: startingherovideo (modern, scroll-scrubbed) ── */}
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
              label: <><em style={{ fontStyle:'normal' }}>★</em> Google Reviews</>,
              href: siteConfig.googleReviews,
              ghost: true,
              external: true,
            },
          ],
        }}
      />

      {/* ── Sequential category reveals (10 collections) ── */}
      <CategoryCards />

      {/* ── SECTION 2: Luxury transition / credibility ── */}
      <Credibility />

      {/* ── SECTION 3: carved-herovideo (heritage, scroll-scrubbed) ── */}
      <FrameSequenceHero config={carvedSequence} />

      <Testimonials />
      <Contact />
    </>
  );
}
