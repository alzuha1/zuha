import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// نجبر الراوت أن يكون dynamic دائمًا
export const dynamic = "force-dynamic";

// دالة PATCH لتحديد إشعار واحد كمقروء
export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // نقرأ id من params
    const { id } = await context.params;

    // نتحقق أن id موجود
    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          message: "Notification id is required",
        },
        { status: 400 }
      );
    }

    // ننشئ عميل Supabase
    const supabase = supabaseServer();

    // نحدث الإشعار المطلوب فقط
    const { error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("id", id);

    // إذا فشل التحديث نرجع الخطأ
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // نجاح
    return NextResponse.json({
      ok: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    // أي خطأ غير متوقع
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}