import { NextResponse } from 'next/server';
import { getReviews, saveReviews } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const reviews = getReviews();
  const idx = reviews.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  reviews[idx] = { ...reviews[idx], ...data };
  saveReviews(reviews);
  return NextResponse.json(reviews[idx]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const reviews = getReviews().filter((r) => r.id !== params.id);
  saveReviews(reviews);
  return NextResponse.json({ success: true });
}
