'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import type { Overlay, SequenceConfig } from '@/lib/frames';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { EASE } from '@/lib/motion';

type IntroMark = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  actions?: { label: React.ReactNode; href: string; ghost?: boolean; external?: boolean }[];
};

/* ── single overlay: opacity + directional slide driven by scroll ── */
function HeroOverlay({ o, progress }: { o: Overlay; progress: MotionValue<number> }) {
  const [a, b] = o.range;
  const opacity = useTransform(progress, [a - 0.05, a, b, b + 0.05], [0, 1, 1, 0]);
  const x = useTransform(
    progress,
    [a - 0.07, a, b, b + 0.07],
    o.anim === 'left'
      ? ['-7vw', '0vw', '0vw', '3vw']
      : o.anim === 'right'
        ? ['7vw', '0vw', '0vw', '-3vw']
        : ['0vw', '0vw', '0vw', '0vw'],
  );
  const y = useTransform(
    progress,
    [a - 0.07, a, b, b + 0.07],
    o.anim === 'up' ? [64, 0, 0, -40] : [0, 0, 0, -24],
  );
  const scale = useTransform(progress, [a - 0.07, a], [0.97, 1]);

  return (
    <motion.div className="seq-overlay" style={{ opacity, x, y, scale }}>
      <div className="eyebrow">{o.eyebrow}</div>
      <h2>{o.title}</h2>
      <p>{o.subtitle}</p>
    </motion.div>
  );
}

/**
 * Scroll-scrubbed frame-sequence hero.
 *
 * The source frames are portrait phone video (~480×850), so:
 *  - portrait viewports get a full-bleed cover draw (native fit)
 *  - landscape viewports get a cinematic two-layer draw: a soft
 *    upscaled backdrop plus a sharp contained portrait panel
 *
 * Loading strategy:
 *  - nothing loads until the section is within 1.5 viewports
 *  - frames arrive in stride waves (every 8th → 4th → 2nd → all)
 *    so scrubbing works within seconds; nearest-frame rendering
 *    fills the gaps until the full set lands
 *  - small screens stop at stride 2 (half the frames, half the memory)
 */
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
  const [nearViewport, setNearViewport] = useState(false);
  const progressBarRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0004,
  });
  // With reduced motion, track scroll directly (no spring overshoot).
  const smooth = reducedMotion ? scrollYProgress : smoothSpring;

  // intro mark fade/lift (hero 1 only)
  const introOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.18], [0, -70]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Hold the sequence on frame 1 during the intro, then scrub.
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
    const idx = Math.min(Math.max(Math.round(frac * (total - 1)), 0), total - 1);
    let img = imgs[idx];
    if (!img) {
      // nearest-frame fallback while waves are still loading
      for (let d = 1; d < total; d++) {
        if (imgs[idx - d]) { img = imgs[idx - d]; break; }
        if (imgs[idx + d]) { img = imgs[idx + d]; break; }
      }
    }
    if (!img || !img.complete || !img.naturalWidth) return;

    const W = sticky.clientWidth;
    const H = sticky.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = W / H;

    ctx.clearRect(0, 0, W, H);

    if (cr <= ir * 1.35) {
      /* Portrait-ish viewport: classic cover draw. */
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
      else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      /* Wide viewport: soft cover backdrop + sharp contained panel. */
      const bw = W;
      const bh = W / ir;
      ctx.save();
      ctx.filter = 'saturate(1.05)';
      ctx.globalAlpha = 0.999;
      ctx.drawImage(img, 0, (H - bh) / 2, bw, bh);
      // warm veil so the upscaled backdrop reads as atmosphere, not content
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(30,19,8,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      const ph = H * 0.94;
      const pw = ph * ir;
      const px = (W - pw) / 2;
      const py = (H - ph) / 2;
      ctx.save();
      ctx.shadowColor = 'rgba(10,5,0,0.55)';
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 18;
      ctx.drawImage(img, px, py, pw, ph);
      ctx.restore();
    }
  }, []);

  /* lazy start: begin loading only when the section approaches */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* progressive stride-wave preload */
  useEffect(() => {
    if (!nearViewport) return;
    const total = config.count;
    const imgs: (HTMLImageElement | undefined)[] = new Array(total);
    imagesRef.current = imgs;

    const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;
    const finalStride = isSmall ? 2 : 1;

    // Build load order: stride 8 first, then fill 4, 2, (1 on desktop).
    const order: number[] = [];
    const seen = new Set<number>();
    for (const stride of [8, 4, 2, 1]) {
      if (stride < finalStride) break;
      for (let i = 0; i < total; i += stride) {
        if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
    }

    let loaded = 0;
    const firstWaveTarget = Math.ceil(total / 8);
    let cancelled = false;
    let cursor = 0;
    const CONCURRENCY = 10;

    const pump = () => {
      if (cancelled || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = 'async';
      const finish = (ok: boolean) => {
        if (cancelled) return;
        if (ok) imgs[i] = img;
        loaded++;
        if (loaded === 1) {
          setAnyLoaded(true);
          draw(0);
        }
        if (loaded >= firstWaveTarget) setBufferReady(true);
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${loaded / order.length})`;
        }
        pump();
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = src(i);
    };
    for (let k = 0; k < CONCURRENCY; k++) pump();

    return () => { cancelled = true; };
  }, [nearViewport, config.count, src, draw]);

  /* scroll → frame */
  useEffect(() => {
    if (!anyLoaded) return;
    const remap = (p: number) =>
      FRAME_START <= 0 ? p : Math.max(0, (p - FRAME_START) / (1 - FRAME_START));
    const unsub = smooth.on('change', (p) => draw(remap(p)));
    draw(remap(smooth.get()));
    return () => unsub();
  }, [smooth, anyLoaded, draw, FRAME_START]);

  /* redraw on layout changes */
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;
    const ro = new ResizeObserver(() => {
      const p = smooth.get();
      draw(FRAME_START <= 0 ? p : Math.max(0, (p - FRAME_START) / (1 - FRAME_START)));
    });
    ro.observe(sticky);
    return () => ro.disconnect();
  }, [smooth, draw, FRAME_START]);

  return (
    <section
      ref={sectionRef}
      id={config.id}
      className={`seq-section${intro ? ' has-intro' : ''}`}
      style={{ position: 'relative' }}
      aria-label={intro ? 'Lavish Furniture showroom film' : 'Carved furniture film'}
    >
      <div ref={stickyRef} className="seq-sticky">
        <div className="seq-fallback" aria-hidden="true" />
        <motion.canvas
          ref={canvasRef}
          className="seq-canvas"
          style={{ opacity: canvasOpacity }}
          aria-hidden="true"
        />
        <div className="seq-scrim" aria-hidden="true" />

        <div className={`seq-loading${bufferReady ? ' hide' : ''}`} aria-hidden="true">
          <span>{config.loadingText}</span>
          <span className="bar">
            <i ref={(el) => { progressBarRef.current = el; }} style={{ transform: 'scaleX(0)' }} />
          </span>
        </div>

        {intro && (
          <motion.div className="hero-mark" style={{ opacity: introOpacity, y: introY }}>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              <div className="eyebrow">{intro.eyebrow}</div>
            </motion.div>
            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            >
              {intro.title}
            </motion.h1>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              {intro.subtitle}
            </motion.p>
            {intro.actions && (
              <motion.div
                className="actions"
                initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
              >
                {intro.actions.map((act, i) => (
                  <MagneticButton
                    key={i}
                    href={act.href}
                    className={act.ghost ? 'ghost on-dark' : undefined}
                    external={act.external}
                  >
                    {act.label}
                  </MagneticButton>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="seq-overlays">
          {config.overlays.map((o, i) => (
            <HeroOverlay key={i} o={o} progress={scrollYProgress} />
          ))}
        </div>

        {intro && (
          <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
            <span>Scroll to explore</span>
            <i />
          </motion.div>
        )}
      </div>
    </section>
  );
}
