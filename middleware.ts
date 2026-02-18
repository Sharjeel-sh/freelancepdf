import { NextRequest, NextResponse } from 'next/server';

/**
 * In production, this rewrites `name.freelancepdf.site` to `/p/name`.
 * For local dev, routes still work via `/p/[subdomain]`.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'freelancepdf.site';

  if (host.endsWith(appDomain) && host !== appDomain) {
    const subdomain = host.replace(`.${appDomain}`, '');
    const url = req.nextUrl.clone();
    url.pathname = `/p/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
