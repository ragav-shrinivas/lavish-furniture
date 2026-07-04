'use client';

import { useRef, useState } from 'react';
import type { Category } from '@/lib/categories';

const S: Record<string, React.CSSProperties> = {
  title: { fontSize: 22, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#7C674E', marginBottom: 22 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 },
  card: { background: '#FFFCF5', border: '0.5px solid #E6D7BE', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  media: { position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#EEE3CB', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  num: { position: 'absolute', top: 10, left: 12, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,.5)' },
  body: { padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: 10 },
  label: { fontSize: 9, letterSpacing: '0.26em', fontWeight: 600, color: '#5A4632', textTransform: 'uppercase', display: 'block', marginBottom: 4 },
  input: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '8px 10px', fontSize: 13, color: '#1E1812', background: '#fff', outline: 'none', boxSizing: 'border-box' },
  uploadRow: { display: 'flex', gap: 8, alignItems: 'center' },
  uploadBtn: { flex: 1, border: '1px dashed #C3A063', borderRadius: 4, padding: '9px', textAlign: 'center', fontSize: 11, letterSpacing: '0.08em', color: '#96763F', background: '#FFFDF8', cursor: 'pointer' },
  focusRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip: { border: '0.5px solid #E6D7BE', borderRadius: 999, padding: '4px 10px', fontSize: 10, letterSpacing: '0.06em', color: '#5A4632', background: '#fff', cursor: 'pointer' },
  chipActive: { border: '1px solid #C3A063', color: '#1E1812', background: '#F7EFDD' },
  saveRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 },
  saveBtn: { background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '9px 22px', fontSize: 10, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  saved: { fontSize: 11, color: '#5A8A5A', letterSpacing: '0.06em' },
  err: { fontSize: 11, color: '#c05050', letterSpacing: '0.04em' },
};

const FOCUS_PRESETS = [
  { label: 'Top', value: '50% 20%' },
  { label: 'Center', value: '50% 50%' },
  { label: 'Lower', value: '50% 65%' },
  { label: 'Bottom', value: '50% 85%' },
];

type Draft = { tag: string; name: string; tagline: string; image: string; focus: string };

function CollectionCard({ cat, index }: { cat: Category; index: number }) {
  const [draft, setDraft] = useState<Draft>({
    tag: cat.tag,
    name: cat.name,
    tagline: cat.tagline,
    image: cat.image,
    focus: cat.focus,
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setStatus('idle');
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus('idle');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) set('image', data.url);
      else setStatus('error');
    } catch {
      setStatus('error');
    }
    setUploading(false);
  }

  async function save() {
    setStatus('saving');
    try {
      const res = await fetch(`/api/collections/${cat.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      setStatus(res.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={S.card}>
      <div style={S.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={draft.image} alt={draft.name} style={{ ...S.img, objectPosition: draft.focus }} />
        <span style={S.num}>{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div style={S.body}>
        <div>
          <label style={S.label}>Category Image</label>
          <div style={S.uploadRow}>
            <div style={S.uploadBtn} onClick={() => fileRef.current?.click()}>
              {uploading ? 'Uploading…' : 'Upload new image'}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
          </div>
          <input
            style={{ ...S.input, marginTop: 8 }}
            value={draft.image}
            onChange={(e) => set('image', e.target.value)}
            placeholder="or paste an image URL"
          />
        </div>

        <div>
          <label style={S.label}>Focal point (which part of the image shows)</label>
          <div style={S.focusRow}>
            {FOCUS_PRESETS.map((p) => (
              <span
                key={p.value}
                onClick={() => set('focus', p.value)}
                style={draft.focus === p.value ? { ...S.chip, ...S.chipActive } : S.chip}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label style={S.label}>Label (small tag)</label>
          <input style={S.input} value={draft.tag} onChange={(e) => set('tag', e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Title</label>
          <input style={S.input} value={draft.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Tagline</label>
          <input style={S.input} value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>

        <div style={S.saveRow}>
          <button style={S.saveBtn} onClick={save} disabled={status === 'saving' || uploading}>
            {status === 'saving' ? 'Saving…' : 'Save'}
          </button>
          {status === 'saved' && <span style={S.saved}>✓ Saved — live on site</span>}
          {status === 'error' && <span style={S.err}>Save failed — check storage setup</span>}
        </div>
      </div>
    </div>
  );
}

export function CollectionsPanel({ collections }: { collections: Category[] }) {
  return (
    <div>
      <div style={S.title}>Collection Cards</div>
      <div style={S.subtitle}>
        Edit the image, focal point and text of each collection card. Order is fixed. Changes go live on save.
      </div>
      <div style={S.grid}>
        {collections.map((cat, i) => (
          <CollectionCard key={cat.slug} cat={cat} index={i} />
        ))}
      </div>
    </div>
  );
}
