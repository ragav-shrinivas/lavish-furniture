export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory } from '@/lib/categories';
import { getCollection } from '@/lib/collections';
import { getGalleryImages } from '@/lib/gallery';
import { getProductsByCategory } from '@/lib/data-store';
import { CategoryView } from '@/components/sections/CategoryView';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, categoryJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/config';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  // Metadata stays on canonical code data (title/description are SEO-stable).
  const cat = getCategory(params.slug);
  if (!cat) return { title: 'Collection' };

  const title = `${cat.name} in Chennai`;
  const description = `${cat.description} Explore ${cat.name.toLowerCase()} at Lavish Furniture — a 30,000 sq.ft luxury showroom in Velachery, Chennai. Visit us or enquire on WhatsApp.`;
  const path = `/collections/${cat.slug}`;

  return {
    title,
    description,
    keywords: [
      `${cat.name} Chennai`,
      `${cat.name} Velachery`,
      `buy ${cat.name.toLowerCase()} Chennai`,
      `luxury ${cat.name.toLowerCase()}`,
      ...siteConfig.keywords,
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${cat.name} — ${siteConfig.name}`,
      description,
      url: path,
      type: 'website',
      images: [siteConfig.ogImage],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = await getCollection(params.slug);
  if (!cat) notFound();

  const [images, adminProducts] = await Promise.all([
    getGalleryImages(cat.slug),
    getProductsByCategory(cat.slug),
  ]);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: siteConfig.url },
    { name: 'Collections', url: `${siteConfig.url}/#categories` },
    { name: cat.name, url: `${siteConfig.url}/collections/${cat.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumb, categoryJsonLd(cat)]} />
      <CategoryView category={cat} images={images} adminProducts={adminProducts} />
    </>
  );
}
