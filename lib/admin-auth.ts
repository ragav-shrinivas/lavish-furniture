import { cookies } from 'next/headers';

/**
 * No password: access is gated only by the hidden EVO9 trigger (footer
 * long-press/5-click) landing on /admin, which sets this cookie. Not a
 * secret — just distinguishes "arrived via the trigger" from a cold URL hit.
 */
export const ADMIN_SESSION_VALUE = 'lavish-admin-session';

export function isAdminAuthenticated(): boolean {
  return cookies().get('lavish_admin')?.value === ADMIN_SESSION_VALUE;
}
