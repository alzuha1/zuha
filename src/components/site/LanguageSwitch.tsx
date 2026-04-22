"use client";
// هذا الملف يعمل على جهة المتصفح لأنه يعتمد على state والتفاعل والانتقال

import { useRouter } from "next/navigation";
// useRouter لتحديث الصفحة بعد تغيير اللغة

import { useEffect, useState, useTransition } from "react";
// useEffect لقراءة document بعد mount فقط
// useState لتخزين اللغة الحالية
// useTransition لتلطيف تحديث الصفحة

type Lang = "ar" | "en";
// اللغتان المدعومتان

export default function LanguageSwitch() {
  // أدوات التنقل الخاصة بـ Next
  const router = useRouter();

  // استخدام transition لتخفيف أثر refresh
  const [isPending, startTransition] = useTransition();

  // نبدأ دائمًا بالعربية كقيمة ثابتة آمنة لمنع hydration mismatch
  const [lang, setLang] = useState<Lang>("ar");

  // بعد تحميل المكوّن على المتصفح فقط نقرأ اللغة الفعلية من document
  useEffect(() => {
    const current =
      document.documentElement.lang === "en" ? "en" : "ar";
    setLang(current);
  }, []);
  // هذا يمنع الفرق بين HTML السيرفر وأول Render على العميل

  const isArabic = lang === "ar";
  // متغير مساعد لمعرفة اللغة الحالية

  async function applyLang(nextLang: Lang) {
    // إذا كانت اللغة المطلوبة هي نفسها الحالية لا نفعل شيئًا
    if (nextLang === lang) return;

    // تحديث محلي سريع حتى يشعر المستخدم بالاستجابة فورًا
    setLang(nextLang);

    // تحديث html مباشرة
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";

    try {
      // حفظ اللغة في الكوكي عبر API
      const res = await fetch("/api/lang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang: nextLang }),
      });

      // إذا فشل الطلب نرمي خطأ
      if (!res.ok) {
        throw new Error(`Failed to save language (HTTP ${res.status})`);
      }

      // بعد نجاح الحفظ نطلب من Next إعادة تحميل بيانات السيرفر
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      // في حالة الفشل نرجع اللغة السابقة
      const fallbackLang: Lang = nextLang === "ar" ? "en" : "ar";
      setLang(fallbackLang);

      document.documentElement.lang = fallbackLang;
      document.documentElement.dir =
        fallbackLang === "ar" ? "rtl" : "ltr";

      console.error("Language switch failed:", error);
    }
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"
      aria-label="Language switch"
    >
      <button
        type="button"
        onClick={() => applyLang("ar")}
        disabled={isPending}
        aria-pressed={isArabic}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          isArabic
            ? "bg-white text-black"
            : "text-white/75 hover:text-white"
        } ${isPending ? "opacity-60" : ""}`}
      >
        AR
      </button>

      <button
        type="button"
        onClick={() => applyLang("en")}
        disabled={isPending}
        aria-pressed={!isArabic}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          !isArabic
            ? "bg-white text-black"
            : "text-white/75 hover:text-white"
        } ${isPending ? "opacity-60" : ""}`}
      >
        EN
      </button>
    </div>
  );
}