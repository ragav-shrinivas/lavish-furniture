'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { AdminProduct, AdminReview, SiteContent } from '@/types/admin';
import { ProductsPanel } from './ProductsPanel';
import { ReviewsPanel } from './ReviewsPanel';
import { ContentPanel } from './ContentPanel';

type Tab = 'products' | 'reviews' | 'content';

const T: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    background: '#F8F3EA',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    background: '#1E1812',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#F8F3EA',
    fontFamily: 'Georgia, serif',
    fontSize: 15,
    letterSpacing: '0.2em',
    fontWeight: 500,
  },
  logoutBtn: {
    border: '0.5px solid rgba(195,160,99,0.4)',
    padding: '6px 16px',
    borderRadius: 3,
    fontSize: 10,
    letterSpacing: '0.22em',
    color: '#C3A063',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    background: 'transparent',
    cursor: 'pointer',
  },
  tabs: {
    background: '#1E1812',
    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
    padding: '0 20px',
    display: 'flex',
    gap: 0,
  },
};

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '13px 20px',
        fontSize: 11,
        letterSpacing: '0.18em',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: active ? '#C3A063' : 'rgba(248,243,234,0.4)',
        borderBottom: `2px solid ${active ? '#C3A063' : 'transparent'}`,
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? '#C3A063' : 'transparent'}`,
        cursor: 'pointer',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {label}
    </button>
  );
}

export function AdminDashboard({
  products,
  reviews,
  content,
}: {
  products: AdminProduct[];
  reviews: AdminReview[];
  content: SiteContent;
}) {
  const [tab, setTab] = useState<Tab>('products');
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  return (
    <div style={T.wrap}>
      <header style={T.header}>
        <div style={T.brand}>
          <Image src="/evo9.png" alt="EVO9" width={22} height={22} style={{ opacity: 0.85 }} />
          LAVISH ADMIN
        </div>
        <button style={T.logoutBtn} onClick={logout}>Logout</button>
      </header>

      <div style={T.tabs}>
        <Tab label="Products" active={tab === 'products'} onClick={() => setTab('products')} />
        <Tab label="Reviews" active={tab === 'reviews'} onClick={() => setTab('reviews')} />
        <Tab label="Content" active={tab === 'content'} onClick={() => setTab('content')} />
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>
        {tab === 'products' && <ProductsPanel initialProducts={products} />}
        {tab === 'reviews' && <ReviewsPanel initialReviews={reviews} />}
        {tab === 'content' && <ContentPanel initialContent={content} />}
      </div>
    </div>
  );
}
