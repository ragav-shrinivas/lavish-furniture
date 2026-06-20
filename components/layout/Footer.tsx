import { siteConfig } from '@/lib/config';
import { Evo9Trigger } from './Evo9Trigger';

export function Footer() {
  const links = siteConfig.nav;
  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="foot-brand">LAVISH</div>
        <div className="foot-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Google Reviews CTA */}
      <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <a
          className="btn-reviews"
          href={siteConfig.googleReviews}
          target="_blank"
          rel="noopener"
        >
          <em className="star">★</em> See 1100+ Google Reviews
        </a>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '.62rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--walnut-soft)' }}>
          Trusted since 1998 · Velachery, Chennai
        </span>
      </div>

      <div className="foot-bottom">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          © {new Date().getFullYear()} Lavish Furniture · Velachery, Chennai
          <Evo9Trigger />
        </span>
        <span>26+ Years · 30,000 Sq.Ft Showroom</span>
      </div>
    </footer>
  );
}
