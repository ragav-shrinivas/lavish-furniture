'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * Route transition curtain.
 *
 * A TransitionLink click raises an ivory curtain over the page, then
 * navigates; when the new route's pathname lands, the curtain lifts to
 * reveal it. Deliberately an overlay (not layoutId shared elements) —
 * reliable with the App Router, no layout-tracking instability.
 * Reduced motion (and modified clicks / new-tab intents) bypass it.
 */

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

const COVER_MS = 520;

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [covering, setCovering] = useState(false);
  const pendingRef = useRef<string | null>(null);
  const coveredPathRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (reducedMotion) {
        router.push(href);
        return;
      }
      if (pendingRef.current) return; // one transition at a time
      pendingRef.current = href;
      coveredPathRef.current = pathname;
      setCovering(true);
      // let the curtain fully cover before swapping routes
      window.setTimeout(() => router.push(href), COVER_MS);
    },
    [router, pathname, reducedMotion],
  );

  /* pathname changed → destination mounted → lift the curtain */
  useEffect(() => {
    if (pendingRef.current && pathname !== coveredPathRef.current) {
      pendingRef.current = null;
      coveredPathRef.current = null;
      setCovering(false);
    }
  }, [pathname]);

  /* safety valve: never leave the curtain stuck (failed nav, same route) */
  useEffect(() => {
    if (!covering) return;
    const t = window.setTimeout(() => {
      pendingRef.current = null;
      setCovering(false);
    }, 4000);
    return () => window.clearTimeout(t);
  }, [covering]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {covering && (
          <motion.div
            className="route-curtain"
            aria-hidden="true"
            initial={{ y: '101%' }}
            animate={{ y: '0%', transition: { duration: COVER_MS / 1000, ease: EASE } }}
            exit={{ y: '-101%', transition: { duration: 0.6, ease: EASE, delay: 0.1 } }}
          >
            <motion.span
              className="route-curtain-mark"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              LAVISH
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

/** Link that routes through the curtain. Falls back to a plain link for
 *  modified clicks (new tab, download) and external targets. */
export function TransitionLink({
  href,
  children,
  className,
  onNavigate,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const { navigate } = useContext(TransitionContext);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (href.startsWith('#') || href.includes('://')) return;
    e.preventDefault();
    onNavigate?.();
    navigate(href);
  };

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
