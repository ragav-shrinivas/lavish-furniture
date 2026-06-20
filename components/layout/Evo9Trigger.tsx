'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Evo9Trigger() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);
  const clicksRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(() => {
    router.push('/admin');
  }, [router]);

  const onPressStart = useCallback(() => {
    activeRef.current = true;
    timerRef.current = setTimeout(() => {
      if (activeRef.current) navigate();
    }, 3000);
  }, [navigate]);

  const onPressEnd = useCallback(() => {
    activeRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onClick = useCallback(() => {
    clicksRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clicksRef.current >= 5) {
      clicksRef.current = 0;
      navigate();
      return;
    }
    clickTimerRef.current = setTimeout(() => { clicksRef.current = 0; }, 2000);
  }, [navigate]);

  return (
    <span
      onPointerDown={onPressStart}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      onPointerCancel={onPressEnd}
      onClick={onClick}
      title=""
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'default',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        opacity: 0.28,
        filter: 'grayscale(1)',
      }}
    >
      <Image src="/evo9.png" alt="" width={18} height={18} draggable={false} />
    </span>
  );
}
