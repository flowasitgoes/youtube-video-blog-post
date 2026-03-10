import { NextRequest, NextResponse } from "next/server";

/**
 * 將舊的 ?lang= 網址導向路徑式語系 URL：
 * / → /zh
 * /blog → /zh/blog
 * /blog/02 → /zh/blog/02
 * /blog?lang=en → /en/blog
 * /blog/02?lang=en → /en/blog/02
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const lang = searchParams.get("lang");
  const isEn = lang === "en";

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/zh", request.url));
  }
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    const path = pathname === "/blog" ? "" : pathname.slice(5);
    const target = isEn ? `/en/blog${path}` : `/zh/blog${path}`;
    return NextResponse.redirect(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog", "/blog/:path*"],
};
