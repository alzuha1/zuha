"use client";
// هذا الملف عميل لأنه يحتوي على state والتفاعل الكامل مع لوحة الأدمن

import { useMemo, useState } from "react";
// useState لإدارة الحالة المحلية
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
      setNotice("Portfolio page saved successfully.");
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

  return (
    <main className="admin-portfolio-editor">
      {/* الغلاف العام لمحرر Portfolio */}

      <section className="admin-portfolio-editor__header">
        <div>
          <h1>Portfolio Page Management</h1>
          <p>
            Manage the public Portfolio page, selected works, category filters,
            imagery, text blocks, and footer content from one place.
          </p>
        </div>

        <div className="admin-portfolio-editor__headerActions">
          <a
            href="/portfolio"
            target="_blank"
            rel="noreferrer"
            className="admin-portfolio-editor__ghostBtn"
          >
            Open Public Page
          </a>

          <button
            type="button"
            className="admin-portfolio-editor__ghostBtn"
            onClick={resetUnsavedChanges}
            disabled={saving}
          >
            Reset Changes
          </button>

          <button
            type="button"
            className="admin-portfolio-editor__primaryBtn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </section>

      <section className="admin-portfolio-editor__stats">
        {/* بطاقات إحصائية مختصرة */}
        <article className="admin-portfolio-editor__statCard">
          <span>Showcase Items</span>
          <strong>{stats.showcaseItemsCount}</strong>
          <small>{stats.activeShowcaseItemsCount} active</small>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>Missing Covers</span>
          <strong>{stats.missingCoverCount}</strong>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>Categories Used</span>
          <strong>{stats.categoriesCount}</strong>
        </article>

        <article className="admin-portfolio-editor__statCard">
          <span>Publish State</span>
          <strong>{item.is_published ? "Live" : "Draft"}</strong>
        </article>
      </section>

      {notice ? (
        <div className="admin-portfolio-editor__notice admin-portfolio-editor__notice--success">
          {notice}
        </div>
      ) : null}
      {/* رسالة النجاح */}

      {error ? (
        <div className="admin-portfolio-editor__notice admin-portfolio-editor__notice--error">
          {error}
        </div>
      ) : null}
      {/* رسالة الخطأ */}

      <section className="admin-portfolio-editor__section">
        {/* Page Meta */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Page Meta</h2>
          <p>General titles, descriptions, and publish state for the portfolio page.</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label="Title AR"
            value={item.title_ar}
            onChange={(value) => updateRootField("title_ar", value)}
          />

          <TextInput
            label="Title EN"
            value={item.title_en}
            onChange={(value) => updateRootField("title_en", value)}
          />

          <TextArea
            label="Content AR"
            value={item.content_ar}
            onChange={(value) => updateRootField("content_ar", value)}
            rows={4}
          />

          <TextArea
            label="Content EN"
            value={item.content_en}
            onChange={(value) => updateRootField("content_en", value)}
            rows={4}
          />
        </div>

        <div className="admin-portfolio-editor__inlineRow">
          <ToggleInput
            label="Published"
            checked={item.is_published}
            onChange={(checked) => updateRootField("is_published", checked)}
          />

          <div className="admin-portfolio-editor__metaTag">
            <span>Slug:</span>
            <strong>{item.slug}</strong>
          </div>

          <div className="admin-portfolio-editor__metaTag">
            <span>Page Type:</span>
            <strong>{item.page_type || "portfolio"}</strong>
          </div>
        </div>
      </section>

      <section className="admin-portfolio-editor__section">
        {/* Hero */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Hero</h2>
          <p>Primary visual and messaging block for the public portfolio page.</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label="Hero Kicker AR"
            value={sections.hero.kicker_ar}
            onChange={(value) => updateAtPath(["hero", "kicker_ar"], value)}
          />

          <TextInput
            label="Hero Kicker EN"
            value={sections.hero.kicker_en}
            onChange={(value) => updateAtPath(["hero", "kicker_en"], value)}
          />

          <TextArea
            label="Hero Title AR"
            value={sections.hero.title_ar}
            onChange={(value) => updateAtPath(["hero", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Hero Title EN"
            value={sections.hero.title_en}
            onChange={(value) => updateAtPath(["hero", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Hero Description AR"
            value={sections.hero.desc_ar}
            onChange={(value) => updateAtPath(["hero", "desc_ar"], value)}
            rows={5}
          />

          <TextArea
            label="Hero Description EN"
            value={sections.hero.desc_en}
            onChange={(value) => updateAtPath(["hero", "desc_en"], value)}
            rows={5}
          />

          <TextInput
            label="Hero Card Title AR"
            value={sections.hero.card_title_ar}
            onChange={(value) => updateAtPath(["hero", "card_title_ar"], value)}
          />

          <TextInput
            label="Hero Card Title EN"
            value={sections.hero.card_title_en}
            onChange={(value) => updateAtPath(["hero", "card_title_en"], value)}
          />

          <TextArea
            label="Hero Card Description AR"
            value={sections.hero.card_desc_ar}
            onChange={(value) => updateAtPath(["hero", "card_desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Hero Card Description EN"
            value={sections.hero.card_desc_en}
            onChange={(value) => updateAtPath(["hero", "card_desc_en"], value)}
            rows={4}
          />

          <TextInput
            label="Hero Card Button AR"
            value={sections.hero.card_btn_ar}
            onChange={(value) => updateAtPath(["hero", "card_btn_ar"], value)}
          />

          <TextInput
            label="Hero Card Button EN"
            value={sections.hero.card_btn_en}
            onChange={(value) => updateAtPath(["hero", "card_btn_en"], value)}
          />

          <TextInput
            label="Hero Card Button Href"
            value={sections.hero.card_btn_href}
            onChange={(value) => updateAtPath(["hero", "card_btn_href"], value)}
          />

          <TextInput
            label="Hero Image URL"
            value={sections.hero.image_url}
            onChange={(value) => updateAtPath(["hero", "image_url"], value)}
            placeholder="/portfolio/img/img%20(1).jpg"
          />
        </div>
      </section>

      <section className="admin-portfolio-editor__section">
        {/* Showcase */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Showcase Section</h2>
          <p>
            Manage section heading, category tabs, and selected portfolio items.
          </p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label="Showcase Kicker AR"
            value={sections.showcase.kicker_ar}
            onChange={(value) => updateAtPath(["showcase", "kicker_ar"], value)}
          />

          <TextInput
            label="Showcase Kicker EN"
            value={sections.showcase.kicker_en}
            onChange={(value) => updateAtPath(["showcase", "kicker_en"], value)}
          />

          <TextArea
            label="Showcase Title AR"
            value={sections.showcase.title_ar}
            onChange={(value) => updateAtPath(["showcase", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Showcase Title EN"
            value={sections.showcase.title_en}
            onChange={(value) => updateAtPath(["showcase", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Showcase Description AR"
            value={sections.showcase.desc_ar}
            onChange={(value) => updateAtPath(["showcase", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Showcase Description EN"
            value={sections.showcase.desc_en}
            onChange={(value) => updateAtPath(["showcase", "desc_en"], value)}
            rows={4}
          />
        </div>

        <div className="admin-portfolio-editor__subSection">
          <h4>Tabs Labels</h4>

          <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
            <TextInput
              label="All AR"
              value={sections.showcase.tabs.all_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "all_ar"], value)}
            />

            <TextInput
              label="All EN"
              value={sections.showcase.tabs.all_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "all_en"], value)}
            />

            <TextInput
              label="Development AR"
              value={sections.showcase.tabs.dev_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "dev_ar"], value)}
            />

            <TextInput
              label="Development EN"
              value={sections.showcase.tabs.dev_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "dev_en"], value)}
            />

            <TextInput
              label="Investment AR"
              value={sections.showcase.tabs.inv_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "inv_ar"], value)}
            />

            <TextInput
              label="Investment EN"
              value={sections.showcase.tabs.inv_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "inv_en"], value)}
            />

            <TextInput
              label="Management AR"
              value={sections.showcase.tabs.mng_ar}
              onChange={(value) => updateAtPath(["showcase", "tabs", "mng_ar"], value)}
            />

            <TextInput
              label="Management EN"
              value={sections.showcase.tabs.mng_en}
              onChange={(value) => updateAtPath(["showcase", "tabs", "mng_en"], value)}
            />
          </div>
        </div>

        <div className="admin-portfolio-editor__arrayHeader">
          <h3>Showcase Items</h3>

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
            Add Showcase Item
          </button>
        </div>

        <div className="admin-portfolio-editor__stack">
          {showcaseItems.length === 0 ? (
            <div className="admin-portfolio-editor__emptyState">
              No showcase items yet.
            </div>
          ) : (
            showcaseItems.map((entry, itemIndex) => (
              <details
                key={entry.id}
                className="admin-portfolio-editor__item"
                open
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
                      {entry.is_active ? "Active" : "Inactive"}
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
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-portfolio-editor__ghostBtn"
                      onClick={() => moveInArray(["showcase", "items"], itemIndex, 1)}
                      disabled={itemIndex === showcaseItems.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-portfolio-editor__dangerBtn"
                      onClick={() => removeFromArray(["showcase", "items"], itemIndex)}
                    >
                      Delete Item
                    </button>
                  </div>

                  <div className="admin-portfolio-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={entry.is_active}
                      onChange={(checked) =>
                        updateAtPath(["showcase", "items", itemIndex, "is_active"], checked)
                      }
                    />

                    <TextInput
                      label="Sort Order"
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
                      label="Item ID"
                      value={entry.id}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "id"], value)
                      }
                    />

                    <SelectInput
                      label="Category Key"
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
                      label="Tag AR"
                      value={entry.tag_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "tag_ar"], value)
                      }
                    />

                    <TextInput
                      label="Tag EN"
                      value={entry.tag_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "tag_en"], value)
                      }
                    />

                    <TextInput
                      label="Title AR"
                      value={entry.title_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "title_ar"], value)
                      }
                    />

                    <TextInput
                      label="Title EN"
                      value={entry.title_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "title_en"], value)
                      }
                    />

                    <TextArea
                      label="Description AR"
                      value={entry.desc_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "desc_ar"], value)
                      }
                      rows={4}
                    />

                    <TextArea
                      label="Description EN"
                      value={entry.desc_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "desc_en"], value)
                      }
                      rows={4}
                    />

                    <TextInput
                      label="Author AR"
                      value={entry.author_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "author_ar"], value)
                      }
                    />

                    <TextInput
                      label="Author EN"
                      value={entry.author_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "author_en"], value)
                      }
                    />

                    <TextInput
                      label="Role AR"
                      value={entry.role_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "role_ar"], value)
                      }
                    />

                    <TextInput
                      label="Role EN"
                      value={entry.role_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "role_en"], value)
                      }
                    />

                    <TextInput
                      label="Date AR"
                      value={entry.date_ar}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "date_ar"], value)
                      }
                    />

                    <TextInput
                      label="Date EN"
                      value={entry.date_en}
                      onChange={(value) =>
                        updateAtPath(["showcase", "items", itemIndex, "date_en"], value)
                      }
                    />

                    <TextInput
                      label="Cover Image URL"
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
                      label="Author Image URL"
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
                      label="Item Href"
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

      <section className="admin-portfolio-editor__section">
        {/* Insight */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Insight Section</h2>
          <p>A supporting statement block that strengthens the portfolio narrative.</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label="Insight Kicker AR"
            value={sections.insight.kicker_ar}
            onChange={(value) => updateAtPath(["insight", "kicker_ar"], value)}
          />

          <TextInput
            label="Insight Kicker EN"
            value={sections.insight.kicker_en}
            onChange={(value) => updateAtPath(["insight", "kicker_en"], value)}
          />

          <TextArea
            label="Insight Title AR"
            value={sections.insight.title_ar}
            onChange={(value) => updateAtPath(["insight", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Insight Title EN"
            value={sections.insight.title_en}
            onChange={(value) => updateAtPath(["insight", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Insight Description AR"
            value={sections.insight.desc_ar}
            onChange={(value) => updateAtPath(["insight", "desc_ar"], value)}
            rows={5}
          />

          <TextArea
            label="Insight Description EN"
            value={sections.insight.desc_en}
            onChange={(value) => updateAtPath(["insight", "desc_en"], value)}
            rows={5}
          />
        </div>
      </section>

      <section className="admin-portfolio-editor__section">
        {/* Contact */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Contact Section</h2>
          <p>Manage the contact/consultation block shown on the public portfolio page.</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextArea
            label="Contact Title AR"
            value={sections.contact.title_ar}
            onChange={(value) => updateAtPath(["contact", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Contact Title EN"
            value={sections.contact.title_en}
            onChange={(value) => updateAtPath(["contact", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Contact Description AR"
            value={sections.contact.desc_ar}
            onChange={(value) => updateAtPath(["contact", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Contact Description EN"
            value={sections.contact.desc_en}
            onChange={(value) => updateAtPath(["contact", "desc_en"], value)}
            rows={4}
          />

          <TextInput
            label="First Name AR"
            value={sections.contact.first_name_ar}
            onChange={(value) => updateAtPath(["contact", "first_name_ar"], value)}
          />

          <TextInput
            label="First Name EN"
            value={sections.contact.first_name_en}
            onChange={(value) => updateAtPath(["contact", "first_name_en"], value)}
          />

          <TextInput
            label="Second Name AR"
            value={sections.contact.second_name_ar}
            onChange={(value) => updateAtPath(["contact", "second_name_ar"], value)}
          />

          <TextInput
            label="Second Name EN"
            value={sections.contact.second_name_en}
            onChange={(value) => updateAtPath(["contact", "second_name_en"], value)}
          />

          <TextInput
            label="Last Name AR"
            value={sections.contact.last_name_ar}
            onChange={(value) => updateAtPath(["contact", "last_name_ar"], value)}
          />

          <TextInput
            label="Last Name EN"
            value={sections.contact.last_name_en}
            onChange={(value) => updateAtPath(["contact", "last_name_en"], value)}
          />

          <TextInput
            label="Email AR"
            value={sections.contact.email_ar}
            onChange={(value) => updateAtPath(["contact", "email_ar"], value)}
          />

          <TextInput
            label="Email EN"
            value={sections.contact.email_en}
            onChange={(value) => updateAtPath(["contact", "email_en"], value)}
          />

          <TextInput
            label="Message AR"
            value={sections.contact.message_ar}
            onChange={(value) => updateAtPath(["contact", "message_ar"], value)}
          />

          <TextInput
            label="Message EN"
            value={sections.contact.message_en}
            onChange={(value) => updateAtPath(["contact", "message_en"], value)}
          />

          <TextInput
            label="Submit Button AR"
            value={sections.contact.submit_btn_ar}
            onChange={(value) => updateAtPath(["contact", "submit_btn_ar"], value)}
          />

          <TextInput
            label="Submit Button EN"
            value={sections.contact.submit_btn_en}
            onChange={(value) => updateAtPath(["contact", "submit_btn_en"], value)}
          />
        </div>
      </section>

      <section className="admin-portfolio-editor__section">
        {/* Footer */}
        <div className="admin-portfolio-editor__sectionHead">
          <h2>Footer</h2>
          <p>Manage footer links and general contact information for Portfolio.</p>
        </div>

        <div className="admin-portfolio-editor__grid admin-portfolio-editor__grid--2">
          <TextInput
            label="Footer Email"
            value={sections.footer.email}
            onChange={(value) => updateAtPath(["footer", "email"], value)}
          />

          <TextInput
            label="Privacy Href"
            value={sections.footer.privacy_href}
            onChange={(value) => updateAtPath(["footer", "privacy_href"], value)}
          />

          <TextInput
            label="Social 1 AR"
            value={sections.footer.social1_ar}
            onChange={(value) => updateAtPath(["footer", "social1_ar"], value)}
          />

          <TextInput
            label="Social 1 EN"
            value={sections.footer.social1_en}
            onChange={(value) => updateAtPath(["footer", "social1_en"], value)}
          />

          <TextInput
            label="Social 1 Href"
            value={sections.footer.social1_href}
            onChange={(value) => updateAtPath(["footer", "social1_href"], value)}
          />

          <TextInput
            label="Social 2 AR"
            value={sections.footer.social2_ar}
            onChange={(value) => updateAtPath(["footer", "social2_ar"], value)}
          />

          <TextInput
            label="Social 2 EN"
            value={sections.footer.social2_en}
            onChange={(value) => updateAtPath(["footer", "social2_en"], value)}
          />

          <TextInput
            label="Social 2 Href"
            value={sections.footer.social2_href}
            onChange={(value) => updateAtPath(["footer", "social2_href"], value)}
          />

          <TextInput
            label="Social 3 AR"
            value={sections.footer.social3_ar}
            onChange={(value) => updateAtPath(["footer", "social3_ar"], value)}
          />

          <TextInput
            label="Social 3 EN"
            value={sections.footer.social3_en}
            onChange={(value) => updateAtPath(["footer", "social3_en"], value)}
          />

          <TextInput
            label="Social 3 Href"
            value={sections.footer.social3_href}
            onChange={(value) => updateAtPath(["footer", "social3_href"], value)}
          />

          <TextInput
            label="Copy AR"
            value={sections.footer.copy_ar}
            onChange={(value) => updateAtPath(["footer", "copy_ar"], value)}
          />

          <TextInput
            label="Copy EN"
            value={sections.footer.copy_en}
            onChange={(value) => updateAtPath(["footer", "copy_en"], value)}
          />

          <TextInput
            label="Privacy AR"
            value={sections.footer.privacy_ar}
            onChange={(value) => updateAtPath(["footer", "privacy_ar"], value)}
          />

          <TextInput
            label="Privacy EN"
            value={sections.footer.privacy_en}
            onChange={(value) => updateAtPath(["footer", "privacy_en"], value)}
          />
        </div>
      </section>

      <section className="admin-portfolio-editor__footerActions">
        {/* أزرار الحفظ النهائية */}
        <button
          type="button"
          className="admin-portfolio-editor__ghostBtn"
          onClick={resetUnsavedChanges}
          disabled={saving}
        >
          Reset Changes
        </button>

        <button
          type="button"
          className="admin-portfolio-editor__primaryBtn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </section>
    </main>
  );
}