'use client';

import { useState } from 'react';

export function HelloClient() {
  const [n, setN] = useState(0);
  return (
    <button
      onClick={() => setN(n + 1)}
      style={{
        marginTop: 24,
        padding: '12px 24px',
        borderRadius: 8,
        border: '1px solid #C3A063',
        background: '#C3A063',
        color: '#fff',
        font: '600 14px system-ui',
        cursor: 'pointer',
      }}
    >
      Clicked {n} times — client component works ✓
    </button>
  );
}
