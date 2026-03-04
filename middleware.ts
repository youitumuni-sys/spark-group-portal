import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/spark-group-portal/auth/signin', req.url));
  }
  if ((pathname.startsWith('/mypage') || pathname.startsWith('/reserve')) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/spark-group-portal/auth/signin?callbackUrl=${callbackUrl}`, req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/mypage/:path*', '/reserve/:path*'],
};
