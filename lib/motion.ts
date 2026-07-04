import type { Variants, Transition } from 'framer-motion';

/* ============================================================
   LAVISH MOTION LANGUAGE
   One easing, a strict duration hierarchy, consistent staggers.
   Every animated component draws from these primitives so the
   whole site shares a single rhythm.
============================================================ */

/** Primary easing — confident deceleration, no bounce. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Duration hierarchy (seconds). */
export const DUR = {
  micro: 0.25, // hovers, presses, arrows
  standard: 0.6, // small element reveals
  reveal: 0.9, // section content entering
  hero: 1.2, // large editorial moments
} as const;

/** Stagger hierarchy (seconds between children). */
export const STAGGER = {
  tight: 0.06, // words, list rows
  standard: 0.09, // cards, tiles
  loose: 0.14, // large panels
} as const;

export const revealTransition: Transition = { duration: DUR.reveal, ease: EASE };

/* ── Reusable variants ────────────────────────────────────── */

/** Rise + fade — the default entrance. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: revealTransition },
};

/** Simple fade for large surfaces (no movement = no jank). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.reveal, ease: EASE } },
};

/** Directional slide for editorial alternation. */
export const slideFrom = (dir: 'left' | 'right', dist = 56): Variants => ({
  hidden: { opacity: 0, x: dir === 'left' ? -dist : dist },
  show: { opacity: 1, x: 0, transition: revealTransition },
});

/** Masked reveal — content rises out of an overflow-hidden parent. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: DUR.reveal, ease: EASE } },
};

/** Image inside a masked frame — scales down as the mask opens. */
export const imageSettle: Variants = {
  hidden: { scale: 1.18 },
  show: { scale: 1, transition: { duration: DUR.hero, ease: EASE } },
};

/** Clip-path curtain reveal for imagery. */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: DUR.hero, ease: EASE } },
};

/** Hairline rule growing across. */
export const lineGrow: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.hero, ease: EASE } },
};

/** Parent orchestrator — pair with child variants above. */
export const stagger = (gap: number = STAGGER.standard, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Default viewport config for whileInView reveals.
 *  Low threshold, no negative margin: tall blocks must never sit
 *  invisible-but-space-occupying while the user scrolls into them
 *  (that reads as giant blank regions on mobile). */
export const viewportOnce = { once: true, amount: 0.12 } as const;
