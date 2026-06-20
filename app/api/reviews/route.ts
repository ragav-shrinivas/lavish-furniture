import { NextResponse } from 'next/server';
import { getReviews, saveReviews } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import type { AdminReview } from '@/types/admin';

export async function GET() {
  return NextResponse.json(getReviews());
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = (await request.json()) as Omit<AdminReview, 'id' | 'createdAt'>;
  const reviews = getReviews();
  const review: AdminReview = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  saveReviews(reviews);
  return NextResponse.json(review, { status: 201 });
}
