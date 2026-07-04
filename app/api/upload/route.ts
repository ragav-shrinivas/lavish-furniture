import { NextResponse } from 'next/server';
import { getSupabase, STORAGE_BUCKET } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/** Uploads an admin image to Supabase Storage and returns its public URL. */
export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const filename = `${crypto.randomUUID()}.${ext || 'jpg'}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(filename, buffer, {
    contentType: file.type || 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
