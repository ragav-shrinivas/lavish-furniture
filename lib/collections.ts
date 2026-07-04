import 'server-only';
import { categories, type Category } from '@/lib/categories';
import { getSupabase } from '@/lib/supabase';

/* ============================================================
   Collections — canonical order + defaults live in code
   (lib/categories.ts); the admin can override display fields
   (image, focal point, tag, name, tagline) via Supabase. This
   merges the two, always preserving the canonical 1–10 order.
   Slug, description, highlights and gradient stay code-owned.
============================================================ */

/** Fields the admin is allowed to override per collection. */
export type CollectionOverride = {
  slug: string;
  tag: string | null;
  name: string | null;
  tagline: string | null;
  image: string | null;
  focus: string | null;
};

type CollectionRow = CollectionOverride;

export async function getCollectionOverrides(): Promise<Record<string, CollectionRow>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from('lavish_collections').select('*');
  if (error || !data) return {};
  const map: Record<string, CollectionRow> = {};
  for (const row of data as CollectionRow[]) map[row.slug] = row;
  return map;
}

/** Canonical categories with any admin overrides applied. */
export async function getCollections(): Promise<Category[]> {
  const overrides = await getCollectionOverrides();
  return categories.map((c) => {
    const o = overrides[c.slug];
    if (!o) return c;
    return {
      ...c,
      tag: o.tag ?? c.tag,
      name: o.name ?? c.name,
      tagline: o.tagline ?? c.tagline,
      image: o.image ?? c.image,
      focus: o.focus ?? c.focus,
    };
  });
}

/** Single merged collection, or undefined if the slug is unknown. */
export async function getCollection(slug: string): Promise<Category | undefined> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug);
}

export type CollectionPatch = Partial<Pick<Category, 'tag' | 'name' | 'tagline' | 'image' | 'focus'>>;

/** Apply an admin edit to one collection's display fields. Returns the
 *  merged collection, or null if Supabase is unconfigured / the write failed. */
export async function updateCollectionOverride(
  slug: string,
  patch: CollectionPatch,
): Promise<Category | null> {
  const sb = getSupabase();
  if (!sb) return null;
  if (!categories.some((c) => c.slug === slug)) return null; // unknown slug

  const row: Record<string, unknown> = { slug, updated_at: new Date().toISOString() };
  if (patch.tag !== undefined) row.tag = patch.tag;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.tagline !== undefined) row.tagline = patch.tagline;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.focus !== undefined) row.focus = patch.focus;

  const { error } = await sb.from('lavish_collections').upsert(row, { onConflict: 'slug' });
  if (error) return null;
  return (await getCollection(slug)) ?? null;
}
