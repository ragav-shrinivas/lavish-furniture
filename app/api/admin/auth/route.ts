import { NextResponse } from 'next/server';
import { ADMIN_SESSION_VALUE } from '@/lib/admin-auth';

/** No password gate — reachable only via the hidden EVO9 trigger. */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('lavish_admin', ADMIN_SESSION_VALUE, {
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
