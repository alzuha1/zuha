import { cookies } from "next/headers";
// نستورد cookies لقراءة جلسة الأدمن من جهة السيرفر قبل عرض الصفحة.

import { redirect } from "next/navigation";
// نستورد redirect لإرسال المستخدم غير المصرح له إلى صفحة تسجيل الدخول.

import { supabaseServer } from "@/lib/supabase-server";
// نستورد عميل Supabase السيرفري حتى نجلب سجل صفحة الخدمات من جدول pages.

import "./services-page.css";
// نستورد ملف تنسيق لوحة خدمات الأدمن.

import ServicesPageEditor, { type ServicesPageAdminRecord } from "./services-page-editor";
// نستورد محرر صفحة الخدمات ونوع السجل الذي يتوقعه المحرر.

export const dynamic = "force-dynamic";
// نجعل صفحة الأدمن ديناميكية لأن بياناتها يجب أن تأتي مباشرة من قاعدة البيانات والجلسة.

function createFallbackServicesPage(): ServicesPageAdminRecord {
  // ننشئ سجلًا احتياطيًا آمنًا إذا تعذر جلب البيانات من Supabase.
  return {
    slug: "services",
    title_ar: "الخدمات",
    title_en: "Services",
    content_ar: "منظومة خدمات عقارية تنفيذية متقدمة.",
    content_en: "An advanced executive real-estate service platform.",
    is_published: true,
    page_type: "services",
    sections_json: null,
  };
}

async function assertAdminAccess() {
  // نتحقق من وجود كوكي الأدمن قبل عرض لوحة التحكم.
  const cookieStore = await cookies();
  // نقرأ كوكيز الطلب الحالي من السيرفر.

  const envCookieName = process.env.ADMIN_COOKIE?.trim();
  // نقرأ اسم كوكي الأدمن من متغيرات البيئة إن كان مضبوطًا.

  const cookieNames = [envCookieName, "admin_session", "zuha_admin"].filter(
    (name): name is string => Boolean(name)
  );
  // نجهز قائمة أسماء محتملة للكوكي حتى نراعي الإعدادات القديمة والجديدة.

  const hasAdminCookie = cookieNames.some((name) => {
    // نفحص هل يوجد أي كوكي صالح من الأسماء المعروفة.
    const value = cookieStore.get(name)?.value;
    // نقرأ قيمة الكوكي إن وجدت.
    return Boolean(value);
    // نعتبر وجود القيمة دليل جلسة؛ تحقق كلمة المرور يتم في API login.
  });

  if (!hasAdminCookie) {
    // إذا لا توجد جلسة أدمن نعيد المستخدم إلى تسجيل الدخول.
    redirect("/admin/login?next=/admin/services-page");
  }
}

async function getServicesPage(): Promise<ServicesPageAdminRecord> {
  // نجلب سجل صفحة services من قاعدة البيانات.
  const fallback = createFallbackServicesPage();
  // نجهز fallback مسبقًا حتى لا تنكسر لوحة الأدمن عند أي خطأ.

  try {
    // نحاول الاتصال بقاعدة البيانات.
    const supabase = supabaseServer();
    // ننشئ عميل Supabase السيرفري.

    const { data, error } = await supabase
      .from("pages")
      .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
      .eq("slug", "services")
      .maybeSingle();
    // نطلب سجل صفحة الخدمات فقط من جدول pages.

    if (error) {
      // إذا رجع خطأ من Supabase نسجله ونرجع fallback.
      console.error("Admin services page fetch error:", error);
      return fallback;
    }

    if (!data) {
      // إذا لا يوجد سجل services نرجع fallback حتى تبقى اللوحة قابلة للفتح.
      return fallback;
    }

    return {
      slug: typeof data.slug === "string" ? data.slug : fallback.slug,
      title_ar: typeof data.title_ar === "string" ? data.title_ar : fallback.title_ar,
      title_en: typeof data.title_en === "string" ? data.title_en : fallback.title_en,
      content_ar: typeof data.content_ar === "string" ? data.content_ar : fallback.content_ar,
      content_en: typeof data.content_en === "string" ? data.content_en : fallback.content_en,
      is_published:
        typeof data.is_published === "boolean" ? data.is_published : fallback.is_published,
      page_type: typeof data.page_type === "string" ? data.page_type : fallback.page_type,
      sections_json:
        data.sections_json && typeof data.sections_json === "object"
          ? (data.sections_json as ServicesPageAdminRecord["sections_json"])
          : fallback.sections_json,
    };
    // نعيد السجل بشكل متوافق مع محرر الخدمات، مع حماية من القيم الناقصة.
  } catch (error) {
    // إذا حدث استثناء غير متوقع نرجع fallback ونمنع سقوط صفحة الأدمن.
    console.error("Admin services page crashed while fetching:", error);
    return fallback;
  }
}

export default async function AdminServicesPage() {
  // الصفحة الرئيسية للوحة إدارة صفحة الخدمات.
  await assertAdminAccess();
  // نمنع الوصول قبل التحقق من جلسة الأدمن.

  const initialItem = await getServicesPage();
  // نجلب السجل الأولي الذي سيبدأ منه محرر Client Component.

  return <ServicesPageEditor initialItem={initialItem} />;
  // نمرر السجل إلى محرر الخدمات التفاعلي.
}
