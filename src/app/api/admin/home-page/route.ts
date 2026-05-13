import { NextRequest, NextResponse } from "next/server";
// NextRequest لقراءة طلب PATCH و NextResponse لإرجاع JSON موحد.

import { cookies } from "next/headers";
// cookies للتحقق من جلسة الأدمن قبل السماح بالقراءة أو الحفظ.

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase السيرفري للتعامل مع جدول pages.

export const dynamic = "force-dynamic";
// منع الكاش لأن لوحة الأدمن يجب أن تقرأ أحدث نسخة دائمًا.

type Dict = Record<string, string>;
// قاموس نصوص بسيط لكل لغة.


type AdvancedSectionStyle = {
  // إعدادات تصميم قسم مستقل داخل Home Builder.
  background: string;
  // خلفية القسم.
  textColor: string;
  // لون النص داخل القسم.
  padding: number;
  // الحشو الداخلي.
  radius: number;
  // تدوير الزوايا.
  shadow: number;
  // قوة الظل.
};
// نهاية نوع تصميم القسم.

type AdvancedElementStyle = {
  // إعدادات تصميم عنصر منفرد داخل قسم.
  color: string;
  // لون النص أو الأيقونة.
  background: string;
  // خلفية العنصر.
  size: number;
  // حجم النص أو العنصر.
  weight: number;
  // سماكة الخط.
  radius: number;
  // تدوير الزوايا.
  shadow: number;
  // قوة الظل.
  borderWidth: number;
  // سماكة الحد.
  borderColor: string;
  // لون الحد.
  opacity: number;
  // الشفافية.
  scale: number;
  // التكبير.
  padding: number;
  // الحشو الداخلي.
  align: "start" | "center" | "end";
  // محاذاة النص.
};
// نهاية نوع تصميم العنصر.

type AdvancedDesignSettings = {
  // خريطة التصميم المتقدم لكل قسم وعنصر.
  activeSection: string;
  // القسم المحدد في لوحة التصميم.
  activeElement: string;
  // العنصر المحدد في لوحة التصميم.
  sections: Record<string, AdvancedSectionStyle>;
  // إعدادات الأقسام.
  elements: Record<string, AdvancedElementStyle>;
  // إعدادات العناصر.
};
// نهاية نوع التصميم المتقدم.

type DesignSettings = {
  // إعدادات التصميم التي يحفظها Home Builder داخل sections_json.
  colors: {
    // ألوان الهوية والخلفيات.
    primary: string;
    secondary: string;
    pageBg: string;
    sectionBg: string;
    text: string;
    mutedText: string;
    buttonBg: string;
    buttonText: string;
  };
  typography: {
    // أحجام الخطوط وسلوك النص.
    heroTitleSize: number;
    sectionTitleSize: number;
    bodySize: number;
    buttonSize: number;
    fontWeight: number;
    lineHeight: number;
  };
  images: {
    // طريقة عرض الصور بصريًا بدون تعديل ملفات الصور.
    radius: number;
    shadow: number;
    borderWidth: number;
    borderColor: string;
    brightness: number;
    contrast: number;
    saturation: number;
    scale: number;
  };
  backgrounds: {
    // إعدادات الخلفيات والتدرجات.
    heroOverlay: number;
    gradientEnabled: boolean;
    gradientFrom: string;
    gradientTo: string;
  };
  advanced: AdvancedDesignSettings;
  // إعدادات التصميم المتقدم لكل قسم وعنصر.
};
// نهاية تعريف إعدادات التصميم.

type HomePageSections = {
  // dict يحمل نصوص الصفحة الرئيسية بنفس مفاتيح الصفحة الحالية.
  dict: {
    ar: Dict;
    en: Dict;
  };

  // site يحمل الصور وبيانات التواصل الخاصة بالهوم.
  site: {
    statsValue: string;
    location_ar: string;
    location_en: string;
    phone: string;
    email: string;
    hero_image: string;
    project_image_1: string;
    project_image_2: string;
    project_image_3: string;
    quote_image: string;
    team_image_1: string;
    team_image_2: string;
    team_image_3: string;
    brand_wall_image: string;
  };

  design: DesignSettings;
  // إعدادات التصميم المرنة للصفحة الرئيسية.
};
// نوع sections_json الخاص بالهوم.

function adminCookieNames() {
  // دعم أكثر من اسم كوكي لأن المشروع استخدم أكثر من convention سابقًا.
  const envCookie = process.env.ADMIN_COOKIE?.trim();

  return Array.from(
    new Set(
      [envCookie, "admin_session", "zuha_admin"].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
}

async function isAdminAuthorized() {
  // التحقق من وجود كوكي أدمن قبل السماح بأي عملية إدارية.
  const cookieStore: any = await Promise.resolve(cookies() as any);

  return adminCookieNames().some((name) => Boolean(cookieStore?.get?.(name)?.value));
}

function text(value: unknown, fallback = "") {
  // تحويل أي قيمة إلى نص آمن ومقصوص.
  return String(value ?? fallback).trim();
}

function objectOf(value: unknown): Record<string, unknown> {
  // تحويل unknown إلى object آمن.
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function num(value: unknown, fallback: number) {
  // تحويل القيم الرقمية القادمة من JSON إلى رقم آمن.
  const parsed = Number(value);
  // محاولة التحويل إلى رقم.
  return Number.isFinite(parsed) ? parsed : fallback;
  // إرجاع الرقم إذا كان صالحًا أو fallback.
}

function bool(value: unknown, fallback: boolean) {
  // تحويل القيم المنطقية القادمة من JSON إلى boolean آمن.
  return typeof value === "boolean" ? value : fallback;
  // إرجاع القيمة إذا كانت boolean أو fallback.
}


function defaultAdvancedSection(background = "#ffffff", textColor = "#111827"): AdvancedSectionStyle {
  // يرجع إعدادات افتراضية لقسم واحد.
  return {
    background,
    textColor,
    padding: 22,
    radius: 26,
    shadow: 18,
  };
}

function defaultAdvancedElement(color = "#111827", background = "#ffffff", size = 18): AdvancedElementStyle {
  // يرجع إعدادات افتراضية لعنصر واحد.
  return {
    color,
    background,
    size,
    weight: 800,
    radius: 18,
    shadow: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    opacity: 1,
    scale: 1,
    padding: 14,
    align: "start",
  };
}

function defaultAdvancedDesign(): AdvancedDesignSettings {
  // يرجع إعدادات التصميم المتقدم الافتراضية.
  return {
    activeSection: "hero",
    activeElement: "hero.title",
    sections: {
      hero: defaultAdvancedSection("#2148a3", "#ffffff"),
      trust: defaultAdvancedSection("#ffffff", "#111827"),
      services: defaultAdvancedSection("#ffffff", "#111827"),
      stats: defaultAdvancedSection("#f8fafc", "#111827"),
      projects: defaultAdvancedSection("#ffffff", "#111827"),
      quote: defaultAdvancedSection("#f8fafc", "#111827"),
      newsletter: defaultAdvancedSection("#ffffff", "#111827"),
      team: defaultAdvancedSection("#ffffff", "#111827"),
      faq: defaultAdvancedSection("#f8fafc", "#111827"),
      contact: defaultAdvancedSection("#050505", "#ffffff"),
    },
    elements: {
      "hero.title": defaultAdvancedElement("#ffffff", "transparent", 42),
      "hero.desc": defaultAdvancedElement("#e5e7eb", "transparent", 16),
      "hero.eyebrow": defaultAdvancedElement("#dbeafe", "transparent", 14),
      "hero.image": defaultAdvancedElement("#111827", "#ffffff", 18),
      "services.title": defaultAdvancedElement("#111827", "transparent", 30),
      "services.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      "services.icon": defaultAdvancedElement("#2148a3", "#eef4ff", 22),
      "stats.value": defaultAdvancedElement("#2148a3", "transparent", 34),
      "projects.image": defaultAdvancedElement("#111827", "#ffffff", 18),
      "team.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      "faq.card": defaultAdvancedElement("#111827", "#ffffff", 16),
      "contact.card": defaultAdvancedElement("#ffffff", "#111111", 16),
      "button.primary": defaultAdvancedElement("#ffffff", "#2148a3", 16),
    },
  };
}

function normalizeAdvancedSection(value: unknown, fallback: AdvancedSectionStyle): AdvancedSectionStyle {
  // تطبيع إعدادات قسم واحد حتى لا تكسر القيم الناقصة الواجهة.
  const obj = objectOf(value);
  return {
    background: text(obj.background, fallback.background),
    textColor: text(obj.textColor, fallback.textColor),
    padding: num(obj.padding, fallback.padding),
    radius: num(obj.radius, fallback.radius),
    shadow: num(obj.shadow, fallback.shadow),
  };
}

function normalizeAdvancedElement(value: unknown, fallback: AdvancedElementStyle): AdvancedElementStyle {
  // تطبيع إعدادات عنصر واحد.
  const obj = objectOf(value);
  const align = text(obj.align, fallback.align);
  return {
    color: text(obj.color, fallback.color),
    background: text(obj.background, fallback.background),
    size: num(obj.size, fallback.size),
    weight: num(obj.weight, fallback.weight),
    radius: num(obj.radius, fallback.radius),
    shadow: num(obj.shadow, fallback.shadow),
    borderWidth: num(obj.borderWidth, fallback.borderWidth),
    borderColor: text(obj.borderColor, fallback.borderColor),
    opacity: num(obj.opacity, fallback.opacity),
    scale: num(obj.scale, fallback.scale),
    padding: num(obj.padding, fallback.padding),
    align: align === "center" || align === "end" ? align : "start",
  };
}

function normalizeAdvancedDesign(value: unknown): AdvancedDesignSettings {
  // تطبيع التصميم المتقدم كاملًا مع الحفاظ على أي مفاتيح مستقبلية قدر الإمكان.
  const defaults = defaultAdvancedDesign();
  const obj = objectOf(value);
  const sections = objectOf(obj.sections);
  const elements = objectOf(obj.elements);
  const normalizedSections: Record<string, AdvancedSectionStyle> = {};
  const normalizedElements: Record<string, AdvancedElementStyle> = {};

  for (const key of Object.keys(defaults.sections)) {
    normalizedSections[key] = normalizeAdvancedSection(sections[key], defaults.sections[key]);
  }

  for (const key of Object.keys(defaults.elements)) {
    normalizedElements[key] = normalizeAdvancedElement(elements[key], defaults.elements[key]);
  }

  return {
    activeSection: text(obj.activeSection, defaults.activeSection),
    activeElement: text(obj.activeElement, defaults.activeElement),
    sections: normalizedSections,
    elements: normalizedElements,
  };
}

function defaultDesign(): DesignSettings {
  // القيم الافتراضية الآمنة لنظام التصميم.
  return {
    colors: {
      primary: "#2148a3",
      secondary: "#d4af37",
      pageBg: "#326bf6",
      sectionBg: "#ffffff",
      text: "#111827",
      mutedText: "#64748b",
      buttonBg: "#2148a3",
      buttonText: "#ffffff",
    },
    typography: {
      heroTitleSize: 56,
      sectionTitleSize: 34,
      bodySize: 16,
      buttonSize: 16,
      fontWeight: 800,
      lineHeight: 1.35,
    },
    images: {
      radius: 28,
      shadow: 28,
      borderWidth: 0,
      borderColor: "#d4af37",
      brightness: 1,
      contrast: 1,
      saturation: 1,
      scale: 1,
    },
    backgrounds: {
      heroOverlay: 0.18,
      gradientEnabled: true,
      gradientFrom: "#2148a3",
      gradientTo: "#326bf6",
    },
    advanced: defaultAdvancedDesign(),
  };
}

function defaultSections(): HomePageSections {
  // القيم الافتراضية مأخوذة من fallback الحالي في الصفحة الرئيسية حتى لا يتغير التصميم.
  return {
    dict: {
      ar: {
        "hero.eyebrow": "حلول عقارية موثوقة وشفافة",
        "hero.title": "استثمر بثقة.\nاكتشف فرصك",
        "hero.desc": "منصة رقمية متقدمة متخصصة في التطوير والاستثمار العقاري، إدارة الأصول، الاستشارات، ودعم المستثمرين بمعلومات دقيقة وتجربة سلسة على جميع الأجهزة.",
        "hero.btn1": "تواصل الآن",
        "hero.btn2": "اعرف المزيد",
        "trust.eyebrow": "مؤشرات الأداء",
        "trust.title": "أرقام تعكس الخبرة",
        "trust.desc": "القيمة الإجمالية للصفقات والمشاريع المُدارة، ضمن منهجية واضحة توازن بين العائد والمخاطر.",
        "services.eyebrow": "الخدمات الأساسية",
        "services.title": "خدمات عقارية موثوقة",
        "services.desc": "التطوير، الاستثمار، الاستشارات، وإدارة الأصول ضمن نموذج تشغيلي منضبط.",
        "services.item1.title": "التطوير العقاري",
        "services.item1.desc": "تطوير مشاريع منظمة بمنطق تشغيلي واستثماري واضح.",
        "services.item2.title": "الاستشارات الاستثمارية",
        "services.item2.desc": "قراءة السوق وفرز الفرص واتخاذ القرار الاستثماري بانضباط.",
        "services.item3.title": "إدارة الأصول",
        "services.item3.desc": "إدارة تشغيلية واستراتيجية للأصول بما يرفع الكفاءة والعائد.",
        "services.cta": "استعرض الخدمات",
        "stats.eyebrow": "مؤشرات الأداء",
        "stats.title": "أرقام تعكس الخبرة",
        "stats.desc": "القيمة الإجمالية للصفقات والمشاريع المُدارة ضمن منهجية واضحة تحقق توازنًا بين العائد والمخاطر.",
        "projects.title": "مشاريع بحضور استراتيجي",
        "projects.desc": "فرص عقارية مختارة تُعرض بهوية بصرية قوية وتخطيط منضبط ورؤية واعية بالموقع.",
        "quote.brand": "عميل ALZUHA",
        "quote.text": "فريق موثوق بتنفيذ منضبط وتواصل واضح وفهم حقيقي للقيمة العقارية.",
        "quote.author": "مستثمر خاص",
        "quote.role": "النجف",
        "quote.cta": "عرض الأعمال",
        "newsletter.title": "ابقَ مطلعًا على الفرص الجادة",
        "newsletter.desc": "استقبل تحديثات مختارة عن المشاريع، وإشارات السوق، والفرص الجاهزة للاستثمار.",
        "newsletter.placeholder": "بريدك الإلكتروني",
        "newsletter.btn": "اشتراك",
        "team.eyebrow": "القيادة",
        "team.title": "الوجوه التي تقف خلف القرار",
        "team.desc": "فريق مركز يجمع بين التطوير والاستثمار والاستشارات والتشغيل.",
        "team.item1.name": "آدم نصار",
        "team.item1.role": "مدير تطوير المشاريع",
        "team.item2.name": "سارة جابر",
        "team.item2.role": "مستشارة استثمار",
        "team.item3.name": "ليان مراد",
        "team.item3.role": "أخصائية إدارة الأصول",
        "faq.title": "الأسئلة الشائعة",
        "faq.desc": "إجابات واضحة على الأسئلة المتكررة في الاستثمار والعقار.",
        "faq.q1": "ما نوع المشاريع التي تعملون عليها؟",
        "faq.a1": "مشاريع سكنية وتجارية ومتعددة الاستخدام وفرص موجهة للاستثمار.",
        "faq.q2": "هل تقدمون استشارة قبل الشراء؟",
        "faq.a2": "نعم. ندعم التقييم وقراءة السوق وتوجيه القرار الاستثماري.",
        "faq.q3": "هل يمكنكم إدارة أصول قائمة؟",
        "faq.a3": "نعم. ندير الأصول تشغيليًا واستراتيجيًا لتحسين الكفاءة والعائد.",
        "faq.q4": "كيف أبدأ معكم؟",
        "faq.a4": "ابدأ بطلب استشارة حتى نفهم الهدف ونقترح المسار المناسب.",
        "faq.cta": "تحدث معنا",
        "contact.eyebrow": "لنتواصل",
        "contact.desc": "تواصل معنا لتطوير المشاريع أو الاستشارات أو الدعم الاستثماري أو الاستفسارات المباشرة."
      },
      en: {
        "hero.eyebrow": "Trusted, transparent real estate solutions",
        "hero.title": "Invest with confidence.\nDiscover your opportunities",
        "hero.desc": "A modern platform focused on real-estate development, investment, asset management, consulting, and investor support—built for clarity across all devices.",
        "hero.btn1": "Contact Now",
        "hero.btn2": "Learn More",
        "trust.eyebrow": "Performance indicators",
        "trust.title": "Numbers that reflect expertise",
        "trust.desc": "Aggregate value of managed deals and projects, supported by a clear methodology balancing return and risk.",
        "services.eyebrow": "Core services",
        "services.title": "Reliable real-estate services",
        "services.desc": "Development, investment, consulting, and asset management under one disciplined operating model.",
        "services.item1.title": "Real Estate Development",
        "services.item1.desc": "Structured project development with strong operational and investment logic.",
        "services.item2.title": "Investment Advisory",
        "services.item2.desc": "Market reading, opportunity filtering, and disciplined investment decisions.",
        "services.item3.title": "Asset Management",
        "services.item3.desc": "Operational control focused on sustainability, efficiency, and long-term returns.",
        "services.cta": "Explore Services",
        "stats.eyebrow": "Performance indicators",
        "stats.title": "Numbers that reflect expertise",
        "stats.desc": "Aggregate value of managed deals and projects through a disciplined methodology balancing return and risk.",
        "projects.title": "Projects with strategic visibility",
        "projects.desc": "Selected real-estate opportunities presented through a strong visual identity, disciplined planning, and location-aware strategy.",
        "quote.brand": "ALZUHA Client",
        "quote.text": "A reliable team with disciplined execution, transparent communication, and a clear understanding of real-estate value.",
        "quote.author": "Private Investor",
        "quote.role": "Najaf",
        "quote.cta": "View Portfolio",
        "newsletter.title": "Stay informed about serious opportunities",
        "newsletter.desc": "Receive selected updates on projects, market signals, and investment-ready opportunities.",
        "newsletter.placeholder": "Your email address",
        "newsletter.btn": "Subscribe",
        "team.eyebrow": "Leadership",
        "team.title": "The people behind the decisions",
        "team.desc": "A focused team across development, investment, advisory, and operations.",
        "team.item1.name": "Adam Nassar",
        "team.item1.role": "Projects Development Lead",
        "team.item2.name": "Sarah Jaber",
        "team.item2.role": "Investment Advisor",
        "team.item3.name": "Lian Murad",
        "team.item3.role": "Asset Management Specialist",
        "faq.title": "Frequently asked questions",
        "faq.desc": "Clear answers to the most common real-estate and investment questions.",
        "faq.q1": "What types of projects do you work on?",
        "faq.a1": "Residential, commercial, mixed-use developments, and selected investment opportunities.",
        "faq.q2": "Do you provide advisory before purchase?",
        "faq.a2": "Yes. We support market reading, evaluation, and investment decision guidance.",
        "faq.q3": "Can you manage existing assets?",
        "faq.a3": "Yes. We manage assets operationally and strategically to improve efficiency and returns.",
        "faq.q4": "How do I start with you?",
        "faq.a4": "Start with a consultation request so we can understand the objective and propose the right path.",
        "faq.cta": "Talk to us",
        "contact.eyebrow": "Let’s connect",
        "contact.desc": "Contact us for development, advisory, investor support, and direct real-estate inquiries."
      }
    },
    site: {
      statsValue: "1,024,125.02",
      location_ar: "العراق / النجف",
      location_en: "Iraq / Najaf",
      phone: "+964 7802335555",
      email: "info@zuha.us",
      hero_image: "/pages/home/img/img (1).jpg",
      project_image_1: "/pages/home/img/img (2).jpg",
      project_image_2: "/pages/home/img/img (3).jpg",
      project_image_3: "/pages/home/img/img (4).jpg",
      quote_image: "/pages/home/img/img (5).jpg",
      team_image_1: "/pages/home/img/img (6).jpg",
      team_image_2: "/pages/home/img/img (7).jpg",
      team_image_3: "/pages/home/img/img (8).jpg",
      brand_wall_image: "/pages/home/img/img (9).jpg"
    },
    design: defaultDesign()
  };
}

function normalizeSections(value: unknown): HomePageSections {
  // دمج البيانات القادمة من القاعدة مع القيم الافتراضية.
  const base = defaultSections();
  const obj = objectOf(value);
  const dict = objectOf(obj.dict);
  const ar = objectOf(dict.ar);
  const en = objectOf(dict.en);
  const site = objectOf(obj.site);
  const design = objectOf(obj.design);
  const colors = objectOf(design.colors);
  const typography = objectOf(design.typography);
  const images = objectOf(design.images);
  const backgrounds = objectOf(design.backgrounds);
  const advanced = objectOf(design.advanced);

  return {
    dict: {
      ar: { ...base.dict.ar, ...(ar as Dict) },
      en: { ...base.dict.en, ...(en as Dict) }
    },
    site: {
      statsValue: text(site.statsValue, base.site.statsValue),
      location_ar: text(site.location_ar, base.site.location_ar),
      location_en: text(site.location_en, base.site.location_en),
      phone: text(site.phone, base.site.phone),
      email: text(site.email, base.site.email),
      hero_image: text(site.hero_image, base.site.hero_image),
      project_image_1: text(site.project_image_1, base.site.project_image_1),
      project_image_2: text(site.project_image_2, base.site.project_image_2),
      project_image_3: text(site.project_image_3, base.site.project_image_3),
      quote_image: text(site.quote_image, base.site.quote_image),
      team_image_1: text(site.team_image_1, base.site.team_image_1),
      team_image_2: text(site.team_image_2, base.site.team_image_2),
      team_image_3: text(site.team_image_3, base.site.team_image_3),
      brand_wall_image: text(site.brand_wall_image, base.site.brand_wall_image)
    },
    design: {
      colors: {
        primary: text(colors.primary, base.design.colors.primary),
        secondary: text(colors.secondary, base.design.colors.secondary),
        pageBg: text(colors.pageBg, base.design.colors.pageBg),
        sectionBg: text(colors.sectionBg, base.design.colors.sectionBg),
        text: text(colors.text, base.design.colors.text),
        mutedText: text(colors.mutedText, base.design.colors.mutedText),
        buttonBg: text(colors.buttonBg, base.design.colors.buttonBg),
        buttonText: text(colors.buttonText, base.design.colors.buttonText),
      },
      typography: {
        heroTitleSize: num(typography.heroTitleSize, base.design.typography.heroTitleSize),
        sectionTitleSize: num(typography.sectionTitleSize, base.design.typography.sectionTitleSize),
        bodySize: num(typography.bodySize, base.design.typography.bodySize),
        buttonSize: num(typography.buttonSize, base.design.typography.buttonSize),
        fontWeight: num(typography.fontWeight, base.design.typography.fontWeight),
        lineHeight: num(typography.lineHeight, base.design.typography.lineHeight),
      },
      images: {
        radius: num(images.radius, base.design.images.radius),
        shadow: num(images.shadow, base.design.images.shadow),
        borderWidth: num(images.borderWidth, base.design.images.borderWidth),
        borderColor: text(images.borderColor, base.design.images.borderColor),
        brightness: num(images.brightness, base.design.images.brightness),
        contrast: num(images.contrast, base.design.images.contrast),
        saturation: num(images.saturation, base.design.images.saturation),
        scale: num(images.scale, base.design.images.scale),
      },
      backgrounds: {
        heroOverlay: num(backgrounds.heroOverlay, base.design.backgrounds.heroOverlay),
        gradientEnabled: bool(backgrounds.gradientEnabled, base.design.backgrounds.gradientEnabled),
        gradientFrom: text(backgrounds.gradientFrom, base.design.backgrounds.gradientFrom),
        gradientTo: text(backgrounds.gradientTo, base.design.backgrounds.gradientTo),
      },
      advanced: normalizeAdvancedDesign(advanced),
    }
  };
}

export async function GET() {
  // قراءة بيانات Home Builder للأدمن.
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("pages")
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    .eq("slug", "home")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  const fallback = {
    slug: "home",
    title_ar: "الرئيسية",
    title_en: "Home",
    content_ar: "محتوى الصفحة الرئيسية.",
    content_en: "Home page content.",
    is_published: true,
    page_type: "home",
    sections_json: defaultSections()
  };

  const item = data
    ? { ...fallback, ...data, sections_json: normalizeSections(data.sections_json) }
    : fallback;

  return NextResponse.json({ ok: true, item });
}

export async function PATCH(request: NextRequest) {
  // حفظ بيانات Home Builder في سجل pages.slug=home.
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const nextItem = {
    slug: "home",
    title_ar: text(body.title_ar, "الرئيسية"),
    title_en: text(body.title_en, "Home"),
    content_ar: text(body.content_ar, "محتوى الصفحة الرئيسية."),
    content_en: text(body.content_en, "Home page content."),
    is_published: typeof body.is_published === "boolean" ? body.is_published : true,
    page_type: "home",
    sections_json: normalizeSections(body.sections_json),
    updated_at: new Date().toISOString()
  };

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("pages")
    .upsert(nextItem, { onConflict: "slug" })
    .select("slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: { ...data, sections_json: normalizeSections(data.sections_json) } });
}
