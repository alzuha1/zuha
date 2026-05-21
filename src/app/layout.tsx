import type { Metadata } from "next";
// استيراد نوع Metadata من Next.js لتعريف بيانات الصفحة العامة مثل العنوان والوصف.

import { cookies } from "next/headers";
// استيراد cookies من Next.js لقراءة كوكي اللغة من السيرفر.

import "./globals.css";
// استيراد ملف التنسيقات العام للموقع.

import SiteHeader from "@/components/site/SiteHeader";
// استيراد الهيدر العام للموقع ليظهر في كل الصفحات.

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase السيرفري لجلب إعدادات الثيم العامة.

import ContentProtection from "@/components/site/ContentProtection";

export const metadata: Metadata = {
  // تعريف بيانات الموقع العامة.
  title: "ALZUHA",
  // عنوان الموقع الذي يظهر في المتصفح ومحركات البحث.
  description: "ALZUHA Real Estate",
  // وصف مختصر للموقع.
};
// نهاية metadata.

async function getLayoutLang(): Promise<"ar" | "en"> {
  // دالة تقرأ اللغة الحالية من الكوكيز وتعيد ar أو en.

  const cookieStore = await cookies();
  // قراءة جميع الكوكيز من طلب المستخدم الحالي.

  const langCookie = cookieStore.get("lang")?.value;
  // قراءة قيمة كوكي اللغة باسم lang إن كانت موجودة.

  return langCookie === "en" ? "en" : "ar";
  // إذا كانت اللغة en نعيد en، وإلا نستخدم ar كافتراضي.
}
// نهاية getLayoutLang.

function defaultTheme() {
  // دالة تعيد ثيمًا افتراضيًا إذا لم يتم جلب الثيم من قاعدة البيانات.

  return {
    // بداية كائن الثيم الافتراضي.
    colors: {
      // بداية ألوان الموقع الافتراضية.
      pageBg: "#ffffff",
      // لون خلفية الصفحة الافتراضي.
      text: "#171717",
      // لون النص الافتراضي.
      headerBg: "#244fca",
      // لون خلفية الهيدر الافتراضي.
      headerText: "#ffffff",
      // لون نص الهيدر الافتراضي.
      headerLink: "rgba(230,230,230,0.86)",
      // لون روابط الهيدر الافتراضي.
      headerActive: "#ffffff",
      // لون الرابط النشط في الهيدر.
    },
    // نهاية colors.
    typography: {
      // بداية إعدادات الخطوط الافتراضية.
      baseFontSize: 16,
      // حجم الخط الأساسي.
      navFontSize: 15,
      // حجم خط روابط الهيدر.
      navWeight: 850,
      // سماكة خط روابط الهيدر.
      lineHeight: 1.5,
      // ارتفاع السطر الافتراضي.
    },
    // نهاية typography.
    header: {
      // بداية إعدادات الهيدر الافتراضية.
      height: 92,
      // ارتفاع الهيدر.
      paddingX: 90,
      // المسافة الأفقية الداخلية للهيدر.
      navGap: 34,
      // المسافة بين روابط الهيدر.
      shadow: 0,
      // مقدار ظل الهيدر.
      borderOpacity: 0.1,
      // شفافية حد الهيدر.
      logoWidth: 156,
      // عرض الشعار.
      logoHeight: 74,
      // ارتفاع الشعار.
      logoRadius: 28,
      // تدوير زوايا إطار الشعار.
      logoScale: 1.18,
      // تكبير صورة الشعار داخل الإطار.
      logoBg: "#cfcfcf",
      // خلفية إطار الشعار.
      logoBorderColor: "#d7b85a",
      // لون حد الشعار.
      logoShadow: 22,
      // مقدار ظل الشعار.
    },
    // نهاية header.
  };
  // نهاية return.
}
// نهاية defaultTheme.

async function getThemeVars(): Promise<React.CSSProperties> {
  // دالة تجلب إعدادات الثيم من Supabase وتحولها إلى CSS variables.

  try {
    // بداية محاولة جلب الثيم.
    const supabase = supabaseServer();
    // إنشاء عميل Supabase السيرفري.

    const { data } = await supabase
      // بداية استعلام Supabase.
      .from("pages")
      // القراءة من جدول pages.
      .select("sections_json")
      // جلب عمود sections_json فقط لأنه يحتوي إعدادات الثيم.
      .eq("slug", "theme")
      // البحث عن سجل الثيم.
      .maybeSingle();
    // إرجاع سجل واحد أو null بدون إسقاط الصفحة.

    const base = defaultTheme();
    // تحميل الثيم الافتراضي كقاعدة آمنة.

    const theme: any = data?.sections_json || {};
    // قراءة إعدادات الثيم من قاعدة البيانات أو استخدام كائن فارغ.

    const colors = { ...base.colors, ...(theme.colors || {}) };
    // دمج ألوان الثيم المحفوظة مع ألوان fallback.

    const typography = { ...base.typography, ...(theme.typography || {}) };
    // دمج إعدادات الخطوط المحفوظة مع fallback.

    const header = { ...base.header, ...(theme.header || {}) };
    // دمج إعدادات الهيدر المحفوظة مع fallback.

    return {
      // بداية إرجاع CSS variables المستخدمة في الموقع.
      "--zuha-page-bg": colors.pageBg,
      // متغير لون خلفية الصفحة.
      "--zuha-text": colors.text,
      // متغير لون النص.
      "--zuha-base-font-size": `${typography.baseFontSize}px`,
      // متغير حجم الخط الأساسي.
      "--zuha-line-height": String(typography.lineHeight),
      // متغير ارتفاع السطر.
      "--zuha-header-bg": colors.headerBg,
      // متغير لون خلفية الهيدر.
      "--zuha-header-text": colors.headerText,
      // متغير لون نص الهيدر.
      "--zuha-header-link": colors.headerLink,
      // متغير لون روابط الهيدر.
      "--zuha-header-active": colors.headerActive,
      // متغير لون الرابط النشط.
      "--zuha-header-height": `${header.height}px`,
      // متغير ارتفاع الهيدر.
      "--zuha-header-padding-x": `${header.paddingX}px`,
      // متغير المسافة الأفقية داخل الهيدر.
      "--zuha-header-shadow": `0 14px ${header.shadow}px rgba(15,23,42,.18)`,
      // متغير ظل الهيدر.
      "--zuha-header-border": `rgba(255,255,255,${header.borderOpacity})`,
      // متغير حد الهيدر.
      "--zuha-logo-width": `${header.logoWidth}px`,
      // متغير عرض الشعار.
      "--zuha-logo-height": `${header.logoHeight}px`,
      // متغير ارتفاع الشعار.
      "--zuha-logo-radius": `${header.logoRadius}px`,
      // متغير تدوير زوايا الشعار.
      "--zuha-logo-scale": String(header.logoScale),
      // متغير تكبير الشعار.
      "--zuha-logo-bg": header.logoBg,
      // متغير خلفية الشعار.
      "--zuha-logo-border": header.logoBorderColor,
      // متغير لون حد الشعار.
      "--zuha-logo-shadow": `${header.logoShadow}px`,
      // متغير ظل الشعار.
      "--zuha-nav-gap": `${header.navGap}px`,
      // متغير المسافة بين روابط الهيدر.
      "--zuha-nav-font-size": `${typography.navFontSize}px`,
      // متغير حجم خط روابط الهيدر.
      "--zuha-nav-font-weight": String(typography.navWeight),
      // متغير سماكة خط روابط الهيدر.
    } as React.CSSProperties;
    // تحويل الكائن إلى React.CSSProperties لأن أسماء CSS variables مخصصة.
  } catch (error) {
    // إذا فشل جلب الثيم لأي سبب.
    console.error("Theme vars load failed:", error);
    // تسجيل الخطأ في الطرفية بدون إسقاط الموقع.

    return {};
    // إرجاع كائن فارغ حتى يعمل الموقع بالـ CSS الافتراضي.
  }
}
// نهاية getThemeVars.

export default async function RootLayout({
  // بداية مكوّن Layout الرئيسي.
  children,
  // محتوى الصفحة الحالية الذي سيتم عرضه داخل layout.
}: Readonly<{ children: React.ReactNode }>) {
  // تعريف نوع children على أنه React Node للقراءة فقط.

  const lang = await getLayoutLang();
  // قراءة اللغة الحالية من الكوكيز.

  const dir = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة حسب اللغة.

  const themeVars = await getThemeVars();
  // جلب CSS variables الخاصة بالثيم.

  return (
    // بداية إخراج HTML الأساسي للموقع.
    <html lang={lang} dir={dir}>
      {/* ضبط لغة واتجاه مستند HTML. */}

      <head>
        {/* رأس المستند. */}

        <link rel="stylesheet" href="/pages/home/css/page.css" />
        {/* تحميل CSS الخاص بالصفحة الرئيسية بشكل عام كما كان في مشروعك. */}
      </head>

      <body className="antialiased" style={themeVars}>
        {/* جسم الموقع بدون next/font/google حتى لا يفشل البناء عند تعذر الوصول إلى Google Fonts. */}

        <ContentProtection />

        <SiteHeader lang={lang} />
        {/* عرض الهيدر العام للموقع مرة واحدة في كل الصفحات. */}

        {children}
        {/* عرض محتوى الصفحة الحالية. */}
      </body>
    </html>
  );
  // نهاية return.
}
// نهاية RootLayout.