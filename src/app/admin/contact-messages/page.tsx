import "./contact-messages.css";
// استيراد CSS الخاص بواجهة إدارة رسائل التواصل

import { cookies } from "next/headers";
// قراءة الكوكيز الحالية لمعرفة هل الأدمن مسجل دخول أم لا

import { redirect } from "next/navigation";
// لإعادة توجيه المستخدم إذا لم يكن أدمن

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import ContactMessagesClient, {
  type ContactMessageAdminRow,
} from "./contact-messages-client";
// استيراد مكوّن العميل مع نوع الرسالة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى لا تعتمد على كاش قديم

async function isAdminAuthorized() {
  // هذه الدالة تتحقق من وجود كوكي الأدمن
  // اعتمدت هنا على وجود الكوكي فقط لأن هذا الأكثر توافقًا مع إعدادك الحالي
  // إذا كان عندك لاحقًا قيمة محددة للكوكي، يمكن تشديد الفحص هنا

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز بصيغة متوافقة مع مشروعك الحالي

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // اسم كوكي الأدمن من البيئة أو fallback افتراضي

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // محاولة قراءة قيمة الكوكي

  return Boolean(adminCookie);
  // إذا كانت القيمة موجودة نعتبر المستخدم أدمن
}

export default async function AdminContactMessagesPage() {
  // الصفحة الرئيسية لإدارة رسائل Contact

  const authorized = await isAdminAuthorized();
  // التحقق من صلاحية الأدمن

  if (!authorized) {
    redirect("/admin/login");
  }
  // إذا لم يكن أدمن نعيد توجيهه إلى صفحة تسجيل دخول الأدمن

  const supabase = supabaseServer();
  // إنشاء عميل Supabase

  const { data, error } = await supabase
    .from("contact_messages")
    .select(
      "id, full_name, phone, email, message, status, admin_note, is_deleted, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  // جلب آخر 200 رسالة بترتيب الأحدث أولًا

  if (error) {
    console.error("Admin contact-messages fetch error:", error.message);
  }
  // طباعة الخطأ في الطرفية إذا فشل الجلب، بدون إسقاط الصفحة

  const initialMessages: ContactMessageAdminRow[] = (data ?? []) as ContactMessageAdminRow[];
  // تجهيز البيانات لتمريرها إلى مكوّن العميل

  return <ContactMessagesClient initialMessages={initialMessages} />;
  // تمرير الرسائل الأولية إلى المكوّن العميل
}