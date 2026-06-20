'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
  external?: boolean;
};

export function MagneticButton({ href, children, className, strength = 0.32, external }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer:fine)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      className={cn('btn', className)}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  );
}
