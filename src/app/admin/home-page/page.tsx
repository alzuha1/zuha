import "./home-page.css";
// استيراد CSS الخاص بلوحة Home Builder.

import { cookies } from "next/headers";
// قراءة الكوكيز للتحقق من جلسة الأدمن.

import { redirect } from "next/navigation";
// redirect لإرسال غير المصرح له إلى صفحة تسجيل الدخول.

import HomePageEditor from "./home-page-editor";
// محرر الصفحة الرئيسية التفاعلي.

export const dynamic = "force-dynamic";
// صفحة الأدمن يجب أن تكون ديناميكية دائمًا.

function adminCookieNames() {
  // دعم أكثر من اسم كوكي حتى لا نكسر تسجيل الدخول الحالي.
  const envCookie = process.env.ADMIN_COOKIE?.trim();

  return Array.from(
    new Set(
      [envCookie, "admin_session", "zuha_admin"].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
}

async function isAdminAuthorized() {
  // التحقق من وجود كوكي الأدمن.
  const cookieStore: any = await Promise.resolve(cookies() as any);

  return adminCookieNames().some((name) => Boolean(cookieStore?.get?.(name)?.value));
}

export default async function AdminHomePage() {
  // صفحة /admin/home-page.
  const authorized = await isAdminAuthorized();

  if (!authorized) {
    redirect("/admin/login?next=/admin/home-page");
  }

  return <HomePageEditor />;
}
