import { NextResponse } from "next/server";
// NextResponse لإرجاع JSON منظم داخل Route Handler

import { cookies } from "next/headers";
// قراءة كوكي الأدمن الحالية

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// جعل الـ API ديناميكيًا وعدم الاعتماد على الكاش

type ServicesPageSections = Record<string, unknown>;
// تعريف عام لبنية sections_json
// نتركه مرنًا لأن البنية كبيرة ومتداخلة وسنحررها من لوحة الأدمن

type ServicesPageAdminRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: ServicesPageSections | null;
};
// شكل السجل الذي نعمل عليه في صفحة services

type ServicesPagePatchPayload = {
  title_ar?: string;
  title_en?: string;
  content_ar?: string;
  content_en?: string;
  is_published?: boolean;
  sections_json?: ServicesPageSections | null;
};
// شكل البيانات المتوقع استقبالها من لوحة الأدمن عند الحفظ

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  // إذا لم تكن Object نرجع كائنًا فارغًا بدل كسر التنفيذ
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تنظيف أي نص قادم من الواجهة
  // إزالة الفراغات الزائدة وتحويل undefined/null إلى fallback
  return String(value ?? fallback).trim();
}

function createDefaultServicesSections(): ServicesPageSections {
  // هذه البنية الافتراضية تُستخدم إذا لم توجد صفحة services أصلًا
  // أو كانت sections_json فارغة
  return {
    hero: {
      kicker_ar: "منظومة خدمات الزُهى",
      kicker_en: "ALZUHA Service Platform",
      title_ar: "حلول عقارية تنفيذية<br/>مصممة للنمو والجودة",
      title_en: "Executive Real-Estate Solutions<br/>Built for Growth and Quality",
      desc_ar:
        "صُممت خدمات الزُهى لتخدم دورة الأصل العقاري كاملة ضمن إطار يوازن بين القيمة، الكفاءة، والانضباط التنفيذي.",
      desc_en:
        "ALZUHA services are designed to support the full life cycle of a real-estate asset through a framework that balances value, efficiency, and execution discipline.",
      btn1_ar: "استكشف خدماتنا",
      btn1_en: "Explore Our Services",
      btn1_href: "/services/explore",
      btn2_ar: "مكتب الخدمات",
      btn2_en: "Service Desk",
      btn2_href: "/services/service-desk",
      image_url: "",
    },

    servicesSection: {
      title_ar: "خدمات متخصصة<br/>لكل مرحلة من دورة الأصل",
      title_en: "Specialized Services<br/>for Every Asset Stage",
      desc_ar:
        "منظومة خدمات متخصصة تساعد على بناء المشروع، تقييم الأصل، دعم القرار، وتحسين التمركز السوقي.",
      desc_en:
        "A specialized service platform built to support development, asset assessment, decision support, and market positioning.",
      items: [],
    },

    serviceDetails: {
      items: [],
    },

    testimonials: {
      kicker_ar: "الأثر الحقيقي للخدمة",
      kicker_en: "The Real Impact of Service",
      title_ar: "نتائج تعكس جودة التنفيذ",
      title_en: "Results That Reflect Execution Quality",
      desc_ar: "تجارب تعكس وضوح المعالجة وقوة التنفيذ.",
      desc_en: "Experiences reflecting clarity of approach and quality of execution.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
      items: [],
    },

    gallery: {
      title_ar: "نماذج منتقاة من البيئات والمخرجات",
      title_en: "Selected Environments & Outputs",
      desc_ar: "صور تعبّر عن الجودة والانضباط والهوية العقارية.",
      desc_en: "Visual selections reflecting quality, discipline, and real-estate identity.",
      images: [],
    },

    cta: {
      title_ar: "اختر المسار الخدمي<br/>الأنسب لاحتياجك",
      title_en: "Choose the Service Path<br/>That Fits Your Need",
      desc_ar: "ابدأ من المسار الأنسب حسب طبيعة الاحتياج الحالي.",
      desc_en: "Start from the path that best matches your current need.",
      label_ar: "مكتب الخدمات",
      label_en: "Service Desk",
      button_ar: "الدخول إلى مكتب الخدمات",
      button_en: "Open Service Desk",
      button_href: "/services/service-desk",
    },

    footer: {
      email: "info@alzuharealestate.com",
      social1_ar: "لينكدإن",
      social1_en: "LinkedIn",
      social1_href: "#",
      social2_ar: "انستغرام",
      social2_en: "Instagram",
      social2_href: "#",
      social3_ar: "دريبل",
      social3_en: "Dribbble",
      social3_href: "#",
      copy_ar: "جميع الحقوق محفوظة © الزُهى 2026",
      copy_en: "All rights reserved © ALZUHA 2026",
      privacy_ar: "سياسة الخصوصية",
      privacy_en: "Privacy Policy",
      privacy_href: "/privacy-policy",
    },
  };
}

function createDefaultServicesRecord(): ServicesPageAdminRecord {
  // إنشاء سجل افتراضي كامل إذا لم توجد صفحة services بعد
  return {
    slug: "services",
    title_ar: "الخدمات",
    title_en: "Services",
    content_ar: "منظومة خدمات عقارية تنفيذية متقدمة.",
    content_en: "An advanced executive real-estate service platform.",
    is_published: true,
    page_type: "services",
    sections_json: createDefaultServicesSections(),
  };
}

async function isAdminAuthorized() {
  // التحقق من وجود كوكي الأدمن
  // هذا نفس المنطق الذي اعتمدناه سابقًا في صفحات الأدمن الأخرى
  const cookieStore: any = await Promise.resolve(cookies() as any);

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // اسم كوكي الأدمن من متغيرات البيئة أو fallback افتراضي

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // قراءة قيمة الكوكي

  return Boolean(adminCookie);
  // إذا وُجدت القيمة نعتبره أدمن
}

export async function GET() {
  // هذه الدالة تجلب إعدادات صفحة services كاملة للأدمن
  try {
    const authorized = await isAdminAuthorized();
    // التحقق من صلاحية الأدمن أولًا

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // إذا لم يكن المستخدم أدمن نمنع الوصول

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .eq("slug", "services")
      .maybeSingle();
    // جلب صف services من جدول pages

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }
    // في حال خطأ من Supabase نرجع خطأ واضح

    const fallbackRecord = createDefaultServicesRecord();
    // سجل افتراضي إذا لم توجد الصفحة أصلًا

    const item: ServicesPageAdminRecord = data
      ? {
          slug: normalizeText(data.slug, "services"),
          title_ar: normalizeText(data.title_ar, fallbackRecord.title_ar),
          title_en: normalizeText(data.title_en, fallbackRecord.title_en),
          content_ar: normalizeText(data.content_ar, fallbackRecord.content_ar),
          content_en: normalizeText(data.content_en, fallbackRecord.content_en),
          is_published:
            typeof data.is_published === "boolean"
              ? data.is_published
              : fallbackRecord.is_published,
          page_type: normalizeText(data.page_type, "services") || "services",
          sections_json:
            data.sections_json && typeof data.sections_json === "object"
              ? (data.sections_json as ServicesPageSections)
              : fallbackRecord.sections_json,
        }
      : fallbackRecord;
    // إذا وجدنا السجل نُطبّع قيمه
    // وإذا لم نجده نُرجع سجلًا افتراضيًا جاهزًا لواجهة الأدمن

    return NextResponse.json({
      ok: true,
      item,
    });
    // إعادة السجل النهائي إلى لوحة الأدمن
  } catch (error) {
    console.error("admin services-page GET error:", error);
    // طباعة الخطأ في الطرفية

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  // هذه الدالة تحفظ تعديلات الأدمن على صفحة services
  try {
    const authorized = await isAdminAuthorized();
    // التحقق من صلاحية الأدمن أولًا

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // منع الوصول إذا لم يكن المستخدم أدمن

    const body = (await req.json().catch(() => ({}))) as ServicesPagePatchPayload;
    // قراءة البيانات القادمة من الواجهة بشكل آمن

    const title_ar = normalizeText(body.title_ar, "الخدمات");
    // العنوان العربي

    const title_en = normalizeText(body.title_en, "Services");
    // العنوان الإنجليزي

    const content_ar = normalizeText(
      body.content_ar,
      "منظومة خدمات عقارية تنفيذية متقدمة."
    );
    // الوصف العربي

    const content_en = normalizeText(
      body.content_en,
      "An advanced executive real-estate service platform."
    );
    // الوصف الإنجليزي

    const is_published =
      typeof body.is_published === "boolean" ? body.is_published : true;
    // حالة النشر

    const sections_json =
      body.sections_json && typeof body.sections_json === "object"
        ? asObject(body.sections_json)
        : createDefaultServicesSections();
    // sections_json القادمة من لوحة الأدمن
    // إذا كانت غير صالحة نستخدم البنية الافتراضية

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const upsertPayload = {
      slug: "services",
      title_ar,
      title_en,
      content_ar,
      content_en,
      is_published,
      page_type: "services",
      sections_json,
    };
    // الحمولة التي سنحفظها داخل صف services

    const { data, error } = await supabase
      .from("pages")
      .upsert(upsertPayload, {
        onConflict: "slug",
      })
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .single();
    // الحفظ بطريقة upsert:
    // - إذا الصف موجود يتم تحديثه
    // - إذا غير موجود يتم إنشاؤه
    // وهذا الأنسب لصفحة services

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }
    // إذا فشل الحفظ نرجع رسالة واضحة

    const item: ServicesPageAdminRecord = {
      slug: normalizeText(data.slug, "services"),
      title_ar: normalizeText(data.title_ar, "الخدمات"),
      title_en: normalizeText(data.title_en, "Services"),
      content_ar: normalizeText(
        data.content_ar,
        "منظومة خدمات عقارية تنفيذية متقدمة."
      ),
      content_en: normalizeText(
        data.content_en,
        "An advanced executive real-estate service platform."
      ),
      is_published:
        typeof data.is_published === "boolean" ? data.is_published : true,
      page_type: normalizeText(data.page_type, "services") || "services",
      sections_json:
        data.sections_json && typeof data.sections_json === "object"
          ? (data.sections_json as ServicesPageSections)
          : createDefaultServicesSections(),
    };
    // تطبيع السجل النهائي بعد الحفظ

    return NextResponse.json({
      ok: true,
      item,
    });
    // إعادة السجل المحدث إلى الواجهة
  } catch (error) {
    console.error("admin services-page PATCH error:", error);
    // طباعة الخطأ في الطرفية

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}