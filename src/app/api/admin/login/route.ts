import { NextResponse } from "next/server";
// استيراد NextResponse حتى نرجع JSON منظم ونضبط الكوكي داخل الاستجابة

export const dynamic = "force-dynamic";
// جعل هذا المسار ديناميكيًا حتى لا يعتمد على كاش ثابت أثناء التطوير أو تسجيل الدخول

export async function POST(req: Request) {
  // هذه الدالة تتعامل فقط مع طلبات POST الخاصة بتسجيل دخول الأدمن

  try {
    const body = await req.json().catch(() => ({}));
    // قراءة بيانات الطلب القادمة من الواجهة
    // إذا فشل json parsing نرجع object فارغ بدل كسر التنفيذ

    const email = String(body?.email ?? "").trim();
    // استخراج البريد الإلكتروني وتحويله إلى نص آمن مع إزالة الفراغات

    const password = String(body?.password ?? "").trim();
    // استخراج كلمة المرور وتحويلها إلى نص آمن مع إزالة الفراغات

    const expectedEmail = String(process.env.ADMIN_EMAIL ?? "").trim();
    // قراءة البريد الصحيح من متغيرات البيئة

    const expectedPassword = String(process.env.ADMIN_PASSWORD ?? "").trim();
    // قراءة كلمة المرور الصحيحة من متغيرات البيئة

    const adminCookieName = String(process.env.ADMIN_COOKIE ?? "zuha_admin").trim();
    // قراءة اسم كوكي الأدمن من متغيرات البيئة
    // وإذا لم يوجد نستخدم "zuha_admin" كقيمة احتياطية
    // هذا هو أهم تعديل، لأنه يجب أن يطابق الاسم الذي تقرأه صفحات الأدمن المحمية

    if (!expectedEmail || !expectedPassword) {
      // إذا كانت بيانات الأدمن غير مضبوطة في .env.local نرجع خطأ واضح

      return NextResponse.json(
        {
          ok: false,
          message: "Admin environment variables are not configured correctly.",
        },
        {
          status: 500,
        }
      );
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      // إذا كان البريد أو كلمة المرور غير صحيحين نرجع Unauthorized

      return NextResponse.json(
        {
          ok: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const res = NextResponse.json({
      ok: true,
    });
    // إنشاء استجابة نجاح
    // هذه الاستجابة سترجع للواجهة لتعرف أن تسجيل الدخول تم بنجاح

    res.cookies.set(adminCookieName, "1", {
      httpOnly: true,
      // منع JavaScript في المتصفح من قراءة الكوكي لزيادة الأمان

      sameSite: "lax",
      // السماح بالاستخدام الطبيعي داخل نفس الموقع مع حماية جيدة ضد بعض أنواع الطلبات العابرة

      secure: false,
      // في localhost أثناء التطوير نستخدم false
      // لاحقًا في الإنتاج عبر HTTPS يفضّل تحويلها إلى true

      path: "/",
      // جعل الكوكي صالحة على كامل الموقع وليس فقط داخل مسار فرعي

      maxAge: 60 * 60 * 24 * 7,
      // مدة صلاحية الكوكي 7 أيام
    });
    // ضبط كوكي الأدمن بالاسم الصحيح الموحد في المشروع

    return res;
    // إرجاع الاستجابة النهائية بعد إنشاء الكوكي
  } catch (error) {
    // التقاط أي خطأ غير متوقع أثناء التنفيذ

    console.error("admin login POST error:", error);
    // طباعة الخطأ في الطرفية ليسهل تتبعه أثناء التطوير

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
    // إرجاع خطأ عام منظم إذا حدث استثناء غير متوقع
  }
}