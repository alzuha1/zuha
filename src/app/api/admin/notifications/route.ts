// نستورد NextResponse لبناء ردود API بشكل رسمي في Next.js
import { NextResponse } from "next/server";

// نستورد دالة التحقق من صلاحية الأدمن لحماية هذا الراوت
import { ensureAdmin } from "@/lib/admin-guard";

// نستورد عميل Supabase الخاص بالسيرفر للوصول إلى قاعدة البيانات
import { supabaseServer } from "@/lib/supabase-server";

// نجبر هذا الراوت أن يكون dynamic دائمًا
// حتى لا يحصل caching غير مرغوب فيه في بيانات الإشعارات
export const dynamic = "force-dynamic";

// نعرّف شكل سجل الإشعار الإداري كما نتوقعه من قاعدة البيانات
type AdminNotificationRow = {
  // المعرّف الفريد للتنبيه
  id: string;

  // نوع التنبيه مثل consultation_request
  type: string;

  // عنوان التنبيه
  title: string;

  // نص رسالة التنبيه
  message: string;

  // الرابط الذي يذهب إليه المستخدم عند فتح التنبيه
  link: string | null;

  // هل تم قراءة التنبيه أم لا
  is_read: boolean;

  // معرّف السجل المرتبط بهذا التنبيه إن وجد
  reference_id: string | null;

  // تاريخ إنشاء التنبيه
  created_at: string;
};

// دالة GET لجلب قائمة الإشعارات
export async function GET(req: Request) {
  try {
    // أولًا: نتحقق أن المستخدم الحالي أدمن
    const admin = await ensureAdmin();

    // إذا لم يكن أدمن، نرجع الرد الجاهز من admin guard ونوقف التنفيذ
    if (!admin.ok) {
      return admin.response;
    }

    // ننشئ عميل Supabase على مستوى السيرفر
    const supabase = supabaseServer();

    // نقرأ بارامترات الرابط الحالية من الـ request
    const { searchParams } = new URL(req.url);

    // نقرأ قيمة limit من الرابط
    const limitParam = searchParams.get("limit");

    // نحوّل limit إلى رقم آمن ضمن نطاق 1 إلى 100
    const limit = Math.min(Math.max(Number(limitParam || 10) || 10, 1), 100);

    // نقرأ خيار unread_only من الرابط
    const unreadOnly = searchParams.get("unread_only") === "true";

    // نبني الاستعلام الأساسي لجلب الإشعارات من جدول admin_notifications
    let query = supabase
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    // إذا طلبنا فقط التنبيهات غير المقروءة، نضيف هذا الفلتر
    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    // ننفذ الاستعلام النهائي
    const { data, error } = await query;

    // إذا حصل خطأ أثناء الجلب نرجع رسالة فشل مناسبة
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // ننفذ استعلامًا مستقلًا لحساب عدد الإشعارات غير المقروءة بدقة
    const { count: unreadCount, error: unreadCountError } = await supabase
      .from("admin_notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    // إذا فشل عدّ غير المقروء لا نكسر الراوت بالكامل
    // لكن نطبع الخطأ في اللوق لمراجعته لاحقًا
    if (unreadCountError) {
      console.error(
        "ADMIN_NOTIFICATIONS_UNREAD_COUNT_ERROR",
        unreadCountError
      );
    }

    // نرجع الاستجابة النهائية بنجاح
    return NextResponse.json({
      // علم النجاح
      ok: true,

      // قائمة الإشعارات
      notifications: (data ?? []) as AdminNotificationRow[],

      // عدد غير المقروء
      unreadCount: unreadCount ?? 0,
    });
  } catch (error) {
    // أي خطأ غير متوقع على مستوى الراوت كله
    return NextResponse.json(
      {
        // علم الفشل
        ok: false,

        // رسالة الخطأ
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

// دالة PATCH لتحديد جميع الإشعارات غير المقروءة كمقروءة
export async function PATCH() {
  try {
    // أولًا: نتحقق أن المستخدم الحالي أدمن
    const admin = await ensureAdmin();

    // إذا لم يكن أدمن، نرجع الرد الجاهز ونوقف التنفيذ
    if (!admin.ok) {
      return admin.response;
    }

    // ننشئ عميل Supabase على مستوى السيرفر
    const supabase = supabaseServer();

    // نحدث كل الإشعارات التي is_read فيها تساوي false
    const { error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    // إذا فشل التحديث نرجع رسالة خطأ مناسبة
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // إذا نجح التحديث نرجع رسالة نجاح
    return NextResponse.json({
      ok: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    // أي خطأ غير متوقع على مستوى PATCH كله
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}