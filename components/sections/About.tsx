import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from '@/components/ui/Parallax';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function About() {
  return (
    <section className="block" id="about">
      <div className="wrap about-grid">
        <Reveal dir="left" className="about-copy">
          <div className="eyebrow">The Lavish Story</div>
          <div className="section-head left" style={{ marginBottom: 0 }}>
            <h3>
              A digital showroom for a <span className="serif-italic">timeless craft</span>
            </h3>
          </div>
          <p>
            For over twenty-six years, Lavish Furniture has been Chennai&apos;s trusted destination
            for premium living. From our 30,000 sq.ft showroom near Phoenix Mall in Velachery, we
            bring together modern collections and intricately carved masterpieces under one roof.
          </p>
          <p>
            Every piece is chosen for craftsmanship, comfort, and a sense of occasion — furniture
            that feels less like a purchase and more like an inheritance.
          </p>
          <div style={{ marginTop: 32 }}>
            <MagneticButton href="#contact">
              Plan Your Visit <span className="arrow">→</span>
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal dir="right">
          <Parallax speed={26} className="about-frame">
            <div className="mono">
              Crafted
              <br />
              since
              <br />
              1998
            </div>
            <div className="float" style={{ top: 30, left: 30 }}>
              26+ Years
            </div>
            <div className="float" style={{ bottom: 30, right: 30 }}>
              Velachery, Chennai
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
