'use client';

import { siteConfig } from '@/lib/config';
import { Reveal } from '@/components/ui/Reveal';

const channels = [
  { ic: '✆', label: 'WhatsApp', value: '+91 93847 20033', href: `https://wa.me/${siteConfig.whatsapp}` },
  { ic: '✉', label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { ic: '◎', label: 'Instagram', value: siteConfig.instagramHandle, href: siteConfig.instagram },
  { ic: 'f', label: 'Facebook', value: 'Lavish Furniture Chennai', href: siteConfig.facebook },
];

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  'Lavish Furniture, Velachery, Chennai',
)}&z=15&output=embed`;

function magnetic(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = e.currentTarget;
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const r = el.getBoundingClientRect();
  el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${
    (e.clientY - r.top - r.height / 2) * 0.18
  }px)`;
}

export function Contact() {
  return (
    <section className="block contact" id="contact">
      <div className="wrap contact-grid">
        <Reveal dir="left">
          <div className="eyebrow">Visit · Call · Message</div>
          <div className="section-head left" style={{ marginBottom: 0 }}>
            <h3>
              Let&apos;s design your <span className="serif-italic">elegant living</span>
            </h3>
            <p>
              Reach us on your preferred channel — our team will help you plan a personal showroom
              visit.
            </p>
          </div>
          <div className="channels">
            {channels.map((c) => (
              <a
                key={c.label}
                className="channel"
                href={c.href}
                target={c.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener"
                onMouseMove={magnetic}
                onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
              >
                <span className="ic">{c.ic}</span>
                <span className="ct">
                  <b>{c.label}</b>
                  <span>{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal dir="right">
          <div className="map-card">
            <iframe
              title="Lavish Furniture — Velachery, Chennai"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="map-open" href={siteConfig.maps} target="_blank" rel="noopener">
              Open in Google Maps →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
