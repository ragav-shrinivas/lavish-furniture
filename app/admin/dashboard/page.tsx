export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getProducts, getReviews, getSiteContent } from '@/lib/data-store';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function DashboardPage() {
  if (!isAdminAuthenticated()) redirect('/admin');

  const products = getProducts();
  const reviews = getReviews();
  const content = getSiteContent();

  return <AdminDashboard products={products} reviews={reviews} content={content} />;
}
