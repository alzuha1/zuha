import { NextResponse } from "next/server";
// NextResponse لإنشاء رد HTTP وضبط الكوكيز

export const dynamic = "force-dynamic";
// منع الكاش الثابت

type Body = {
  lang?: string;
};
// نوع مبسط للبيانات القادمة من الطلب

export async function POST(req: Request) {
  // قراءة body بشكل آمن
  const body = (await req.json().catch(() => ({}))) as Body;

  // تحديد اللغة المطلوبة
  const nextLang = body?.lang === "en" ? "en" : "ar";

  // إنشاء response نجاح
  const res = NextResponse.json({
    ok: true,
    lang: nextLang,
  });

  // تخزين اللغة في الكوكيز حتى تقرأها Server Components مثل الصفحة الرئيسية
  res.cookies.set("lang", nextLang, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}