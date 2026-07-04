import { NextResponse } from 'next/server';
import { updateReview, deleteReview } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const updated = await updateReview(params.id, data);
  if (!updated) return NextResponse.json({ error: 'Not found or storage error' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = await deleteReview(params.id);
  if (!ok) return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  return NextResponse.json({ success: true });
}
