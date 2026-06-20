import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  return NextResponse.json(getSiteContent());
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  saveSiteContent(data);
  return NextResponse.json({ success: true });
}
