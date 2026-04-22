// نستورد NextResponse لبناء ردود API بطريقة رسمية داخل Next.js
import { NextResponse } from "next/server";

// نستورد عميل Supabase الخاص بالسيرفر للوصول إلى قاعدة البيانات
import { supabaseServer } from "@/lib/supabase-server";

// نستورد دالة إرسال البريد الإداري
import { sendAdminConsultationEmail } from "@/lib/send-admin-email";

// نجبر الراوت أن يكون dynamic دائمًا حتى لا يحصل caching غير مرغوب فيه
export const dynamic = "force-dynamic";

// نحدد اسم جدول طلبات الاستشارة في قاعدة البيانات
const CONSULTATION_TABLE = "consultation_requests";

// نحدد أنواع الاجتماعات المسموح بها فقط
const ALLOWED_MEETING_TYPES = new Set(["branch", "zoom", "phone"]);

// دالة مساعدة لتنظيف أي قيمة قادمة من body
// إذا كانت null أو undefined نرجع نصًا فارغًا
// وإذا كانت موجودة نحوّلها إلى string ونقص الفراغات
function safeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

// دالة للتحقق من البريد الإلكتروني بصيغة مناسبة
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// دالة للتحقق من صحة رقم الهاتف
function isValidPhone(phone: string): boolean {
  return /^[0-9+\-()\s]{7,20}$/.test(phone);
}

// دالة للتحقق من أن التاريخ صالح وليس يوم جمعة أو سبت
function isAllowedBusinessDate(dateValue: string): boolean {
  if (!dateValue) return false;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const day = date.getDay();

  return day !== 5 && day !== 6;
}

// دالة POST الرئيسية لاستقبال نموذج طلب الاستشارة
export async function POST(req: Request) {
  try {
    // نقرأ البيانات القادمة من الطلب
    const body = await req.json();

    // ننظف الحقول القادمة من المستخدم
    const fullName = safeText(body.fullName);
    const phone = safeText(body.phone);
    const email = safeText(body.email);
    const meetingType = safeText(body.meetingType);
    const meetingDate = safeText(body.meetingDate);
    const meetingTime = safeText(body.meetingTime);
    const notes = safeText(body.notes);

    // نتحقق من الاسم الكامل
    if (fullName.length < 3) {
      return NextResponse.json(
        {
          ok: false,
          message: "Full name is required and must be at least 3 characters",
        },
        { status: 400 }
      );
    }

    // نتحقق من الهاتف
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid phone number",
        },
        { status: 400 }
      );
    }

    // نتحقق من البريد الإلكتروني
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // نتحقق من نوع المقابلة
    if (!ALLOWED_MEETING_TYPES.has(meetingType)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid meeting type",
        },
        { status: 400 }
      );
    }

    // نتحقق من تاريخ المقابلة
    if (!isAllowedBusinessDate(meetingDate)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid meeting date",
        },
        { status: 400 }
      );
    }

    // نتحقق من وقت المقابلة
    if (!meetingTime) {
      return NextResponse.json(
        {
          ok: false,
          message: "Meeting time is required",
        },
        { status: 400 }
      );
    }

    // ننشئ عميل Supabase بعد نجاح التحقق من المدخلات
    const supabase = supabaseServer();

    // نحفظ طلب الاستشارة في الجدول
    const { data: consultation, error: consultationError } = await supabase
      .from(CONSULTATION_TABLE)
      .insert({
        full_name: fullName,
        phone,
        email,
        meeting_type: meetingType,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        notes: notes || null,
        source_page: "contact",
        status: "new",
      })
      .select()
      .single();

    // إذا فشل حفظ الطلب نوقف التنفيذ
    if (consultationError || !consultation) {
      console.error("CONSULTATION_INSERT_ERROR", consultationError);

      return NextResponse.json(
        {
          ok: false,
          message:
            consultationError?.message ||
            "Failed to save consultation request",
        },
        { status: 500 }
      );
    }

    // نجهز نص عنوان التنبيه
    const notificationTitle = "طلب استشارة جديد";

    // نجهز نص رسالة التنبيه
    const notificationMessage = `ورد طلب استشارة جديد من ${fullName} بتاريخ ${meetingDate} في الساعة ${meetingTime}.`;

    // ننشئ رابطًا ذكيًا يفتح نفس الصفحة لكن يركز على الطلب المحدد
    const notificationLink = `/admin/consultations?focus=${consultation.id}`;

    // نحفظ التنبيه الداخلي في جدول admin_notifications
    const { error: notificationError } = await supabase
      .from("admin_notifications")
      .insert({
        type: "consultation_request",
        title: notificationTitle,
        message: notificationMessage,
        link: notificationLink,
        reference_id: consultation.id,
        is_read: false,
      });

    // إذا فشل إنشاء التنبيه نطبع الخطأ فقط ولا نسقط العملية كلها
    if (notificationError) {
      console.error(
        "ADMIN_NOTIFICATION_INSERT_ERROR",
        notificationError.message
      );
    } else {
      console.log("ADMIN_NOTIFICATION_INSERT_OK", {
        consultationId: consultation.id,
      });
    }

    // نحاول إرسال البريد الإداري
    const emailResult = await sendAdminConsultationEmail({
      fullName,
      phone,
      email,
      meetingType,
      meetingDate,
      meetingTime,
      requestId: consultation.id,
    });

    // نطبع نتيجة البريد في اللوق للمراجعة
    console.log("CONTACT_ROUTE_EMAIL_RESULT", {
      consultationId: consultation.id,
      emailResult,
    });

    // متغير يحدد هل البريد انرسل فعلًا
    let emailSent = false;

    // متغير يحدد هل تم تخطي الإرسال بسبب نقص إعدادات
    let emailSkipped = false;

    // متغير يحتوي رسالة الخطأ أو السبب إذا لم ينجح البريد
    let emailError: string | null = null;

    // إذا نجح البريد
    if (emailResult.ok) {
      emailSent = true;
    } else if (emailResult.skipped) {
      // إذا تم تخطي البريد بسبب إعدادات ناقصة
      emailSkipped = true;
      emailError = emailResult.reason;
      console.error("ADMIN_EMAIL_SKIPPED", emailResult.reason);
    } else {
      // إذا فشل الإرسال فعلًا نجهز نص الخطأ
      emailError =
        typeof emailResult.error === "object"
          ? JSON.stringify(emailResult.error)
          : String(emailResult.error);

      console.error("ADMIN_EMAIL_SEND_FAILED", emailResult.error);
    }

    // نرجع الاستجابة النهائية بنجاح حتى لو فشل البريد
    return NextResponse.json(
      {
        ok: true,
        message: "Consultation request submitted successfully",
        request: consultation,
        notificationSaved: !notificationError,
        emailSent,
        emailSkipped,
        emailError,
      },
      { status: 201 }
    );
  } catch (error) {
    // أي خطأ غير متوقع على مستوى الراوت كله
    console.error("CONSULTATION_REQUEST_ROUTE_ERROR", error);

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