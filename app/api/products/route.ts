import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import type { AdminProduct } from '@/types/admin';

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = (await request.json()) as Omit<AdminProduct, 'id' | 'createdAt'>;
  const products = getProducts();
  const product: AdminProduct = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  saveProducts(products);
  return NextResponse.json(product, { status: 201 });
}
