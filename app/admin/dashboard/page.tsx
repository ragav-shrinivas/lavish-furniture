export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getProducts, getReviews, getSiteContent } from '@/lib/data-store';
import { getCollections } from '@/lib/collections';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default async function DashboardPage() {
  if (!isAdminAuthenticated()) redirect('/admin');

  const [products, reviews, content, collections] = await Promise.all([
    getProducts(),
    getReviews(),
    getSiteContent(),
    getCollections(),
  ]);

  return (
    <AdminDashboard
      products={products}
      reviews={reviews}
      content={content}
      collections={collections}
    />
  );
}
