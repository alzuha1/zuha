import "./service-detail.css";
// استيراد ملف CSS الخاص بصفحات الخدمات الفرعية فقط

import { cookies } from "next/headers";
// قراءة اللغة الحالية من الكوكيز على جهة السيرفر

import { notFound } from "next/navigation";
// استخدام notFound عند عدم العثور على slug صحيح

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import ServiceDetailClient, {
  type FooterBlock,
  type Lang,
  type ServiceDetailItem,
  type ServiceNavItem,
} from "./service-detail-client";
// استيراد مكوّن العميل والأنواع التي سيعتمد عليها

// ============================================================================
// استيراد الصور المحلية من مجلد الصور الخاص بصفحة services
// نستخدمها هنا كـ fallback حتى تعمل الصفحات الفرعية حتى لو كانت DB ناقصة
// ============================================================================

import detailExploreImage from "../img/img (8).jpg";
// صورة افتراضية لصفحة explore

import detailDevelopmentImage from "../img/img (2).jpg";
// صورة افتراضية لصفحة تطوير المشاريع

import detailAssessmentImage from "../img/img (3).jpg";
// صورة افتراضية لصفحة تقييم الأصل

import detailAdvisoryImage from "../img/img (4).jpg";
// صورة افتراضية لصفحة الاستشارات

import detailPositioningImage from "../img/img (5).jpg";
// صورة افتراضية لصفحة التموضع السوقي

import detailDeskImage from "../img/img (9).jpg";
// صورة افتراضية لصفحة مكتب الخدمات

import galleryOneImage from "../img/img (8).jpg";
// صور fallback للمعارض الفرعية

import galleryTwoImage from "../img/img (9).jpg";
import galleryThreeImage from "../img/img (10).jpg";

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى تقرأ الكوكيز وتُجلب البيانات مباشرة

// ============================================================================
// Footer fallback
// هذا الفوتر سيستخدم إذا لم توجد بيانات صحيحة في sections_json
// ============================================================================

const FALLBACK_FOOTER: FooterBlock = {
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
};
// فوتر احتياطي موحد

// ============================================================================
// service detail fallback items
// هذه النسخ الاحتياطية هي الأساس إذا كانت القاعدة ناقصة أو لم تُملأ بعد بالكامل
// ============================================================================

const FALLBACK_SERVICE_DETAILS: ServiceDetailItem[] = [
  {
    id: "detail-1",
    slug: "explore",
    is_active: true,
    sort_order: 1,

    hero: {
      kicker_ar: "استكشاف الخدمات",
      kicker_en: "Explore Services",
      title_ar: "بوابة الخدمات العقارية",
      title_en: "Gateway to Real-Estate Services",
      desc_ar:
        "استعرض المسارات الخدمية الأساسية وحدد المسار الأنسب لاحتياجك الحالي، بدل الانتقال بين حلول غير مترابطة.",
      desc_en:
        "Review the main service paths and identify the one that best matches your current need instead of moving across disconnected solutions.",
      image_url: detailExploreImage.src,
    },

    overview: {
      title_ar: "كيف نبدأ من النقطة الصحيحة",
      title_en: "How We Start From the Right Point",
      desc_ar:
        "تعمل هذه الصفحة كبوابة توجيهية تساعدك على فهم المنظومة كاملة: ما الذي تحتاجه الآن، ما الذي يجب تأجيله، وما المسار الذي ينسجم مع مرحلة الأصل أو المشروع.",
      desc_en:
        "This page works as a service gateway that helps you understand the full platform: what you need now, what can wait, and which path matches the stage of the asset or project.",
    },

    capabilities: [
      {
        title_ar: "تحديد المسار",
        title_en: "Path Selection",
        desc_ar:
          "تحديد المسار الأنسب بين التطوير، التقييم، الاستشارات، أو التموضع السوقي.",
        desc_en:
          "Identifying the best-fit path between development, assessment, advisory, or market positioning.",
      },
      {
        title_ar: "فرز الأولويات",
        title_en: "Priority Mapping",
        desc_ar:
          "ترتيب الأولويات بحسب المرحلة الفعلية بدل البدء من خطوات غير ناضجة.",
        desc_en:
          "Organizing priorities according to the real stage instead of starting from premature actions.",
      },
      {
        title_ar: "تقليل التشتت",
        title_en: "Reducing Drift",
        desc_ar:
          "تقليل الضبابية عبر توجيه العميل إلى المسار الصحيح منذ البداية.",
        desc_en:
          "Reducing ambiguity by directing the client to the right path from the start.",
      },
    ],

    gallery: [
      {
        image_url: detailExploreImage.src,
        alt_ar: "استكشاف الخدمات",
        alt_en: "Explore services",
      },
      {
        image_url: galleryTwoImage.src,
        alt_ar: "مسار خدماتي",
        alt_en: "Service path",
      },
      {
        image_url: galleryThreeImage.src,
        alt_ar: "منظومة خدمات",
        alt_en: "Service platform",
      },
    ],

    cta: {
      title_ar: "ابدأ من مكتب الخدمات",
      title_en: "Start From the Service Desk",
      desc_ar:
        "إذا لم يكن المسار واضحًا بعد، ابدأ من مكتب الخدمات ليتم توجيهك إلى الخيار الأنسب.",
      desc_en:
        "If the right path is still unclear, start from the Service Desk and we will route you to the most suitable option.",
      btn_ar: "الذهاب إلى مكتب الخدمات",
      btn_en: "Open Service Desk",
      btn_href: "/services/service-desk",
    },
  },

  {
    id: "detail-2",
    slug: "project-development",
    is_active: true,
    sort_order: 2,

    hero: {
      kicker_ar: "تطوير المشاريع",
      kicker_en: "Project Development",
      title_ar: "من الفكرة إلى جاهزية التنفيذ",
      title_en: "From Vision to Execution Readiness",
      desc_ar:
        "خدمة مخصصة لبناء المسار التطويري للمشروع العقاري، من الفكرة الأولية إلى رفع الجاهزية التنفيذية والاستثمارية.",
      desc_en:
        "A dedicated service built to shape the development path of a real-estate project from early concept to execution and investment readiness.",
      image_url: detailDevelopmentImage.src,
    },

    overview: {
      title_ar: "دور هذه الخدمة",
      title_en: "What This Service Delivers",
      desc_ar:
        "نساعد على ضبط الرؤية، تنظيم عناصر المشروع، ورفع جودة المنتج العقاري قبل الانتقال إلى مراحل التنفيذ المكلفة أو الحساسة.",
      desc_en:
        "We help structure the vision, organize project components, and improve the real-estate product before moving into costly or sensitive execution stages.",
    },

    capabilities: [
      {
        title_ar: "صياغة الرؤية",
        title_en: "Vision Structuring",
        desc_ar:
          "تحويل الفكرة من تصور عام إلى إطار عمل أكثر دقة واتساقًا.",
        desc_en:
          "Turning a broad idea into a clearer and more structured working framework.",
      },
      {
        title_ar: "رفع الجاهزية",
        title_en: "Readiness Uplift",
        desc_ar:
          "تهيئة المشروع للمرحلة التالية تنفيذيًا وتجاريًا واستثماريًا.",
        desc_en:
          "Preparing the project for the next execution, commercial, and investment stage.",
      },
      {
        title_ar: "تحسين المنتج العقاري",
        title_en: "Product Quality Strengthening",
        desc_ar:
          "رفع تماسك الفكرة والقيمة العقارية المعروضة في السوق.",
        desc_en:
          "Strengthening the product concept and the value offered to the market.",
      },
    ],

    gallery: [
      {
        image_url: detailDevelopmentImage.src,
        alt_ar: "تطوير المشاريع",
        alt_en: "Project development",
      },
      {
        image_url: galleryOneImage.src,
        alt_ar: "مشروع قيد التطوير",
        alt_en: "Project in development",
      },
      {
        image_url: galleryThreeImage.src,
        alt_ar: "جودة التصميم والتنفيذ",
        alt_en: "Design and execution quality",
      },
    ],

    cta: {
      title_ar: "هل لديك مشروع في طور التشكّل؟",
      title_en: "Do You Have a Project Taking Shape?",
      desc_ar:
        "ابدأ بتنظيم الرؤية قبل أن تتحول الفكرة إلى عبء تنفيذي أو قرار غير مكتمل.",
      desc_en:
        "Structure the vision before the concept turns into execution burden or incomplete decision-making.",
      btn_ar: "الانتقال إلى مكتب الخدمات",
      btn_en: "Open Service Desk",
      btn_href: "/services/service-desk",
    },
  },

  {
    id: "detail-3",
    slug: "asset-assessment",
    is_active: true,
    sort_order: 3,

    hero: {
      kicker_ar: "تقييم الأصل",
      kicker_en: "Asset Assessment",
      title_ar: "فهم أدق لحالة الأصل وإمكاناته",
      title_en: "A Sharper View of Asset Condition and Potential",
      desc_ar:
        "خدمة تساعد على قراءة الأصل العقاري من زاوية الأداء، الإمكانات، والفرص التحسينية قبل أي توجيه جديد.",
      desc_en:
        "A service designed to assess the asset through performance, potential, and improvement opportunities before any major redirection.",
      image_url: detailAssessmentImage.src,
    },

    overview: {
      title_ar: "لماذا تبدأ بالتقييم",
      title_en: "Why Assessment Comes First",
      desc_ar:
        "لأن أي قرار لاحق في الإدارة أو التطوير أو التموضع يجب أن يُبنى على فهم أدق لحالة الأصل لا على الانطباع العام فقط.",
      desc_en:
        "Because any next move in management, development, or positioning should be built on accurate understanding of the asset rather than broad impression.",
    },

    capabilities: [
      {
        title_ar: "قراءة الأداء",
        title_en: "Performance Review",
        desc_ar:
          "فحص الوضع الحالي للأصل ومؤشرات الاستفادة والتشغيل.",
        desc_en:
          "Reviewing the current condition, operation, and utilization of the asset.",
      },
      {
        title_ar: "تحديد إمكانات التحسين",
        title_en: "Improvement Opportunities",
        desc_ar:
          "إبراز الجوانب التي يمكن رفعها أو إعادة توجيهها بفعالية.",
        desc_en:
          "Highlighting the areas that can be improved or redirected effectively.",
      },
      {
        title_ar: "تقليل القرارات المكلفة",
        title_en: "Reducing Costly Decisions",
        desc_ar:
          "منع التحرك غير المدروس عبر تأسيس فهم أوضح قبل التنفيذ.",
        desc_en:
          "Preventing premature action by building clearer understanding first.",
      },
    ],

    gallery: [
      {
        image_url: detailAssessmentImage.src,
        alt_ar: "تقييم الأصل",
        alt_en: "Asset assessment",
      },
      {
        image_url: galleryTwoImage.src,
        alt_ar: "تحليل الأصل",
        alt_en: "Asset analysis",
      },
      {
        image_url: galleryThreeImage.src,
        alt_ar: "جودة الأصل",
        alt_en: "Asset quality",
      },
    ],

    cta: {
      title_ar: "هل تحتاج قراءة أدق لأصلك؟",
      title_en: "Need a Clearer Read on Your Asset?",
      desc_ar:
        "ابدأ من التقييم قبل اتخاذ قرار مكلف أو غير مدروس.",
      desc_en:
        "Start with assessment before making a costly or premature move.",
      btn_ar: "افتح مكتب الخدمات",
      btn_en: "Open Service Desk",
      btn_href: "/services/service-desk",
    },
  },

  {
    id: "detail-4",
    slug: "strategic-advisory",
    is_active: true,
    sort_order: 4,

    hero: {
      kicker_ar: "الاستشارات",
      kicker_en: "Strategic Advisory",
      title_ar: "دعم تحليلي يساعد على القرار",
      title_en: "Analytical Support That Strengthens Decisions",
      desc_ar:
        "خدمة استشارية موجهة للقرارات العقارية التي تحتاج وضوحًا أكبر قبل التنفيذ أو التوسع أو إعادة التوجيه.",
      desc_en:
        "An advisory service built for real-estate decisions that require stronger clarity before execution, expansion, or redirection.",
      image_url: detailAdvisoryImage.src,
    },

    overview: {
      title_ar: "جوهر الخدمة",
      title_en: "Service Intent",
      desc_ar:
        "نمنح القرار العقاري أساسًا أقوى من خلال فهم السياق، ترتيب المشهد، وقراءة الفرص والمخاطر بصورة أكثر دقة.",
      desc_en:
        "We strengthen real-estate decisions by understanding context, structuring the situation, and reading opportunities and risk with greater precision.",
    },

    capabilities: [
      {
        title_ar: "فهم المشهد",
        title_en: "Context Reading",
        desc_ar:
          "تحليل المرحلة والسياق قبل الدخول في قرارات ثقيلة.",
        desc_en:
          "Analyzing timing and context before entering major commitments.",
      },
      {
        title_ar: "تقليل الضبابية",
        title_en: "Reducing Uncertainty",
        desc_ar:
          "ترتيب المعطيات وتحويلها إلى أساس أقوى للقرار.",
        desc_en:
          "Structuring inputs into a stronger basis for decision-making.",
      },
      {
        title_ar: "توجيه القرار",
        title_en: "Decision Direction",
        desc_ar:
          "توضيح أي خطوة ينبغي أن تبدأ أولًا ولماذا.",
        desc_en:
          "Clarifying which move should come first and why.",
      },
    ],

    gallery: [
      {
        image_url: detailAdvisoryImage.src,
        alt_ar: "استشارات استراتيجية",
        alt_en: "Strategic advisory",
      },
      {
        image_url: galleryOneImage.src,
        alt_ar: "تحليل واستشارة",
        alt_en: "Analysis and advisory",
      },
      {
        image_url: galleryThreeImage.src,
        alt_ar: "قرار استراتيجي",
        alt_en: "Strategic decision",
      },
    ],

    cta: {
      title_ar: "هل القرار غير واضح بعد؟",
      title_en: "Is the Decision Still Unclear?",
      desc_ar:
        "ابدأ من التحليل قبل الانتقال إلى التنفيذ.",
      desc_en:
        "Start with analysis before moving into action.",
      btn_ar: "ابدأ من مكتب الخدمات",
      btn_en: "Start from Service Desk",
      btn_href: "/services/service-desk",
    },
  },

  {
    id: "detail-5",
    slug: "market-positioning",
    is_active: true,
    sort_order: 5,

    hero: {
      kicker_ar: "التموضع السوقي",
      kicker_en: "Market Positioning",
      title_ar: "حضور أقوى ورسالة أوضح",
      title_en: "Stronger Presence and Clearer Market Message",
      desc_ar:
        "خدمة مخصصة لتحسين صورة المشروع أو الأصل العقاري بصريًا وتسويقيًا وتجاريًا أمام السوق المستهدف.",
      desc_en:
        "A specialized service to sharpen the visual, marketing, and commercial image of the project or real-estate asset for the right market.",
      image_url: detailPositioningImage.src,
    },

    overview: {
      title_ar: "فكرة الخدمة",
      title_en: "What This Service Improves",
      desc_ar:
        "نساعد على بناء عرض أكثر جاذبية وإقناعًا للمشروع أو الأصل عبر تحسين الرسالة والتمثيل البصري والسرد التجاري.",
      desc_en:
        "We help build a more compelling proposition for the project or asset through stronger messaging, visual representation, and commercial narrative.",
    },

    capabilities: [
      {
        title_ar: "تحسين الرسالة",
        title_en: "Message Refinement",
        desc_ar:
          "صياغة الرسالة السوقية بصورة أكثر قوة واتساقًا.",
        desc_en:
          "Refining market messaging with stronger clarity and consistency.",
      },
      {
        title_ar: "رفع الجاذبية",
        title_en: "Market Appeal",
        desc_ar:
          "تحسين التمثيل البصري والتجاري للمشروع أو الأصل العقاري.",
        desc_en:
          "Improving the visual and commercial representation of the project or asset.",
      },
      {
        title_ar: "تعزيز التمركز",
        title_en: "Position Strengthening",
        desc_ar:
          "تقوية الحضور أمام الجمهور أو المستثمر أو المستخدم النهائي.",
        desc_en:
          "Strengthening presence in front of the buyer, investor, or end user.",
      },
    ],

    gallery: [
      {
        image_url: detailPositioningImage.src,
        alt_ar: "التموضع السوقي",
        alt_en: "Market positioning",
      },
      {
        image_url: galleryTwoImage.src,
        alt_ar: "حضور بصري",
        alt_en: "Visual presence",
      },
      {
        image_url: galleryThreeImage.src,
        alt_ar: "هوية عقارية",
        alt_en: "Real-estate identity",
      },
    ],

    cta: {
      title_ar: "هل يحتاج مشروعك إلى حضور أقوى؟",
      title_en: "Does Your Project Need Stronger Presence?",
      desc_ar:
        "ابدأ من إعادة التموضع قبل الإنفاق على رسائل مشتتة أو غير مقنعة.",
      desc_en:
        "Reposition first before spending on scattered or weak market messaging.",
      btn_ar: "افتح مكتب الخدمات",
      btn_en: "Open Service Desk",
      btn_href: "/services/service-desk",
    },
  },

  {
    id: "detail-6",
    slug: "service-desk",
    is_active: true,
    sort_order: 6,

    hero: {
      kicker_ar: "مكتب الخدمات",
      kicker_en: "Service Desk",
      title_ar: "نقطة الدخول الموحدة للخدمات",
      title_en: "Unified Entry Point to Services",
      desc_ar:
        "هذه الصفحة تمثل بوابة التوجيه إلى المسار الخدمي الأنسب حسب طبيعة الاحتياج والمرحلة الحالية.",
      desc_en:
        "This page serves as the entry point that directs you to the most suitable service path based on the current need and stage.",
      image_url: detailDeskImage.src,
    },

    overview: {
      title_ar: "كيف يعمل مكتب الخدمات",
      title_en: "How the Service Desk Works",
      desc_ar:
        "نبدأ بتحديد الاحتياج، ثم فرز المرحلة، ثم توجيهك إلى المسار الصحيح بدل التنقل العشوائي أو البدء من نقطة غير مناسبة.",
      desc_en:
        "We begin by identifying the need, classifying the stage, and directing you to the correct path instead of random navigation or premature action.",
    },

    capabilities: [
      {
        title_ar: "توجيه الاحتياج",
        title_en: "Need Routing",
        desc_ar:
          "إحالة الاحتياج إلى المسار الأنسب داخل المنظومة.",
        desc_en:
          "Routing the need to the most suitable path within the service platform.",
      },
      {
        title_ar: "تحديد الأولوية",
        title_en: "Priority Framing",
        desc_ar:
          "منع التشتت والبدء من النقطة الصحيحة.",
        desc_en:
          "Avoiding drift and starting from the right point.",
      },
      {
        title_ar: "بناء مسار واضح",
        title_en: "Building a Clear Path",
        desc_ar:
          "توضيح الخطوة التالية بدل القفز إلى حلول غير متناسقة.",
        desc_en:
          "Clarifying the next step instead of jumping into inconsistent solutions.",
      },
    ],

    gallery: [
      {
        image_url: detailDeskImage.src,
        alt_ar: "مكتب الخدمات",
        alt_en: "Service desk",
      },
      {
        image_url: galleryOneImage.src,
        alt_ar: "توجيه الخدمة",
        alt_en: "Service routing",
      },
      {
        image_url: galleryTwoImage.src,
        alt_ar: "منظومة الخدمات",
        alt_en: "Service platform",
      },
    ],

    cta: {
      title_ar: "ابدأ من النقطة الصحيحة",
      title_en: "Start From the Right Point",
      desc_ar:
        "هذه الصفحة ستكون لاحقًا نقطة التواصل أو الطلب المباشر للخدمة.",
      desc_en:
        "This page will later become the direct point of request or structured contact for services.",
      btn_ar: "استكشف الخدمات",
      btn_en: "Explore Services",
      btn_href: "/services/explore",
    },
  },
];
// النسخ الاحتياطية للصفحات الفرعية كاملة

function normalizeSlug(value: string) {
  // توحيد صيغة slug حتى نقارنها بشكل صحيح
  return String(value || "").trim().toLowerCase();
}

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

function navLabelsFromSlug(slug: string) {
  // أسماء قصيرة للتنقل العلوي والجانبي
  switch (normalizeSlug(slug)) {
    case "explore":
      return {
        ar: "استكشف الخدمات",
        en: "Explore",
      };
    case "project-development":
      return {
        ar: "تطوير المشاريع",
        en: "Project Development",
      };
    case "asset-assessment":
      return {
        ar: "تقييم الأصل",
        en: "Asset Assessment",
      };
    case "strategic-advisory":
      return {
        ar: "الاستشارات",
        en: "Advisory",
      };
    case "market-positioning":
      return {
        ar: "التموضع السوقي",
        en: "Positioning",
      };
    case "service-desk":
      return {
        ar: "مكتب الخدمات",
        en: "Service Desk",
      };
    default:
      return {
        ar: "خدمة",
        en: "Service",
      };
  }
}

function createGenericFallbackDetail(slug: string): ServiceDetailItem {
  // إنشاء fallback عام إذا أضاف الأدمن خدمة جديدة في DB ولم نضع لها fallback محلي
  const labels = navLabelsFromSlug(slug);

  return {
    id: `generated-${slug}`,
    slug,
    is_active: true,
    sort_order: 999,

    hero: {
      kicker_ar: "خدمة متخصصة",
      kicker_en: "Specialized Service",
      title_ar: labels.ar,
      title_en: labels.en,
      desc_ar: "محتوى هذه الخدمة سيظهر هنا بعد التحديث من لوحة الأدمن.",
      desc_en: "This service content will appear here after being updated from the admin panel.",
      image_url: detailExploreImage.src,
    },

    overview: {
      title_ar: "نظرة عامة",
      title_en: "Overview",
      desc_ar: "هذه صفحة فرعية ديناميكية وجاهزة لملئها من لوحة الأدمن.",
      desc_en: "This is a dynamic detail page ready to be populated from the admin panel.",
    },

    capabilities: [
      {
        title_ar: "إضافة المحتوى",
        title_en: "Add Content",
        desc_ar: "يمكن للأدمن تعديل هذا القسم لاحقًا.",
        desc_en: "The admin can replace this content later.",
      },
    ],

    gallery: [
      {
        image_url: detailExploreImage.src,
        alt_ar: labels.ar,
        alt_en: labels.en,
      },
    ],

    cta: {
      title_ar: "مكتب الخدمات",
      title_en: "Service Desk",
      desc_ar: "يمكن توجيه هذه الخدمة إلى المسار الأنسب لاحقًا من لوحة الأدمن.",
      desc_en: "This service can later be routed to the most suitable path from the admin panel.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
    },
  };
}

function mergeServiceDetailItem(
  candidate: unknown,
  fallback: ServiceDetailItem
): ServiceDetailItem {
  // دمج عنصر الخدمة القادم من DB مع fallback محلي
  const obj = asObject(candidate);

  const hero = asObject(obj.hero);
  const overview = asObject(obj.overview);
  const cta = asObject(obj.cta);

  const capabilitiesRaw = pickArray<unknown>(obj.capabilities, []);
  const galleryRaw = pickArray<unknown>(obj.gallery, []);

  const mergedCapabilities =
    capabilitiesRaw.length > 0
      ? capabilitiesRaw.map((entry, index) => {
          const cap = asObject(entry);
          const fallbackCap = fallback.capabilities[index] || fallback.capabilities[0];

          return {
            title_ar: pickString(cap.title_ar, fallbackCap.title_ar),
            title_en: pickString(cap.title_en, fallbackCap.title_en),
            desc_ar: pickString(cap.desc_ar, fallbackCap.desc_ar),
            desc_en: pickString(cap.desc_en, fallbackCap.desc_en),
          };
        })
      : fallback.capabilities;

  const mergedGallery =
    galleryRaw.length > 0
      ? galleryRaw.map((entry, index) => {
          const image = asObject(entry);
          const fallbackImage = fallback.gallery[index] || fallback.gallery[0];

          return {
            image_url: pickString(image.image_url, fallbackImage.image_url),
            alt_ar: pickString(image.alt_ar, fallbackImage.alt_ar),
            alt_en: pickString(image.alt_en, fallbackImage.alt_en),
          };
        })
      : fallback.gallery;

  return {
    id: pickString(obj.id, fallback.id),
    slug: normalizeSlug(pickString(obj.slug, fallback.slug)),
    is_active:
      typeof obj.is_active === "boolean" ? obj.is_active : fallback.is_active,
    sort_order:
      typeof obj.sort_order === "number" ? obj.sort_order : fallback.sort_order,

    hero: {
      kicker_ar: pickString(hero.kicker_ar, fallback.hero.kicker_ar),
      kicker_en: pickString(hero.kicker_en, fallback.hero.kicker_en),
      title_ar: pickString(hero.title_ar, fallback.hero.title_ar),
      title_en: pickString(hero.title_en, fallback.hero.title_en),
      desc_ar: pickString(hero.desc_ar, fallback.hero.desc_ar),
      desc_en: pickString(hero.desc_en, fallback.hero.desc_en),
      image_url: pickString(hero.image_url, fallback.hero.image_url),
    },

    overview: {
      title_ar: pickString(overview.title_ar, fallback.overview.title_ar),
      title_en: pickString(overview.title_en, fallback.overview.title_en),
      desc_ar: pickString(overview.desc_ar, fallback.overview.desc_ar),
      desc_en: pickString(overview.desc_en, fallback.overview.desc_en),
    },

    capabilities: mergedCapabilities,
    gallery: mergedGallery,

    cta: {
      title_ar: pickString(cta.title_ar, fallback.cta.title_ar),
      title_en: pickString(cta.title_en, fallback.cta.title_en),
      desc_ar: pickString(cta.desc_ar, fallback.cta.desc_ar),
      desc_en: pickString(cta.desc_en, fallback.cta.desc_en),
      btn_ar: pickString(cta.btn_ar, fallback.cta.btn_ar),
      btn_en: pickString(cta.btn_en, fallback.cta.btn_en),
      btn_href: pickString(cta.btn_href, fallback.cta.btn_href),
    },
  };
}

function mergeFooter(candidate: unknown): FooterBlock {
  // دمج footer القادم من DB مع fallback محلي
  const obj = asObject(candidate);

  return {
    email: pickString(obj.email, FALLBACK_FOOTER.email),

    social1_ar: pickString(obj.social1_ar, FALLBACK_FOOTER.social1_ar),
    social1_en: pickString(obj.social1_en, FALLBACK_FOOTER.social1_en),
    social1_href: pickString(obj.social1_href, FALLBACK_FOOTER.social1_href),

    social2_ar: pickString(obj.social2_ar, FALLBACK_FOOTER.social2_ar),
    social2_en: pickString(obj.social2_en, FALLBACK_FOOTER.social2_en),
    social2_href: pickString(obj.social2_href, FALLBACK_FOOTER.social2_href),

    social3_ar: pickString(obj.social3_ar, FALLBACK_FOOTER.social3_ar),
    social3_en: pickString(obj.social3_en, FALLBACK_FOOTER.social3_en),
    social3_href: pickString(obj.social3_href, FALLBACK_FOOTER.social3_href),

    copy_ar: pickString(obj.copy_ar, FALLBACK_FOOTER.copy_ar),
    copy_en: pickString(obj.copy_en, FALLBACK_FOOTER.copy_en),

    privacy_ar: pickString(obj.privacy_ar, FALLBACK_FOOTER.privacy_ar),
    privacy_en: pickString(obj.privacy_en, FALLBACK_FOOTER.privacy_en),
    privacy_href: pickString(obj.privacy_href, FALLBACK_FOOTER.privacy_href),
  };
}

function buildNavItems(details: ServiceDetailItem[]): ServiceNavItem[] {
  // بناء التنقل العلوي والجانبي من قائمة الخدمات الفرعية الفعالة
  return [...details]
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => {
      const labels = navLabelsFromSlug(item.slug);

      return {
        slug: item.slug,
        label_ar: labels.ar,
        label_en: labels.en,
        href: `/services/${item.slug}`,
        is_active: item.is_active,
      };
    });
}

async function getServiceDetailPayload(serviceSlug: string) {
  // هذه الدالة تجمع كل ما تحتاجه الصفحة الفرعية:
  // - الخدمة الحالية
  // - عناصر التنقل
  // - الفوتر
  const normalizedRequestedSlug = normalizeSlug(serviceSlug);

  // أولًا: جلب المحتوى من DB إن وجد
  let dbSections: Record<string, unknown> = {};

  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select("sections_json,is_published")
      .eq("slug", "services")
      .eq("is_published", true)
      .maybeSingle();

    if (!error && data?.sections_json) {
      dbSections = asObject(data.sections_json);
    }
  } catch (error) {
    console.error("service detail fetch error:", error);
  }

  const dbServiceDetails = pickArray<unknown>(
    asObject(dbSections.serviceDetails).items,
    []
  );
  // عناصر الخدمة الفرعية القادمة من DB

  const mergedKnownDetails = FALLBACK_SERVICE_DETAILS.map((fallbackItem) => {
    const matchedDbItem = dbServiceDetails.find((entry) => {
      const obj = asObject(entry);
      return normalizeSlug(String(obj.slug ?? "")) === normalizeSlug(fallbackItem.slug);
    });

    return matchedDbItem
      ? mergeServiceDetailItem(matchedDbItem, fallbackItem)
      : fallbackItem;
  });
  // دمج العناصر المعروفة في fallback مع القاعدة

  const extraDbDetails = dbServiceDetails
    .filter((entry) => {
      const obj = asObject(entry);
      const slug = normalizeSlug(String(obj.slug ?? ""));

      return (
        slug &&
        !FALLBACK_SERVICE_DETAILS.some(
          (fallbackItem) => normalizeSlug(fallbackItem.slug) === slug
        )
      );
    })
    .map((entry) => {
      const obj = asObject(entry);
      const slug = normalizeSlug(String(obj.slug ?? ""));
      const genericFallback = createGenericFallbackDetail(slug);

      return mergeServiceDetailItem(entry, genericFallback);
    });
  // دعم الخدمات الجديدة التي يضيفها الأدمن مستقبلًا من دون كسر الصفحة

  const allDetails = [...mergedKnownDetails, ...extraDbDetails]
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  // كل الخدمات الفرعية الفعالة بعد الدمج

  const currentItem =
    allDetails.find((item) => normalizeSlug(item.slug) === normalizedRequestedSlug) ||
    null;
  // محاولة إيجاد الصفحة الفرعية المطلوبة

  if (!currentItem) {
    return null;
  }
  // إذا لم نجد الخدمة نرجع null ليتم عرض notFound()

  const footer = mergeFooter(dbSections.footer);
  // دمج الفوتر

  const navItems = buildNavItems(allDetails);
  // بناء التنقل الداخلي

  return {
    currentItem,
    footer,
    navItems,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  // الصفحة الرئيسية الخاصة بالخدمات الفرعية الديناميكية

  const { serviceSlug } = await params;
  // قراءة الـ slug من المسار الديناميكي

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز الحالية

  const lang: Lang = cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // تحديد اللغة الحالية من الكوكيز

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة بحسب اللغة

  const payload = await getServiceDetailPayload(serviceSlug);
  // جلب كل البيانات اللازمة لهذه الصفحة الفرعية

  if (!payload) {
    notFound();
  }
  // إذا لم نجد الخدمة نعرض صفحة 404 الخاصة بـ Next

  return (
    <ServiceDetailClient
      lang={lang}
      dir={dir}
      currentItem={payload.currentItem}
      navItems={payload.navItems}
      footer={payload.footer}
    />
  );
}