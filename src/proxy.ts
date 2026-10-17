import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['vi', 'en'] as const;
const DEFAULT_LOCALE = 'vi';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already starts with a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return;
  }

  // Check for saved preference in cookie, otherwise fallback to default
  const savedLocale = request.cookies.get('portfolio_language')?.value;
  const locale = savedLocale === 'en' || savedLocale === 'vi' ? savedLocale : DEFAULT_LOCALE;

  // Redirect to localized URL
  const targetPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = targetPath;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /api (API routes)
     * - /admin (Admin portal)
     * - /_next/static (static build files)
     * - /_next/image (image optimization files)
     * - Static asset files (containing dot like favicon.ico, images, uploads, etc.)
     */
    '/((?!api|admin|_next/static|_next/image|favicon|uploads|.*\\..*).*)',
  ],
};
