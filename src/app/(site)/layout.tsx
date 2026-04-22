import type { ReactNode } from "react";
// استيراد نوع ReactNode فقط لاستخدامه في typing الخاص بـ children

import { cookies } from "next/headers";
// استيراد cookies من Next.js لقراءة الكوكيز على جهة السيرفر

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  // جعل الـ layout غير متزامن لأن cookies() أصبحت async في Next.js الحديث

  const cookieStore = await cookies();
  // ننتظر نتيجة cookies() أولًا ثم نستخدمها بأمان

  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "ar";
  // إذا كانت قيمة كوكيز lang = en نستخدم الإنجليزية
  // وأي قيمة أخرى أو عدم وجود الكوكيز يعني العربية

  const dir = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة:
  // العربية من اليمين إلى اليسار RTL
  // الإنجليزية من اليسار إلى اليمين LTR

  return (
    <div lang={lang} dir={dir} className="min-h-screen">
      {/* 
        lang:
        يخبر المتصفح ومحركات البحث وقارئات الشاشة بلغة المحتوى

        dir:
        يضبط اتجاه النصوص والعناصر حسب اللغة

        min-h-screen:
        يجعل الغلاف لا يقل عن ارتفاع الشاشة كاملة
      */}
      {children}
      {/* هنا يتم عرض كل صفحات مجموعة (site) داخل هذا الغلاف */}
    </div>
  );
}