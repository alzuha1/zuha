import "./services-page.css";
// استيراد CSS الخاص بواجهة إدارة صفحة الخدمات

import type { ComponentProps } from "react";
// ComponentProps لاستخراج نوع initialItem من ServicesPageEditor نفسه
// وهذا هو الحل الآمن لإزالة تعارض الأنواع بدون إعادة تصميم الملف

import { cookies } from "next/headers";
// قراءة الكوكيز الحالية لمعرفة هل الأدمن مسجل دخول أم لا

import { redirect } from "next/navigation";
// لإعادة توجيه المستخدم إذا لم يكن أدمن

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import ServicesPageEditor from "./services-page-editor";
// استيراد محرر صفحة الخدمات
// هذا المكوّن العميلي سيأخذ السجل الأولي ويعرض واجهة التعديل الكاملة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى لا تعتمد على كاش ثابت
// هذا مهم في صفحات الأدمن لأن المحتوى يتغير باستمرار

type ServicesPageAdminRecord = ComponentProps<
  typeof ServicesPageEditor
>["initialItem"];
// هذا هو التعديل الجوهري الأهم
// بدل تعريف النوع محليًا مرة ثانية، نأخذ النوع مباشرة من ServicesPageEditor
// بهذه الطريقة يصبح page.tsx والمحرر متطابقين 100%
// وتنتهي مشكلة:
// Two different types with this name exist

type ServicesPageSections = NonNullable<
  ServicesPageAdminRecord["sections_json"]
>;
// استخراج نوع sections_json الحقيقي من نفس نوع المحرر
// بدل تعريف عام من نوع Record<string, unknown> قد يسبب تعارضًا

function normalizeText(value: unknown, fallback = "") {
  // تنظيف أي قيمة نصية قادمة من القاعدة
  // إذا كانت null أو undefined نعيد fallback
  return String(value ?? fallback).trim();
}

function createDefaultServicesSections(): ServicesPageSections {
  // هذه الدالة تنشئ البنية الافتراضية لـ sections_json
  // نستخدمها إذا لم نجد بيانات services في القاعدة
  // أو إذا كانت البيانات ناقصة أو غير صالحة

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
      desc_en:
        "Experiences reflecting clarity of approach and quality of execution.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
      items: [],
    },

    gallery: {
      title_ar: "نماذج منتقاة من البيئات والمخرجات",
      title_en: "Selected Environments & Outputs",
      desc_ar: "صور تعبّر عن الجودة والانضباط والهوية العقارية.",
      desc_en:
        "Visual selections reflecting quality, discipline, and real-estate identity.",
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
  } as ServicesPageSections;
  // cast واحد فقط لتثبيت التوافق مع النوع الحقيقي للمحرر
  // بدل النوع العام القديم الذي كان سبب المشكلة
}

function createDefaultServicesRecord(): ServicesPageAdminRecord {
  // إنشاء سجل افتراضي كامل إذا لم توجد صفحة services بعد في القاعدة
  return {
    slug: "services",
    title_ar: "الخدمات",
    title_en: "Services",
    content_ar: "منظومة خدمات عقارية تنفيذية متقدمة.",
    content_en: "An advanced executive real-estate service platform.",
    is_published: true,
    page_type: "services",
    sections_json: createDefaultServicesSections(),
  } as ServicesPageAdminRecord;
}

async function isAdminAuthorized() {
  // هذه الدالة تتحقق من وجود كوكي الأدمن
  // نفس الفكرة المستخدمة في باقي صفحات الأدمن حتى نحافظ على التناسق

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // أبقينا هذا السطر كما هو لتجنب المجازفة بتغيير نمط الملف القديم أكثر من اللازم

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // اسم كوكي الأدمن من .env.local أو fallback افتراضي

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // محاولة قراءة قيمة الكوكي

  return Boolean(adminCookie);
  // إذا وُجدت قيمة نعتبر المستخدم أدمن
}

async function getInitialServicesRecord(): Promise<ServicesPageAdminRecord> {
  // هذه الدالة تجلب سجل services من جدول pages
  // وإذا لم تجده أو كانت البيانات ناقصة، تعيد سجلًا افتراضيًا صالحًا للعرض والتحرير

  const fallbackRecord = createDefaultServicesRecord();
  // السجل الافتراضي الذي نرجع إليه عند أي نقص أو فشل

  try {
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

    if (error || !data) {
      return fallbackRecord;
    }
    // إذا فشل الجلب أو لم نجد الصف نرجع fallback

    return {
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
    } as ServicesPageAdminRecord;
    // تطبيع البيانات القادمة من القاعدة
    // وعدم السماح بمرور null أو بنى غير صالحة إلى محرر الأدمن
  } catch (error) {
    console.error("Admin services page fetch error:", error);
    // طباعة الخطأ في الطرفية لتتبع المشكلة أثناء التطوير

    return fallbackRecord;
    // العودة إلى السجل الافتراضي بدل كسر الصفحة
  }
}

export default async function AdminServicesPage() {
  // الصفحة الرئيسية لإدارة صفحة الخدمات

  const authorized = await isAdminAuthorized();
  // التحقق من صلاحية الأدمن

  if (!authorized) {
    redirect("/admin/login?next=/admin/services-page");
  }
  // إذا لم يكن المستخدم أدمن نعيد توجيهه إلى صفحة تسجيل الدخول
  // مع الاحتفاظ بالمسار المطلوب داخل next

  const initialItem = await getInitialServicesRecord();
  // جلب البيانات الأولية لصفحة الخدمات

  return <ServicesPageEditor initialItem={initialItem} />;
  // تمرير السجل إلى محرر الأدمن
}