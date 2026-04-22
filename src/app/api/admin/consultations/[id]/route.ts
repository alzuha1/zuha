// استيراد NextResponse لبناء ردود API
import { NextResponse } from "next/server";

// استيراد حارس الأدمن
import { ensureAdmin } from "@/lib/admin-guard";

// استيراد عميل Supabase الخادمي
import { supabaseServer } from "@/lib/supabase-server";

// إجبار الـ route على العمل ديناميكيًا
export const dynamic = "force-dynamic";

// الحالات المسموح بها
const ALLOWED_STATUSES = new Set([
  "new",
  "contacted",
  "confirmed",
  "cancelled",
]);

// PATCH: تعديل حالة طلب الاستشارة
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // التحقق من صلاحية الأدمن
  const admin = await ensureAdmin();

  // إذا لم يكن المستخدم أدمن نرجع 401
  if (!admin.ok) return admin.response;

  // استخراج id من الرابط
  const { id } = await context.params;

  // قراءة body القادم من الطلب
  const body = await req.json();

  // استخراج status
  const status = String(body.status ?? "").trim();

  // التحقق من الحالة
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      { ok: false, message: "Invalid status" },
      { status: 400 }
    );
  }

  // إنشاء عميل Supabase
  const supabase = supabaseServer();

  // تنفيذ التحديث
  const { data, error } = await supabase
    .from("consultation_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  // إذا حدث خطأ نرجع 500
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  // إذا نجح نرجع السجل المعدل
  return NextResponse.json({
    ok: true,
    consultation: data,
  });
}

// DELETE: حذف طلب استشارة
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // التحقق من صلاحية الأدمن
  const admin = await ensureAdmin();

  // إذا لم يكن المستخدم أدمن نرجع 401
  if (!admin.ok) return admin.response;

  // استخراج id من الرابط
  const { id } = await context.params;

  // إنشاء عميل Supabase
  const supabase = supabaseServer();

  // تنفيذ الحذف
  const { error } = await supabase
    .from("consultation_requests")
    .delete()
    .eq("id", id);

  // إذا حصل خطأ نرجع 500
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  // إذا نجح الحذف
  return NextResponse.json({
    ok: true,
    id,
  });
}