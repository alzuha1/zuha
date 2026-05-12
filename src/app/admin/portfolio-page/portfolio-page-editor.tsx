"use client";
// هذا الملف عميل لأنه يحتوي على state والتفاعل الكامل مع لوحة الأدمن

import { useEffect, useMemo, useState } from "react";
// useState لإدارة الحالة المحلية
// useEffect لقراءة لغة لوحة التحكم من الكوكي.
// useMemo لحساب الإحصائيات والتطبيع دون إعادة حساب غير لازمة

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
// عنصر واحد داخل قسم الأعمال/القصص المختارة

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
// الشكل الكامل لـ sections_json الخاصة بصفحة Portfolio

type PortfolioPageAdminRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: PortfolioPageSections | null;
};
// السجل الكامل الذي تتحكم به لوحة الأدمن

type PathSegment = string | number;

type BuilderLang = "ar" | "en";
// لغة واجهة لوحة التحكم: عربي أو إنجليزي.

type PreviewDevice = "desktop" | "tablet" | "mobile";
// نوع الجهاز المستخدم في المعاينة الحية.

const builderCopy = {
  ar: {
    cms: "ALZUHA CMS",
    title: "منشئ صفحة الأعمال",
    desc: "تحكم بصفحة الأعمال، القصص المختارة، الصور، النصوص، التواصل، والفوتر من مساحة عمل واحدة.",
    openPublic: "عرض الصفحة",
    reset: "إرجاع التغييرات",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    saved: "تم حفظ صفحة الأعمال بنجاح.",
    live: "منشور",
    draft: "مسودة",
    sections: "الأقسام",
    preview: "معاينة مباشرة",
    desktop: "ديسكتوب",
    tablet: "تابلت",
    mobile: "موبايل",
    pageMeta: "بيانات الصفحة",
    hero: "الهيرو",
    showcase: "الأعمال المختارة",
    insight: "الرؤية/التحليل",
    contact: "التواصل",
    footer: "الفوتر",
    showcaseItems: "عناصر الأعمال",
    missingCovers: "صور ناقصة",
    categories: "التصنيفات",
    publishState: "حالة النشر",
    active: "نشط",
    activeSuffix: "نشط",
    missing: "ناقص",
    language: "لغة اللوحة",
    noItems: "لا توجد عناصر بعد.",
  },
  en: {
    cms: "ALZUHA CMS",
    title: "Portfolio Live Builder",
    desc: "Manage the Portfolio page, selected stories, imagery, text blocks, contact section, and footer from one workspace.",
    openPublic: "Open Public Page",
    reset: "Reset Changes",
    save: "Save Changes",
    saving: "Saving...",
    saved: "Portfolio page saved successfully.",
    live: "Live",
    draft: "Draft",
    sections: "Sections",
    preview: "Live Preview",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    pageMeta: "Page Meta",
    hero: "Hero",
    showcase: "Showcase",
    insight: "Insight",
    contact: "Contact",
    footer: "Footer",
    showcaseItems: "Showcase Items",
    missingCovers: "Missing Covers",
    categories: "Categories Used",
    publishState: "Publish State",
    active: "active",
    activeSuffix: "active",
    missing: "missing",
    language: "Interface Language",
    noItems: "No showcase items yet.",
  },
} as const;
// قاموس نصوص واجهة الأدمن؛ لا يغيّر محتوى الصفحة المخزن.

const portfolioFieldLabelsAr: Record<string, string> = {
  "Portfolio live preview": "معاينة صفحة الأعمال",
  "Portfolio": "الأعمال",
  "Page Meta": "بيانات الصفحة",
  "General titles, descriptions, and publish state for the portfolio page.": "العناوين، الملخصات، وحالة النشر الخاصة بصفحة الأعمال.",
  "Title AR": "العنوان AR",
  "Title EN": "العنوان EN",
  "Content AR": "المحتوى AR",
  "Content EN": "المحتوى EN",
  "Published": "منشور",
  "Slug:": "المسار:",
  "Page Type:": "نوع الصفحة:",
  "Hero": "الهيرو",
  "Primary visual and messaging block for the public portfolio page.": "القسم البصري والرسالة الافتتاحية لصفحة الأعمال العامة.",
  "Hero Kicker AR": "النص العلوي للهيرو AR",
  "Hero Kicker EN": "النص العلوي للهيرو EN",
  "Hero Title AR": "عنوان الهيرو AR",
  "Hero Title EN": "عنوان الهيرو EN",
  "Hero Description AR": "وصف الهيرو AR",
  "Hero Description EN": "وصف الهيرو EN",
  "Hero Card Title AR": "عنوان بطاقة الهيرو AR",
  "Hero Card Title EN": "عنوان بطاقة الهيرو EN",
  "Hero Card Description AR": "وصف بطاقة الهيرو AR",
  "Hero Card Description EN": "وصف بطاقة الهيرو EN",
  "Hero Card Button AR": "زر بطاقة الهيرو AR",
  "Hero Card Button EN": "زر بطاقة الهيرو EN",
  "Hero Card Button Href": "رابط زر بطاقة الهيرو",
  "Hero Image URL": "رابط صورة الهيرو",
  "Showcase Section": "قسم الأعمال المختارة",
  "Manage section heading, category tabs, and selected portfolio items.": "إدارة عنوان القسم، تبويبات التصنيف، وعناصر الأعمال المختارة.",
  "Showcase Kicker AR": "النص العلوي للأعمال AR",
  "Showcase Kicker EN": "النص العلوي للأعمال EN",
  "Showcase Title AR": "عنوان الأعمال AR",
  "Showcase Title EN": "عنوان الأعمال EN",
  "Showcase Description AR": "وصف الأعمال AR",
  "Showcase Description EN": "وصف الأعمال EN",
  "Tabs Labels": "عناوين التبويبات",
  "All AR": "الكل AR",
  "All EN": "الكل EN",
  "Development AR": "التطوير AR",
  "Development EN": "التطوير EN",
  "Investment AR": "الاستثمار AR",
  "Investment EN": "الاستثمار EN",
  "Management AR": "الإدارة AR",
  "Management EN": "الإدارة EN",
  "Showcase Items": "عناصر الأعمال",
  "Add Showcase Item": "إضافة عنصر أعمال",
  "No showcase items yet.": "لا توجد عناصر أعمال بعد.",
  "Active": "نشط",
  "Inactive": "غير نشط",
  "Sort Order": "ترتيب العرض",
  "Move Up": "تحريك للأعلى",
  "Move Down": "تحريك للأسفل",
  "Delete Item": "حذف العنصر",
  "Item ID": "معرّف العنصر",
  "Category Key": "مفتاح التصنيف",
  "Tag AR": "الوسم AR",
  "Tag EN": "الوسم EN",
  "Description AR": "الوصف AR",
  "Description EN": "الوصف EN",
  "Author AR": "الجهة/الكاتب AR",
  "Author EN": "الجهة/الكاتب EN",
  "Role AR": "الدور AR",
  "Role EN": "الدور EN",
  "Date AR": "التاريخ AR",
  "Date EN": "التاريخ EN",
  "Cover Image URL": "رابط صورة الغلاف",
  "Author Image URL": "رابط صورة الجهة/الكاتب",
  "Item Href": "رابط العنصر",
  "Insight Section": "قسم الرؤية/التحليل",
  "A supporting statement block that strengthens the portfolio narrative.": "قسم داعم يعزز قصة الأعمال وسجل التنفيذ.",
  "Insight Kicker AR": "النص العلوي للرؤية AR",
  "Insight Kicker EN": "النص العلوي للرؤية EN",
  "Insight Title AR": "عنوان الرؤية AR",
  "Insight Title EN": "عنوان الرؤية EN",
  "Insight Description AR": "وصف الرؤية AR",
  "Insight Description EN": "وصف الرؤية EN",
  "Contact Section": "قسم التواصل",
  "Manage the contact/consultation block shown on the public portfolio page.": "إدارة قسم التواصل أو الاستشارة الظاهر في صفحة الأعمال العامة.",
  "Contact Title AR": "عنوان التواصل AR",
  "Contact Title EN": "عنوان التواصل EN",
  "Contact Description AR": "وصف التواصل AR",
  "Contact Description EN": "وصف التواصل EN",
  "First Name AR": "الاسم الأول AR",
  "First Name EN": "الاسم الأول EN",
  "Second Name AR": "الاسم الثاني AR",
  "Second Name EN": "الاسم الثاني EN",
  "Last Name AR": "الاسم الأخير AR",
  "Last Name EN": "الاسم الأخير EN",
  "Email AR": "البريد الإلكتروني AR",
  "Email EN": "البريد الإلكتروني EN",
  "Message AR": "الرسالة AR",
  "Message EN": "الرسالة EN",
  "Submit Button AR": "زر الإرسال AR",
  "Submit Button EN": "زر الإرسال EN",
  "Footer": "الفوتر",
  "Manage footer links and general contact information for Portfolio.": "إدارة روابط الفوتر ومعلومات التواصل العامة الخاصة بصفحة الأعمال.",
  "Footer Email": "بريد الفوتر",
  "Privacy Href": "رابط سياسة الخصوصية",
  "Social 1 AR": "الرابط الاجتماعي 1 AR",
  "Social 1 EN": "الرابط الاجتماعي 1 EN",
  "Social 1 Href": "رابط الاجتماعي 1",
  "Social 2 AR": "الرابط الاجتماعي 2 AR",
  "Social 2 EN": "الرابط الاجتماعي 2 EN",
  "Social 2 Href": "رابط الاجتماعي 2",
  "Social 3 AR": "الرابط الاجتماعي 3 AR",
  "Social 3 EN": "الرابط الاجتماعي 3 EN",
  "Social 3 Href": "رابط الاجتماعي 3",
  "Copy AR": "حقوق النشر AR",
  "Copy EN": "حقوق النشر EN",
  "Privacy AR": "سياسة الخصوصية AR",
  "Privacy EN": "سياسة الخصوصية EN",
  "Reset Changes": "إرجاع التغييرات",
  "Save Changes": "حفظ التغييرات",
};
// قاموس عربي لكل نصوص الحقول والأقسام التي كانت ثابتة بالإنجليزية داخل محرر Portfolio.

function labelFor(label: string, lang: BuilderLang) {
  // يعيد النص العربي عند اختيار AR، ويُبقي النص الإنجليزي كما هو عند اختيار EN.
  return lang === "ar" ? portfolioFieldLabelsAr[label] ?? label : label;
}
// دالة مركزية تمنع بقاء النصوص ثابتة عند تبديل اللغة.

// نوع المقطع داخل المسار الديناميكي عند التحديث الداخلي

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تنظيف النصوص وتحويل null/undefined إلى fallback
  return String(value ?? fallback).trim();
}

function normalizeBoolean(value: unknown, fallback = false) {
  // إرجاع قيمة boolean آمنة
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  // إرجاع رقم آمن
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function createId(prefix: string) {
  // إنشاء معرّف داخلي بسيط للعناصر الجديدة
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDeep<T>(value: T): T {
  // نسخ عميق للحالة قبل التعديل
  return JSON.parse(JSON.stringify(value)) as T;
}

function getNestedValue(target: any, path: PathSegment[]) {
  // قراءة قيمة داخلية من object أو array عبر مسار ديناميكي
  return path.reduce((acc, segment) => {
    if (acc == null) return undefined;
    return acc[segment as keyof typeof acc];
  }, target);
}

function setNestedValue(target: any, path: PathSegment[], value: unknown) {
  // تحديث قيمة داخلية داخل object أو array عبر مسار ديناميكي
  let cursor = target;

  for (let index = 0; index < path.length - 1; index += 1) {
    const current = path[index];
    const next = path[index + 1];

    if (cursor[current] == null) {
      cursor[current] = typeof next === "number" ? [] : {};
    }

    cursor = cursor[current];
  }

  cursor[path[path.length - 1]] = value;
}

function moveArrayItem<T>(items: T[], fromIndex: number, direction: -1 | 1) {
  // تحريك عنصر داخل مصفوفة لأعلى أو لأسفل
  const targetIndex = fromIndex + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  next.splice(targetIndex, 0, moved);

  return next;
}

function createEmptyShowcaseItem(order = 1): ShowcaseItem {
  // إنشاء عنصر جديد داخل قسم الأعمال/القصص
  return {
    id: createId("portfolio-item"),
    is_active: true,
    sort_order: order,
    category_key: "dev",
    tag_ar: "تصنيف",
    tag_en: "Category",
    title_ar: "عمل جديد",
    title_en: "New Work",
    desc_ar: "وصف مختصر لهذا العنصر.",
    desc_en: "A short description for this item.",
    author_ar: "فريق الزُهى",
    author_en: "ALZUHA Team",
    role_ar: "تحرير الملف",
    role_en: "Portfolio Editing",
    date_ar: "يناير 2026",
    date_en: "January 2026",
    cover_image_url: "",
    author_image_url: "",
    href: "/portfolio",
  };
}

function createDefaultSections(): PortfolioPageSections {
  // البنية الافتراضية الكاملة لـ Portfolio
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
  };
}

function normalizeShowcaseItem(value: unknown, index: number): ShowcaseItem {
  // تطبيع عنصر واحد داخل showcase.items
  const obj = asObject(value);

  return {
    id: normalizeText(obj.id, createId("portfolio-item")),
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    category_key: normalizeText(obj.category_key, "dev"),
    tag_ar: normalizeText(obj.tag_ar, "تصنيف"),
    tag_en: normalizeText(obj.tag_en, "Category"),
    title_ar: normalizeText(obj.title_ar, "عمل"),
    title_en: normalizeText(obj.title_en, "Work"),
    desc_ar: normalizeText(obj.desc_ar, "وصف مختصر لهذا العنصر."),
    desc_en: normalizeText(obj.desc_en, "A short description for this item."),
    author_ar: normalizeText(obj.author_ar, "فريق الزُهى"),
    author_en: normalizeText(obj.author_en, "ALZUHA Team"),
    role_ar: normalizeText(obj.role_ar, "تحرير الملف"),
    role_en: normalizeText(obj.role_en, "Portfolio Editing"),
    date_ar: normalizeText(obj.date_ar, "يناير 2026"),
    date_en: normalizeText(obj.date_en, "January 2026"),
    cover_image_url: normalizeText(obj.cover_image_url, ""),
    author_image_url: normalizeText(obj.author_image_url, ""),
    href: normalizeText(obj.href, "/portfolio"),
  };
}

function normalizeSections(value: unknown): PortfolioPageSections {
  // تطبيع البنية الكاملة لـ sections_json
  const defaults = createDefaultSections();
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
      image_url: normalizeText(hero.image_url, defaults.hero.image_url),
    },

    showcase: {
      kicker_ar: normalizeText(showcase.kicker_ar, defaults.showcase.kicker_ar),
      kicker_en: normalizeText(showcase.kicker_en, defaults.showcase.kicker_en),
      title_ar: normalizeText(showcase.title_ar, defaults.showcase.title_ar),
      title_en: normalizeText(showcase.title_en, defaults.showcase.title_en),
      desc_ar: normalizeText(showcase.desc_ar, defaults.showcase.desc_ar),
      desc_en: normalizeText(showcase.desc_en, defaults.showcase.desc_en),

      tabs: {
        all_ar: normalizeText(tabs.all_ar, defaults.showcase.tabs.all_ar),
        all_en: normalizeText(tabs.all_en, defaults.showcase.tabs.all_en),
        dev_ar: normalizeText(tabs.dev_ar, defaults.showcase.tabs.dev_ar),
        dev_en: normalizeText(tabs.dev_en, defaults.showcase.tabs.dev_en),
        inv_ar: normalizeText(tabs.inv_ar, defaults.showcase.tabs.inv_ar),
        inv_en: normalizeText(tabs.inv_en, defaults.showcase.tabs.inv_en),
        mng_ar: normalizeText(tabs.mng_ar, defaults.showcase.tabs.mng_ar),
        mng_en: normalizeText(tabs.mng_en, defaults.showcase.tabs.mng_en),
      },

      items: Array.isArray(showcase.items)
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
      social1_href: normalizeText(
        footer.social1_href,
        defaults.footer.social1_href
      ),
      social2_ar: normalizeText(footer.social2_ar, defaults.footer.social2_ar),
      social2_en: normalizeText(footer.social2_en, defaults.footer.social2_en),
      social2_href: normalizeText(
        footer.social2_href,
        defaults.footer.social2_href
      ),
      social3_ar: normalizeText(footer.social3_ar, defaults.footer.social3_ar),
      social3_en: normalizeText(footer.social3_en, defaults.footer.social3_en),
      social3_href: normalizeText(
        footer.social3_href,
        defaults.footer.social3_href
      ),
      copy_ar: normalizeText(footer.copy_ar, defaults.footer.copy_ar),
      copy_en: normalizeText(footer.copy_en, defaults.footer.copy_en),
      privacy_ar: normalizeText(footer.privacy_ar, defaults.footer.privacy_ar),
      privacy_en: normalizeText(footer.privacy_en, defaults.footer.privacy_en),
      privacy_href: normalizeText(
        footer.privacy_href,
        defaults.footer.privacy_href
      ),
    },
  };
}

function normalizeRecord(value: PortfolioPageAdminRecord): PortfolioPageAdminRecord {
  // تطبيع السجل الكامل القادم من السيرفر
  return {
    slug: normalizeText(value.slug, "portfolio"),
    title_ar: normalizeText(value.title_ar, "الأعمال"),
    title_en: normalizeText(value.title_en, "Portfolio"),
    content_ar: normalizeText(
      value.content_ar,
      "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي."
    ),
    content_en: normalizeText(
      value.content_en,
      "A professional real-estate portfolio presenting selected works and strategic execution content."
    ),
    is_published: normalizeBoolean(value.is_published, true),
    page_type: normalizeText(value.page_type, "portfolio") || "portfolio",
    sections_json: normalizeSections(value.sections_json),
  };
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  // حقل input موحد
  return (
    <label className="admin-portfolio-editor__field">
      <span>{label}</span>
      <input
        className="admin-portfolio-editor__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  // حقل textarea موحد
  return (
    <label className="admin-portfolio-editor__field">
      <span>{label}</span>
      <textarea
        className="admin-portfolio-editor__textarea"
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function ToggleInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  // Checkbox موحد
  return (
    <label className="admin-portfolio-editor__toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  // select موحد لتصنيف العناصر
  return (
    <label className="admin-portfolio-editor__field">
      <span>{label}</span>
      <select
        className="admin-portfolio-editor__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}


function stripHtmlBreaks(value: string) {
  // يحول <br> إلى مسافة داخل المعاينة المصغرة.
  return value.replace(/<br\s*\/?>(\s*)/gi, " ").trim();
}

function pickLangText(lang: BuilderLang, ar: string, en: string) {
  // يختار النص المناسب حسب لغة واجهة الأدمن.
  return lang === "ar" ? ar || en : en || ar;
}

function PortfolioPreviewImage({ src, alt }: { src: string; alt: string }) {
  // يعرض صورة آمنة داخل المعاينة أو بديلًا بصريًا عند عدم وجود صورة.
  if (!src) {
    return <div className="admin-portfolio-preview__imagePlaceholder">ALZUHA</div>;
  }

  return <img src={src} alt={alt || "Portfolio preview image"} />;
}

function PortfolioLivePreview({
  item,
  lang,
  device,
  onDeviceChange,
  copy,
}: {
  item: PortfolioPageAdminRecord;
  lang: BuilderLang;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  copy: (typeof builderCopy)[BuilderLang];
}) {
  // المعاينة الحية تقرأ نفس الحالة الحالية؛ لذلك تظهر التغييرات فور الكتابة.
  const sections = item.sections_json ?? createDefaultSections();
  const heroTitle = stripHtmlBreaks(pickLangText(lang, sections.hero.title_ar, sections.hero.title_en));
  const heroDesc = pickLangText(lang, sections.hero.desc_ar, sections.hero.desc_en);
  const heroKicker = pickLangText(lang, sections.hero.kicker_ar, sections.hero.kicker_en);
  const previewItems = sections.showcase.items.filter((entry) => entry.is_active).slice(0, 4);
  const insightTitle = pickLangText(lang, sections.insight.title_ar, sections.insight.title_en);
  const insightDesc = pickLangText(lang, sections.insight.desc_ar, sections.insight.desc_en);
  const contactTitle = pickLangText(lang, sections.contact.title_ar, sections.contact.title_en);

  return (
    <aside className="admin-portfolio-preview" aria-label={labelFor("Portfolio live preview", lang)}>
      <div className="admin-portfolio-preview__toolbar">
        <div>
          <span>{copy.cms}</span>
          <strong>{copy.preview}</strong>
        </div>

        <div className="admin-portfolio-preview__devices">
          {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((option) => (
            <button
              key={option}
              type="button"
              className={device === option ? "is-active" : ""}
              onClick={() => onDeviceChange(option)}
            >
              {option === "desktop" ? copy.desktop : option === "tablet" ? copy.tablet : copy.mobile}
            </button>
          ))}
        </div>
      </div>

      <div className={`admin-portfolio-preview__stage is-${device}`}>
        <div className="admin-portfolio-preview__page" dir={lang === "ar" ? "rtl" : "ltr"}>
          <section className="admin-portfolio-preview__hero">
            <PortfolioPreviewImage src={sections.hero.image_url} alt={heroTitle} />
            <div className="admin-portfolio-preview__heroCopy">
              <span>{heroKicker}</span>
              <h2>{heroTitle}</h2>
              <p>{heroDesc}</p>
            </div>
          </section>

          <section className="admin-portfolio-preview__section">
            <span>{pickLangText(lang, sections.showcase.kicker_ar, sections.showcase.kicker_en)}</span>
            <h3>{stripHtmlBreaks(pickLangText(lang, sections.showcase.title_ar, sections.showcase.title_en))}</h3>
            <p>{pickLangText(lang, sections.showcase.desc_ar, sections.showcase.desc_en)}</p>

            <div className="admin-portfolio-preview__cards">
              {previewItems.length === 0 ? (
                <div className="admin-portfolio-preview__empty">{copy.noItems}</div>
              ) : (
                previewItems.map((entry) => (
                  <article key={entry.id} className="admin-portfolio-preview__card">
                    <PortfolioPreviewImage src={entry.cover_image_url} alt={pickLangText(lang, entry.title_ar, entry.title_en)} />
                    <div>
                      <small>{pickLangText(lang, entry.tag_ar, entry.tag_en)}</small>
                      <strong>{pickLangText(lang, entry.title_ar, entry.title_en)}</strong>
                      <p>{pickLangText(lang, entry.desc_ar, entry.desc_en)}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="admin-portfolio-preview__section admin-portfolio-preview__section--blue">
            <span>{pickLangText(lang, sections.insight.kicker_ar, sections.insight.kicker_en)}</span>
            <h3>{stripHtmlBreaks(insightTitle)}</h3>
            <p>{insightDesc}</p>
          </section>

          <section className="admin-portfolio-preview__contact">
            <h3>{stripHtmlBreaks(contactTitle)}</h3>
            <p>{pickLangText(lang, sections.contact.desc_ar, sections.contact.desc_en)}</p>
          </section>
        </div>
      </div>
    </aside>
  );
}

export default function PortfolioPageEditor({
  initialItem,
}: {
  initialItem: PortfolioPageAdminRecord;
}) {
  // المكوّن الرئيسي لمحرر Portfolio

  const normalizedInitial = useMemo(
    () => normalizeRecord(initialItem),
    [initialItem]
  );
  // تطبيع السجل الأولي مرة واحدة

  const [item, setItem] = useState<PortfolioPageAdminRecord>(normalizedInitial);
  // الحالة الحالية للمحرر

  const [saving, setSaving] = useState(false);
  // حالة الحفظ الحالية

  const [notice, setNotice] = useState("");
  // رسالة النجاح

  const [error, setError] = useState("");
  // رسالة الخطأ


  const [builderLang, setBuilderLang] = useState<BuilderLang>("en");
  // لغة واجهة Portfolio Builder.

  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  // حجم المعاينة الحية.

  useEffect(() => {
    // قراءة كوكي اللغة عند فتح لوحة الأدمن.
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lang="))
      ?.split("=")[1];

    setBuilderLang(cookieLang === "ar" ? "ar" : "en");
  }, []);

  const isArabicBuilder = builderLang === "ar";
  // هل واجهة الأدمن عربية.

  const copy = builderCopy[builderLang];
  // النصوص المستخدمة في الواجهة حسب اللغة.

  function changeBuilderLang(nextLang: BuilderLang) {
    // تغيير لغة واجهة الأدمن وتحديث الكوكي حتى تتذكرها الصفحة.
    setBuilderLang(nextLang);
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
  }

  const sections = item.sections_json ?? createDefaultSections();
  // اختصار للوصول إلى الأقسام

  const showcaseItems = sections.showcase.items;
  // عناصر قسم الأعمال

  const stats = useMemo(
    () => ({
      showcaseItemsCount: showcaseItems.length,
      activeShowcaseItemsCount: showcaseItems.filter((entry) => entry.is_active).length,
      missingCoverCount: showcaseItems.filter((entry) => !entry.cover_image_url).length,
      categoriesCount: new Set(showcaseItems.map((entry) => entry.category_key)).size,
    }),
    [showcaseItems]
  );
  // إحصائيات مختصرة للواجهة

  function updateRootField(
    field: keyof Pick<
      PortfolioPageAdminRecord,
      "title_ar" | "title_en" | "content_ar" | "content_en" | "is_published"
    >,
    value: string | boolean
  ) {
    // تحديث الحقول الجذرية في السجل
    setItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateAtPath(path: PathSegment[], value: unknown) {
    // تحديث أي قيمة داخلية داخل sections_json عبر مسار ديناميكي
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      setNestedValue(next.sections_json, path, value);

      return next;
    });
  }

  function appendToArray(path: PathSegment[], value: unknown) {
    // إضافة عنصر جديد إلى مصفوفة داخلية
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        currentArray.push(value);
      } else {
        setNestedValue(next.sections_json, path, [value]);
      }

      return next;
    });
  }

  function removeFromArray(path: PathSegment[], index: number) {
    // حذف عنصر من مصفوفة داخلية
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        currentArray.splice(index, 1);
      }

      return next;
    });
  }

  function moveInArray(path: PathSegment[], index: number, direction: -1 | 1) {
    // تحريك عنصر لأعلى أو لأسفل داخل مصفوفة
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        const reordered = moveArrayItem(currentArray, index, direction);
        setNestedValue(next.sections_json, path, reordered);
      }

      return next;
    });
  }

  async function handleSave() {
    // حفظ كل التعديلات عبر API الأدمن
    try {
      setSaving(true);
      setNotice("");
      setError("");

      const response = await fetch("/api/admin/portfolio-page", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title_ar: item.title_ar,
          title_en: item.title_en,
          content_ar: item.content_ar,
          content_en: item.content_en,
          is_published: item.is_published,
          sections_json: item.sections_json,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Failed to save portfolio page.");
      }

      const normalizedSaved = normalizeRecord(payload.item as PortfolioPageAdminRecord);
      // إعادة تطبيع السجل القادم من السيرفر

      setItem(normalizedSaved);
      setNotice(copy.saved);
    } catch (saveError) {
      console.error("portfolio handleSave error:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save portfolio page."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetUnsavedChanges() {
    // إعادة المحرر إلى الحالة الأولية القادمة من السيرفر
    setItem(cloneDeep(normalizedInitial));
    setNotice("");
    setError("");
  }

  const sectionLinks = [
    { id: "portfolio-section-meta", label: copy.pageMeta, metric: item.is_published ? copy.live : copy.draft },
    { id: "portfolio-section-hero", label: copy.hero, metric: "Hero" },
    { id: "portfolio-section-showcase", label: copy.showcase, metric: `${stats.showcaseItemsCount}` },
    { id: "portfolio-section-insight", label: copy.insight, metric: "Insight" },
    { id: "portfolio-section-contact", label: copy.contact, metric: "Contact" },
    { id: "portfolio-section-footer", label: copy.footer, metric: "Footer" },
  ];
  // روابط التنقل الجانبية داخل محرر Portfolio.

  return (
    <main className="admin-portfolio-editor admin-portfolio-editor--builder" dir={isArabicBuilder ? "rtl" : "ltr"}>
      {/* الغلاف العام لمحرر Portfolio بصيغة Builder. */}

      <section className="admin-portfolio-editor__header admin-portfolio-builder__topbar">
        <div>
          <span className="admin-portfolio-builder__eyebrow">{copy.cms}</span>
          <h1>{copy.title}</h1>
          <p>{copy.desc}</p>
        </div>

        <div className="admin-portfolio-editor__headerActions">
          <div className="admin-portfolio-builder__lang" aria-label={copy.language}>
            <button
              type="button"
              className={builderLang === "ar" ? "is-active" : ""}
              onClick={() => changeBuilderLang("ar")}
            >
              AR
            </button>

            <button
              type="button"
              className={builderLang === "en" ? "is-active" : ""}
              onClick={() => changeBuilderLang("en")}
            >
              EN
            </button>
          </div>

          <a
            href="/portfolio"
            target="_blank"
            rel="noreferrer"
            className="admin-portfolio-editor__ghostBtn"
          >
            {copy.openPublic}
          </a>

          <button
            type="button"
            className="admin-portfolio-editor__ghostBtn"
            onClick={resetUnsavedChanges}
            disabled={saving}
          >
            {copy.reset}
          </button>

          <button
            type="button"
            className="admin-portfolio-editor__primaryBtn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? copy.saving : copy.save}
          </button>
        </div>
      </section>

      <section className="admin-portfolio-editor__stats">
        {/* بطاقات إحصائية مختصرة. */}
        <article className="admin-portfolio-editor__statCard">
          <span>{copy.showcaseItems}</span>
          <strong>{stats.showcaseItemsCount}</strong>
          <small>{stats.activeShowcaseItemsCount} {copy.activeSuffix}</small>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>{copy.missingCovers}</span>
          <strong>{stats.missingCoverCount}</strong>
          <small>{copy.missing}</small>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>{copy.categories}</span>
          <strong>{stats.categoriesCount}</strong>
          <small>{labelFor("Portfolio", builderLang)}</small>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>{copy.publishState}</span>
          <strong>{item.is_published ? copy.live : copy.draft}</strong>
          <small>{item.slug}</small>
        </article>
      </section>

      {notice ? (
        <div className="admin-portfolio-editor__notice admin-portfolio-editor__notice--success">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="admin-portfolio-editor__notice admin-portfolio-editor__notice--error">
          {error}
        </div>
      ) : null}

      <section className="admin-portfolio-builder__workspace">
        <aside className="admin-portfolio-builder__sidebar" aria-label={copy.sections}>
          <div className="admin-portfolio-builder__sidebarHead">
            <span>{copy.cms}</span>
            <strong>{copy.sections}</strong>
          </div>

          <nav className="admin-portfolio-builder__nav">
            {sectionLinks.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{section.label}</span>
                <small>{section.metric}</small>
              </a>
            ))}
          </nav>
        </aside>

        <div className="admin-portfolio-builder__content">
      <section id="portfolio-section-meta" className="admin-portfolio-editor__section">
        {/* Page Meta */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Page Meta", builderLang)}</h2>
          <p>{labelFor("General titles, descriptions, and publish state for the portfolio page.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label={labelFor("Title AR", builderLang)}
            value={item.title_ar}
            onChange={(value) => updateRootField("title_ar", value)}
          />

          <TextInput
            label={labelFor("Title EN", builderLang)}
            value={item.title_en}
            onChange={(value) => updateRootField("title_en", value)}
          />

          <TextArea
            label={labelFor("Content AR", builderLang)}
            value={item.content_ar}
            onChange={(value) => updateRootField("content_ar", value)}
            rows={4}
          />

          <TextArea
            label={labelFor("Content EN", builderLang)}
            value={item.content_en}
            onChange={(value) => updateRootField("content_en", value)}
            rows={4}
          />
        </div>

        <div className="admin-portfolio-editor__inlineRow">
          <ToggleInput
            label={labelFor("Published", builderLang)}
            checked={item.is_published}
            onChange={(checked) => updateRootField("is_published", checked)}
          />

          <div className="admin-portfolio-editor__metaTag">
            <span>{labelFor("Slug:", builderLang)}</span>
            <strong>{item.slug}</strong>
          </div>

          <div className="admin-portfolio-editor__metaTag">
            <span>{labelFor("Page Type:", builderLang)}</span>
            <strong>{item.page_type || "portfolio"}</strong>
          </div>
        </div>
      </section>

      <section id="portfolio-section-hero" className="admin-portfolio-editor__section">
        {/* Hero */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Hero", builderLang)}</h2>
          <p>{labelFor("Primary visual and messaging block for the public portfolio page.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label={labelFor("Hero Kicker AR", builderLang)}
            value={sections.hero.kicker_ar}
            onChange={(value) => updateAtPath(["hero", "kicker_ar"], value)}
          />

          <TextInput
            label={labelFor("Hero Kicker EN", builderLang)}
            value={sections.hero.kicker_en}
            onChange={(value) => updateAtPath(["hero", "kicker_en"], value)}
          />

          <TextArea
            label={labelFor("Hero Title AR", builderLang)}
            value={sections.hero.title_ar}
            onChange={(value) => updateAtPath(["hero", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Hero Title EN", builderLang)}
            value={sections.hero.title_en}
            onChange={(value) => updateAtPath(["hero", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Hero Description AR", builderLang)}
            value={sections.hero.desc_ar}
            onChange={(value) => updateAtPath(["hero", "desc_ar"], value)}
            rows={5}
          />

          <TextArea
            label={labelFor("Hero Description EN", builderLang)}
            value={sections.hero.desc_en}
            onChange={(value) => updateAtPath(["hero", "desc_en"], value)}
            rows={5}
          />

          <TextInput
            label={labelFor("Hero Card Title AR", builderLang)}
            value={sections.hero.card_title_ar}
            onChange={(value) => updateAtPath(["hero", "card_title_ar"], value)}
          />

          <TextInput
            label={labelFor("Hero Card Title EN", builderLang)}
            value={sections.hero.card_title_en}
            onChange={(value) => updateAtPath(["hero", "card_title_en"], value)}
          />

          <TextArea
            label={labelFor("Hero Card Description AR", builderLang)}
            value={sections.hero.card_desc_ar}
            onChange={(value) => updateAtPath(["hero", "card_desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label={labelFor("Hero Card Description EN", builderLang)}
            value={sections.hero.card_desc_en}
            onChange={(value) => updateAtPath(["hero", "card_desc_en"], value)}
            rows={4}
          />

          <TextInput
            label={labelFor("Hero Card Button AR", builderLang)}
            value={sections.hero.card_btn_ar}
            onChange={(value) => updateAtPath(["hero", "card_btn_ar"], value)}
          />

          <TextInput
            label={labelFor("Hero Card Button EN", builderLang)}
            value={sections.hero.card_btn_en}
            onChange={(value) => updateAtPath(["hero", "card_btn_en"], value)}
          />

          <TextInput
            label={labelFor("Hero Card Button Href", builderLang)}
            value={sections.hero.card_btn_href}
            onChange={(value) => updateAtPath(["hero", "card_btn_href"], value)}
          />

          <TextInput
            label={labelFor("Hero Image URL", builderLang)}
            value={sections.hero.image_url}
            onChange={(value) => updateAtPath(["hero", "image_url"], value)}
            placeholder="/portfolio/img/img%20(1).jpg"
          />
        </div>
      </section>

      <section id="portfolio-section-showcase" className="admin-portfolio-editor__section">
        {/* Showcase */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Showcase Section", builderLang)}</h2>
          <p>{labelFor("Manage section heading, category tabs, and selected portfolio items.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label={labelFor("Showcase Kicker AR", builderLang)}
            value={sections.showcase.kicker_ar}
            onChange={(value) => updateAtPath(["showcase", "kicker_ar"], value)}
          />

          <TextInput
            label={labelFor("Showcase Kicker EN", builderLang)}
            value={sections.showcase.kicker_en}
            onChange={(value) => updateAtPath(["showcase", "kicker_en"], value)}
          />

          <TextArea
            label={labelFor("Showcase Title AR", builderLang)}
            value={sections.showcase.title_ar}
            onChange={(value) => updateAtPath(["showcase", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Showcase Title EN", builderLang)}
            value={sections.showcase.title_en}
            onChange={(value) => updateAtPath(["showcase", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Showcase Description AR", builderLang)}
            value={sections.showcase.desc_ar}
            onChange={(value) => updateAtPath(["showcase", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label={labelFor("Showcase Description EN", builderLang)}
            value={sections.showcase.desc_en}
            onChange={(value) => updateAtPath(["showcase", "desc_en"], value)}
            rows={4}
          />
        </div>

        <div className="admin-portfolio-editor__subSection">
          <h4>{labelFor("Tabs Labels", builderLang)}</h4>

          <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
            <TextInput
              label={labelFor("All AR", builderLang)}
              value={sections.showcase.tabs.all_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "all_ar"], value)}
            />

            <TextInput
              label={labelFor("All EN", builderLang)}
              value={sections.showcase.tabs.all_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "all_en"], value)}
            />

            <TextInput
              label={labelFor("Development AR", builderLang)}
              value={sections.showcase.tabs.dev_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "dev_ar"], value)}
            />

            <TextInput
              label={labelFor("Development EN", builderLang)}
              value={sections.showcase.tabs.dev_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "dev_en"], value)}
            />

            <TextInput
              label={labelFor("Investment AR", builderLang)}
              value={sections.showcase.tabs.inv_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "inv_ar"], value)}
            />

            <TextInput
              label={labelFor("Investment EN", builderLang)}
              value={sections.showcase.tabs.inv_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "inv_en"], value)}
            />

            <TextInput
              label={labelFor("Management AR", builderLang)}
              value={sections.showcase.tabs.mng_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "mng_ar"], value)}
            />

            <TextInput
              label={labelFor("Management EN", builderLang)}
              value={sections.showcase.tabs.mng_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "mng_en"], value)}
            />
          </div>
        </div>

        <div className="admin-portfolio-editor__arrayHeader">
          <h3>{labelFor("Showcase Items", builderLang)}</h3>

          <button
            type="button"
            className="admin-portfolio-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["showcase", "items"],
                createEmptyShowcaseItem(showcaseItems.length + 1)
              )
            }
          >
            {labelFor("Add Showcase Item", builderLang)}
          </button>
        </div>

        <div className="admin-portfolio-editor__stack">
          {showcaseItems.length === 0 ? (
            <div className="admin-portfolio-editor__emptyState">
              {labelFor("No showcase items yet.", builderLang)}
            </div>
          ) : (
            showcaseItems.map((entry, itemIndex) => (
              <details
                key={entry.id}
                className="admin-portfolio-editor__item"
              >
                <summary className="admin-portfolio-editor__itemSummary">
                  <div>
                    <strong>{entry.title_en || entry.title_ar || `Item ${itemIndex + 1}`}</strong>
                    <span>{entry.category_key || "uncategorized"}</span>
                  </div>

                  <div className="admin-portfolio-editor__summaryTags">
                    <span className="admin-portfolio-editor__tag">
                      #{itemIndex + 1}
                    </span>
                    <span
                      className={`admin-portfolio-editor__tag ${
                        entry.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {entry.is_active ? labelFor("Active", builderLang) : labelFor("Inactive", builderLang)}
                    </span>
                  </div>
                </summary>

                <div className="admin-portfolio-editor__itemBody">
                  <div className="admin-portfolio-editor__itemActions">
                    <button
                      type="button"
                      className="admin-portfolio-editor__ghostBtn"
                      onClick={() => moveInArray(["showcase", "items"], itemIndex, -1)}
                      disabled={itemIndex === 0}
                    >
                      {labelFor("Move Up", builderLang)}
                    </button>

                    <button
                      type="button"
                      className="admin-portfolio-editor__ghostBtn"
                      onClick={() => moveInArray(["showcase", "items"], itemIndex, 1)}
                      disabled={itemIndex === showcaseItems.length - 1}
                    >
                      {labelFor("Move Down", builderLang)}
                    </button>

                    <button
                      type="button"
                      className="admin-portfolio-editor__dangerBtn"
                      onClick={() => removeFromArray(["showcase", "items"], itemIndex)}
                    >
                      {labelFor("Delete Item", builderLang)}
                    </button>
                  </div>

                  <div className="admin-portfolio-editor__inlineRow">
                    <ToggleInput
                      label={labelFor("Active", builderLang)}
                      checked={entry.is_active}
                      onChange={(checked) =>
                        updateAtPath(["showcase", "items", itemIndex, "is_active"], checked)
                      }
                    />

                    <TextInput
                      label={labelFor("Sort Order", builderLang)}
                      value={String(entry.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["showcase", "items", itemIndex, "sort_order"],
                          Number(value) || itemIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
                    <TextInput
                      label={labelFor("Item ID", builderLang)}
                      value={entry.id}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "id"], value)
                      }
                    />

                    <SelectInput
                      label={labelFor("Category Key", builderLang)}
                      value={entry.category_key}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "category_key"], value)
                      }
                      options={[
                        { label: "Development (dev)", value: "dev" },
                        { label: "Investment (inv)", value: "inv" },
                        { label: "Management (mng)", value: "mng" },
                      ]}
                    />

                    <TextInput
                      label={labelFor("Tag AR", builderLang)}
                      value={entry.tag_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "tag_ar"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Tag EN", builderLang)}
                      value={entry.tag_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "tag_en"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Title AR", builderLang)}
                      value={entry.title_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "title_ar"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Title EN", builderLang)}
                      value={entry.title_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "title_en"], value)
                      }
                    />

                    <TextArea
                      label={labelFor("Description AR", builderLang)}
                      value={entry.desc_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "desc_ar"], value)
                      }
                      rows={4}
                    />

                    <TextArea
                      label={labelFor("Description EN", builderLang)}
                      value={entry.desc_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "desc_en"], value)
                      }
                      rows={4}
                    />

                    <TextInput
                      label={labelFor("Author AR", builderLang)}
                      value={entry.author_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "author_ar"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Author EN", builderLang)}
                      value={entry.author_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "author_en"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Role AR", builderLang)}
                      value={entry.role_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "role_ar"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Role EN", builderLang)}
                      value={entry.role_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "role_en"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Date AR", builderLang)}
                      value={entry.date_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "date_ar"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Date EN", builderLang)}
                      value={entry.date_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "date_en"], value)
                      }
                    />

                    <TextInput
                      label={labelFor("Cover Image URL", builderLang)}
                      value={entry.cover_image_url}
                      onChange={(value) =>
                        updateAtPath(
                          ["showcase", "items", itemIndex, "cover_image_url"],
                          value
                        )
                      }
                      placeholder="/portfolio/img/img%20(1).jpg"
                    />

                    <TextInput
                      label={labelFor("Author Image URL", builderLang)}
                      value={entry.author_image_url}
                      onChange={(value) =>
                        updateAtPath(
                          ["showcase", "items", itemIndex, "author_image_url"],
                          value
                        )
                      }
                      placeholder="/portfolio/img/img%20(3).jpg"
                    />

                    <TextInput
                      label={labelFor("Item Href", builderLang)}
                      value={entry.href}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "href"], value)
                      }
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section id="portfolio-section-insight" className="admin-portfolio-editor__section">
        {/* Insight */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Insight Section", builderLang)}</h2>
          <p>{labelFor("A supporting statement block that strengthens the portfolio narrative.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label={labelFor("Insight Kicker AR", builderLang)}
            value={sections.insight.kicker_ar}
            onChange={(value) => updateAtPath(["insight", "kicker_ar"], value)}
          />

          <TextInput
            label={labelFor("Insight Kicker EN", builderLang)}
            value={sections.insight.kicker_en}
            onChange={(value) => updateAtPath(["insight", "kicker_en"], value)}
          />

          <TextArea
            label={labelFor("Insight Title AR", builderLang)}
            value={sections.insight.title_ar}
            onChange={(value) => updateAtPath(["insight", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Insight Title EN", builderLang)}
            value={sections.insight.title_en}
            onChange={(value) => updateAtPath(["insight", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Insight Description AR", builderLang)}
            value={sections.insight.desc_ar}
            onChange={(value) => updateAtPath(["insight", "desc_ar"], value)}
            rows={5}
          />

          <TextArea
            label={labelFor("Insight Description EN", builderLang)}
            value={sections.insight.desc_en}
            onChange={(value) => updateAtPath(["insight", "desc_en"], value)}
            rows={5}
          />
        </div>
      </section>

      <section id="portfolio-section-contact" className="admin-portfolio-editor__section">
        {/* Contact */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Contact Section", builderLang)}</h2>
          <p>{labelFor("Manage the contact/consultation block shown on the public portfolio page.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextArea
            label={labelFor("Contact Title AR", builderLang)}
            value={sections.contact.title_ar}
            onChange={(value) => updateAtPath(["contact", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Contact Title EN", builderLang)}
            value={sections.contact.title_en}
            onChange={(value) => updateAtPath(["contact", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label={labelFor("Contact Description AR", builderLang)}
            value={sections.contact.desc_ar}
            onChange={(value) => updateAtPath(["contact", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label={labelFor("Contact Description EN", builderLang)}
            value={sections.contact.desc_en}
            onChange={(value) => updateAtPath(["contact", "desc_en"], value)}
            rows={4}
          />

          <TextInput
            label={labelFor("First Name AR", builderLang)}
            value={sections.contact.first_name_ar}
            onChange={(value) => updateAtPath(["contact", "first_name_ar"], value)}
          />

          <TextInput
            label={labelFor("First Name EN", builderLang)}
            value={sections.contact.first_name_en}
            onChange={(value) => updateAtPath(["contact", "first_name_en"], value)}
          />

          <TextInput
            label={labelFor("Second Name AR", builderLang)}
            value={sections.contact.second_name_ar}
            onChange={(value) => updateAtPath(["contact", "second_name_ar"], value)}
          />

          <TextInput
            label={labelFor("Second Name EN", builderLang)}
            value={sections.contact.second_name_en}
            onChange={(value) => updateAtPath(["contact", "second_name_en"], value)}
          />

          <TextInput
            label={labelFor("Last Name AR", builderLang)}
            value={sections.contact.last_name_ar}
            onChange={(value) => updateAtPath(["contact", "last_name_ar"], value)}
          />

          <TextInput
            label={labelFor("Last Name EN", builderLang)}
            value={sections.contact.last_name_en}
            onChange={(value) => updateAtPath(["contact", "last_name_en"], value)}
          />

          <TextInput
            label={labelFor("Email AR", builderLang)}
            value={sections.contact.email_ar}
            onChange={(value) => updateAtPath(["contact", "email_ar"], value)}
          />

          <TextInput
            label={labelFor("Email EN", builderLang)}
            value={sections.contact.email_en}
            onChange={(value) => updateAtPath(["contact", "email_en"], value)}
          />

          <TextInput
            label={labelFor("Message AR", builderLang)}
            value={sections.contact.message_ar}
            onChange={(value) => updateAtPath(["contact", "message_ar"], value)}
          />

          <TextInput
            label={labelFor("Message EN", builderLang)}
            value={sections.contact.message_en}
            onChange={(value) => updateAtPath(["contact", "message_en"], value)}
          />

          <TextInput
            label={labelFor("Submit Button AR", builderLang)}
            value={sections.contact.submit_btn_ar}
            onChange={(value) => updateAtPath(["contact", "submit_btn_ar"], value)}
          />

          <TextInput
            label={labelFor("Submit Button EN", builderLang)}
            value={sections.contact.submit_btn_en}
            onChange={(value) => updateAtPath(["contact", "submit_btn_en"], value)}
          />
        </div>
      </section>

      <section id="portfolio-section-footer" className="admin-portfolio-editor__section">
        {/* Footer */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>{labelFor("Footer", builderLang)}</h2>
          <p>{labelFor("Manage footer links and general contact information for Portfolio.", builderLang)}</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label={labelFor("Footer Email", builderLang)}
            value={sections.footer.email}
            onChange={(value) => updateAtPath(["footer", "email"], value)}
          />

          <TextInput
            label={labelFor("Privacy Href", builderLang)}
            value={sections.footer.privacy_href}
            onChange={(value) => updateAtPath(["footer", "privacy_href"], value)}
          />

          <TextInput
            label={labelFor("Social 1 AR", builderLang)}
            value={sections.footer.social1_ar}
            onChange={(value) => updateAtPath(["footer", "social1_ar"], value)}
          />

          <TextInput
            label={labelFor("Social 1 EN", builderLang)}
            value={sections.footer.social1_en}
            onChange={(value) => updateAtPath(["footer", "social1_en"], value)}
          />

          <TextInput
            label={labelFor("Social 1 Href", builderLang)}
            value={sections.footer.social1_href}
            onChange={(value) => updateAtPath(["footer", "social1_href"], value)}
          />

          <TextInput
            label={labelFor("Social 2 AR", builderLang)}
            value={sections.footer.social2_ar}
            onChange={(value) => updateAtPath(["footer", "social2_ar"], value)}
          />

          <TextInput
            label={labelFor("Social 2 EN", builderLang)}
            value={sections.footer.social2_en}
            onChange={(value) => updateAtPath(["footer", "social2_en"], value)}
          />

          <TextInput
            label={labelFor("Social 2 Href", builderLang)}
            value={sections.footer.social2_href}
            onChange={(value) => updateAtPath(["footer", "social2_href"], value)}
          />

          <TextInput
            label={labelFor("Social 3 AR", builderLang)}
            value={sections.footer.social3_ar}
            onChange={(value) => updateAtPath(["footer", "social3_ar"], value)}
          />

          <TextInput
            label={labelFor("Social 3 EN", builderLang)}
            value={sections.footer.social3_en}
            onChange={(value) => updateAtPath(["footer", "social3_en"], value)}
          />

          <TextInput
            label={labelFor("Social 3 Href", builderLang)}
            value={sections.footer.social3_href}
            onChange={(value) => updateAtPath(["footer", "social3_href"], value)}
          />

          <TextInput
            label={labelFor("Copy AR", builderLang)}
            value={sections.footer.copy_ar}
            onChange={(value) => updateAtPath(["footer", "copy_ar"], value)}
          />

          <TextInput
            label={labelFor("Copy EN", builderLang)}
            value={sections.footer.copy_en}
            onChange={(value) => updateAtPath(["footer", "copy_en"], value)}
          />

          <TextInput
            label={labelFor("Privacy AR", builderLang)}
            value={sections.footer.privacy_ar}
            onChange={(value) => updateAtPath(["footer", "privacy_ar"], value)}
          />

          <TextInput
            label={labelFor("Privacy EN", builderLang)}
            value={sections.footer.privacy_en}
            onChange={(value) => updateAtPath(["footer", "privacy_en"], value)}
          />
        </div>
      </section>

          <section className="admin-portfolio-editor__footerActions">
            {/* أزرار الحفظ النهائية. */}
            <button
              type="button"
              className="admin-portfolio-editor__ghostBtn"
              onClick={resetUnsavedChanges}
              disabled={saving}
            >
              {copy.reset}
            </button>

            <button
              type="button"
              className="admin-portfolio-editor__primaryBtn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? copy.saving : copy.save}
            </button>
          </section>
        </div>

        <PortfolioLivePreview
          item={item}
          lang={builderLang}
          device={previewDevice}
          onDeviceChange={setPreviewDevice}
          copy={copy}
        />
      </section>
    </main>
  );
}