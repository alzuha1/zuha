import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  // إنشاء عميل Supabase من الملف الموحد الجديد
  const supabase = supabaseServer();

  // قراءة الرابط الحالي
  const url = new URL(req.url);

  // استخراج path من query string
  const path = url.searchParams.get("path")?.trim();

  // التحقق من وجود path
  if (!path) {
    return NextResponse.json(
      { ok: false, message: "Missing path" },
      { status: 400 }
    );
  }

  // حذف الملف من Supabase Storage
  const { error } = await supabase.storage.from("media").remove([path]);

  // إذا حصل خطأ أثناء الحذف
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  // إذا نجح الحذف
  return NextResponse.json({ ok: true });
}