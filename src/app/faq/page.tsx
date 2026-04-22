import "./faq.css";
// استيراد CSS الخاص بالواجهة العامة لصفحة FAQ

import { cookies } from "next/headers";
// قراءة كوكي اللغة الحالية من السيرفر

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر لجلب بيانات صفحة FAQ المنشورة

import FaqClient from "./faq-client";
// مكوّن العرض العام لصفحة FAQ
// هذا الملف سنكمله بعده مباشرة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى:
// - تقرأ اللغة من الكوكي
// - تقرأ التعديلات المنشورة من القاعدة مباشرة
// - لا تعتمد على كاش ثابت

type Lang = "ar" | "en";
// اللغتان المدعومتان

type FaqCategoryItem = {
  id: string;
  key: string;
  is_active: boolean;
  sort_order: number;
  label_ar: string;
  label_en: string;
};
// نوع عنصر التصنيف داخل categories.items

type FaqItem = {
  id: string;
  category_key: string;
  is_active: boolean;
  sort_order: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
};
// نوع السؤال/الجواب الواحد داخل faqItems.items

type FaqPageSections = {
  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    btn_ar: string;
    btn_en: string;
    btn_href: string;
  };

  categories: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    items: FaqCategoryItem[];
  };

  faqItems: {
    items: FaqItem[];
  };

  cta: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    button_ar: string;
    button_en: string;
    button_href: string;
  };

  footer: {
    email: string;
    social1_ar: string;
    social1_en: string;
    social1_href: string;
    social2_ar: string;
    social2_en: string;
    social2_href: string;
    social3_ar: string;
    social3_en: string;
    social3_href: string;
    copy_ar: string;
    copy_en: string;
    privacy_ar: string;
    privacy_en: string;
    privacy_href: string;
  };
};
// الشكل الكامل لـ sections_json الخاص بصفحة FAQ

type FaqPageRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: FaqPageSections;
};
// السجل النهائي الذي سنمرره إلى FaqClient

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تنظيف النصوص من null / undefined / الفراغات الزائدة
  return String(value ?? fallback).trim();
}

function normalizeBoolean(value: unknown, fallback = false) {
  // إرجاع boolean آمن
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  // إرجاع رقم آمن
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function createId(prefix: string) {
  // إنشاء معرف احتياطي للعناصر الناقصة
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultCategoryItem(
  key: string,
  order: number,
  label_ar: string,
  label_en: string
): FaqCategoryItem {
  // إنشاء تصنيف افتراضي منظم
  return {
    id: `faq-category-${key}`,
    key,
    is_active: true,
    sort_order: order,
    label_ar,
    label_en,
  };
}

function createDefaultFaqItem(
  id: string,
  category_key: string,
  sort_order: number,
  question_ar: string,
  question_en: string,
  answer_ar: string,
  answer_en: string
): FaqItem {
  // إنشاء سؤال/جواب افتراضي
  return {
    id,
    category_key,
    is_active: true,
    sort_order,
    question_ar,
    question_en,
    answer_ar,
    answer_en,
  };
}

function createDefaultFaqSections(): FaqPageSections {
  // البنية الافتراضية الكاملة لصفحة FAQ
  // تُستخدم إذا لم نجد بيانات صالحة في القاعدة
  return {
    hero: {
      kicker_ar: "إجابات واضحة",
      kicker_en: "Clear Answers",
      title_ar: "الأسئلة الشائعة<br/>بصياغة عملية ومباشرة",
      title_en: "Frequently Asked Questions<br/>With Practical, Direct Answers",
      desc_ar:
        "هذه الصفحة تجمع أكثر الأسئلة شيوعًا حول الخدمات العقارية، آلية العمل، التقييم، التطوير، والتواصل، بصياغة مختصرة وواضحة.",
      desc_en:
        "This page gathers the most common questions about real-estate services, workflow, valuation, development, and communication in a concise and clear format.",
      btn_ar: "طلب استشارة",
      btn_en: "Request Consultation",
      btn_href: "/request-consultation",
    },

    categories: {
      title_ar: "تصنيفات الأسئلة",
      title_en: "Question Categories",
      desc_ar:
        "رتبنا الأسئلة حسب طبيعة الموضوع لتسهيل الوصول إلى الإجابة الصحيحة بسرعة.",
      desc_en:
        "Questions are organized by topic to make it easier to reach the right answer quickly.",
      items: [
        createDefaultCategoryItem("general", 1, "عام", "General"),
        createDefaultCategoryItem("services", 2, "الخدمات", "Services"),
        createDefaultCategoryItem("investment", 3, "الاستثمار", "Investment"),
        createDefaultCategoryItem("contact", 4, "التواصل", "Contact"),
      ],
    },

    faqItems: {
      items: [
        createDefaultFaqItem(
          "faq-1",
          "general",
          1,
          "ما طبيعة عمل شركة الزُهى؟",
          "What is the nature of ALZUHA’s work?",
          "نقدم حلولًا عقارية تشمل التطوير، الاستشارات، تقييم الأصول، ودعم القرار للمشاريع والفرص العقارية.",
          "We provide real-estate solutions including development, advisory, asset assessment, and decision support for projects and opportunities."
        ),
        createDefaultFaqItem(
          "faq-2",
          "services",
          2,
          "هل تقدمون استشارة قبل البدء بالمشروع؟",
          "Do you provide consultation before starting a project?",
          "نعم، نبدأ بفهم الهدف والمرحلة الحالية ثم نقترح المسار الأنسب من الناحية التشغيلية والاستثمارية.",
          "Yes. We start by understanding the objective and current stage, then recommend the most suitable operational and investment path."
        ),
        createDefaultFaqItem(
          "faq-3",
          "investment",
          3,
          "هل يمكن تقييم أصل أو فرصة قبل اتخاذ قرار الاستثمار؟",
          "Can an asset or opportunity be assessed before making an investment decision?",
          "نعم، وهذا جزء أساسي من عملنا. نحلل الأصل أو الفرصة لإعطاء صورة أوضح عن القيمة والملاءمة والمخاطر.",
          "Yes, and that is a core part of our work. We analyze the asset or opportunity to provide a clearer picture of value, fit, and risk."
        ),
        createDefaultFaqItem(
          "faq-4",
          "contact",
          4,
          "كيف أبدأ التواصل معكم؟",
          "How do I start working with you?",
          "ابدأ بطلب استشارة أو عبر صفحة التواصل، وبعدها يتم توجيهك إلى المسار الأنسب حسب نوع الاحتياج.",
          "Start with a consultation request or through the contact page, then you will be guided to the most suitable path based on your need."
        ),
      ],
    },

    cta: {
      title_ar: "لم تجد الإجابة التي تبحث عنها؟",
      title_en: "Didn’t Find the Answer You Need?",
      desc_ar:
        "يمكنك الانتقال مباشرة إلى طلب استشارة حتى نراجع حالتك أو استفسارك بصورة أدق.",
      desc_en:
        "You can move directly to a consultation request so we can review your case or question more precisely.",
      button_ar: "طلب استشارة",
      button_en: "Request Consultation",
      button_href: "/request-consultation",
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

function normalizeCategoryItem(value: unknown, index: number): FaqCategoryItem {
  // تطبيع عنصر تصنيف واحد
  const obj = asObject(value);

  return {
    id: normalizeText(obj.id, createId("faq-category")),
    key: normalizeText(obj.key, index === 0 ? "general" : `category-${index + 1}`),
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    label_ar: normalizeText(obj.label_ar, "تصنيف"),
    label_en: normalizeText(obj.label_en, "Category"),
  };
}

function normalizeFaqItem(value: unknown, index: number): FaqItem {
  // تطبيع عنصر سؤال/جواب واحد
  const obj = asObject(value);

  return {
    id: normalizeText(obj.id, createId("faq-item")),
    category_key: normalizeText(obj.category_key, "general"),
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    question_ar: normalizeText(obj.question_ar, "سؤال جديد"),
    question_en: normalizeText(obj.question_en, "New Question"),
    answer_ar: normalizeText(obj.answer_ar, "إجابة السؤال بالعربية."),
    answer_en: normalizeText(obj.answer_en, "Answer to the question in English."),
  };
}

function normalizeSections(value: unknown): FaqPageSections {
  // دمج sections_json القادمة من القاعدة مع fallback قوي
  const defaults = createDefaultFaqSections();
  const obj = asObject(value);

  const hero = asObject(obj.hero);
  const categories = asObject(obj.categories);
  const faqItems = asObject(obj.faqItems);
  const cta = asObject(obj.cta);
  const footer = asObject(obj.footer);

  return {
    hero: {
      kicker_ar: normalizeText(hero.kicker_ar, defaults.hero.kicker_ar),
      kicker_en: normalizeText(hero.kicker_en, defaults.hero.kicker_en),
      title_ar: normalizeText(hero.title_ar, defaults.hero.title_ar),
      title_en: normalizeText(hero.title_en, defaults.hero.title_en),
      desc_ar: normalizeText(hero.desc_ar, defaults.hero.desc_ar),
      desc_en: normalizeText(hero.desc_en, defaults.hero.desc_en),
      btn_ar: normalizeText(hero.btn_ar, defaults.hero.btn_ar),
      btn_en: normalizeText(hero.btn_en, defaults.hero.btn_en),
      btn_href: normalizeText(hero.btn_href, defaults.hero.btn_href),
    },

    categories: {
      title_ar: normalizeText(categories.title_ar, defaults.categories.title_ar),
      title_en: normalizeText(categories.title_en, defaults.categories.title_en),
      desc_ar: normalizeText(categories.desc_ar, defaults.categories.desc_ar),
      desc_en: normalizeText(categories.desc_en, defaults.categories.desc_en),
      items:
        Array.isArray(categories.items) && categories.items.length > 0
          ? categories.items.map((item, index) => normalizeCategoryItem(item, index))
          : defaults.categories.items,
    },

    faqItems: {
      items:
        Array.isArray(faqItems.items) && faqItems.items.length > 0
          ? faqItems.items.map((item, index) => normalizeFaqItem(item, index))
          : defaults.faqItems.items,
    },

    cta: {
      title_ar: normalizeText(cta.title_ar, defaults.cta.title_ar),
      title_en: normalizeText(cta.title_en, defaults.cta.title_en),
      desc_ar: normalizeText(cta.desc_ar, defaults.cta.desc_ar),
      desc_en: normalizeText(cta.desc_en, defaults.cta.desc_en),
      button_ar: normalizeText(cta.button_ar, defaults.cta.button_ar),
      button_en: normalizeText(cta.button_en, defaults.cta.button_en),
      button_href: normalizeText(cta.button_href, defaults.cta.button_href),
    },

    footer: {
      email: normalizeText(footer.email, defaults.footer.email),
      social1_ar: normalizeText(footer.social1_ar, defaults.footer.social1_ar),
      social1_en: normalizeText(footer.social1_en, defaults.footer.social1_en),
      social1_href: normalizeText(footer.social1_href, defaults.footer.social1_href),
      social2_ar: normalizeText(footer.social2_ar, defaults.footer.social2_ar),
      social2_en: normalizeText(footer.social2_en, defaults.footer.social2_en),
      social2_href: normalizeText(footer.social2_href, defaults.footer.social2_href),
      social3_ar: normalizeText(footer.social3_ar, defaults.footer.social3_ar),
      social3_en: normalizeText(footer.social3_en, defaults.footer.social3_en),
      social3_href: normalizeText(footer.social3_href, defaults.footer.social3_href),
      copy_ar: normalizeText(footer.copy_ar, defaults.footer.copy_ar),
      copy_en: normalizeText(footer.copy_en, defaults.footer.copy_en),
      privacy_ar: normalizeText(footer.privacy_ar, defaults.footer.privacy_ar),
      privacy_en: normalizeText(footer.privacy_en, defaults.footer.privacy_en),
      privacy_href: normalizeText(footer.privacy_href, defaults.footer.privacy_href),
    },
  };
}

async function getPublishedFaqPage(): Promise<FaqPageRecord> {
  // جلب صفحة FAQ المنشورة من القاعدة
  // وإذا لم توجد أو حدث خطأ نرجع fallback كامل وصالح
  const fallbackSections = createDefaultFaqSections();

  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .eq("slug", "faq")
      .eq("is_published", true)
      .maybeSingle();
    // جلب صف faq المنشور فقط

    if (error || !data) {
      return {
        slug: "faq",
        title_ar: "الأسئلة الشائعة",
        title_en: "FAQ",
        content_ar:
          "صفحة الأسئلة الشائعة تقدم إجابات عملية وواضحة على أكثر الاستفسارات شيوعًا.",
        content_en:
          "The FAQ page provides practical and clear answers to the most common questions.",
        is_published: true,
        page_type: "faq",
        sections_json: fallbackSections,
      };
    }

    return {
      slug: normalizeText(data.slug, "faq"),
      title_ar: normalizeText(data.title_ar, "الأسئلة الشائعة"),
      title_en: normalizeText(data.title_en, "FAQ"),
      content_ar: normalizeText(
        data.content_ar,
        "صفحة الأسئلة الشائعة تقدم إجابات عملية وواضحة على أكثر الاستفسارات شيوعًا."
      ),
      content_en: normalizeText(
        data.content_en,
        "The FAQ page provides practical and clear answers to the most common questions."
      ),
      is_published: normalizeBoolean(data.is_published, true),
      page_type: normalizeText(data.page_type, "faq") || "faq",
      sections_json: normalizeSections(data.sections_json),
    };
  } catch (error) {
    console.error("faq public page fetch error:", error);

    return {
      slug: "faq",
      title_ar: "الأسئلة الشائعة",
      title_en: "FAQ",
      content_ar:
        "صفحة الأسئلة الشائعة تقدم إجابات عملية وواضحة على أكثر الاستفسارات شيوعًا.",
      content_en:
        "The FAQ page provides practical and clear answers to the most common questions.",
      is_published: true,
      page_type: "faq",
      sections_json: fallbackSections,
    };
  }
}

export default async function FaqPage() {
  // الصفحة العامة لعرض FAQ

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكي الحالية

  const lang: Lang = cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // تحديد اللغة الحالية من الكوكي
  // إذا لم توجد قيمة نستخدم العربية افتراضيًا

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة حسب اللغة

  const pageData = await getPublishedFaqPage();
  // جلب بيانات FAQ النهائية بعد التطبيع والدمج مع fallback

  return <FaqClient lang={lang} dir={dir} pageData={pageData} />;
  // تمرير اللغة والاتجاه والسجل النهائي إلى مكوّن العرض
}