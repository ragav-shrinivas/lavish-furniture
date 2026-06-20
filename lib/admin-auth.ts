import { cookies } from 'next/headers';

export function isAdminAuthenticated(): boolean {
  const token = cookies().get('lavish_admin')?.value;
  return !!token && token === process.env.ADMIN_SESSION_TOKEN;
}
