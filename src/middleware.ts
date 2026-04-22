import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// استيراد أدوات الـ middleware

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // استخراج المسار الحالي من الطلب

  const isAdminArea = pathname.startsWith("/admin");
  // هل المستخدم يحاول دخول لوحة الأدمن؟

  const isAdminLogin = pathname.startsWith("/admin/login");
  // هل هو أصلًا في صفحة تسجيل دخول الأدمن؟

  
const adminCookieName = process.env.ADMIN_COOKIE?.trim() || "zuha_admin";
// قراءة اسم كوكي الأدمن من البيئة

const adminSession = req.cookies.get(adminCookieName)?.value;
// جلب الجلسة بالاسم الصحيح


  if (isAdminArea && !isAdminLogin && !adminSession) {
    // إذا حاول شخص دخول /admin وليس لديه جلسة أدمن
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
    // نحوله مباشرة إلى صفحة تسجيل الدخول
  }

  return NextResponse.next();
  // غير ذلك نسمح بمرور الطلب
}

export const config = {
  matcher: ["/admin/:path*"],
};
// تطبيق الحماية على كل مسارات الأدمن