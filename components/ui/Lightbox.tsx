'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * Accessible fullscreen image viewer.
 * Escape / backdrop click closes; arrow keys and on-screen controls
 * navigate; focus is held inside while open and restored on close.
 */
export function Lightbox({
  images,
  index,
  alt,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number | null;
  alt: (i: number) => string;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const open = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const restoreTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      restoreTo?.focus?.();
    };
  }, [open, onClose, prev, next]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.img
            key={index}
            src={images[index]}
            alt={alt(index)}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          />

          <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close viewer">
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button className="lightbox-nav prev" onClick={prev} aria-label="Previous image">
                ←
              </button>
              <button className="lightbox-nav next" onClick={next} aria-label="Next image">
                →
              </button>
              <div className="lightbox-counter" aria-hidden="true">
                {index + 1} / {images.length}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
