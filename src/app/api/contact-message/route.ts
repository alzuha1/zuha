import { NextResponse } from "next/server";
// NextResponse لإرجاع استجابات API منظمة

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// جعل الـ API ديناميكيًا وعدم الاعتماد على كاش ثابت

type ContactMessagePayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  message?: string;
};
// تعريف شكل البيانات القادمة من جهة العميل

function normalizeText(value: unknown) {
  // تحويل القيمة إلى نص منظف وآمن
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  // تحقق بسيط من صحة صيغة البريد الإلكتروني
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  // هذه الدالة تستقبل طلبات POST فقط
  try {
    const body = (await req.json().catch(() => ({}))) as ContactMessagePayload;
    // قراءة البيانات القادمة من الـ body بشكل آمن

    const fullName = normalizeText(body.fullName);
    // تنظيف الاسم

    const phone = normalizeText(body.phone);
    // تنظيف الهاتف

    const email = normalizeText(body.email);
    // تنظيف البريد

    const message = normalizeText(body.message);
    // تنظيف الرسالة

    if (!fullName) {
      return NextResponse.json(
        { ok: false, message: "fullName is required" },
        { status: 400 }
      );
    }
    // التحقق من وجود الاسم

    if (!phone) {
      return NextResponse.json(
        { ok: false, message: "phone is required" },
        { status: 400 }
      );
    }
    // التحقق من وجود الهاتف

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "valid email is required" },
        { status: 400 }
      );
    }
    // التحقق من وجود بريد صحيح

    if (!message) {
      return NextResponse.json(
        { ok: false, message: "message is required" },
        { status: 400 }
      );
    }
    // التحقق من وجود الرسالة

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        full_name: fullName,
        phone,
        email,
        message,
        status: "new",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    // حفظ الرسالة الجديدة داخل الجدول

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }
    // إذا فشل الإدخال نرجع خطأ واضح

    return NextResponse.json({
      ok: true,
      id: data.id,
    });
    // إذا نجح الإدخال نرجع نجاح ومعرّف الرسالة
  } catch (error) {
    console.error("contact-message POST error:", error);
    // طباعة الخطأ في الـ console

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    // إرجاع خطأ عام في حال حدوث استثناء غير متوقع
  }
}