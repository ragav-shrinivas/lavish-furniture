'use client';

import { useState, useRef } from 'react';
import type { AdminReview } from '@/types/admin';

const S: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif' },
  addBtn: { background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '9px 18px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#7C674E', fontSize: 13, padding: '48px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#FFFCF5', border: '0.5px solid #E6D7BE', borderRadius: 6, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' },
  avatar: { width: 42, height: 42, borderRadius: '50%', background: '#EEE3CB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, color: '#7C674E', overflow: 'hidden' },
  content: { flex: 1 },
  meta: { display: 'flex', justifyContent: 'space-between', marginBottom: 5, flexWrap: 'wrap', gap: 4 },
  name: { fontSize: 14, fontWeight: 500, color: '#1E1812' },
  location: { fontSize: 11, color: '#7C674E', marginLeft: 10 },
  stars: { color: '#C3A063', fontSize: 14, letterSpacing: 2 },
  text: { fontSize: 13, color: '#382D20', lineHeight: 1.6, marginBottom: 10 },
  actions: { display: 'flex', gap: 8 },
  btn: { border: '0.5px solid #E6D7BE', borderRadius: 2, padding: '4px 12px', fontSize: 10, letterSpacing: '0.15em', color: '#1E1812', background: '#fff', cursor: 'pointer' },
  delBtn: { border: '0.5px solid #e07070', borderRadius: 2, padding: '4px 12px', fontSize: 10, letterSpacing: '0.15em', color: '#c05050', background: '#fff', cursor: 'pointer' },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(30,24,18,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#FDFBF6', borderRadius: 8, width: '100%', maxWidth: 480, padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif', marginBottom: 20 },
  label: { fontSize: 10, letterSpacing: '0.3em', fontWeight: 600, color: '#5A4632', textTransform: 'uppercase', display: 'block', marginBottom: 5 },
  input: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 },
  textarea: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14, resize: 'vertical' as const, minHeight: 90 },
  modalBtns: { display: 'flex', gap: 10, marginTop: 4 },
  saveBtn: { flex: 1, background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '11px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'transparent', color: '#5A4632', border: '0.5px solid #E6D7BE', borderRadius: 4, padding: '11px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  uploadArea: { border: '1px dashed #E6D7BE', borderRadius: 4, padding: '12px', textAlign: 'center', marginBottom: 14, cursor: 'pointer', color: '#7C674E', fontSize: 12 },
};

const EMPTY: Omit<AdminReview, 'id' | 'createdAt'> = {
  name: '', text: '', rating: 5, photo: '', location: '', visible: true,
};

function Stars({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange?.(i)}
          style={{ color: i <= rating ? '#C3A063' : '#ddd', fontSize: 20, cursor: onChange ? 'pointer' : 'default' }}
        >★</span>
      ))}
    </span>
  );
}

export function ReviewsPanel({ initialReviews }: { initialReviews: AdminReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function openAdd() { setForm(EMPTY); setPhotoPreview(''); setEditing(null); setIsNew(true); }
  function openEdit(r: AdminReview) {
    setForm({ name: r.name, text: r.text, rating: r.rating, photo: r.photo, location: r.location, visible: r.visible });
    setPhotoPreview(r.photo);
    setEditing(r);
    setIsNew(false);
  }
  function closeModal() { setEditing(null); setIsNew(false); }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, _file: file } as typeof f & { _file: File }));
  }

  async function handleSave() {
    setSaving(true);
    let photoUrl = form.photo;
    const anyForm = form as typeof form & { _file?: File };
    if (anyForm._file) {
      const fd = new FormData();
      fd.append('file', anyForm._file);
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      photoUrl = (await up.json()).url;
    }
    const payload = { ...form, photo: photoUrl };
    delete (payload as Record<string, unknown>)._file;

    if (isNew) {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const created = await res.json();
      setReviews((prev) => [created, ...prev]);
    } else if (editing) {
      const res = await fetch(`/api/reviews/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === editing.id ? updated : r)));
    }
    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function toggleVisible(review: AdminReview) {
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !review.visible }),
    });
    const updated = await res.json();
    setReviews((prev) => prev.map((r) => (r.id === review.id ? updated : r)));
  }

  return (
    <div>
      <div style={S.header}>
        <div style={S.title}>Reviews</div>
        <button style={S.addBtn} onClick={openAdd}>+ Add Review</button>
      </div>

      {reviews.length === 0 ? (
        <div style={S.empty}>No reviews yet. Add your first customer review.</div>
      ) : (
        <div style={S.list}>
          {reviews.map((r) => (
            <div key={r.id} style={{ ...S.card, opacity: r.visible ? 1 : 0.55 }}>
              <div style={S.avatar}>
                {r.photo
                  ? <img src={r.photo} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : r.name.charAt(0).toUpperCase()
                }
              </div>
              <div style={S.content}>
                <div style={S.meta}>
                  <div>
                    <span style={S.name}>{r.name}</span>
                    {r.location && <span style={S.location}>{r.location}</span>}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <div style={S.text}>{r.text}</div>
                <div style={S.actions}>
                  <button style={S.btn} onClick={() => toggleVisible(r)}>{r.visible ? 'Hide' : 'Show'}</button>
                  <button style={S.btn} onClick={() => openEdit(r)}>Edit</button>
                  <button style={S.delBtn} onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isNew || editing) && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={S.modal}>
            <div style={S.modalTitle}>{isNew ? 'Add Review' : 'Edit Review'}</div>

            <label style={S.label}>Customer Name</label>
            <input style={S.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Aanya & Rohit" />

            <label style={S.label}>Location (optional)</label>
            <input style={S.input} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Velachery, Chennai" />

            <label style={S.label}>Rating</label>
            <div style={{ marginBottom: 14 }}>
              <Stars rating={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>

            <label style={S.label}>Review Text</label>
            <textarea style={S.textarea} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="What did the customer say?" />

            <label style={S.label}>Customer Photo (optional)</label>
            {photoPreview && (
              <img src={photoPreview} alt="preview" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />
            )}
            <div style={S.uploadArea} onClick={() => fileRef.current?.click()}>
              Click to upload photo
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
            </div>

            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving || !form.name || !form.text}>
                {saving ? 'Saving…' : 'Save Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
