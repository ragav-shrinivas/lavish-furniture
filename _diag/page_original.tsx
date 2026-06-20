import { FrameSequenceHero } from '@/components/sections/FrameSequenceHero';
import { CollectionCards } from '@/components/sections/CollectionCards';
import { Credibility } from '@/components/sections/Credibility';
import { About } from '@/components/sections/About';
import { Collections } from '@/components/sections/Collections';
import { Showroom } from '@/components/sections/Showroom';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import {
  startingSequence,
  carvedSequence,
  modernCards,
  carvedCards,
} from '@/lib/frames';

export default function Home() {
  return (
    <>
      <span id="top" />

      {/* HERO 1 — startingherovideo → Modern */}
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
            { label: <>Explore Collections <span className="arrow">→</span></>, href: '#collections' },
            { label: 'Book a Visit', href: '#contact', ghost: true },
          ],
        }}
      />

      <CollectionCards
        id="modern-cards"
        eyebrow="The Modern Range"
        title="Contemporary pieces for the"
        italic="refined modern home"
        cards={modernCards}
      />

      <Credibility />

      {/* HERO 2 — carved-herovideo → Carved */}
      <FrameSequenceHero config={carvedSequence} />

      <CollectionCards
        id="carved-cards"
        eyebrow="The Carved Range"
        title="Heritage masterpieces for the"
        italic="grand interior"
        cards={carvedCards}
      />

      <About />
      <Collections />
      <Showroom />
      <Testimonials />
      <Contact />
    </>
  );
}
