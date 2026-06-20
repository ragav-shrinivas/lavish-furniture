import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from '@/components/ui/Parallax';

export function Showroom() {
  return (
    <section className="block showroom" id="showroom">
      <div className="wrap">
        <Reveal className="section-head center">
          <div className="eyebrow">30,000 Sq.Ft of Luxury</div>
          <h3>
            Step inside our
            <br />
            <span className="serif-italic">Velachery showroom</span>
          </h3>
          <p>
            Natural light, generous space, and every collection presented like a gallery — minutes
            from Phoenix Mall.
          </p>
        </Reveal>
        <div className="showband">
          <Reveal dir="left">
            <Parallax speed={22} className="showtile tall">
              <span>The Atrium</span>
            </Parallax>
          </Reveal>
          <Reveal delay={0.08}>
            <Parallax speed={40} className="showtile">
              <span>Modern Wing</span>
            </Parallax>
          </Reveal>
          <Reveal dir="right" delay={0.16}>
            <Parallax speed={22} className="showtile tall">
              <span>Carved Gallery</span>
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
