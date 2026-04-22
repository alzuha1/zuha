import "./portfolio-page.css";
// استيراد CSS الخاص بواجهة إدارة صفحة Portfolio

import type { ComponentProps } from "react";
// ComponentProps لاستخراج نوع props من PortfolioPageEditor مباشرة
// وهذا هو مفتاح حل مشكلة TypeScript الحالية

import { cookies } from "next/headers";
// قراءة الكوكيز الحالية لمعرفة هل الأدمن مسجل دخول أم لا

import { redirect } from "next/navigation";
// لإعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن أدمن

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import PortfolioPageEditor from "./portfolio-page-editor";
// استيراد محرر صفحة Portfolio
// هذا المكوّن العميلي سيستقبل السجل الأولي ويعرض واجهة التحرير الكاملة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى لا تعتمد على كاش ثابت
// هذا ضروري في صفحات الأدمن لأن البيانات تتغير باستمرار

type PortfolioPageAdminRecord = ComponentProps<
  typeof PortfolioPageEditor
>["initialItem"];
// بدل تعريف النوع محليًا مرة ثانية، نأخذ النوع مباشرة من PortfolioPageEditor
// بهذه الطريقة يصبح page.tsx والمحرر متطابقين 100%
// وينتهي خطأ:
// Two different types with this name exist

type PortfolioPageSections = NonNullable<
  PortfolioPageAdminRecord["sections_json"]
>;
// نستخرج نوع sections_json من نفس النوع الحقيقي القادم من المحرر
// ونستخدم NonNullable لأننا نحتاج بنية صالحة في السجل الافتراضي

function normalizeText(value: unknown, fallback = "") {
  // تنظيف أي قيمة نصية قادمة من القاعدة
  // إذا كانت null أو undefined نعيد fallback
  return String(value ?? fallback).trim();
}

function getAdminCookieNames() {
  // دعم أكثر من اسم كوكي لتفادي التعارض بين النسخ المختلفة
  // بعض الملفات السابقة في المشروع تستخدم admin_session
  // وبعضها يعتمد ADMIN_COOKIE أو zuha_admin
  const envCookie = process.env.ADMIN_COOKIE?.trim();

  return Array.from(
    new Set(
      [envCookie, "admin_session", "zuha_admin"].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
}

function createDefaultPortfolioSections(): PortfolioPageSections {
  // هذه الدالة تنشئ البنية الافتراضية لـ sections_json الخاصة بصفحة Portfolio
  // نستخدمها إذا لم نجد بيانات portfolio في القاعدة
  // أو إذا كانت البيانات ناقصة أو غير صالحة

  return {
    hero: {
      kicker_ar: "ملف الأعمال العقاري",
      kicker_en: "Real Estate Portfolio",
      title_ar: "أعمال مختارة<br/>تعكس القيمة والانضباط",
      title_en: "Selected Works<br/>That Reflect Value and Discipline",
      desc_ar:
        "نستعرض هنا نماذج مختارة من المشاريع، المسارات الاستثمارية، والمخرجات العقارية التي تعبّر عن منهجنا في الجودة، التنظيم، والتمثيل الاحترافي.",
      desc_en:
        "Here we present selected projects, investment paths, and real-estate outputs that reflect our approach to quality, structure, and professional representation.",
      card_title_ar: "استكشف ملف الأعمال",
      card_title_en: "Explore the Portfolio",
      card_desc_ar:
        "محتوى منتقى يوضح كيف تتحول الفكرة العقارية إلى مخرج متماسك بصريًا وتجاريًا واستثماريًا.",
      card_desc_en:
        "Curated content showing how a real-estate idea turns into a coherent visual, commercial, and investment output.",
      card_btn_ar: "استكشف الأعمال",
      card_btn_en: "Explore Works",
      card_btn_href: "/portfolio",
      image_url: "",
    },

    showcase: {
      kicker_ar: "قصص وأعمال مختارة",
      kicker_en: "Selected Stories & Works",
      title_ar: "ملف أعمال يعكس<br/>قوة التنفيذ والتمثيل",
      title_en: "A Portfolio That Reflects<br/>Execution Strength and Representation",
      desc_ar:
        "استعرض أعمالًا ومحتوى مختارًا عبر تصنيفات مختلفة لفهم طريقة بناء القيمة، التموضع، والإخراج المهني في التجارب العقارية.",
      desc_en:
        "Explore selected works and content across multiple categories to understand how value, positioning, and professional presentation are built in real-estate experiences.",

      tabs: {
        all_ar: "الكل",
        all_en: "All",
        dev_ar: "التطوير",
        dev_en: "Development",
        inv_ar: "الاستثمار",
        inv_en: "Investment",
        mng_ar: "الإدارة",
        mng_en: "Management",
      },

      items: [],
    },

    insight: {
      kicker_ar: "رؤية تنفيذية",
      kicker_en: "Execution Insight",
      title_ar: "ملف الأعمال ليس عرضًا شكليًا",
      title_en: "A Portfolio Is Not Decorative Display",
      desc_ar:
        "ملف الأعمال القوي لا يعرض الصور فقط، بل يقدّم منطقًا واضحًا للمشروع أو الأصل، ويمنح المتلقي صورة أكثر نضجًا عن القيمة والاتجاه.",
      desc_en:
        "A strong portfolio does not merely show visuals; it communicates a clear logic for the project or asset and gives the viewer a more mature sense of value and direction.",
    },

    contact: {
      title_ar: "تواصل معنا<br/>لبحث الفرص والأعمال",
      title_en: "Connect With Us<br/>To Discuss Opportunities and Works",
      desc_ar:
        "إذا كنت ترغب في مناقشة مشروع، فرصة، أو إخراج احترافي لملف أعمال عقاري، يمكنك البدء من هذه النقطة.",
      desc_en:
        "If you want to discuss a project, opportunity, or the professional presentation of a real-estate portfolio, you can start here.",
      first_name_ar: "الاسم الأول",
      first_name_en: "First Name",
      second_name_ar: "الاسم الثاني",
      second_name_en: "Second Name",
      last_name_ar: "اسم العائلة",
      last_name_en: "Last Name",
      email_ar: "البريد الإلكتروني",
      email_en: "Email",
      message_ar: "رسالتك",
      message_en: "Message",
      submit_btn_ar: "إرسال",
      submit_btn_en: "Submit",
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
  } as PortfolioPageSections;
  // استخدمنا cast واحد هنا فقط لتثبيت التوافق مع نوع المحرر الحقيقي
  // هذا أكثر أمانًا من تعريف نوع محلي منفصل ومختلف
}

function createDefaultPortfolioRecord(): PortfolioPageAdminRecord {
  // إنشاء سجل افتراضي كامل إذا لم توجد صفحة portfolio بعد في القاعدة
  return {
    slug: "portfolio",
    title_ar: "الأعمال",
    title_en: "Portfolio",
    content_ar:
      "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي.",
    content_en:
      "A professional real-estate portfolio presenting selected works and strategic execution content.",
    is_published: true,
    page_type: "portfolio",
    sections_json: createDefaultPortfolioSections(),
  } as PortfolioPageAdminRecord;
}

async function isAdminAuthorized() {
  // هذه الدالة تتحقق من وجود كوكي أدمن صالح
  // نحافظ على التوافق مع أكثر من اسم كوكي
  const cookieStore = await cookies();
  const cookieNames = getAdminCookieNames();

  return cookieNames.some((cookieName) => {
    const cookieValue = cookieStore.get(cookieName)?.value;
    return Boolean(cookieValue);
  });
}

async function getInitialPortfolioRecord(): Promise<PortfolioPageAdminRecord> {
  // هذه الدالة تجلب سجل portfolio من جدول pages
  // وإذا لم تجده أو كانت البيانات ناقصة، تعيد سجلًا افتراضيًا صالحًا للعرض والتحرير

  const fallbackRecord = createDefaultPortfolioRecord();
  // السجل الافتراضي الذي نرجع إليه عند أي نقص أو فشل

  try {
    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .eq("slug", "portfolio")
      .maybeSingle();
    // جلب صف portfolio من جدول pages

    if (error || !data) {
      return fallbackRecord;
    }
    // إذا فشل الجلب أو لم نجد الصف نرجع fallback

    return {
      slug: normalizeText(data.slug, "portfolio"),
      title_ar: normalizeText(data.title_ar, fallbackRecord.title_ar),
      title_en: normalizeText(data.title_en, fallbackRecord.title_en),
      content_ar: normalizeText(data.content_ar, fallbackRecord.content_ar),
      content_en: normalizeText(data.content_en, fallbackRecord.content_en),
      is_published:
        typeof data.is_published === "boolean"
          ? data.is_published
          : fallbackRecord.is_published,
      page_type: normalizeText(data.page_type, "portfolio") || "portfolio",
      sections_json:
        data.sections_json && typeof data.sections_json === "object"
          ? (data.sections_json as PortfolioPageSections)
          : fallbackRecord.sections_json,
    } as PortfolioPageAdminRecord;
    // تطبيع البيانات القادمة من القاعدة
    // وعدم السماح بمرور null أو بنى مكسورة إلى محرر الأدمن
  } catch (error) {
    console.error("Admin portfolio page fetch error:", error);
    // طباعة الخطأ في الطرفية لتتبع المشكلة أثناء التطوير

    return fallbackRecord;
    // العودة إلى السجل الافتراضي بدل كسر الصفحة
  }
}

export default async function AdminPortfolioPage() {
  // الصفحة الرئيسية لإدارة صفحة Portfolio

  const authorized = await isAdminAuthorized();
  // التحقق من صلاحية الأدمن

  if (!authorized) {
    redirect("/admin/login?next=/admin/portfolio-page");
  }
  // إذا لم يكن المستخدم أدمن نعيد توجيهه إلى صفحة تسجيل الدخول
  // مع الاحتفاظ بالمسار المطلوب داخل next

  const initialItem = await getInitialPortfolioRecord();
  // جلب البيانات الأولية لصفحة الأعمال

  return <PortfolioPageEditor initialItem={initialItem} />;
  // تمرير السجل الأولي إلى محرر الأدمن
}