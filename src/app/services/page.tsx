import "./services.css";
// استيراد ملف CSS الخاص بصفحة Services فقط

import { cookies } from "next/headers";
// قراءة اللغة الحالية من الكوكيز على جهة السيرفر

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import ServicesClient, {
  type Lang,
  type ServicesSections,
} from "./services-client";
// استيراد مكوّن العميل والأنواع الخاصة بصفحة الخدمات

// ============================================================================
// استيراد الصور المحلية مباشرة من مجلد الصفحة نفسه
// هذه الطريقة مناسبة لأن الصور موجودة داخل:
// src/app/services/img
// ============================================================================

import heroMainImage from "./img/img (1).jpg";
// صورة الهيرو الرئيسية

import serviceDevelopmentImage from "./img/img (2).jpg";
// صورة خدمة تطوير المشاريع

import serviceAssetImage from "./img/img (3).jpg";
// صورة خدمة تقييم الأصل

import serviceAdvisoryImage from "./img/img (4).jpg";
// صورة خدمة الاستشارات الاستراتيجية

import serviceMarketingImage from "./img/img (5).jpg";
// صورة خدمة التموضع والتسويق العقاري

import reviewOneImage from "./img/img (6).jpg";
// صورة التقييم الأول

import reviewTwoImage from "./img/img (7).jpg";
// صورة التقييم الثاني

import galleryOneImage from "./img/img (8).jpg";
// صورة المعرض الأولى

import galleryTwoImage from "./img/img (9).jpg";
// صورة المعرض الثانية

import galleryThreeImage from "./img/img (10).jpg";
// صورة المعرض الثالثة

import galleryFourImage from "./img/img (11).jpg";
// صورة المعرض الرابعة

import galleryFiveImage from "./img/img (12).jpg";
// صورة المعرض الخامسة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى تقرأ الكوكيز وتُجلب البيانات مباشرة

// ============================================================================
// نسخة احتياطية احترافية لصفحة Services
// هذه النسخة تُستخدم إذا لم توجد بيانات منشورة أو صالحة في قاعدة البيانات
//
// الهدف من هذه النسخة:
// - جعل صفحة Services مستقلة عن About
// - إبقاء الروابط داخل منظومة /services نفسها
// - تقديم محتوى عالمي أكثر قوة ومتانة
// ============================================================================

const FALLBACK_SECTIONS: ServicesSections = {
  hero: {
    kicker_ar: "منظومة خدمات الزُهى",
    kicker_en: "ALZUHA Service Platform",

    title_ar: "حلول عقارية تنفيذية<br/>مصممة للنمو والجودة",
    title_en: "Executive Real-Estate Solutions<br/>Built for Growth and Quality",

    desc_ar:
      "صُممت خدمات الزُهى لتخدم دورة الأصل العقاري كاملة: من تطوير المشروع، إلى تقييم الأصل، إلى الإدارة، والتموضع السوقي، ضمن إطار يوازن بين القيمة، الكفاءة، والانضباط التنفيذي.",
    desc_en:
      "ALZUHA services are designed to support the full life cycle of a real-estate asset: from project development to asset assessment, operations, and market positioning, through a framework that balances value, efficiency, and disciplined execution.",

    btn1_ar: "استكشف خدماتنا",
    btn1_en: "Explore Our Services",
    btn1_href: "/services/explore",

    btn2_ar: "مكتب الخدمات",
    btn2_en: "Service Desk",
    btn2_href: "/services/service-desk",

    image_url: heroMainImage.src,
  },

  servicesSection: {
    title_ar: "خدمات متخصصة<br/>لكل مرحلة من دورة الأصل",
    title_en: "Specialized Services<br/>for Every Asset Stage",

    desc_ar:
      "بدل الحلول العامة، تقدّم الزُهى مسارات خدمية متخصصة تساعد على بناء المشروع، تقييم الأصل، دعم القرار، وتحسين التمركز السوقي بصورة أكثر قوة واتساقًا.",
    desc_en:
      "Instead of generic support, ALZUHA delivers specialized service tracks that help develop projects, assess assets, support decisions, and strengthen market positioning with greater clarity and consistency.",

    items: [
      {
        id: "service-1",
        is_active: true,
        sort_order: 1,
        icon: "🏗️",
        image_url: serviceDevelopmentImage.src,

        title_ar: "تطوير المشاريع العقارية",
        title_en: "Project Development",

        desc_ar:
          "صياغة المسار التطويري للمشروع من الرؤية إلى التهيئة التنفيذية، بما يرفع جودة المنتج العقاري ويعزز فرصه السوقية.",
        desc_en:
          "Structuring the development path of a project from vision to execution readiness, raising product quality and improving market readiness.",

        cta_label_ar: "ناقش مشروعك",
        cta_label_en: "Discuss Your Project",
        href: "/services/project-development",
      },
      {
        id: "service-2",
        is_active: true,
        sort_order: 2,
        icon: "📊",
        image_url: serviceAssetImage.src,

        title_ar: "تقييم الأصل وإدارته",
        title_en: "Asset Assessment",

        desc_ar:
          "فهم أدق لحالة الأصل العقاري، أدائه، وإمكاناته، بما يدعم تنظيمه وإعادة توجيهه بصورة أكثر كفاءة.",
        desc_en:
          "A sharper understanding of asset condition, performance, and potential, supporting stronger structuring and more efficient direction.",

        cta_label_ar: "اطلب تقييمًا",
        cta_label_en: "Request Assessment",
        href: "/services/asset-assessment",
      },
      {
        id: "service-3",
        is_active: true,
        sort_order: 3,
        icon: "🧭",
        image_url: serviceAdvisoryImage.src,

        title_ar: "الاستشارات الاستراتيجية",
        title_en: "Strategic Advisory",

        desc_ar:
          "دعم تحليلي واستراتيجي يساعد على قراءة السوق والفرص واتخاذ القرار العقاري بثقة أكبر ومنهجية أوضح.",
        desc_en:
          "Strategic and analytical support that helps read the market, assess opportunities, and make stronger real-estate decisions with clarity.",

        cta_label_ar: "اطلب تحليلًا",
        cta_label_en: "Request Advisory",
        href: "/services/strategic-advisory",
      },
      {
        id: "service-4",
        is_active: true,
        sort_order: 4,
        icon: "📣",
        image_url: serviceMarketingImage.src,

        title_ar: "التموضع والتسويق العقاري",
        title_en: "Market Positioning",

        desc_ar:
          "بناء حضور أكثر إقناعًا للمشروع أو الأصل العقاري عبر تحسين الرسالة، العرض، والتمثيل البصري والتجاري.",
        desc_en:
          "Building a more compelling presence for the project or asset through stronger messaging, visual representation, and commercial positioning.",

        cta_label_ar: "ابدأ التسويق",
        cta_label_en: "Start Positioning",
        href: "/services/market-positioning",
      },
    ],
  },

  testimonials: {
    kicker_ar: "الأثر الحقيقي للخدمة",
    kicker_en: "The Real Impact of Service",

    title_ar: "نتائج تعكس جودة التنفيذ",
    title_en: "Results That Reflect Execution Quality",

    desc_ar:
      "عندما تكون الخدمة جزءًا من منطق واضح، تتحول إلى أثر ملموس في القرار والتنظيم والنتيجة النهائية.",
    desc_en:
      "When service operates within a clear framework, it becomes a visible force in decision quality, structure, and final outcomes.",

    btn_ar: "مكتب الخدمات",
    btn_en: "Service Desk",
    btn_href: "/services/service-desk",

    items: [
      {
        id: "testimonial-1",
        is_active: true,
        sort_order: 1,

        text_ar:
          "الفرق الحقيقي كان في وضوح المعالجة وترتيب الأولويات. لم تكن الخدمة شكلية، بل كانت عملية ومباشرة في أثرها.",
        text_en:
          "The real difference was the clarity of approach and the structuring of priorities. This was not decorative service, but practical and directly impactful.",

        name_ar: "آدم منصور",
        name_en: "Adam Mansour",

        role_ar: "مستثمر عقاري",
        role_en: "Real Estate Investor",

        image_url: reviewOneImage.src,
      },
      {
        id: "testimonial-2",
        is_active: true,
        sort_order: 2,

        text_ar:
          "ساعدتنا الزُهى في تحويل الصورة العامة إلى مسار تنفيذي واضح، وهذا وفّر وقتًا وقلّل مساحة التردد.",
        text_en:
          "ALZUHA helped us turn a broad picture into a clear execution path, saving time and reducing uncertainty.",

        name_ar: "سارة جابر",
        name_en: "Sarah Jaber",

        role_ar: "مالكة أصول",
        role_en: "Asset Owner",

        image_url: reviewTwoImage.src,
      },
    ],
  },

  gallery: {
    title_ar: "نماذج منتقاة من البيئات والمخرجات",
    title_en: "Selected Environments & Outputs",

    desc_ar:
      "صور تعبّر عن مستوى الجودة، الانضباط، والهوية التي نعتبرها جزءًا أساسيًا من أي تجربة عقارية متميزة.",
    desc_en:
      "A curated visual selection reflecting quality, discipline, and the identity we consider essential to every distinguished real-estate experience.",

    images: [
      {
        id: "gallery-1",
        is_active: true,
        sort_order: 1,
        image_url: galleryOneImage.src,
        alt_ar: "مشهد عقاري مختار",
        alt_en: "Selected real-estate scene",
      },
      {
        id: "gallery-2",
        is_active: true,
        sort_order: 2,
        image_url: galleryTwoImage.src,
        alt_ar: "تفاصيل تنفيذية",
        alt_en: "Execution detail",
      },
      {
        id: "gallery-3",
        is_active: true,
        sort_order: 3,
        image_url: galleryThreeImage.src,
        alt_ar: "بيئة عمرانية راقية",
        alt_en: "Refined urban environment",
      },
      {
        id: "gallery-4",
        is_active: true,
        sort_order: 4,
        image_url: galleryFourImage.src,
        alt_ar: "واجهة حديثة",
        alt_en: "Modern frontage",
      },
      {
        id: "gallery-5",
        is_active: true,
        sort_order: 5,
        image_url: galleryFiveImage.src,
        alt_ar: "تفاصيل داخلية",
        alt_en: "Interior detail",
      },
    ],
  },

  cta: {
    title_ar: "اختر المسار الخدمي<br/>الأنسب لاحتياجك",
    title_en: "Choose the Service Path<br/>That Fits Your Need",

    desc_ar:
      "ابدأ من الصفحة الفرعية المناسبة: تطوير مشروع، تقييم أصل، دعم استراتيجي، أو تموضع وتسويق عقاري.",
    desc_en:
      "Start from the service path that fits your need: project development, asset assessment, strategic support, or market positioning.",

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

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function pickString(value: unknown, fallback: string) {
  // إرجاع النص إذا كان صالحًا وغير فارغ
  return typeof value === "string" && value.trim() ? value : fallback;
}

function pickArray<T>(value: unknown, fallback: T[]) {
  // إرجاع المصفوفة إذا كانت صحيحة
  return Array.isArray(value) ? (value as T[]) : fallback;
}

async function getServicesSections(): Promise<ServicesSections> {
  // محاولة جلب محتوى صفحة services من قاعدة البيانات
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select("sections_json,is_published")
      .eq("slug", "services")
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_SECTIONS;
    }

    const sections = asObject(data.sections_json);

    const hero = asObject(sections.hero);
    const servicesSection = asObject(sections.servicesSection);
    const testimonials = asObject(sections.testimonials);
    const gallery = asObject(sections.gallery);
    const cta = asObject(sections.cta);
    const footer = asObject(sections.footer);

    return {
      hero: {
        kicker_ar: pickString(hero.kicker_ar, FALLBACK_SECTIONS.hero.kicker_ar),
        kicker_en: pickString(hero.kicker_en, FALLBACK_SECTIONS.hero.kicker_en),

        title_ar: pickString(hero.title_ar, FALLBACK_SECTIONS.hero.title_ar),
        title_en: pickString(hero.title_en, FALLBACK_SECTIONS.hero.title_en),

        desc_ar: pickString(hero.desc_ar, FALLBACK_SECTIONS.hero.desc_ar),
        desc_en: pickString(hero.desc_en, FALLBACK_SECTIONS.hero.desc_en),

        btn1_ar: pickString(hero.btn1_ar, FALLBACK_SECTIONS.hero.btn1_ar),
        btn1_en: pickString(hero.btn1_en, FALLBACK_SECTIONS.hero.btn1_en),
        btn1_href: pickString(hero.btn1_href, FALLBACK_SECTIONS.hero.btn1_href),

        btn2_ar: pickString(hero.btn2_ar, FALLBACK_SECTIONS.hero.btn2_ar),
        btn2_en: pickString(hero.btn2_en, FALLBACK_SECTIONS.hero.btn2_en),
        btn2_href: pickString(hero.btn2_href, FALLBACK_SECTIONS.hero.btn2_href),

        image_url: pickString(hero.image_url, FALLBACK_SECTIONS.hero.image_url),
      },

      servicesSection: {
        title_ar: pickString(
          servicesSection.title_ar,
          FALLBACK_SECTIONS.servicesSection.title_ar
        ),
        title_en: pickString(
          servicesSection.title_en,
          FALLBACK_SECTIONS.servicesSection.title_en
        ),
        desc_ar: pickString(
          servicesSection.desc_ar,
          FALLBACK_SECTIONS.servicesSection.desc_ar
        ),
        desc_en: pickString(
          servicesSection.desc_en,
          FALLBACK_SECTIONS.servicesSection.desc_en
        ),
        items: pickArray(
          servicesSection.items,
          FALLBACK_SECTIONS.servicesSection.items
        ),
      },

      testimonials: {
        kicker_ar: pickString(
          testimonials.kicker_ar,
          FALLBACK_SECTIONS.testimonials.kicker_ar
        ),
        kicker_en: pickString(
          testimonials.kicker_en,
          FALLBACK_SECTIONS.testimonials.kicker_en
        ),
        title_ar: pickString(
          testimonials.title_ar,
          FALLBACK_SECTIONS.testimonials.title_ar
        ),
        title_en: pickString(
          testimonials.title_en,
          FALLBACK_SECTIONS.testimonials.title_en
        ),
        desc_ar: pickString(
          testimonials.desc_ar,
          FALLBACK_SECTIONS.testimonials.desc_ar
        ),
        desc_en: pickString(
          testimonials.desc_en,
          FALLBACK_SECTIONS.testimonials.desc_en
        ),
        btn_ar: pickString(testimonials.btn_ar, FALLBACK_SECTIONS.testimonials.btn_ar),
        btn_en: pickString(testimonials.btn_en, FALLBACK_SECTIONS.testimonials.btn_en),
        btn_href: pickString(
          testimonials.btn_href,
          FALLBACK_SECTIONS.testimonials.btn_href
        ),
        items: pickArray(
          testimonials.items,
          FALLBACK_SECTIONS.testimonials.items
        ),
      },

      gallery: {
        title_ar: pickString(gallery.title_ar, FALLBACK_SECTIONS.gallery.title_ar),
        title_en: pickString(gallery.title_en, FALLBACK_SECTIONS.gallery.title_en),
        desc_ar: pickString(gallery.desc_ar, FALLBACK_SECTIONS.gallery.desc_ar),
        desc_en: pickString(gallery.desc_en, FALLBACK_SECTIONS.gallery.desc_en),
        images: pickArray(gallery.images, FALLBACK_SECTIONS.gallery.images),
      },

      cta: {
        title_ar: pickString(cta.title_ar, FALLBACK_SECTIONS.cta.title_ar),
        title_en: pickString(cta.title_en, FALLBACK_SECTIONS.cta.title_en),
        desc_ar: pickString(cta.desc_ar, FALLBACK_SECTIONS.cta.desc_ar),
        desc_en: pickString(cta.desc_en, FALLBACK_SECTIONS.cta.desc_en),
        label_ar: pickString(cta.label_ar, FALLBACK_SECTIONS.cta.label_ar),
        label_en: pickString(cta.label_en, FALLBACK_SECTIONS.cta.label_en),
        button_ar: pickString(cta.button_ar, FALLBACK_SECTIONS.cta.button_ar),
        button_en: pickString(cta.button_en, FALLBACK_SECTIONS.cta.button_en),
        button_href: pickString(cta.button_href, FALLBACK_SECTIONS.cta.button_href),
      },

      footer: {
        email: pickString(footer.email, FALLBACK_SECTIONS.footer.email),

        social1_ar: pickString(
          footer.social1_ar,
          FALLBACK_SECTIONS.footer.social1_ar
        ),
        social1_en: pickString(
          footer.social1_en,
          FALLBACK_SECTIONS.footer.social1_en
        ),
        social1_href: pickString(
          footer.social1_href,
          FALLBACK_SECTIONS.footer.social1_href
        ),

        social2_ar: pickString(
          footer.social2_ar,
          FALLBACK_SECTIONS.footer.social2_ar
        ),
        social2_en: pickString(
          footer.social2_en,
          FALLBACK_SECTIONS.footer.social2_en
        ),
        social2_href: pickString(
          footer.social2_href,
          FALLBACK_SECTIONS.footer.social2_href
        ),

        social3_ar: pickString(
          footer.social3_ar,
          FALLBACK_SECTIONS.footer.social3_ar
        ),
        social3_en: pickString(
          footer.social3_en,
          FALLBACK_SECTIONS.footer.social3_en
        ),
        social3_href: pickString(
          footer.social3_href,
          FALLBACK_SECTIONS.footer.social3_href
        ),

        copy_ar: pickString(footer.copy_ar, FALLBACK_SECTIONS.footer.copy_ar),
        copy_en: pickString(footer.copy_en, FALLBACK_SECTIONS.footer.copy_en),

        privacy_ar: pickString(
          footer.privacy_ar,
          FALLBACK_SECTIONS.footer.privacy_ar
        ),
        privacy_en: pickString(
          footer.privacy_en,
          FALLBACK_SECTIONS.footer.privacy_en
        ),
        privacy_href: pickString(
          footer.privacy_href,
          FALLBACK_SECTIONS.footer.privacy_href
        ),
      },
    };
  } catch (error) {
    console.error("Services page fetch error:", error);
    return FALLBACK_SECTIONS;
  }
}

export default async function ServicesPage() {
  // الدالة الرئيسية لصفحة الخدمات

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز الحالية

  const lang: Lang = cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // تحديد اللغة الحالية من الكوكيز

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة بناءً على اللغة

  const sections = await getServicesSections();
  // جلب بيانات الصفحة من القاعدة أو fallback

  return <ServicesClient lang={lang} dir={dir} sections={sections} />;
  // تمرير البيانات إلى مكوّن العميل
}