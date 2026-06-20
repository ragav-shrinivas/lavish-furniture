'use client';

import { useState } from 'react';
import type { SiteContent } from '@/types/admin';

const S: Record<string, React.CSSProperties> = {
  title: { fontSize: 22, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#7C674E', marginBottom: 24 },
  section: { fontSize: 10, letterSpacing: '0.38em', fontWeight: 600, color: '#C3A063', textTransform: 'uppercase', paddingBottom: 8, borderBottom: '0.5px solid #E6D7BE', marginBottom: 14 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 10, letterSpacing: '0.3em', fontWeight: 600, color: '#5A4632', textTransform: 'uppercase', display: 'block', marginBottom: 5 },
  hint: { fontSize: 10, color: '#7C674E', marginBottom: 5 },
  input: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const },
  saveBtn: { background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '11px 32px', fontSize: 11, letterSpacing: '0.28em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 },
  saved: { fontSize: 12, color: '#5A8A5A', marginLeft: 12, letterSpacing: '0.1em' },
};

export function ContentPanel({ initialContent }: { initialContent: SiteContent }) {
  const [form, setForm] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: keyof SiteContent, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <div style={S.title}>Site Content</div>
      <div style={S.subtitle}>Edit showroom details and contact information. Changes apply instantly.</div>

      <div style={S.section}>Contact & WhatsApp</div>
      <div style={S.grid2}>
        <div style={S.field}>
          <label style={S.label}>WhatsApp Number</label>
          <div style={S.hint}>Country code + number, no spaces (e.g. 919876543210)</div>
          <input style={S.input} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
        </div>
        <div style={S.field}>
          <label style={S.label}>Email Address</label>
          <input style={S.input} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      </div>
      <div style={S.field}>
        <label style={S.label}>Showroom Address</label>
        <input style={S.input} value={form.address} onChange={(e) => set('address', e.target.value)} />
      </div>

      <div style={{ ...S.section, marginTop: 24 }}>Review & Social Links</div>
      <div style={S.field}>
        <label style={S.label}>Google Review Link</label>
        <input style={S.input} value={form.googleReviewLink} onChange={(e) => set('googleReviewLink', e.target.value)} placeholder="https://maps.app.goo.gl/..." />
      </div>
      <div style={S.grid2}>
        <div style={S.field}>
          <label style={S.label}>Instagram URL</label>
          <input style={S.input} value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://www.instagram.com/..." />
        </div>
        <div style={S.field}>
          <label style={S.label}>Facebook URL</label>
          <input style={S.input} value={form.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://www.facebook.com/..." />
        </div>
      </div>

      <div style={{ ...S.section, marginTop: 24 }}>Homepage Copy</div>
      <div style={S.field}>
        <label style={S.label}>Hero Headline</label>
        <input style={S.input} value={form.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} placeholder="Crafting Luxury Living" />
      </div>
      <div style={S.field}>
        <label style={S.label}>Hero Subtitle</label>
        <input style={S.input} value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} placeholder="Furniture designed for sophisticated modern lifestyles..." />
      </div>

      <div>
        <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span style={S.saved}>✓ Saved</span>}
      </div>
    </div>
  );
}
