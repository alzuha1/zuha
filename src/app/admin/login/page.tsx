"use client";
// هذا الملف يعمل على جهة المتصفح لأنه يعتمد على state والتفاعل مع النموذج
// كما أنه يحتاج useSearchParams، لذلك سنعزله داخل مكوّن داخلي مغلف بـ Suspense

import { Suspense, useMemo, useState } from "react";
// Suspense مطلوب لحل مشكلة useSearchParams أثناء build
// useMemo لتحضير رابط next بشكل منظم
// useState لإدارة الإدخالات، التحميل، ورسالة الخطأ

import { useRouter, useSearchParams } from "next/navigation";
// useRouter لإعادة التوجيه بعد نجاح تسجيل الدخول
// useSearchParams لقراءة رابط next إن كان المستخدم قادمًا من صفحة محمية

function AdminLoginPageInner() {
  // هذا المكوّن الداخلي هو الوحيد الذي يستخدم useSearchParams
  // بهذه الطريقة نتجنب خطأ build الخاص بـ Next.js

  const router = useRouter();
  // إنشاء كائن التوجيه الخاص بـ Next.js

  const sp = useSearchParams();
  // قراءة query params الحالية من الرابط
  // نقلنا هذا السطر من المكوّن الخارجي إلى هذا المكوّن الداخلي فقط

  const nextUrl = useMemo(() => {
    // إذا كان المستخدم أُعيد توجيهه من صفحة محمية نرجعه إليها بعد نجاح الدخول
    // وإذا لم توجد next نستخدم /admin كمسار افتراضي

    const rawNext = sp.get("next") || "/admin";

    // حماية بسيطة:
    // لا نسمح بقيم لا تبدأ بـ /
    // حتى لا نسمح بإعادة توجيه غير مرغوبة إلى روابط خارجية
    if (!rawNext.startsWith("/")) {
      return "/admin";
    }

    return rawNext;
  }, [sp]);

  const [email, setEmail] = useState("");
  // حالة البريد الإلكتروني

  const [password, setPassword] = useState("");
  // حالة كلمة المرور

  const [loading, setLoading] = useState(false);
  // حالة التحميل أثناء محاولة تسجيل الدخول

  const [err, setErr] = useState<string | null>(null);
  // رسالة الخطأ التي تظهر للمستخدم عند الفشل

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // منع إعادة تحميل الصفحة بشكل تقليدي عند إرسال النموذج
    e.preventDefault();

    // حذف أي رسالة خطأ سابقة قبل بدء المحاولة الجديدة
    setErr(null);

    // تفعيل حالة التحميل
    setLoading(true);

    try {
      // إرسال بيانات الدخول إلى API الأدمن
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // إرسال البريد وكلمة المرور في body
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),

        // هذا الخيار يجعل التعامل مع الكوكي أوضح في نفس النطاق
        credentials: "same-origin",
      });

      // قراءة رد الـ API بشكل آمن سواء نجح أو فشل
      const data = await res.json().catch(() => ({}));

      // إذا كان الرد غير ناجح أو الـ API قالت ok=false نرمي خطأ واضح
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || "بيانات الدخول غير صحيحة");
      }

      // عند نجاح تسجيل الدخول ننتقل إلى الصفحة المطلوبة
      router.replace(nextUrl);

      // ثم نطلب من Next.js إعادة تحميل الحالة الجديدة
      // حتى تُقرأ الكوكي الجديدة في الصفحات المحمية
      router.refresh();
    } catch (e: unknown) {
      // في حالة حدوث خطأ نعرض الرسالة القادمة من الـ API أو رسالة عامة
      setErr(
        e instanceof Error ? e.message : "فشل تسجيل الدخول"
      );
    } finally {
      // إعادة الزر إلى حالته الطبيعية سواء نجح أو فشل الطلب
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      {/* الغلاف العام للصفحة مع توسيط البطاقة في منتصف الشاشة */}

      <div className="w-full max-w-md rounded-2xl bg-white/95 text-neutral-900 shadow-2xl p-8">
        {/* بطاقة تسجيل الدخول */}

        <h1 className="text-2xl font-semibold">Admin Login</h1>
        {/* عنوان الصفحة */}

        <p className="mt-1 text-sm text-neutral-600">
          تسجيل دخول الأدمن.
        </p>
        {/* وصف مختصر */}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* نموذج تسجيل الدخول */}

          <div>
            <label className="text-sm font-medium">Email</label>
            {/* عنوان حقل البريد */}

            <input
              className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alzuha.local"
              autoComplete="username"
              inputMode="email"
              type="email"
              required
            />
            {/* حقل البريد الإلكتروني */}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            {/* عنوان حقل كلمة المرور */}

            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
            {/* حقل كلمة المرور */}
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}
          {/* إذا وُجدت رسالة خطأ نعرضها هنا */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-950 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {/* زر تسجيل الدخول، ويتحول إلى حالة تحميل أثناء الطلب */}
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  // هذا هو المكوّن الافتراضي للصفحة
  // لا نستخدم useSearchParams هنا مباشرة
  // بل نغلف المكوّن الداخلي بـ Suspense لحل مشكلة البناء

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
          {/* واجهة تحميل بسيطة أثناء تجهيز الصفحة */}
          <div className="w-full max-w-md rounded-2xl bg-white/95 text-neutral-900 shadow-2xl p-8">
            <h1 className="text-2xl font-semibold">Admin Login</h1>
            <p className="mt-3 text-sm text-neutral-600">
              Loading login page...
            </p>
          </div>
        </main>
      }
    >
      <AdminLoginPageInner />
    </Suspense>
  );
}