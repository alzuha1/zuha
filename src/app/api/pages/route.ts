import { NextResponse } from "next/server";
// استيراد استجابة Next القياسية للـ API routes

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// إجبار المسار على العمل بشكل ديناميكي وعدم استخدام كاش ثابت

type JsonObject = Record<string, unknown>;
// نوع عام بسيط لتمثيل JSON objects

export async function GET(req: Request) {
  // هذه الدالة تخدم حالتين:
  // 1) إذا لا يوجد id ولا slug => ترجع قائمة الصفحات
  // 2) إذا يوجد id أو slug => ترجع صفحة واحدة كاملة بكل بياناتها

  const supabase = supabaseServer();
  // إنشاء عميل Supabase

  const url = new URL(req.url);
  // استخراج رابط الطلب الحالي حتى نقرأ query params

  const id = url.searchParams.get("id")?.trim();
  // محاولة قراءة id من الرابط، ثم إزالة الفراغات

  const slug = url.searchParams.get("slug")?.trim();
  // محاولة قراءة slug من الرابط، ثم إزالة الفراغات

  if (id || slug) {
    // إذا طلب المستخدم صفحة واحدة بالـ id أو slug

    let query = supabase
      .from("pages")
      .select(
        "id,slug,title_ar,title_en,content_ar,content_en,hero_image_url,is_published,updated_at,page_type,meta_json,sections_json"
      );
    // بناء الاستعلام مع كل الحقول اللازمة للعرض والتحرير

    if (id) {
      query = query.eq("id", id);
      // إذا وُجد id نبحث به أولًا لأنه الأدق
    } else if (slug) {
      query = query.eq("slug", slug);
      // إذا لم يوجد id لكن يوجد slug نبحث بالـ slug
    }

    const { data, error } = await query.maybeSingle();
    // جلب سجل واحد كحد أقصى بدون رمي خطأ إذا لم يوجد

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
      // إرجاع خطأ السيرفر إذا فشل الاستعلام
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, message: "page not found" },
        { status: 404 }
      );
      // إرجاع 404 إذا لم نجد الصفحة
    }

    return NextResponse.json({ ok: true, item: data });
    // إرجاع الصفحة الكاملة داخل item
  }

  const { data, error } = await supabase
    .from("pages")
    .select("id,slug,title_ar,title_en,is_published,updated_at,page_type")
    .order("updated_at", { ascending: false });
  // إذا لم يُطلب id أو slug نرجع قائمة الصفحات فقط مع معلومات مختصرة

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
    // إرجاع خطأ السيرفر إذا فشل جلب القائمة
  }

  return NextResponse.json({ ok: true, items: data ?? [] });
  // إرجاع القائمة النهائية
}

export async function POST(req: Request) {
  // إنشاء صفحة جديدة

  const supabase = supabaseServer();
  // إنشاء عميل Supabase

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // قراءة JSON المرسل من الواجهة، ومعالجة أي فشل بإرجاع object فارغ

  const slug = String(body?.slug ?? "").trim();
  // استخراج slug وتحويله إلى string مضمون

  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "slug required" },
      { status: 400 }
    );
    // لا يمكن إنشاء صفحة بدون slug
  }

  const payload = {
    slug,
    title_ar: String(body?.title_ar ?? ""),
    title_en: String(body?.title_en ?? ""),
    content_ar: String(body?.content_ar ?? ""),
    content_en: String(body?.content_en ?? ""),
    hero_image_url: body?.hero_image_url ? String(body.hero_image_url) : null,
    is_published: Boolean(body?.is_published ?? false),
    page_type: String(body?.page_type ?? "basic"),
    meta_json:
      typeof body?.meta_json === "object" && body?.meta_json !== null
        ? (body.meta_json as JsonObject)
        : {},
    sections_json:
      typeof body?.sections_json === "object" && body?.sections_json !== null
        ? (body.sections_json as JsonObject)
        : {},
    updated_at: new Date().toISOString(),
  };
  // تجهيز البيانات الجديدة مع دعم الحقول المؤسسية الجديدة

  const { data, error } = await supabase
    .from("pages")
    .insert(payload)
    .select("id")
    .single();
  // إدراج الصفحة ثم إعادة id الخاص بها

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
    // إرجاع خطأ إذا فشلت عملية الإدراج
  }

  return NextResponse.json({ ok: true, id: data.id });
  // إرجاع id الصفحة الجديدة
}

export async function PUT(req: Request) {
  // تحديث صفحة موجودة

  const supabase = supabaseServer();
  // إنشاء عميل Supabase

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // قراءة JSON القادم من الواجهة

  const id = String(body?.id ?? "").trim();
  // استخراج id الصفحة المراد تحديثها

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "id required" },
      { status: 400 }
    );
    // لا يمكن تحديث صفحة بدون id
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  // payload التحديث يبدأ دائمًا بتحديث timestamp

  const simpleFields = [
    "slug",
    "title_ar",
    "title_en",
    "content_ar",
    "content_en",
    "hero_image_url",
    "is_published",
    "page_type",
  ];
  // هذه الحقول البسيطة سنمررها كما هي إذا كانت موجودة

  for (const key of simpleFields) {
    if (body[key] !== undefined) {
      payload[key] = body[key];
    }
  }
  // نسخ الحقول البسيطة إلى payload إذا أُرسلت من الواجهة

  if (body.meta_json !== undefined) {
    payload.meta_json =
      typeof body.meta_json === "object" && body.meta_json !== null
        ? (body.meta_json as JsonObject)
        : {};
  }
  // دعم تحديث meta_json بشكل آمن

  if (body.sections_json !== undefined) {
    payload.sections_json =
      typeof body.sections_json === "object" && body.sections_json !== null
        ? (body.sections_json as JsonObject)
        : {};
  }
  // دعم تحديث sections_json بشكل آمن

  const { error } = await supabase.from("pages").update(payload).eq("id", id);
  // تنفيذ التحديث على السجل المطلوب

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
    // إرجاع خطأ إذا فشل التحديث
  }

  return NextResponse.json({ ok: true });
  // إرجاع نجاح العملية
}

export async function DELETE(req: Request) {
  // حذف صفحة موجودة

  const supabase = supabaseServer();
  // إنشاء عميل Supabase

  const url = new URL(req.url);
  // قراءة الرابط الحالي

  const id = url.searchParams.get("id")?.trim();
  // استخراج id الصفحة المراد حذفها

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "id required" },
      { status: 400 }
    );
    // لا يمكن الحذف بدون id
  }

  const { error } = await supabase.from("pages").delete().eq("id", id);
  // حذف السجل المطابق للـ id

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
    // إرجاع خطأ إذا فشل الحذف
  }

  return NextResponse.json({ ok: true });
  // إرجاع نجاح الحذف
}