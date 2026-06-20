import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }
  const token = process.env.ADMIN_SESSION_TOKEN!;
  const response = NextResponse.json({ success: true });
  response.cookies.set('lavish_admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('lavish_admin');
  return response;
}
