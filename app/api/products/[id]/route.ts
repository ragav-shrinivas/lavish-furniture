import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products[idx] = { ...products[idx], ...data };
  saveProducts(products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const products = getProducts().filter((p) => p.id !== params.id);
  saveProducts(products);
  return NextResponse.json({ success: true });
}
