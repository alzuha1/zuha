import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";
const MAX_MB = 10;

// دالة بسيطة لتنظيف اسم المجلد
function safeFolder(value: string | null | undefined) {
  return String(value ?? "uploads")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "") || "uploads";
}

export async function GET() {
  // إنشاء عميل Supabase من الملف الموحد الجديد
  const supabase = supabaseServer();

  // جلب قائمة الملفات من قاعدة البيانات
  const { data, error } = await supabase
    .from("media_files")
    .select("id,bucket,path,public_url,mime,size,alt_ar,alt_en,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // إذا حصل خطأ أثناء الجلب
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message, items: [] },
      { status: 500 }
    );
  }

  // إذا نجح الجلب
  return NextResponse.json({ ok: true, items: data ?? [] });
}

export async function POST(req: Request) {
  try {
    // إنشاء عميل Supabase من الملف الموحد الجديد
    const supabase = supabaseServer();

    // قراءة البيانات المرسلة كـ form-data
    const form = await req.formData();

    // استخراج الملف
    const file = form.get("file") as File | null;

    // استخراج اسم المجلد مع تنظيفه
    const folder = safeFolder(form.get("folder") as string | null);

    // النص البديل العربي
    const alt_ar = String(form.get("alt_ar") ?? "").trim();

    // النص البديل الإنجليزي
    const alt_en = String(form.get("alt_en") ?? "").trim();

    // التحقق من وجود الملف
    if (!file) {
      return NextResponse.json(
        { ok: false, message: "Missing file" },
        { status: 400 }
      );
    }

    // التحقق من الحجم
    const size = file.size;
    if (size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: `Max file size is ${MAX_MB}MB` },
        { status: 400 }
      );
    }

    // تحديد نوع الملف
    const mime = file.type || "application/octet-stream";

    // السماح فقط بالصور
    if (!mime.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "Only image uploads are allowed" },
        { status: 400 }
      );
    }

    // استخراج الامتداد
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();

    // إنشاء اسم فريد للملف
    const id = crypto.randomUUID();

    // إنشاء مسار التخزين داخل Storage
    const path = `${folder}/${id}.${ext}`;

    // تحويل الملف إلى bytes
    const bytes = new Uint8Array(await file.arrayBuffer());

    // رفع الملف إلى Supabase Storage
    const up = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });

    // إذا فشل الرفع
    if (up.error) {
      return NextResponse.json(
        { ok: false, message: up.error.message },
        { status: 500 }
      );
    }

    // استخراج الرابط العام للملف
    const pub = supabase.storage.from(BUCKET).getPublicUrl(path);
    const public_url = pub.data.publicUrl;

    // حفظ بيانات الملف في قاعدة البيانات
    const ins = await supabase
      .from("media_files")
      .insert({
        bucket: BUCKET,
        path,
        public_url,
        mime,
        size,
        alt_ar,
        alt_en,
      })
      .select("id,bucket,path,public_url,mime,size,alt_ar,alt_en,created_at")
      .single();

    // إذا فشل الحفظ في قاعدة البيانات نحذف الملف من Storage حتى لا يبقى orphan
    if (ins.error) {
      await supabase.storage.from(BUCKET).remove([path]);

      return NextResponse.json(
        { ok: false, message: ins.error.message },
        { status: 500 }
      );
    }

    // إذا نجح كل شيء
    return NextResponse.json({ ok: true, item: ins.data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}