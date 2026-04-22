import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  const token = req.cookies.get(cookieName)?.value;

  // 1) حماية صفحات الأدمن
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (token === "1") return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) API content: GET للجميع / PUT للأدمن
  if (pathname.startsWith("/api/content")) {
    if (req.method === "GET") return NextResponse.next();
    if (token === "1") return NextResponse.next();
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  // 3) API site: GET للجميع / PUT للأدمن
  if (pathname.startsWith("/api/site")) {
    if (req.method === "GET") return NextResponse.next();
    if (token === "1") return NextResponse.next();
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  // 4) i18n: GET للجميع / PUT للأدمن
  if (pathname.startsWith("/api/i18n")) {
    if (req.method === "GET") return NextResponse.next();
    if (token === "1") return NextResponse.next();
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  // 5) media: أدمن فقط (GET/POST/DELETE)
  if (pathname.startsWith("/api/media")) {
    if (token === "1") return NextResponse.next();
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/site", "/api/i18n", "/api/media/:path*"],
};