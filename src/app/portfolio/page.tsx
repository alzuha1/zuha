import "./portfolio.css";
// استيراد CSS الخاص بواجهة Portfolio العامة

import { cookies } from "next/headers";
// قراءة كوكي اللغة الحالية من السيرفر

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر لجلب بيانات صفحة portfolio

import PortfolioClient from "./portfolio-client";
// مكوّن الواجهة العامة لصفحة Portfolio

// ============================================================================
// صور fallback المحلية الخاصة بصفحة Portfolio
// ملاحظة مهمة:
// هذه الصور تُستخدم كنسخة احتياطية فقط إذا لم تكن القاعدة تحتوي على صورة صالحة
// ============================================================================

import heroPrimaryImage from "./img/img (1).jpg";
// الصورة الرئيسية للهيرو

import heroCardImage from "./img/img (2).png";
// صورة بطاقة الهيرو الجانبية
// هذه PNG حسب ما أوضحته في لقطة الشاشة، لذلك ثبتنا الامتداد الصحيح

import showcaseOneImage from "./img/img (3).jpg";
import showcaseTwoImage from "./img/img (4).jpg";
import showcaseThreeImage from "./img/img (5).jpg";
// صور fallback لعناصر قسم الأعمال المختارة

import authorOneImage from "./img/img (6).jpg";
import authorTwoImage from "./img/img (7).jpg";
import authorThreeImage from "./img/img (8).jpg";
// صور fallback لصورة الكاتب/الهوية الصغيرة في بطاقات الأعمال

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى تقرأ اللغة من الكوكيز
// وتقرأ التعديلات المنشورة من قاعدة البيانات مباشرة

type Lang = "ar" | "en";
// اللغتان المدعومتان

type ShowcaseItem = {
  id: string;
  is_active: boolean;
  sort_order: number;
  category_key: string;
  tag_ar: string;
  tag_en: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  author_ar: string;
  author_en: string;
  role_ar: string;
  role_en: string;
  date_ar: string;
  date_en: string;
  cover_image_url: string;
  author_image_url: string;
  href: string;
};
// نوع العنصر الواحد داخل قسم الأعمال/القصص المختارة

type PortfolioPageSections = {
  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    card_title_ar: string;
    card_title_en: string;
    card_desc_ar: string;
    card_desc_en: string;
    card_btn_ar: string;
    card_btn_en: string;
    card_btn_href: string;
    image_url: string;
    card_image_url?: string;
  };

  showcase: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    tabs: {
      all_ar: string;
      all_en: string;
      dev_ar: string;
      dev_en: string;
      inv_ar: string;
      inv_en: string;
      mng_ar: string;
      mng_en: string;
    };
    items: ShowcaseItem[];
  };

  insight: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  };

  contact: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    first_name_ar: string;
    first_name_en: string;
    second_name_ar: string;
    second_name_en: string;
    last_name_ar: string;
    last_name_en: string;
    email_ar: string;
    email_en: string;
    message_ar: string;
    message_en: string;
    submit_btn_ar: string;
    submit_btn_en: string;
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
// الشكل الكامل لـ sections_json الخاص بصفحة Portfolio

type PortfolioPageRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: PortfolioPageSections;
};
// السجل النهائي الذي سنمرره إلى PortfolioClient

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تنظيف النصوص من null / undefined / الفراغات
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

function normalizeAssetPath(value: unknown, fallback = "") {
  // توحيد مسار الصورة القادمة من القاعدة
  // يدعم:
  // - روابط http/https
  // - مسارات public مثل /portfolio/img/...
  // - مسارات fallback من import مثل /_next/static/media/...
  const text = normalizeText(value, fallback);

  if (!text) {
    return fallback;
  }

  if (/^https?:\/\//i.test(text)) {
    return text;
  }

  if (text.startsWith("/")) {
    return text;
  }

  return `/${text}`;
}

function buildFallbackShowcaseItem(order: number): ShowcaseItem {
  // إنشاء عنصر fallback احتياطي لقسم الأعمال
  const coverPool = [
    showcaseOneImage.src,
    showcaseTwoImage.src,
    showcaseThreeImage.src,
  ];

  const authorPool = [
    authorOneImage.src,
    authorTwoImage.src,
    authorThreeImage.src,
  ];

  const safeIndex = (order - 1) % coverPool.length;

  return {
    id: `portfolio-item-${order}`,
    is_active: true,
    sort_order: order,
    category_key: order === 1 ? "dev" : order === 2 ? "inv" : "mng",
    tag_ar: order === 1 ? "تطوير" : order === 2 ? "استثمار" : "إدارة",
    tag_en: order === 1 ? "Development" : order === 2 ? "Investment" : "Management",
    title_ar:
      order === 1
        ? "مشروع عقاري معاصر بتكوين بصري قوي"
        : order === 2
        ? "فرصة استثمارية بتمثيل احترافي"
        : "إدارة أصل عقاري بصورة أوضح",
    title_en:
      order === 1
        ? "A Contemporary Real-Estate Project With Strong Visual Framing"
        : order === 2
        ? "An Investment Opportunity With Professional Positioning"
        : "Managing a Real-Estate Asset With Greater Clarity",
    desc_ar:
      order === 1
        ? "محتوى يوضح كيف يتحول المشروع إلى صورة أكثر نضجًا وجودة وتمثيلًا."
        : order === 2
        ? "عرض يساعد على فهم قيمة الأصل أو الفرصة من زاوية استثمارية وتسويقية أوضح."
        : "صياغة أكثر تنظيمًا للأصل العقاري بما يعزز القرار والانطباع النهائي.",
    desc_en:
      order === 1
        ? "Content showing how a project becomes more mature in quality, image, and representation."
        : order === 2
        ? "A presentation that clarifies the value of an asset or opportunity through stronger investment and market framing."
        : "A more structured view of the real-estate asset that improves decision quality and final impression.",
    author_ar: "فريق الزُهى",
    author_en: "ALZUHA Team",
    role_ar: "تحرير الملف",
    role_en: "Portfolio Editing",
    date_ar: "أبريل 2026",
    date_en: "April 2026",
    cover_image_url: coverPool[safeIndex],
    author_image_url: authorPool[safeIndex],
    href: "/portfolio",
  };
}

function createDefaultPortfolioSections(): PortfolioPageSections {
  // البنية الافتراضية الكاملة لصفحة Portfolio
  // تُستخدم إذا لم نجد بيانات صالحة في القاعدة
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
      image_url: heroPrimaryImage.src,
      card_image_url: heroCardImage.src,
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
      items: [
        buildFallbackShowcaseItem(1),
        buildFallbackShowcaseItem(2),
        buildFallbackShowcaseItem(3),
      ],
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
  };
}

function normalizeShowcaseItem(value: unknown, index: number): ShowcaseItem {
  // تطبيع عنصر واحد من الأعمال المختارة
  const obj = asObject(value);
  const fallback = buildFallbackShowcaseItem(index + 1);

  return {
    id: normalizeText(obj.id, fallback.id),
    is_active: normalizeBoolean(obj.is_active, fallback.is_active),
    sort_order: normalizeNumber(obj.sort_order, fallback.sort_order),
    category_key: normalizeText(obj.category_key, fallback.category_key),
    tag_ar: normalizeText(obj.tag_ar, fallback.tag_ar),
    tag_en: normalizeText(obj.tag_en, fallback.tag_en),
    title_ar: normalizeText(obj.title_ar, fallback.title_ar),
    title_en: normalizeText(obj.title_en, fallback.title_en),
    desc_ar: normalizeText(obj.desc_ar, fallback.desc_ar),
    desc_en: normalizeText(obj.desc_en, fallback.desc_en),
    author_ar: normalizeText(obj.author_ar, fallback.author_ar),
    author_en: normalizeText(obj.author_en, fallback.author_en),
    role_ar: normalizeText(obj.role_ar, fallback.role_ar),
    role_en: normalizeText(obj.role_en, fallback.role_en),
    date_ar: normalizeText(obj.date_ar, fallback.date_ar),
    date_en: normalizeText(obj.date_en, fallback.date_en),
    cover_image_url: normalizeAssetPath(
      obj.cover_image_url,
      fallback.cover_image_url
    ),
    author_image_url: normalizeAssetPath(
      obj.author_image_url,
      fallback.author_image_url
    ),
    href: normalizeText(obj.href, fallback.href),
  };
}

function normalizeSections(value: unknown): PortfolioPageSections {
  // دمج sections_json القادمة من القاعدة مع fallback قوي
  const defaults = createDefaultPortfolioSections();
  const obj = asObject(value);

  const hero = asObject(obj.hero);
  const showcase = asObject(obj.showcase);
  const tabs = asObject(showcase.tabs);
  const insight = asObject(obj.insight);
  const contact = asObject(obj.contact);
  const footer = asObject(obj.footer);

  return {
    hero: {
      kicker_ar: normalizeText(hero.kicker_ar, defaults.hero.kicker_ar),
      kicker_en: normalizeText(hero.kicker_en, defaults.hero.kicker_en),
      title_ar: normalizeText(hero.title_ar, defaults.hero.title_ar),
      title_en: normalizeText(hero.title_en, defaults.hero.title_en),
      desc_ar: normalizeText(hero.desc_ar, defaults.hero.desc_ar),
      desc_en: normalizeText(hero.desc_en, defaults.hero.desc_en),
      card_title_ar: normalizeText(hero.card_title_ar, defaults.hero.card_title_ar),
      card_title_en: normalizeText(hero.card_title_en, defaults.hero.card_title_en),
      card_desc_ar: normalizeText(hero.card_desc_ar, defaults.hero.card_desc_ar),
      card_desc_en: normalizeText(hero.card_desc_en, defaults.hero.card_desc_en),
      card_btn_ar: normalizeText(hero.card_btn_ar, defaults.hero.card_btn_ar),
      card_btn_en: normalizeText(hero.card_btn_en, defaults.hero.card_btn_en),
      card_btn_href: normalizeText(hero.card_btn_href, defaults.hero.card_btn_href),
      image_url: normalizeAssetPath(hero.image_url, defaults.hero.image_url),
      card_image_url: normalizeAssetPath(
        hero.card_image_url,
        defaults.hero.card_image_url || heroCardImage.src
      ),
    },

    showcase: {
      kicker_ar: normalizeText(showcase.kicker_ar, defaults.showcase.kicker_ar),
      kicker_en: normalizeText(showcase.kicker_en, defaults.showcase.kicker_en),
      title_ar: normalizeText(showcase.title_ar, defaults.showcase.title_ar),
      title_en: normalizeText(showcase.title_en, defaults.showcase.title_en),
      desc_ar: normalizeText(showcase.desc_ar, defaults.showcase.desc_ar),
      desc_en: normalizeText(showcase.desc_en, defaults.showcase.desc_en),

      tabs: {
        // تبويب "الكل" بالعربية
        all_ar: normalizeText(
          tabs.all_ar,
          defaults.showcase.tabs.all_ar
        ),

        // تبويب "الكل" بالإنجليزية
        all_en: normalizeText(
          tabs.all_en,
          defaults.showcase.tabs.all_en
        ),

        // تبويب "التطوير" بالعربية
        // كان الخطأ هنا بسبب تمرير وسيط ثالث زائد
        dev_ar: normalizeText(
          tabs.dev_ar,
          defaults.showcase.tabs.dev_ar
        ),

        // تبويب "التطوير" بالإنجليزية
        dev_en: normalizeText(
          tabs.dev_en,
          defaults.showcase.tabs.dev_en
        ),

        // تبويب "الاستثمار" بالعربية
        inv_ar: normalizeText(
          tabs.inv_ar,
          defaults.showcase.tabs.inv_ar
        ),

        // تبويب "الاستثمار" بالإنجليزية
        inv_en: normalizeText(
          tabs.inv_en,
          defaults.showcase.tabs.inv_en
        ),

        // تبويب "الإدارة" بالعربية
        mng_ar: normalizeText(
          tabs.mng_ar,
          defaults.showcase.tabs.mng_ar
        ),

        // تبويب "الإدارة" بالإنجليزية
        mng_en: normalizeText(
          tabs.mng_en,
          defaults.showcase.tabs.mng_en
        ),
      },

      items:
        Array.isArray(showcase.items) && showcase.items.length > 0
          ? showcase.items.map((item, index) => normalizeShowcaseItem(item, index))
          : defaults.showcase.items,
    },

    insight: {
      kicker_ar: normalizeText(insight.kicker_ar, defaults.insight.kicker_ar),
      kicker_en: normalizeText(insight.kicker_en, defaults.insight.kicker_en),
      title_ar: normalizeText(insight.title_ar, defaults.insight.title_ar),
      title_en: normalizeText(insight.title_en, defaults.insight.title_en),
      desc_ar: normalizeText(insight.desc_ar, defaults.insight.desc_ar),
      desc_en: normalizeText(insight.desc_en, defaults.insight.desc_en),
    },

    contact: {
      title_ar: normalizeText(contact.title_ar, defaults.contact.title_ar),
      title_en: normalizeText(contact.title_en, defaults.contact.title_en),
      desc_ar: normalizeText(contact.desc_ar, defaults.contact.desc_ar),
      desc_en: normalizeText(contact.desc_en, defaults.contact.desc_en),
      first_name_ar: normalizeText(
        contact.first_name_ar,
        defaults.contact.first_name_ar
      ),
      first_name_en: normalizeText(
        contact.first_name_en,
        defaults.contact.first_name_en
      ),
      second_name_ar: normalizeText(
        contact.second_name_ar,
        defaults.contact.second_name_ar
      ),
      second_name_en: normalizeText(
        contact.second_name_en,
        defaults.contact.second_name_en
      ),
      last_name_ar: normalizeText(
        contact.last_name_ar,
        defaults.contact.last_name_ar
      ),
      last_name_en: normalizeText(
        contact.last_name_en,
        defaults.contact.last_name_en
      ),
      email_ar: normalizeText(contact.email_ar, defaults.contact.email_ar),
      email_en: normalizeText(contact.email_en, defaults.contact.email_en),
      message_ar: normalizeText(contact.message_ar, defaults.contact.message_ar),
      message_en: normalizeText(contact.message_en, defaults.contact.message_en),
      submit_btn_ar: normalizeText(
        contact.submit_btn_ar,
        defaults.contact.submit_btn_ar
      ),
      submit_btn_en: normalizeText(
        contact.submit_btn_en,
        defaults.contact.submit_btn_en
      ),
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

async function getPublishedPortfolioPage(): Promise<PortfolioPageRecord> {
  // جلب صفحة portfolio المنشورة من القاعدة
  // وإذا لم توجد أو حدث خطأ نرجع fallback كامل
  const fallbackSections = createDefaultPortfolioSections();

  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .eq("slug", "portfolio")
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
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
        sections_json: fallbackSections,
      };
    }

    return {
      slug: normalizeText(data.slug, "portfolio"),
      title_ar: normalizeText(data.title_ar, "الأعمال"),
      title_en: normalizeText(data.title_en, "Portfolio"),
      content_ar: normalizeText(
        data.content_ar,
        "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي."
      ),
      content_en: normalizeText(
        data.content_en,
        "A professional real-estate portfolio presenting selected works and strategic execution content."
      ),
      is_published: normalizeBoolean(data.is_published, true),
      page_type: normalizeText(data.page_type, "portfolio") || "portfolio",
      sections_json: normalizeSections(data.sections_json),
    };
  } catch (error) {
    console.error("portfolio public page fetch error:", error);

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
      sections_json: fallbackSections,
    };
  }
}

export default async function PortfolioPage() {
  // الصفحة العامة لعرض Portfolio

  const cookieStore = await cookies();
  // قراءة الكوكي الحالية بطريقة متوافقة مع Next.js 16

  const lang: Lang = cookieStore.get("lang")?.value === "en" ? "en" : "ar";
  // اختيار اللغة الحالية من الكوكي
  // إذا لم توجد قيمة نستخدم العربية افتراضيًا

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة حسب اللغة

  const pageData = await getPublishedPortfolioPage();
  // جلب بيانات Portfolio النهائية بعد الدمج والتطبيع

  return (
    <PortfolioClient
      lang={lang}
      dir={dir}
      pageData={pageData}
    />
  );
  // تمرير اللغة والاتجاه والسجل النهائي إلى مكوّن العرض
}