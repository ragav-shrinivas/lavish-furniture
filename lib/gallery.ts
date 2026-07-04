import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { getProductsByCategory } from './data-store';

/**
 * Web-accessible image paths for a category's gallery.
 * Admin-managed product images (Supabase) come first, followed by any
 * legacy files committed to public/products/<slug>/. CategoryView dedupes
 * product images so they don't appear twice.
 */
export async function getGalleryImages(slug: string): Promise<string[]> {
  const adminImages = (await getProductsByCategory(slug))
    .filter((p) => p.image)
    .map((p) => p.image);

  let fileImages: string[] = [];
  try {
    const dir = path.join(process.cwd(), 'public', 'products', slug);
    fileImages = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/products/${slug}/${f}`);
  } catch {
    fileImages = [];
  }

  return [...adminImages, ...fileImages];
}
