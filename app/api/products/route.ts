import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import type { AdminProduct } from '@/types/admin';

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = (await request.json()) as Omit<AdminProduct, 'id' | 'createdAt'>;
  const product = await createProduct(data);
  if (!product) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  return NextResponse.json(product, { status: 201 });
}
