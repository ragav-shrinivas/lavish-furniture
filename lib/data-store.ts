import 'server-only';
import type { AdminProduct, AdminReview, SiteContent } from '@/types/admin';
import { getSupabase } from '@/lib/supabase';

/* ============================================================
   Data store — Supabase-backed with safe code-default fallbacks.
   Every read degrades to a sensible default when Supabase is
   unconfigured or unreachable, so the site never crashes.
============================================================ */

const DEFAULT_CONTENT: SiteContent = {
  whatsapp: '919384720033',
  email: 'lavishfurn@gmail.com',
  instagram: 'https://www.instagram.com/lavishfurniturechennai',
  facebook: 'https://share.google/zWT0EGSHPLF5nu2iH',
  googleReviewLink: 'https://maps.app.goo.gl/e7fbXZQyTBaMPuze8',
  address: 'Velachery Main Road, Near Phoenix Marketcity, Velachery, Chennai - 600042',
  heroHeadline: 'Crafting Luxury Living',
  heroSubtitle:
    'Furniture designed for sophisticated modern lifestyles, presented in a 30,000 sq.ft luxury showroom.',
  categoryDescriptions: {},
};

/* ── row <-> app mappers ───────────────────────────────────── */
type ProductRow = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  featured: boolean;
  visible: boolean;
  created_at: string;
};

function toProduct(r: ProductRow): AdminProduct {
  return {
    id: r.id,
    categorySlug: r.category_slug,
    name: r.name,
    description: r.description,
    price: r.price,
    image: r.image,
    featured: r.featured,
    visible: r.visible,
    createdAt: r.created_at,
  };
}

type ReviewRow = {
  id: string;
  name: string;
  text: string;
  rating: number;
  photo: string;
  location: string;
  visible: boolean;
  created_at: string;
};

function toReview(r: ReviewRow): AdminReview {
  return {
    id: r.id,
    name: r.name,
    text: r.text,
    rating: r.rating,
    photo: r.photo,
    location: r.location,
    visible: r.visible,
    createdAt: r.created_at,
  };
}

/* ── Products ──────────────────────────────────────────────── */
export async function getProducts(): Promise<AdminProduct[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('lavish_products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as ProductRow[]).map(toProduct);
}

export async function getProductsByCategory(slug: string): Promise<AdminProduct[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('lavish_products')
    .select('*')
    .eq('category_slug', slug)
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as ProductRow[]).map(toProduct);
}

export async function createProduct(
  input: Omit<AdminProduct, 'id' | 'createdAt'>,
): Promise<AdminProduct | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('lavish_products')
    .insert({
      category_slug: input.categorySlug,
      name: input.name,
      description: input.description,
      price: input.price,
      image: input.image,
      featured: input.featured,
      visible: input.visible,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return toProduct(data as ProductRow);
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<AdminProduct, 'id' | 'createdAt'>>,
): Promise<AdminProduct | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const row: Record<string, unknown> = {};
  if (patch.categorySlug !== undefined) row.category_slug = patch.categorySlug;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.featured !== undefined) row.featured = patch.featured;
  if (patch.visible !== undefined) row.visible = patch.visible;
  const { data, error } = await sb
    .from('lavish_products')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return null;
  return toProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('lavish_products').delete().eq('id', id);
  return !error;
}

/* ── Reviews ───────────────────────────────────────────────── */
export async function getReviews(): Promise<AdminReview[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('lavish_reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as ReviewRow[]).map(toReview);
}

export async function createReview(
  input: Omit<AdminReview, 'id' | 'createdAt'>,
): Promise<AdminReview | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('lavish_reviews')
    .insert({
      name: input.name,
      text: input.text,
      rating: input.rating,
      photo: input.photo,
      location: input.location,
      visible: input.visible,
    })
    .select('*')
    .single();
  if (error || !data) return null;
  return toReview(data as ReviewRow);
}

export async function updateReview(
  id: string,
  patch: Partial<Omit<AdminReview, 'id' | 'createdAt'>>,
): Promise<AdminReview | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.text !== undefined) row.text = patch.text;
  if (patch.rating !== undefined) row.rating = patch.rating;
  if (patch.photo !== undefined) row.photo = patch.photo;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.visible !== undefined) row.visible = patch.visible;
  const { data, error } = await sb
    .from('lavish_reviews')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return null;
  return toReview(data as ReviewRow);
}

export async function deleteReview(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('lavish_reviews').delete().eq('id', id);
  return !error;
}

/* ── Site content (single row) ─────────────────────────────── */
type ContentRow = {
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  google_review_link: string | null;
  hero_headline: string | null;
  hero_subtitle: string | null;
};

export async function getSiteContent(): Promise<SiteContent> {
  const sb = getSupabase();
  if (!sb) return DEFAULT_CONTENT;
  const { data, error } = await sb
    .from('lavish_content')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_CONTENT;
  const r = data as ContentRow;
  return {
    whatsapp: r.whatsapp ?? DEFAULT_CONTENT.whatsapp,
    email: r.email ?? DEFAULT_CONTENT.email,
    address: r.address ?? DEFAULT_CONTENT.address,
    instagram: r.instagram ?? DEFAULT_CONTENT.instagram,
    facebook: r.facebook ?? DEFAULT_CONTENT.facebook,
    googleReviewLink: r.google_review_link ?? DEFAULT_CONTENT.googleReviewLink,
    heroHeadline: r.hero_headline ?? DEFAULT_CONTENT.heroHeadline,
    heroSubtitle: r.hero_subtitle ?? DEFAULT_CONTENT.heroSubtitle,
    categoryDescriptions: {},
  };
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('lavish_content').upsert({
    id: 1,
    whatsapp: content.whatsapp,
    email: content.email,
    address: content.address,
    instagram: content.instagram,
    facebook: content.facebook,
    google_review_link: content.googleReviewLink,
    hero_headline: content.heroHeadline,
    hero_subtitle: content.heroSubtitle,
    updated_at: new Date().toISOString(),
  });
  return !error;
}
