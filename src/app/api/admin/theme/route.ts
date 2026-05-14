import { cookies } from "next/headers";
// قراءة كوكي الأدمن داخل API.

import { NextResponse } from "next/server";
// إنشاء استجابات JSON.

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase السيرفري.

export const dynamic = "force-dynamic";
// يمنع كاش API.

type ThemeSettings = Record<string, any>;
// نوع مرن لإعدادات الثيم المخزنة داخل sections_json.

function defaultThemeSettings(): ThemeSettings {
  // القيم الافتراضية الآمنة للثيم العام.
  return {
    colors: {
      primary: "#244fca",
      secondary: "#d7b85a",
      pageBg: "#ffffff",
      text: "#171717",
      muted: "#64748b",
      buttonBg: "#244fca",
      buttonText: "#ffffff",
      headerBg: "#244fca",
      headerText: "#ffffff",
      headerLink: "rgba(230,230,230,0.86)",
      headerActive: "#ffffff",
      mobileMenuBg: "#ffffff",
      mobileMenuText: "#111827",
    },
    typography: {
      baseFontSize: 16,
      navFontSize: 15,
      navWeight: 850,
      buttonFontSize: 16,
      lineHeight: 1.5,
    },
    header: {
      height: 92,
      paddingX: 90,
      navGap: 34,
      shadow: 0,
      borderOpacity: 0.1,
      logoWidth: 156,
      logoHeight: 74,
      logoRadius: 28,
      logoScale: 1.18,
      logoBg: "#cfcfcf",
      logoBorderColor: "#d7b85a",
      logoShadow: 22,
    },
    buttons: {
      radius: 999,
      shadow: 18,
    },
  };
}

function mergeTheme(value: any): ThemeSettings {
  // يدمج الثيم القادم من قاعدة البيانات فوق القيم الافتراضية.
  const base = defaultThemeSettings();
  // القاعدة الافتراضية.
  const incoming = value && typeof value === "object" ? value : {};
  // حماية من null أو نوع غير object.
  return {
    ...base,
    ...incoming,
    colors: { ...base.colors, ...(incoming.colors || {}) },
    typography: { ...base.typography, ...(incoming.typography || {}) },
    header: { ...base.header, ...(incoming.header || {}) },
    buttons: { ...base.buttons, ...(incoming.buttons || {}) },
  };
}

async function isAdminAuthorized() {
  // يتحقق من كوكي الأدمن.
  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز.
  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // اسم الكوكي.
  return Boolean(cookieStore?.get?.(adminCookieName)?.value);
  // true عند وجود الكوكي.
}

export async function GET() {
  // قراءة ثيم الموقع.
  const supabase = supabaseServer();
  // عميل Supabase.

  const { data, error } = await supabase
    .from("pages")
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    .eq("slug", "theme")
    .maybeSingle();
  // جلب سجل theme.

  if (error) {
    // عند فشل قاعدة البيانات.
    return NextResponse.json({ ok: false, message: error.message, item: null }, { status: 500 });
    // إعادة خطأ واضح.
  }

  const item = data || {
    slug: "theme",
    title_ar: "ثيم الموقع",
    title_en: "Site Theme",
    content_ar: "إعدادات التصميم العام للموقع.",
    content_en: "Global design settings for the website.",
    is_published: true,
    page_type: "theme",
    sections_json: defaultThemeSettings(),
  };
  // fallback إذا لم يوجد السجل.

  return NextResponse.json({ ok: true, item: { ...item, sections_json: mergeTheme(item.sections_json) } });
  // إرجاع الثيم بعد الدمج.
}

export async function PATCH(request: Request) {
  // حفظ ثيم الموقع.
  const authorized = await isAdminAuthorized();
  // تحقق الأدمن.

  if (!authorized) {
    // إذا لم يكن مصرحًا.
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    // منع الحفظ.
  }

  const body = await request.json().catch(() => ({}));
  // قراءة جسم الطلب بأمان.

  const sections_json = mergeTheme(body.sections_json || body.theme || body);
  // قبول أكثر من صيغة ثم دمجها.

  const payload = {
    slug: "theme",
    title_ar: body.title_ar || "ثيم الموقع",
    title_en: body.title_en || "Site Theme",
    content_ar: body.content_ar || "إعدادات التصميم العام للموقع.",
    content_en: body.content_en || "Global design settings for the website.",
    is_published: true,
    page_type: "theme",
    sections_json,
  };
  // سجل pages الذي سنحفظه.

  const supabase = supabaseServer();
  // عميل Supabase.

  const { data, error } = await supabase
    .from("pages")
    .upsert(payload, { onConflict: "slug" })
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    .single();
  // upsert حتى ينشئ السجل إذا لم يكن موجودًا.

  if (error) {
    // إذا فشل الحفظ.
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    // رسالة خطأ.
  }

  return NextResponse.json({ ok: true, item: { ...data, sections_json: mergeTheme(data.sections_json) } });
  // إرجاع السجل المحفوظ.
}
