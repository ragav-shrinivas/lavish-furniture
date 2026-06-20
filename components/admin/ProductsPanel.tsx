'use client';

import { useState, useRef } from 'react';
import type { AdminProduct } from '@/types/admin';

const CATEGORIES = [
  { slug: 'carving-sofas', name: 'Carving Sofas' },
  { slug: 'luxury-sofas', name: 'Luxury Sofas' },
  { slug: 'recliners', name: 'Recliners' },
  { slug: 'bedroom', name: 'Bedroom Collections' },
  { slug: 'dining-sets', name: 'Dining Sets' },
  { slug: 'office-furniture', name: 'Office Furniture' },
  { slug: 'wardrobes', name: 'Wardrobes' },
  { slug: 'luxury-chairs', name: 'Luxury Chairs' },
  { slug: 'wooden-decor', name: 'Wooden Decor' },
  { slug: 'coffee-side-tables', name: 'Coffee & Side Tables' },
];

const S: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif' },
  addBtn: { background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '9px 18px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  count: { fontSize: 12, color: '#7C674E', marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: '#FFFCF5', border: '0.5px solid #E6D7BE', borderRadius: 8, overflow: 'hidden' },
  img: { width: '100%', height: 160, objectFit: 'cover' as const, display: 'block' },
  imgPlaceholder: { width: '100%', height: 160, background: 'linear-gradient(135deg, #F5EDDB, #EEE3CB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B89765', fontSize: 12, letterSpacing: '0.1em' },
  body: { padding: '12px 14px' },
  catLabel: { fontSize: 9, letterSpacing: '0.28em', color: '#C3A063', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 },
  name: { fontSize: 14, fontWeight: 500, color: '#1E1812', marginBottom: 2, lineHeight: 1.3 },
  desc: { fontSize: 11, color: '#5A4632', marginBottom: 6, lineHeight: 1.5 },
  price: { fontSize: 12, color: '#7C674E', fontWeight: 500, marginBottom: 10 },
  toggleRow: { display: 'flex', gap: 12, marginBottom: 10 },
  actions: { display: 'flex', gap: 6 },
  editBtn: { flex: 1, border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '6px', fontSize: 10, letterSpacing: '0.12em', color: '#1E1812', textAlign: 'center', background: '#fff', cursor: 'pointer' },
  delBtn: { flex: 1, border: '0.5px solid #e07070', borderRadius: 3, padding: '6px', fontSize: 10, letterSpacing: '0.12em', color: '#c05050', textAlign: 'center', background: '#fff', cursor: 'pointer' },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(30,24,18,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#FDFBF6', borderRadius: 8, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' as const, padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: 500, color: '#1E1812', fontFamily: 'Georgia, serif', marginBottom: 20 },
  label: { fontSize: 10, letterSpacing: '0.3em', fontWeight: 600, color: '#5A4632', textTransform: 'uppercase', display: 'block', marginBottom: 5 },
  input: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 },
  select: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 },
  textarea: { width: '100%', border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: '#1E1812', background: '#FFFCF5', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14, resize: 'vertical' as const, minHeight: 80 },
  modalBtns: { display: 'flex', gap: 10, marginTop: 4 },
  saveBtn: { flex: 1, background: '#1E1812', color: '#F8F3EA', border: 'none', borderRadius: 4, padding: '11px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'transparent', color: '#5A4632', border: '0.5px solid #E6D7BE', borderRadius: 4, padding: '11px', fontSize: 11, letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  uploadArea: { border: '1px dashed #E6D7BE', borderRadius: 4, padding: '16px', textAlign: 'center', marginBottom: 14, cursor: 'pointer', color: '#7C674E', fontSize: 12 },
  filterRow: { display: 'flex', gap: 10, marginBottom: 16 },
  filterSelect: { border: '0.5px solid #E6D7BE', borderRadius: 3, padding: '7px 12px', fontSize: 12, color: '#5A4632', background: '#FFFCF5', outline: 'none' },
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: '#5A4632' }}>
      <span
        onClick={() => onChange(!checked)}
        style={{
          width: 32, height: 18, borderRadius: 9, background: checked ? '#C3A063' : '#ccc',
          position: 'relative', display: 'inline-block', flexShrink: 0, transition: 'background .15s',
        }}
      >
        <span style={{
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: checked ? 16 : 2, transition: 'left .15s',
        }} />
      </span>
      {label}
    </label>
  );
}

const EMPTY: Omit<AdminProduct, 'id' | 'createdAt'> = {
  categorySlug: 'carving-sofas', name: '', description: '', price: '', image: '', featured: false, visible: true,
};

export function ProductsPanel({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filter === 'all' ? products : products.filter((p) => p.categorySlug === filter);

  function openAdd() {
    setForm(EMPTY);
    setPreview('');
    setEditing(null);
    setIsNew(true);
  }

  function openEdit(p: AdminProduct) {
    setForm({ categorySlug: p.categorySlug, name: p.name, description: p.description, price: p.price, image: p.image, featured: p.featured, visible: p.visible });
    setPreview(p.image);
    setEditing(p);
    setIsNew(false);
  }

  function closeModal() { setEditing(null); setIsNew(false); }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, _file: file } as typeof f & { _file: File }));
  }

  async function handleSave() {
    setSaving(true);
    let imageUrl = form.image;

    const anyForm = form as typeof form & { _file?: File };
    if (anyForm._file) {
      const fd = new FormData();
      fd.append('file', anyForm._file);
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      const upData = await up.json();
      imageUrl = upData.url;
    }

    const payload = { ...form, image: imageUrl };
    delete (payload as Record<string, unknown>)._file;

    if (isNew) {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
    } else if (editing) {
      const res = await fetch(`/api/products/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
    }
    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  async function toggleField(product: AdminProduct, field: 'visible' | 'featured', value: boolean) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  }

  const catName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div>
      <div style={S.header}>
        <div style={S.title}>Products</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select style={S.filterSelect} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <button style={S.addBtn} onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      <div style={S.count}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>

      <div style={S.grid}>
        {filtered.map((p) => (
          <div key={p.id} style={{ ...S.card, opacity: p.visible ? 1 : 0.55 }}>
            {p.image
              ? <img src={p.image} alt={p.name} style={S.img} />
              : <div style={S.imgPlaceholder}>No image</div>
            }
            <div style={S.body}>
              <div style={S.catLabel}>{catName(p.categorySlug)}</div>
              <div style={S.name}>{p.name}</div>
              <div style={S.desc}>{p.description}</div>
              {p.price && <div style={S.price}>{p.price}</div>}
              <div style={S.toggleRow}>
                <Toggle checked={p.visible} onChange={(v) => toggleField(p, 'visible', v)} label="Visible" />
                <Toggle checked={p.featured} onChange={(v) => toggleField(p, 'featured', v)} label="Featured" />
              </div>
              <div style={S.actions}>
                <button style={S.editBtn} onClick={() => openEdit(p)}>Edit</button>
                <button style={S.delBtn} onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                  {deleting === p.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isNew || editing) && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={S.modal}>
            <div style={S.modalTitle}>{isNew ? 'Add Product' : 'Edit Product'}</div>

            <label style={S.label}>Category</label>
            <select style={S.select} value={form.categorySlug} onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>

            <label style={S.label}>Product Name</label>
            <input style={S.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Maharaja Carved Sofa" />

            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the product..." />

            <label style={S.label}>Price (optional)</label>
            <input style={S.input} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. ₹1,20,000 or On Request" />

            <label style={S.label}>Product Image</label>
            {preview && (
              <img src={preview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
            )}
            <div style={S.uploadArea} onClick={() => fileRef.current?.click()}>
              Click to upload image
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
            </div>
            <input style={{ ...S.input, marginTop: -8 }} value={form.image} onChange={(e) => { setForm((f) => ({ ...f, image: e.target.value })); setPreview(e.target.value); }} placeholder="Or paste image URL" />

            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
              <Toggle checked={form.visible} onChange={(v) => setForm((f) => ({ ...f, visible: v }))} label="Visible on site" />
              <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured" />
            </div>

            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving || !form.name}>
                {saving ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
