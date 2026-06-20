import fs from 'node:fs';
import path from 'node:path';
import { getProductsByCategory } from './data-store';

/**
 * Returns web-accessible image paths for a category.
 * Admin-uploaded product images come first, followed by any files
 * dropped into public/products/<slug>/ (legacy folder method still works).
 */
export function getGalleryImages(slug: string): string[] {
  // Admin-uploaded product images (from data/products.json)
  const adminImages = getProductsByCategory(slug)
    .filter((p) => p.image)
    .map((p) => p.image);

  // File-based images from public/products/<slug>/
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
