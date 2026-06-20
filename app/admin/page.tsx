'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/admin/dashboard');
    } else {
      setError('Incorrect access code');
      setLoading(false);
    }
  }

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
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
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
          }}>Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(248,243,234,0.04)',
          border: '0.5px solid rgba(195,160,99,0.2)',
          borderRadius: 8,
          padding: 28,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.36em',
            fontWeight: 600,
            color: '#C3A063',
            textTransform: 'uppercase',
            textAlign: 'left',
            marginBottom: 10,
          }}>Access Code</div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoComplete="current-password"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(195,160,99,0.25)',
              borderRadius: 4,
              padding: '11px 14px',
              color: '#F8F3EA',
              fontSize: 14,
              outline: 'none',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              color: '#e07070',
              fontSize: 12,
              marginBottom: 12,
              textAlign: 'left',
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(195,160,99,0.5)' : '#C3A063',
              border: 'none',
              borderRadius: 4,
              padding: '12px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.3em',
              color: '#1E1812',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>

        <div style={{
          marginTop: 20,
          fontSize: 11,
          color: 'rgba(248,243,234,0.28)',
          letterSpacing: '0.08em',
        }}>
          Hold the EVO9 mark in the footer for 3 seconds to reach this page
        </div>
      </div>
    </div>
  );
}
