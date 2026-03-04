import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read JWT from cookie directly (avoids auth() basePath issues)
  const cookieName = req.cookies.get('authjs.session-token')
    ? 'authjs.session-token'
    : '__Secure-authjs.session-token';
  const tokenStr = req.cookies.get(cookieName)?.value;

  let role: string | undefined;
  let isLoggedIn = false;

  if (tokenStr) {
    try {
      const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? '';
      const token = await decode({ token: tokenStr, secret, salt: cookieName });
      isLoggedIn = !!token;
      role = (token as any)?.role;
    } catch {
      // invalid token → treat as not logged in
    }
  }

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/spark-group-portal/auth/signin', req.url));
  }
  if ((pathname.startsWith('/mypage') || pathname.startsWith('/reserve')) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/spark-group-portal/auth/signin?callbackUrl=${callbackUrl}`, req.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/mypage/:path*', '/reserve/:path*'],
};
