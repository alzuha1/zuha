import { NextResponse } from "next/server";
// NextResponse لإرجاع استجابات API منظمة

import { cookies } from "next/headers";
// قراءة كوكي الأدمن

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// جعل الـ API ديناميكيًا

type ContactMessageStatus = "new" | "reviewed" | "replied" | "archived";
// الحالات المسموح بها

type UpdateMessagePayload = {
  status?: ContactMessageStatus;
  adminNote?: string;
  isDeleted?: boolean;
};
// شكل البيانات القادمة لتحديث الرسالة

async function isAdminAuthorized() {
  // التحقق من وجود كوكي الأدمن
  const cookieStore: any = await Promise.resolve(cookies() as any);

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;

  return Boolean(adminCookie);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // تعديل رسالة واحدة: الحالة أو الملاحظة أو الاستعادة
  try {
    const authorized = await isAdminAuthorized();

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    // قراءة id الرسالة من المسار الديناميكي

    const body = (await req.json().catch(() => ({}))) as UpdateMessagePayload;
    // قراءة البيانات القادمة من جهة العميل

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    // جسم التحديث الأساسي

    if (typeof body.status === "string") {
      patch.status = body.status;
    }
    // تحديث الحالة إذا وصلت

    if (typeof body.adminNote === "string") {
      patch.admin_note = body.adminNote.trim();
    }
    // تحديث الملاحظة الإدارية إذا وصلت

    if (typeof body.isDeleted === "boolean") {
      patch.is_deleted = body.isDeleted;
    }
    // دعم الاستعادة أو الإخفاء المنطقي

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("contact_messages")
      .update(patch)
      .eq("id", id)
      .select(
        "id, full_name, phone, email, message, status, admin_note, is_deleted, created_at, updated_at"
      )
      .single();
    // تنفيذ التحديث وإرجاع الصف المحدث

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: data,
    });
    // إرجاع الرسالة بعد التعديل
  } catch (error) {
    console.error("admin contact-message PATCH error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // حذف منطقي للرسالة بدل الحذف النهائي
  try {
    const authorized = await isAdminAuthorized();

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    // قراءة معرف الرسالة

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("contact_messages")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, full_name, phone, email, message, status, admin_note, is_deleted, created_at, updated_at"
      )
      .single();
    // تنفيذ الحذف المنطقي وإرجاع الصف الجديد

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: data,
    });
    // إرجاع الصف بعد الحذف المنطقي
  } catch (error) {
    console.error("admin contact-message DELETE error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}