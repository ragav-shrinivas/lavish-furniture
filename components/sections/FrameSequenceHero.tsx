'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { Overlay, SequenceConfig } from '@/lib/frames';
import { MagneticButton } from '@/components/ui/MagneticButton';

type IntroMark = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  actions?: { label: React.ReactNode; href: string; ghost?: boolean; external?: boolean }[];
};

/* ── single overlay, drives its own opacity + slide from scroll progress ── */
function HeroOverlay({ o, progress }: { o: Overlay; progress: MotionValue<number> }) {
  const [a, b] = o.range;
  const opacity = useTransform(progress, [a - 0.05, a, b, b + 0.05], [0, 1, 1, 0]);
  const x = useTransform(
    progress,
    [a - 0.06, a],
    o.anim === 'left' ? ['-9vw', '0vw'] : o.anim === 'right' ? ['9vw', '0vw'] : ['0vw', '0vw'],
  );
  const y = useTransform(progress, [a - 0.06, a], o.anim === 'up' ? [60, 0] : [0, 0]);

  return (
    <motion.div className="seq-overlay" style={{ opacity, x, y }}>
      <div className="eyebrow">{o.eyebrow}</div>
      <h2>{o.title}</h2>
      <p>{o.subtitle}</p>
    </motion.div>
  );
}

export function FrameSequenceHero({
  config,
  intro,
}: {
  config: SequenceConfig;
  intro?: IntroMark;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const [anyLoaded, setAnyLoaded] = useState(false);
  const [bufferReady, setBufferReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.0005 });

  // intro mark fade/lift (hero 1 only)
  const introOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.18], [0, -70]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // First hero (has intro): open on the calm sand frame, then fade the video in
  // after a little scroll, holding the sequence at frame 1 until it's visible.
  const FRAME_START = intro ? 0.09 : 0;
  const canvasOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.15],
    intro ? [0, 0, 1] : [1, 1, 1],
  );

  const src = useCallback(
    (i: number) =>
      `${config.basePath}${config.prefix}${String(config.start + i).padStart(config.pad, '0')}${config.ext}`,
    [config],
  );

  const draw = useCallback((frac: number) => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    const imgs = imagesRef.current;
    if (!canvas || !sticky || !imgs.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = imgs.length;
    let idx = Math.min(Math.max(Math.round(frac * (total - 1)), 0), total - 1);
    let img = imgs[idx];
    if (!img) {
      for (let d = 1; d < total; d++) {
        if (imgs[idx - d]) { img = imgs[idx - d]; break; }
        if (imgs[idx + d]) { img = imgs[idx + d]; break; }
      }
    }
    if (!img || !img.complete) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = sticky.clientWidth, H = sticky.clientHeight;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const ir = img.naturalWidth / img.naturalHeight, cr = W / H;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
    else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /* preload */
  useEffect(() => {
    const imgs: (HTMLImageElement | undefined)[] = new Array(config.count);
    imagesRef.current = imgs;
    let valid = 0, done = 0, first = true;

    for (let i = 0; i < config.count; i++) {
      const img = new Image();
      img.decoding = 'async';
      const finish = (ok: boolean) => {
        if (ok) { imgs[i] = img; valid++; }
        done++;
        if (first && valid > 0) { first = false; setAnyLoaded(true); draw(0); }
        if (valid >= Math.min(8, config.count)) setBufferReady(true);
        if (done === config.count) setBufferReady(true);
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = src(i);
    }
  }, [config.count, src, draw]);

  /* scroll → frame (hold on frame 1 during the intro, then scrub) */
  useEffect(() => {
    if (!anyLoaded) return;
    const remap = (p: number) =>
      FRAME_START <= 0 ? p : Math.max(0, (p - FRAME_START) / (1 - FRAME_START));
    const unsub = smooth.on('change', (p) => draw(remap(p)));
    draw(remap(smooth.get()));
    return () => unsub();
  }, [smooth, anyLoaded, draw, FRAME_START]);

  /* resize */
  useEffect(() => {
    const onResize = () => {
      const p = smooth.get();
      draw(FRAME_START <= 0 ? p : Math.max(0, (p - FRAME_START) / (1 - FRAME_START)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [smooth, draw, FRAME_START]);

  return (
    <section ref={sectionRef} id={config.id} className={`seq-section${intro ? ' has-intro' : ''}`}>
      <div ref={stickyRef} className="seq-sticky">
        <div className="seq-fallback" />
        <motion.canvas ref={canvasRef} className="seq-canvas" style={{ opacity: canvasOpacity }} />
        <div className="seq-scrim" />

        <div className={`seq-loading${bufferReady ? ' hide' : ''}`}>{config.loadingText}</div>

        {intro && (
          <motion.div className="hero-mark" style={{ opacity: introOpacity, y: introY }}>
            <div className="eyebrow">{intro.eyebrow}</div>
            <h1>{intro.title}</h1>
            <p>{intro.subtitle}</p>
            {intro.actions && (
              <div className="actions">
                {intro.actions.map((act, i) => (
                  <MagneticButton key={i} href={act.href} className={act.ghost ? 'ghost' : undefined} external={act.external}>
                    {act.label}
                  </MagneticButton>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="seq-overlays">
          {config.overlays.map((o, i) => (
            <HeroOverlay key={i} o={o} progress={scrollYProgress} />
          ))}
        </div>

        {intro && (
          <motion.div className="scroll-cue" style={{ opacity: cueOpacity }}>
            <span>Scroll to explore</span>
            <i />
          </motion.div>
        )}
      </div>
    </section>
  );
}
