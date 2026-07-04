import { NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import type { AdminReview } from '@/types/admin';

export async function GET() {
  return NextResponse.json(await getReviews());
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = (await request.json()) as Omit<AdminReview, 'id' | 'createdAt'>;
  const review = await createReview(data);
  if (!review) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  return NextResponse.json(review, { status: 201 });
}
