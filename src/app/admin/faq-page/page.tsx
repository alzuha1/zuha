import "./faq-page.css"; // تحميل تنسيقات لوحة إدارة FAQ الخاصة بهذه الصفحة فقط.
import { cookies } from "next/headers"; // قراءة كوكي جلسة الأدمن من السيرفر.
import { redirect } from "next/navigation"; // إعادة توجيه غير المصرح لهم إلى صفحة الدخول.
import { supabaseServer } from "@/lib/supabase-server"; // إنشاء عميل Supabase server-side آمن.
import FaqPageEditor from "./faq-page-editor"; // استيراد محرر FAQ التفاعلي.

export const dynamic = "force-dynamic"; // منع الكاش الثابت لأن صفحة الأدمن يجب أن تقرأ أحدث بيانات دائمًا.

type FaqPageAdminRecord = { // تعريف شكل السجل الذي سيمرر إلى محرر FAQ.
  slug: string; // معرف الصفحة داخل جدول pages.
  title_ar: string; // عنوان الصفحة بالعربية.
  title_en: string; // عنوان الصفحة بالإنجليزية.
  content_ar: string; // ملخص الصفحة بالعربية.
  content_en: string; // ملخص الصفحة بالإنجليزية.
  is_published: boolean; // حالة النشر الحالية.
  page_type: string | null; // نوع الصفحة داخل النظام إن وجد.
  sections_json: unknown; // محتوى الأقسام، يطبّعه محرر العميل لاحقًا.
}; // نهاية تعريف سجل FAQ.

function getAdminCookieNames() { // دالة تجمع أسماء الكوكي المقبولة للأدمن.
  const envCookie = process.env.ADMIN_COOKIE?.trim(); // قراءة اسم الكوكي من البيئة إن كان موجودًا.
  return Array.from(new Set([envCookie, "admin_session", "zuha_admin"].filter(Boolean) as string[])); // إرجاع قائمة بدون تكرار.
} // نهاية getAdminCookieNames.

async function isAdminAuthorized() { // دالة تتحقق من وجود جلسة أدمن.
  const cookieStore: any = await Promise.resolve(cookies() as any); // الحصول على مخزن الكوكيز بطريقة متوافقة مع Next.
  const names = getAdminCookieNames(); // جلب كل أسماء الكوكي المقبولة.
  return names.some((name) => Boolean(cookieStore?.get?.(name)?.value)); // السماح إذا وجد أي كوكي جلسة صالح.
} // نهاية isAdminAuthorized.

function fallbackFaqPage(): FaqPageAdminRecord { // دالة fallback حتى لا تنهار اللوحة إذا لم يرجع السجل من Supabase.
  return { // بداية السجل الافتراضي.
    slug: "faq", // slug ثابت لصفحة FAQ.
    title_ar: "الأسئلة الشائعة", // عنوان عربي افتراضي.
    title_en: "FAQ", // عنوان إنجليزي افتراضي.
    content_ar: "إدارة محتوى صفحة الأسئلة الشائعة من لوحة التحكم.", // ملخص عربي افتراضي.
    content_en: "Manage the FAQ page content from the admin dashboard.", // ملخص إنجليزي افتراضي.
    is_published: true, // جعلها منشورة افتراضيًا حتى لا تخفي الصفحة خطأً.
    page_type: "faq", // نوع الصفحة.
    sections_json: null, // يترك التطبيع للمحرر.
  }; // نهاية السجل الافتراضي.
} // نهاية fallbackFaqPage.

async function getFaqPage(): Promise<FaqPageAdminRecord> { // دالة تجلب سجل FAQ من قاعدة البيانات.
  try { // بدء كتلة حماية من أخطاء Supabase.
    const supabase = supabaseServer(); // إنشاء عميل Supabase للـ server.
    const { data, error } = await supabase // تنفيذ استعلام قاعدة البيانات.
      .from("pages") // جدول الصفحات العام.
      .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json") // الأعمدة المطلوبة فقط.
      .eq("slug", "faq") // جلب صفحة FAQ فقط.
      .maybeSingle(); // إرجاع سجل واحد أو null.

    if (error) { // فحص خطأ Supabase.
      console.error("Admin FAQ fetch error:", error); // تسجيل الخطأ للديبغ.
      return fallbackFaqPage(); // الرجوع إلى fallback آمن.
    } // نهاية فحص الخطأ.

    if (!data) { // إذا لم توجد صفحة FAQ في جدول pages.
      return fallbackFaqPage(); // استخدام fallback آمن.
    } // نهاية فحص عدم وجود البيانات.

    return { // إرجاع السجل بعد سد القيم الناقصة.
      slug: String(data.slug || "faq"), // تطبيع slug.
      title_ar: String(data.title_ar || "الأسئلة الشائعة"), // تطبيع العنوان العربي.
      title_en: String(data.title_en || "FAQ"), // تطبيع العنوان الإنجليزي.
      content_ar: String(data.content_ar || ""), // تطبيع الملخص العربي.
      content_en: String(data.content_en || ""), // تطبيع الملخص الإنجليزي.
      is_published: typeof data.is_published === "boolean" ? data.is_published : true, // تطبيع حالة النشر.
      page_type: data.page_type ? String(data.page_type) : "faq", // تطبيع نوع الصفحة.
      sections_json: data.sections_json ?? null, // تمرير sections_json كما هو للمحرر.
    }; // نهاية السجل.
  } catch (error) { // التقاط أي خطأ غير متوقع.
    console.error("Admin FAQ page crashed while fetching:", error); // تسجيل الخطأ.
    return fallbackFaqPage(); // الرجوع إلى fallback آمن.
  } // نهاية try/catch.
} // نهاية getFaqPage.

export default async function AdminFaqPage() { // مكوّن صفحة إدارة FAQ من جهة السيرفر.
  const authorized = await isAdminAuthorized(); // التحقق من صلاحية الأدمن.
  if (!authorized) { // إذا لا توجد جلسة أدمن.
    redirect("/admin/login?next=/admin/faq-page"); // إعادة التوجيه لتسجيل الدخول.
  } // نهاية شرط الحماية.

  const initialItem = await getFaqPage(); // جلب السجل الأولي للصفحة.
  return <FaqPageEditor initialItem={initialItem as any} />;  // تمرير السجل إلى محرر العميل.
} // نهاية صفحة AdminFaqPage.
