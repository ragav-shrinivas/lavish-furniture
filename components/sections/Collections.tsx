import { Reveal } from '@/components/ui/Reveal';

const items = [
  { span: 'Living Room', title: 'Luxury Sofas', g: 'linear-gradient(150deg,#efe3cd,#cdb488)' },
  { span: 'Dining', title: 'Designer Dining', g: 'linear-gradient(150deg,#e9dcc2,#c4a978)' },
  { span: 'Bedroom', title: 'Premium Beds', g: 'linear-gradient(150deg,#f1e6d2,#d2bb92)' },
  { span: 'Storage', title: 'Modern Wardrobes', g: 'linear-gradient(150deg,#e7d8bb,#bfa372)' },
  { span: 'Heritage', title: 'Carved Masterpieces', g: 'linear-gradient(150deg,#eee0c6,#caae7e)' },
  { span: 'Accent', title: 'Statement Pieces', g: 'linear-gradient(150deg,#e4d3b2,#b89a66)' },
];

export function Collections() {
  return (
    <section className="block" id="collections">
      <div className="wrap">
        <Reveal className="section-head center">
          <div className="eyebrow">Browse The House</div>
          <h3>
            Premium collections,
            <br />
            <span className="serif-italic">curated by space</span>
          </h3>
        </Reveal>
        <div className="coll-grid">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 0.07}>
              <div className="coll" style={{ backgroundImage: it.g }}>
                <div className="ctxt">
                  <span>{it.span}</span>
                  <h4>{it.title}</h4>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
