import { NextResponse } from "next/server";
// NextResponse لإنشاء ردود API بشكل صحيح

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر للوصول المباشر إلى قاعدة البيانات

export const dynamic = "force-dynamic";
// إجبار هذا المسار على العمل ديناميكيًا وعدم الاعتماد على كاش ثابت

export async function GET(req: Request) {
  // قراءة الرابط الحالي لاستخراج slug من query string
  const url = new URL(req.url);

  // استخراج slug المطلوب، مثل services أو portfolio أو faq
  const slug = String(url.searchParams.get("slug") ?? "").trim();

  // إذا لم يصل slug نرجع خطأ واضح
  if (!slug) {
    return NextResponse.json(
      {
        ok: false,
        message: "slug required",
      },
      { status: 400 }
    );
  }

  try {
    // إنشاء عميل Supabase
    const supabase = supabaseServer();

    // جلب الصفحة المنشورة فقط من جدول pages
    const { data, error } = await supabase
      .from("pages")
      .select(
        `
        slug,
        title_ar,
        title_en,
        content_ar,
        content_en,
        hero_image_url,
        is_published,
        page_type,
        meta_json,
        sections_json
        `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    // إذا رجع Supabase خطأ نعيده بشكل واضح
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // إذا لم نجد الصفحة نرجع 404 منظم
    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          message: "Page not found",
        },
        { status: 404 }
      );
    }

    // إذا وجدنا الصفحة نرجعها للواجهة
    return NextResponse.json({
      ok: true,
      page: data,
    });
  } catch (error) {
    // التقاط أي خطأ غير متوقع بدل ظهور TypeError غامض
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}