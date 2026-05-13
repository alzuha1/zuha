import "./contact-messages.css";
// يستورد ملف التنسيق الخاص بصفحة إدارة رسائل التواصل.

import { cookies } from "next/headers";
// يستورد cookies من Next.js لقراءة كوكي تسجيل دخول الأدمن من السيرفر.

import { redirect } from "next/navigation";
// يستورد redirect لإعادة غير المصرح لهم إلى صفحة تسجيل الدخول.

import { supabaseServer } from "@/lib/supabase-server";
// يستورد عميل Supabase server-side حتى لا تظهر مفاتيح الخدمة في المتصفح.

import ContactMessagesClient, {
  type ContactMessageAdminRow,
} from "./contact-messages-client";
// يستورد واجهة العميل ونوع صف الرسالة الذي ستستقبله الواجهة.

export const dynamic = "force-dynamic";
// يمنع كاش الصفحة لأن رسائل التواصل يجب أن تكون حيّة دائمًا.

function getAdminCookieNames() {
  // يرجع قائمة أسماء كوكي الأدمن المقبولة لحماية التوافق مع إعداداتك السابقة.
  const envCookie = process.env.ADMIN_COOKIE?.trim();
  // يقرأ اسم الكوكي من متغير البيئة إذا كان مضبوطًا.

  return Array.from(
    new Set(
      [envCookie, "zuha_admin", "admin_session"].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
  // يعيد أسماء الكوكي بدون تكرار وبدون قيم فارغة.
}

async function isAdminAuthorized() {
  // يتحقق من وجود جلسة أدمن قبل عرض الرسائل.
  const cookieStore: any = await Promise.resolve(cookies() as any);
  // يقرأ الكوكيز بطريقة متوافقة مع نسخ Next.js المختلفة.

  const cookieNames = getAdminCookieNames();
  // يجهز كل أسماء الكوكي المقبولة.

  return cookieNames.some((cookieName) => {
    // يمر على أسماء الكوكي ويقبل أول كوكي موجود.
    const cookieValue = cookieStore?.get?.(cookieName)?.value;
    // يقرأ قيمة الكوكي الحالية.
    return Boolean(cookieValue);
    // يرجع true إذا كانت القيمة موجودة.
  });
}

export default async function AdminContactMessagesPage() {
  // صفحة السيرفر الرئيسية لإدارة رسائل التواصل.
  const authorized = await isAdminAuthorized();
  // يتحقق هل المستخدم أدمن أم لا.

  if (!authorized) {
    // إذا لا توجد جلسة أدمن.
    redirect("/admin/login?next=/admin/contact-messages");
    // يعيد المستخدم لصفحة الدخول مع حفظ الوجهة المطلوبة.
  }

  const supabase = supabaseServer();
  // ينشئ عميل Supabase الآمن من جهة السيرفر.

  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      "id, full_name, phone, email, message, status, admin_note, is_deleted, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(300);
  // يجلب أحدث 300 رسالة مع الحقول التي تحتاجها لوحة Inbox.

  if (error) {
    // إذا فشل الجلب لا نكسر صفحة الأدمن.
    console.error("Admin contact-messages fetch error:", error.message);
    // نسجل الخطأ في الطرفية للمراجعة.
  }

  const initialMessages: ContactMessageAdminRow[] = (data ?? []) as ContactMessageAdminRow[];
  // يحول البيانات القادمة من Supabase إلى النوع الذي تتوقعه واجهة العميل.

  return <ContactMessagesClient initialMessages={initialMessages} />;
  // يعرض واجهة إدارة الرسائل ويمرر لها الرسائل الأولية.
}
