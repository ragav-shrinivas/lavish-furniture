'use client';

import { useRef } from 'react';
import type { CardItem } from '@/lib/frames';
import { Reveal } from '@/components/ui/Reveal';

function TiltCard({ item, dir }: { item: CardItem; dir: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const MAX = 9;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer:fine)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-6px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Reveal dir={dir} as="article">
      <div className="tilt" ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
        <span className="num">{item.num}</span>
        <span className="tag">{item.tag}</span>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
        <span className="go">
          Discover <span>→</span>
        </span>
      </div>
    </Reveal>
  );
}

export function CollectionCards({
  id,
  eyebrow,
  title,
  italic,
  cards,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  italic: string;
  cards: CardItem[];
}) {
  return (
    <section className="block" id={id}>
      <div className="wrap">
        <Reveal className="section-head center">
          <div className="eyebrow">{eyebrow}</div>
          <h3>
            {title}
            <br />
            <span className="serif-italic">{italic}</span>
          </h3>
        </Reveal>
        <div className="card-grid">
          {cards.map((c, i) => (
            <TiltCard key={c.num} item={c} dir={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </div>
    </section>
  );
}
