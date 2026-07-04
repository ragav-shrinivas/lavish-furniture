'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Reached only via the hidden EVO9 trigger (footer long-press/5-click).
 * No password prompt — just establishes the session cookie and moves on.
 */
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/auth', { method: 'POST' }).then(() => {
      router.replace('/admin/dashboard');
    });
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1E1812',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <Image
          src="/evo9.png"
          alt="EVO9"
          width={48}
          height={48}
          style={{ margin: '0 auto 16px', opacity: 0.9 }}
        />
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: 22,
          letterSpacing: '0.22em',
          color: '#F8F3EA',
          fontWeight: 500,
          marginBottom: 4,
        }}>LAVISH</div>
        <div style={{
          fontSize: 10,
          letterSpacing: '0.5em',
          color: '#C3A063',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>Entering Admin Panel…</div>
      </div>
    </div>
  );
}
