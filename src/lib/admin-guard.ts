// استيراد cookies لقراءة كوكي الأدمن من الطلب الحالي
import { cookies } from "next/headers";

// استيراد NextResponse لبناء ردود API بشكل رسمي
import { NextResponse } from "next/server";

// دالة مساعدة للتحقق من أن المستخدم مسجل دخول كأدمن
export async function ensureAdmin() {
  // جلب مخزن الكوكيز من الطلب الحالي
  const cookieStore = await cookies();

  // اسم كوكي الأدمن من البيئة، وإذا لم يوجد نستخدم الاسم الافتراضي
  const cookieName = process.env.ADMIN_COOKIE || "zuha_admin";

  // قراءة قيمة كوكي الأدمن
  const adminCookie = cookieStore.get(cookieName)?.value;

  // إذا لم توجد كوكي أدمن، نرجع رد 401 Unauthorized
  if (!adminCookie) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { ok: false, message: "Unauthorized admin access" },
        { status: 401 }
      ),
    };
  }

  // إذا كانت الكوكي موجودة، نرجع نتيجة نجاح
  return {
    ok: true as const,
    cookieName,
    adminCookie,
  };
}