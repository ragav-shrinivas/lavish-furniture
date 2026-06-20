import fs from 'node:fs';
import path from 'node:path';
import type { AdminProduct, AdminReview, SiteContent } from '@/types/admin';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
export const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function ensureUploadsDir() {
  ensureDir(UPLOADS_DIR);
}

function read<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function write(file: string, data: unknown) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

export function getProducts(): AdminProduct[] {
  return read<AdminProduct[]>(PRODUCTS_FILE, []);
}

export function saveProducts(products: AdminProduct[]) {
  write(PRODUCTS_FILE, products);
}

export function getProductsByCategory(slug: string): AdminProduct[] {
  return getProducts().filter((p) => p.categorySlug === slug && p.visible);
}

export function getFeaturedProducts(): AdminProduct[] {
  return getProducts().filter((p) => p.featured && p.visible);
}

export function getReviews(): AdminReview[] {
  return read<AdminReview[]>(REVIEWS_FILE, []);
}

export function saveReviews(reviews: AdminReview[]) {
  write(REVIEWS_FILE, reviews);
}

const DEFAULT_CONTENT: SiteContent = {
  whatsapp: '919384720033',
  email: 'lavishfurn@gmail.com',
  instagram: 'https://www.instagram.com/lavishfurniturechennai',
  facebook: 'https://share.google/zWT0EGSHPLF5nu2iH',
  googleReviewLink: 'https://maps.app.goo.gl/e7fbXZQyTBaMPuze8',
  address: 'Velachery Main Road, Near Phoenix Marketcity, Velachery, Chennai - 600042',
  heroHeadline: 'Crafting Luxury Living',
  heroSubtitle: 'Furniture designed for sophisticated modern lifestyles, presented in a 30,000 sq.ft luxury showroom.',
  categoryDescriptions: {},
};

export function getSiteContent(): SiteContent {
  return read<SiteContent>(CONTENT_FILE, DEFAULT_CONTENT);
}

export function saveSiteContent(content: SiteContent) {
  write(CONTENT_FILE, content);
}
