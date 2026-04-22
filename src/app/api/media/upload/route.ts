import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// تنظيف اسم الملف من الرموز غير المناسبة
function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    // إنشاء عميل Supabase من الملف الموحد الجديد
    const supabase = supabaseServer();

    // قراءة form-data
    const form = await req.formData();

    // استخراج الملف
    const file = form.get("file") as File | null;

    // التحقق من وجود الملف
    if (!file) {
      return NextResponse.json(
        { ok: false, message: "Missing file" },
        { status: 400 }
      );
    }

    // تحويل الملف إلى Buffer
    const bytes = Buffer.from(await file.arrayBuffer());

    // استخراج الامتداد
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();

    // تنظيف الاسم بدون الامتداد
    const filename = safeName(file.name.replace(/\.[^/.]+$/, ""));

    // إنشاء مسار تخزين فريد
    const path = `uploads/${Date.now()}_${filename}.${ext}`;

    // رفع الملف إلى bucket اسمه media
    const { error } = await supabase.storage
      .from("media")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    // إذا حصل خطأ في الرفع
    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    // استخراج الرابط العام للملف بعد رفعه
    const { data } = supabase.storage.from("media").getPublicUrl(path);

    // إرجاع بيانات النجاح
    return NextResponse.json({
      ok: true,
      path,
      url: data.publicUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}