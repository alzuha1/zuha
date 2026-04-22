// استيراد NextResponse لبناء ردود API
import { NextResponse } from "next/server";

// استيراد حارس الأدمن
import { ensureAdmin } from "@/lib/admin-guard";

// استيراد عميل Supabase الخادمي
import { supabaseServer } from "@/lib/supabase-server";

// إجبار الـ route على العمل ديناميكيًا
export const dynamic = "force-dynamic";

// GET: جلب كل طلبات الاستشارة
export async function GET(req: Request) {
  // التحقق من صلاحية الأدمن
  const admin = await ensureAdmin();

  // إذا لم يكن المستخدم أدمن نرجع الرد الجاهز
  if (!admin.ok) return admin.response;

  // قراءة الحالة من query string إن وجدت
  const url = new URL(req.url);
  const status = url.searchParams.get("status")?.trim();

  // إنشاء عميل Supabase
  const supabase = supabaseServer();

  // بدء الاستعلام
  let query = supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });

  // إذا أرسلنا status وكان ليس all نفلتر بناءً عليه
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  // تنفيذ الاستعلام
  const { data, error } = await query;

  // إذا حصل خطأ نرجع 500
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  // إذا نجح الاستعلام نرجع البيانات
  return NextResponse.json({
    ok: true,
    consultations: data ?? [],
  });
}