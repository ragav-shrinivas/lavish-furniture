'use client';

import { motion, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

type Dir = 'up' | 'left' | 'right';

const variants = (dir: Dir): Variants => {
  // horizontal offsets stay small: a hidden full-width block translated
  // beyond the viewport widens the document and, on Android, the whole
  // layout viewport (cream strip bug) — never exceed ~24px sideways
  const offset =
    dir === 'left' ? { x: -24, y: 12 } : dir === 'right' ? { x: 24, y: 12 } : { x: 0, y: 40 };
  return {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 1, ease: EASE, delay: 0 } },
  };
};

export function Reveal({
  children,
  dir = 'up',
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  dir?: Dir;
  delay?: number;
  className?: string;
  as?: 'div' | 'article' | 'section';
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants(dir)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
