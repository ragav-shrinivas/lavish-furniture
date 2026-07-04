import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/data-store';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const ok = await saveSiteContent(data);
  if (!ok) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  return NextResponse.json({ success: true });
}
