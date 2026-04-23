import { NextResponse } from "next/server";
// إنشاء ردود JSON منظمة من داخل Route Handler

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// تعطيل الكاش الثابت حتى نحصل على نتيجة حقيقية في كل طلب

export async function GET() {
  // قراءة متغيرات البيئة لأغراض التشخيص فقط
  // لا نطبع المفتاح كاملًا حفاظًا على الأمان
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  const diagnostics = {
    hasUrl: !!supabaseUrl,
    hasKey: !!serviceRoleKey,
    url: supabaseUrl || null,
    keyPrefix: serviceRoleKey ? serviceRoleKey.slice(0, 12) : null,
    keyLength: serviceRoleKey.length,
  };

  try {
    // المرحلة الأولى: إنشاء عميل Supabase
    let supabase;

    try {
      supabase = supabaseServer();
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "create_client",
          diagnostics,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // المرحلة الثانية: تنفيذ استعلام بسيط جدًا على جدول pages
    let result;

    try {
      result = await supabase
        .from("pages")
        .select("slug,title_ar,title_en,is_published,page_type")
        .limit(1);
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "run_query",
          diagnostics,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    const { data, error } = result;

    // إذا Supabase رجع كائن خطأ واضح
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "supabase_error_object",
          diagnostics,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // إذا نجح كل شيء نرجع أول النتائج
    return NextResponse.json({
      ok: true,
      stage: "success",
      diagnostics,
      items: data ?? [],
    });
  } catch (error) {
    // حماية أخيرة لأي خطأ غير متوقع خارج المراحل المحددة
    return NextResponse.json(
      {
        ok: false,
        stage: "outer_catch",
        diagnostics,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}