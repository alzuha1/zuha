import { NextResponse } from "next/server";
// استيراد NextResponse لإنشاء رد API منظم

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// منع الكاش الثابت حتى نرى النتيجة الحقيقية في كل مرة

export async function GET() {
  try {
    // إنشاء عميل Supabase
    const supabase = supabaseServer();

    // تجربة قراءة صف واحد فقط من جدول pages
    const { data, error } = await supabase
      .from("pages")
      .select("slug,title_ar,title_en,is_published,page_type")
      .limit(1);

    // إذا رجع Supabase خطأ نعيده بشكل واضح
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          source: "supabase-query",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // إذا نجح الاتصال والاستعلام نرجع النتيجة
    return NextResponse.json({
      ok: true,
      source: "supabase-query",
      items: data ?? [],
    });
  } catch (error) {
    // التقاط أي خطأ غير متوقع مثل خطأ متغيرات البيئة أو إنشاء العميل
    return NextResponse.json(
      {
        ok: false,
        source: "runtime",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}