import "./theme.css";
// يستورد ملف تنسيق صفحة Theme Admin فقط.

import { cookies } from "next/headers";
// يستورد cookies لقراءة كوكي تسجيل دخول الأدمن من السيرفر.

import { redirect } from "next/navigation";
// يستورد redirect لإعادة المستخدم غير المصرح له إلى صفحة تسجيل الدخول.

import { supabaseServer } from "@/lib/supabase-server";
// يستورد Supabase server client المستخدم داخل المشروع.

import ThemeEditor from "./theme-editor";
// يستورد محرر الثيم فقط، بدون استدعاء أي دالة من Client Component.

export const dynamic = "force-dynamic";
// يجعل صفحة الثيم ديناميكية دائمًا حتى لا تعتمد على كاش قديم.

type ThemeSettings = {
  // نوع إعدادات الثيم داخل sections_json.
  colors: {
    // مجموعة ألوان الموقع العامة.
    primary: string;
    // اللون الأساسي العام.
    secondary: string;
    // اللون الثانوي العام.
    pageBg: string;
    // لون خلفية الموقع العامة.
    text: string;
    // لون النص الأساسي.
    muted: string;
    // لون النص الهادئ أو الثانوي.
    buttonBg: string;
    // لون خلفية الأزرار.
    buttonText: string;
    // لون نص الأزرار.
    headerBg: string;
    // لون خلفية الهيدر.
    headerText: string;
    // لون النص العام داخل الهيدر.
    headerLink: string;
    // لون روابط الهيدر.
    headerActive: string;
    // لون الرابط النشط في الهيدر.
    mobileMenuBg: string;
    // لون خلفية قائمة الموبايل.
    mobileMenuText: string;
    // لون نص قائمة الموبايل.
  };
  // نهاية colors.
  typography: {
    // إعدادات الخطوط والأحجام.
    baseFontSize: number;
    // حجم الخط العام.
    navFontSize: number;
    // حجم خط روابط الهيدر.
    navWeight: number;
    // سماكة خط روابط الهيدر.
    buttonFontSize: number;
    // حجم خط الأزرار.
    lineHeight: number;
    // ارتفاع السطر العام.
  };
  // نهاية typography.
  header: {
    // إعدادات الهيدر والشعار.
    height: number;
    // ارتفاع الهيدر.
    paddingX: number;
    // المسافة الجانبية داخل الهيدر.
    navGap: number;
    // المسافة بين روابط الهيدر.
    shadow: number;
    // قوة ظل الهيدر.
    borderOpacity: number;
    // شفافية حد الهيدر السفلي.
    logoWidth: number;
    // عرض الشعار.
    logoHeight: number;
    // ارتفاع الشعار.
    logoRadius: number;
    // تدوير زوايا إطار الشعار.
    logoScale: number;
    // تكبير صورة الشعار داخل الإطار.
    logoBg: string;
    // خلفية إطار الشعار.
    logoBorderColor: string;
    // لون حد الشعار.
    logoShadow: number;
    // قوة ظل الشعار.
  };
  // نهاية header.
  buttons: {
    // إعدادات الأزرار العامة.
    radius: number;
    // تدوير زوايا الأزرار.
    shadow: number;
    // قوة ظل الأزرار.
  };
  // نهاية buttons.
};
// نهاية ThemeSettings.

type ThemeAdminRecord = {
  // نوع سجل الثيم القادم من جدول pages.
  slug: string;
  // slug السجل ويجب أن يكون theme.
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
// نهاية ThemeAdminRecord.

async function isAdminAuthorized() {
  // يتحقق من وجود كوكي الأدمن بنفس نمط صفحات الأدمن الحالية.
  const cookieStore: any = await Promise.resolve(cookies() as any);
  // يقرأ الكوكيز من السيرفر بطريقة متوافقة مع نسخ Next المختلفة.

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // يحدد اسم كوكي الأدمن من ملف البيئة أو يستخدم الاسم الافتراضي.

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // يقرأ قيمة كوكي الأدمن إن كانت موجودة.

  return Boolean(adminCookie);
  // يرجع true إذا كان الكوكي موجودًا.
}
// نهاية isAdminAuthorized.

function fallbackThemeSettings(): ThemeSettings {
  // يرجع إعدادات ثيم افتراضية كاملة متوافقة مع theme-editor.tsx.
  return {
    // بداية كائن إعدادات الثيم.
    colors: {
      // بداية إعدادات الألوان.
      primary: "#244fca",
      // اللون الأساسي الافتراضي.
      secondary: "#d7b85a",
      // اللون الثانوي الذهبي الافتراضي.
      pageBg: "#ffffff",
      // خلفية الموقع الافتراضية.
      text: "#171717",
      // لون النص الأساسي.
      muted: "#64748b",
      // لون النص الهادئ.
      buttonBg: "#244fca",
      // خلفية الأزرار.
      buttonText: "#ffffff",
      // لون نص الأزرار.
      headerBg: "#244fca",
      // خلفية الهيدر.
      headerText: "#ffffff",
      // نص الهيدر.
      headerLink: "rgba(230,230,230,0.86)",
      // لون روابط الهيدر.
      headerActive: "#ffffff",
      // لون الرابط النشط.
      mobileMenuBg: "#ffffff",
      // خلفية قائمة الموبايل.
      mobileMenuText: "#111827",
      // نص قائمة الموبايل.
    },
    // نهاية colors.
    typography: {
      // بداية إعدادات الخطوط.
      baseFontSize: 16,
      // حجم الخط العام.
      navFontSize: 15,
      // حجم خط روابط الهيدر.
      navWeight: 850,
      // سماكة روابط الهيدر.
      buttonFontSize: 16,
      // حجم خط الأزرار.
      lineHeight: 1.5,
      // ارتفاع السطر.
    },
    // نهاية typography.
    header: {
      // بداية إعدادات الهيدر.
      height: 92,
      // ارتفاع الهيدر.
      paddingX: 90,
      // المسافة الجانبية.
      navGap: 34,
      // المسافة بين الروابط.
      shadow: 0,
      // ظل الهيدر.
      borderOpacity: 0.1,
      // شفافية حد الهيدر.
      logoWidth: 156,
      // عرض الشعار.
      logoHeight: 74,
      // ارتفاع الشعار.
      logoRadius: 28,
      // تدوير الشعار.
      logoScale: 1.18,
      // تكبير صورة الشعار.
      logoBg: "#cfcfcf",
      // خلفية إطار الشعار.
      logoBorderColor: "#d7b85a",
      // لون حد الشعار.
      logoShadow: 22,
      // ظل الشعار.
    },
    // نهاية header.
    buttons: {
      // بداية إعدادات الأزرار.
      radius: 999,
      // تدوير الأزرار.
      shadow: 18,
      // ظل الأزرار.
    },
    // نهاية buttons.
  };
  // نهاية return.
}
// نهاية fallbackThemeSettings.

function fallbackRecord(): ThemeAdminRecord {
  // ينشئ سجلًا افتراضيًا إذا لم يوجد سجل theme داخل قاعدة البيانات.
  return {
    // بداية السجل الافتراضي.
    slug: "theme",
    // slug الثيم.
    title_ar: "ثيم الموقع",
    // العنوان العربي.
    title_en: "Site Theme",
    // العنوان الإنجليزي.
    content_ar: "إعدادات التصميم العام للموقع.",
    // الوصف العربي.
    content_en: "Global design settings for the website.",
    // الوصف الإنجليزي.
    is_published: true,
    // جعل السجل منشورًا.
    page_type: "theme",
    // نوع الصفحة.
    sections_json: fallbackThemeSettings(),
    // إعدادات الثيم الافتراضية.
  };
  // نهاية return.
}
// نهاية fallbackRecord.

function normalizeThemeRecord(value: any): ThemeAdminRecord {
  // يدمج بيانات قاعدة البيانات مع القيم الافتراضية حتى لا تنقص أي مفاتيح.
  const fallback = fallbackRecord();
  // يحضر السجل الافتراضي الكامل.

  const incomingSettings = value?.sections_json || {};
  // يقرأ sections_json القادم من قاعدة البيانات أو يستخدم كائنًا فارغًا.

  return {
    // بداية السجل النهائي.
    ...fallback,
    // يضع القيم الافتراضية أولًا.
    ...(value || {}),
    // يضع بيانات قاعدة البيانات فوقها إن وجدت.
    sections_json: {
      // بداية دمج إعدادات الثيم.
      colors: {
        // بداية دمج الألوان.
        ...fallback.sections_json.colors,
        // ألوان افتراضية.
        ...(incomingSettings.colors || {}),
        // ألوان محفوظة.
      },
      // نهاية colors.
      typography: {
        // بداية دمج الخطوط.
        ...fallback.sections_json.typography,
        // إعدادات خطوط افتراضية.
        ...(incomingSettings.typography || {}),
        // إعدادات خطوط محفوظة.
      },
      // نهاية typography.
      header: {
        // بداية دمج الهيدر.
        ...fallback.sections_json.header,
        // إعدادات هيدر افتراضية.
        ...(incomingSettings.header || {}),
        // إعدادات هيدر محفوظة.
      },
      // نهاية header.
      buttons: {
        // بداية دمج الأزرار.
        ...fallback.sections_json.buttons,
        // إعدادات أزرار افتراضية.
        ...(incomingSettings.buttons || {}),
        // إعدادات أزرار محفوظة.
      },
      // نهاية buttons.
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
    // إذا لم يكن المستخدم مسجل دخول كأدمن.
    redirect("/admin/login?next=/admin/theme");
    // يعيده إلى تسجيل الدخول مع رابط الرجوع.
  }

  const supabase = supabaseServer();
  // ينشئ Supabase server client.

  const { data, error } = await supabase
    // يبدأ استعلام Supabase.
    .from("pages")
    // يقرأ من جدول pages.
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    // يحدد الأعمدة المطلوبة فقط.
    .eq("slug", "theme")
    // يبحث عن سجل theme.
    .maybeSingle();
  // يرجع سجلًا واحدًا أو null.

  if (error) {
    // إذا حدث خطأ في القراءة.
    console.error("Admin theme fetch error:", error.message);
    // يسجل الخطأ في الطرفية ولا يكسر الصفحة.
  }

  const initialItem = normalizeThemeRecord(data);
  // يجهز السجل النهائي المتوافق مع ThemeEditor.

  return <ThemeEditor initialItem={initialItem} />;
  // يمرر السجل إلى محرر الثيم.
}
// نهاية AdminThemePage.