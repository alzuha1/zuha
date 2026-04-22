import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // إنشاء عميل Supabase من الملف الموحد الجديد
  const supabase = supabaseServer();

  // استخراج id من params
  const { id } = await params;

  // 1) قراءة السجل من قاعدة البيانات
  const row = await supabase
    .from("media_files")
    .select("id,bucket,path")
    .eq("id", id)
    .single();

  // إذا لم نجد السجل أو حصل خطأ
  if (row.error || !row.data) {
    return NextResponse.json(
      { ok: false, message: row.error?.message ?? "Not found" },
      { status: 404 }
    );
  }

  const { bucket, path } = row.data;

  // 2) حذف الملف من Storage
  const delFile = await supabase.storage.from(bucket).remove([path]);

  if (delFile.error) {
    return NextResponse.json(
      { ok: false, message: delFile.error.message },
      { status: 500 }
    );
  }

  // 3) حذف السجل من قاعدة البيانات
  const delRow = await supabase
    .from("media_files")
    .delete()
    .eq("id", id);

  if (delRow.error) {
    return NextResponse.json(
      { ok: false, message: delRow.error.message },
      { status: 500 }
    );
  }

  // إذا نجح كل شيء
  return NextResponse.json({ ok: true });
}