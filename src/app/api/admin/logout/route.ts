import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // إنشاء استجابة نجاح

  res.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
  // حذف الكوكي

  return res;
}