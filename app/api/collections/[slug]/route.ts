import { NextResponse } from 'next/server';
import { updateCollectionOverride, type CollectionPatch } from '@/lib/collections';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const patch = (await request.json()) as CollectionPatch;
  const updated = await updateCollectionOverride(params.slug, patch);
  if (!updated) return NextResponse.json({ error: 'Unknown collection or storage error' }, { status: 400 });
  return NextResponse.json(updated);
}
