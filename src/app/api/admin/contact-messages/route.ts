import { NextResponse } from "next/server";
// NextResponse لإرجاع ردود API منظمة

import { cookies } from "next/headers";
// قراءة كوكي الأدمن

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// جعل الـ API ديناميكيًا

async function isAdminAuthorized() {
  // التحقق من وجود كوكي الأدمن
  const cookieStore: any = await Promise.resolve(cookies() as any);

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;

  return Boolean(adminCookie);
}

export async function GET(req: Request) {
  // جلب الرسائل وفق الفلاتر الحالية
  try {
    const authorized = await isAdminAuthorized();

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // منع الوصول إذا لم يكن المستخدم أدمن

    const url = new URL(req.url);
    const status = (url.searchParams.get("status") || "all").trim();
    const q = (url.searchParams.get("q") || "").trim();
    const includeDeleted = url.searchParams.get("includeDeleted") === "true";
    // قراءة فلاتر البحث من الرابط

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    let query = supabase
      .from("contact_messages")
      .select(
        "id, full_name, phone, email, message, status, admin_note, is_deleted, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    // الاستعلام الأساسي

    if (!includeDeleted) {
      query = query.eq("is_deleted", false);
    }
    // إذا لم يطلب الأدمن عرض المحذوف، نستبعد الرسائل المحذوفة

    if (status !== "all") {
      query = query.eq("status", status);
    }
    // تطبيق فلتر الحالة إذا لم يكن all

    if (q) {
      query = query.or(
        `full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,message.ilike.%${q}%`
      );
    }
    // تطبيق البحث على الاسم والبريد والهاتف والرسالة

    const { data, error } = await query;
    // تنفيذ الاستعلام النهائي

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: data ?? [],
    });
    // إعادة النتائج إلى واجهة الأدمن
  } catch (error) {
    console.error("admin contact-messages GET error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}