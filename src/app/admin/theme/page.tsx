import "./theme.css";
// يستورد ملف تنسيق صفحة Theme Admin فقط.

import { cookies } from "next/headers";
// يستورد cookies لقراءة كوكي تسجيل دخول الأدمن من السيرفر.

import { redirect } from "next/navigation";
// يستورد redirect لإعادة غير المصرح له إلى صفحة تسجيل الدخول.

import { supabaseServer } from "@/lib/supabase-server";
// يستورد Supabase server client المستخدم في المشروع.

import ThemeEditor from "./theme-editor";
// يستورد محرر الثيم فقط، بدون استيراد دوال أو أنواع من Client Component.

export const dynamic = "force-dynamic";
// يجعل الصفحة ديناميكية دائمًا حتى لا تُعرض نسخة كاش قديمة من إعدادات الثيم.

type ThemeSettings = {
  // نوع إعدادات الثيم المخزنة داخل sections_json.
  colors: {
    // مجموعة ألوان الموقع العامة.
    siteBg: string;
    // لون خلفية الموقع العامة.
    text: string;
    // لون النص العام.
    headerBg: string;
    // لون خلفية الهيدر.
    headerText: string;
    // لون روابط ونصوص الهيدر.
    headerActive: string;
    // لون الرابط النشط داخل الهيدر.
    buttonBg: string;
    // لون خلفية الأزرار العامة.
    buttonText: string;
    // لون نص الأزرار العامة.
  };
  header: {
    // إعدادات الهيدر على الديسكتوب.
    height: number;
    // ارتفاع الهيدر.
    paddingX: number;
    // المسافة الجانبية داخل الهيدر.
    gap: number;
    // المسافة بين عناصر الهيدر.
    logoWidth: number;
    // عرض الشعار.
    logoHeight: number;
    // ارتفاع الشعار.
    logoRadius: number;
    // تدوير زوايا إطار الشعار.
    logoScale: number;
    // تكبير صورة الشعار داخل الإطار.
    navFontSize: number;
    // حجم خط روابط الهيدر.
    navFontWeight: number;
    // سماكة خط روابط الهيدر.
    navGap: number;
    // المسافة بين روابط الهيدر.
    shadow: number;
    // قوة ظل الهيدر.
  };
  mobile: {
    // إعدادات الهيدر في الموبايل.
    headerHeight: number;
    // ارتفاع الهيدر في الموبايل.
    logoWidth: number;
    // عرض الشعار في الموبايل.
    logoHeight: number;
    // ارتفاع الشعار في الموبايل.
    logoRadius: number;
    // تدوير زوايا الشعار في الموبايل.
  };
};
// نهاية نوع ThemeSettings.

type ThemeAdminRecord = {
  // نوع سجل الثيم القادم من جدول pages.
  slug: string;
  // slug الخاص بالسجل، ويجب أن يكون theme.
  title_ar: string;
  // عنوان السجل بالعربية.
  title_en: string;
  // عنوان السجل بالإنجليزية.
  content_ar: string;
  // وصف السجل بالعربية.
  content_en: string;
  // وصف السجل بالإنجليزية.
  is_published: boolean;
  // حالة النشر.
  page_type: string | null;
  // نوع الصفحة داخل جدول pages.
  sections_json: ThemeSettings;
  // إعدادات الثيم الفعلية.
};
// نهاية نوع ThemeAdminRecord.

async function isAdminAuthorized() {
  // يتحقق من وجود كوكي الأدمن بنفس نمط صفحات الأدمن الحالية.
  const cookieStore: any = await Promise.resolve(cookies() as any);
  // يقرأ الكوكيز بطريقة متوافقة مع نسخ Next المختلفة.

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // يحدد اسم كوكي الأدمن من متغيرات البيئة أو يستخدم الاسم الافتراضي.

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // يقرأ قيمة كوكي الأدمن إن كانت موجودة.

  return Boolean(adminCookie);
  // يرجع true إذا كان الكوكي موجودًا، وإلا false.
}
// نهاية isAdminAuthorized.

function fallbackThemeSettings(): ThemeSettings {
  // يرجع إعدادات ثيم افتراضية إذا لم يوجد سجل theme في قاعدة البيانات.
  return {
    // بداية إعدادات الثيم.
    colors: {
      // بداية ألوان الموقع.
      siteBg: "#ffffff",
      // خلفية الموقع الافتراضية.
      text: "#171717",
      // لون النص الافتراضي.
      headerBg: "#244fca",
      // لون الهيدر الافتراضي.
      headerText: "#d7d7d7",
      // لون روابط الهيدر الافتراضي.
      headerActive: "#ffffff",
      // لون الرابط النشط في الهيدر.
      buttonBg: "#244fca",
      // لون الأزرار الافتراضي.
      buttonText: "#ffffff",
      // لون نص الأزرار الافتراضي.
    },
    // نهاية ألوان الموقع.
    header: {
      // بداية إعدادات الهيدر للديسكتوب.
      height: 92,
      // ارتفاع الهيدر الافتراضي.
      paddingX: 90,
      // المسافة الجانبية الافتراضية.
      gap: 24,
      // المسافة بين عناصر الهيدر.
      logoWidth: 156,
      // عرض الشعار الافتراضي.
      logoHeight: 74,
      // ارتفاع الشعار الافتراضي.
      logoRadius: 28,
      // تدوير زوايا الشعار الافتراضي.
      logoScale: 1.18,
      // تكبير صورة الشعار داخل الإطار.
      navFontSize: 15,
      // حجم خط روابط الهيدر.
      navFontWeight: 850,
      // سماكة خط روابط الهيدر.
      navGap: 34,
      // المسافة بين روابط الهيدر.
      shadow: 0,
      // ظل الهيدر الافتراضي.
    },
    // نهاية إعدادات الهيدر.
    mobile: {
      // بداية إعدادات الموبايل.
      headerHeight: 78,
      // ارتفاع الهيدر في الموبايل.
      logoWidth: 126,
      // عرض الشعار في الموبايل.
      logoHeight: 62,
      // ارتفاع الشعار في الموبايل.
      logoRadius: 22,
      // تدوير زوايا الشعار في الموبايل.
    },
    // نهاية إعدادات الموبايل.
  };
  // نهاية return.
}
// نهاية fallbackThemeSettings.

function fallbackRecord(): ThemeAdminRecord {
  // ينشئ سجلًا افتراضيًا كاملًا إذا لم يوجد سجل theme داخل جدول pages.
  return {
    // بداية السجل الافتراضي.
    slug: "theme",
    // slug الثيم.
    title_ar: "ثيم الموقع",
    // عنوان السجل بالعربية.
    title_en: "Site Theme",
    // عنوان السجل بالإنجليزية.
    content_ar: "إعدادات التصميم العام للموقع.",
    // وصف السجل بالعربية.
    content_en: "Global design settings for the website.",
    // وصف السجل بالإنجليزية.
    is_published: true,
    // جعل السجل منشورًا افتراضيًا.
    page_type: "theme",
    // نوع الصفحة داخل جدول pages.
    sections_json: fallbackThemeSettings(),
    // إعدادات الثيم الافتراضية.
  };
  // نهاية return.
}
// نهاية fallbackRecord.

function normalizeThemeRecord(value: any): ThemeAdminRecord {
  // يدمج السجل القادم من قاعدة البيانات مع fallback لتجنب نقص المفاتيح القديمة.
  const fallback = fallbackRecord();
  // يحضر السجل الافتراضي.

  const incomingSettings = value?.sections_json || {};
  // يقرأ sections_json القادم من قاعدة البيانات إن وجد.

  return {
    // إرجاع سجل مضبوط.
    ...fallback,
    // وضع القيم الافتراضية أولًا.
    ...(value || {}),
    // دمج بيانات قاعدة البيانات فوق القيم الافتراضية.
    sections_json: {
      // دمج إعدادات الثيم.
      colors: {
        // دمج الألوان.
        ...fallback.sections_json.colors,
        // ألوان افتراضية.
        ...(incomingSettings.colors || {}),
        // ألوان محفوظة في قاعدة البيانات.
      },
      // نهاية colors.
      header: {
        // دمج إعدادات الهيدر.
        ...fallback.sections_json.header,
        // إعدادات هيدر افتراضية.
        ...(incomingSettings.header || {}),
        // إعدادات هيدر محفوظة.
      },
      // نهاية header.
      mobile: {
        // دمج إعدادات الموبايل.
        ...fallback.sections_json.mobile,
        // إعدادات موبايل افتراضية.
        ...(incomingSettings.mobile || {}),
        // إعدادات موبايل محفوظة.
      },
      // نهاية mobile.
    },
    // نهاية sections_json.
  };
  // نهاية return.
}
// نهاية normalizeThemeRecord.

export default async function AdminThemePage() {
  // صفحة أدمن الثيم العامة.
  const authorized = await isAdminAuthorized();
  // يتحقق من صلاحية الأدمن.

  if (!authorized) {
    // إذا لا يوجد كوكي أدمن.
    redirect("/admin/login?next=/admin/theme");
    // يعيد المستخدم إلى صفحة تسجيل الدخول مع حفظ وجهته التالية.
  }

  const supabase = supabaseServer();
  // ينشئ عميل Supabase السيرفري.

  const { data, error } = await supabase
    // يبدأ استعلام Supabase.
    .from("pages")
    // يقرأ من جدول pages.
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    // يحدد الأعمدة المطلوبة فقط.
    .eq("slug", "theme")
    // يبحث عن سجل الثيم فقط.
    .maybeSingle();
  // يرجع سجلًا واحدًا أو null إذا غير موجود.

  if (error) {
    // إذا فشل الجلب.
    console.error("Admin theme fetch error:", error.message);
    // يطبع الخطأ في الطرفية بدون إسقاط الصفحة.
  }

  const initialItem = normalizeThemeRecord(data);
  // يجهز السجل النهائي للمحرر مع fallback آمن.

  return <ThemeEditor initialItem={initialItem} />;
  // يمرر السجل إلى Client Component المسؤول عن التحرير.
}
// نهاية AdminThemePage.