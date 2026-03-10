import { NextRequest, NextResponse } from "next/server";

/**
 * 從 Accept-Language 判斷是否偏好中文（任一 zh 變體皆視為中文）
 */
function prefersChinese(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const first = acceptLanguage.split(",")[0]?.trim().toLowerCase();
  const code = first?.split("-")[0] ?? "";
  return code === "zh";
}

/**
 * - 根路徑 /、/blog、/blog/xx：依瀏覽器 Accept-Language 導向 /zh 或 /en（偏好中文 → zh，否則 → en）
 * - 若有 ?lang=en 則強制英文；?lang=zh 則強制中文
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const langParam = searchParams.get("lang");
  const acceptLanguage = request.headers.get("accept-language");
  const preferZh = prefersChinese(acceptLanguage);

  const resolvedLang = langParam === "en" ? "en" : langParam === "zh" ? "zh" : preferZh ? "zh" : "en";

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${resolvedLang}`, request.url));
  }
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    const path = pathname === "/blog" ? "" : pathname.slice(5);
    return NextResponse.redirect(new URL(`/${resolvedLang}/blog${path}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog", "/blog/:path*"],
};
