"use client";
// هذا الملف عميل لأنه يحتوي على:
// - state للحالة المحلية
// - منطق إضافة/حذف/ترتيب العناصر
// - منطق الحفظ عبر API
// - واجهة الأدمن التفاعلية الكاملة

import { useMemo, useState } from "react";
// useState لإدارة الحالة
// useMemo لحساب الإحصائيات والقيم المشتقة بكفاءة

type FaqCategoryItem = {
  id: string;
  key: string;
  is_active: boolean;
  sort_order: number;
  label_ar: string;
  label_en: string;
};
// نوع عنصر التصنيف داخل قسم categories

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
// نوع السؤال/الجواب الفردي

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

type FaqPageAdminRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: FaqPageSections | null;
};
// السجل الكامل الذي يستقبله المحرر من صفحة السيرفر

type PathSegment = string | number;
// نوع المقطع داخل المسار الديناميكي عند التحديث الداخلي

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

function createId(prefix: string) {
  // إنشاء معرف بسيط للعناصر الجديدة
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDeep<T>(value: T): T {
  // نسخ عميق للحالة قبل تعديلها
  return JSON.parse(JSON.stringify(value)) as T;
}

function getNestedValue(target: any, path: PathSegment[]) {
  // قراءة قيمة داخلية من object / array اعتمادًا على مسار ديناميكي
  return path.reduce((acc, segment) => {
    if (acc == null) return undefined;
    return acc[segment as keyof typeof acc];
  }, target);
}

function setNestedValue(target: any, path: PathSegment[], value: unknown) {
  // تحديث قيمة داخلية داخل object / array اعتمادًا على مسار ديناميكي
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

function createEmptyCategoryItem(order: number): FaqCategoryItem {
  // إنشاء تصنيف جديد يضاف من لوحة الأدمن
  return {
    id: createId("faq-category"),
    key: `category-${order}`,
    is_active: true,
    sort_order: order,
    label_ar: "تصنيف جديد",
    label_en: "New Category",
  };
}

function createEmptyFaqItem(order: number): FaqItem {
  // إنشاء سؤال جديد يضاف من لوحة الأدمن
  return {
    id: createId("faq-item"),
    category_key: "general",
    is_active: true,
    sort_order: order,
    question_ar: "سؤال جديد",
    question_en: "New Question",
    answer_ar: "إجابة السؤال بالعربية.",
    answer_en: "Answer to the question in English.",
  };
}

function createDefaultSections(): FaqPageSections {
  // البنية الافتراضية الكاملة لصفحة FAQ
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
  // تطبيع البنية الكاملة لـ sections_json
  const defaults = createDefaultSections();
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

function normalizeRecord(value: FaqPageAdminRecord): FaqPageAdminRecord {
  // تطبيع السجل الكامل القادم من السيرفر
  return {
    slug: normalizeText(value.slug, "faq"),
    title_ar: normalizeText(value.title_ar, "الأسئلة الشائعة"),
    title_en: normalizeText(value.title_en, "FAQ"),
    content_ar: normalizeText(
      value.content_ar,
      "صفحة الأسئلة الشائعة تقدم إجابات عملية وواضحة على أكثر الاستفسارات شيوعًا."
    ),
    content_en: normalizeText(
      value.content_en,
      "The FAQ page provides practical and clear answers to the most common questions."
    ),
    is_published: normalizeBoolean(value.is_published, true),
    page_type: normalizeText(value.page_type, "faq") || "faq",
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
    <label className="admin-faq-editor__field">
      <span>{label}</span>
      <input
        className="admin-faq-editor__input"
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
    <label className="admin-faq-editor__field">
      <span>{label}</span>
      <textarea
        className="admin-faq-editor__textarea"
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
  // checkbox موحد
  return (
    <label className="admin-faq-editor__toggle">
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
  // select موحد
  return (
    <label className="admin-faq-editor__field">
      <span>{label}</span>
      <select
        className="admin-faq-editor__input"
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

export default function FaqPageEditor({
  initialItem,
}: {
  initialItem: FaqPageAdminRecord;
}) {
  // المكوّن الرئيسي لإدارة صفحة FAQ

  const normalizedInitial = useMemo(
    () => normalizeRecord(initialItem),
    [initialItem]
  );
  // تطبيع السجل الأولي مرة واحدة

  const [item, setItem] = useState<FaqPageAdminRecord>(normalizedInitial);
  // الحالة الحالية التي يعدّل عليها الأدمن

  const [saving, setSaving] = useState(false);
  // حالة الحفظ الحالية

  const [notice, setNotice] = useState("");
  // رسالة نجاح الحفظ

  const [error, setError] = useState("");
  // رسالة الخطأ

  const sections = item.sections_json ?? createDefaultSections();
  // اختصار للوصول إلى الأقسام الحالية

  const categoryItems = sections.categories.items;
  // التصنيفات الحالية

  const faqItems = sections.faqItems.items;
  // الأسئلة الحالية

  const stats = useMemo(
    () => ({
      categoriesCount: categoryItems.length,
      activeCategoriesCount: categoryItems.filter((entry) => entry.is_active).length,
      questionsCount: faqItems.length,
      activeQuestionsCount: faqItems.filter((entry) => entry.is_active).length,
      uncategorizedQuestionsCount: faqItems.filter((entry) => {
        return !categoryItems.some((category) => category.key === entry.category_key);
      }).length,
    }),
    [categoryItems, faqItems]
  );
  // إحصائيات مختصرة لواجهة الأدمن

  const categoryOptions = useMemo(
    () =>
      categoryItems.map((entry) => ({
        label: `${entry.label_en} (${entry.key})`,
        value: entry.key,
      })),
    [categoryItems]
  );
  // خيارات select الخاصة بتصنيفات الأسئلة

  function updateRootField(
    field: keyof Pick<
      FaqPageAdminRecord,
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
    // حفظ جميع التعديلات عبر API الأدمن الخاصة بـ FAQ
    try {
      setSaving(true);
      setNotice("");
      setError("");

      const response = await fetch("/api/admin/faq-page", {
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
        throw new Error(payload?.message || "Failed to save FAQ page.");
      }

      const normalizedSaved = normalizeRecord(payload.item as FaqPageAdminRecord);
      // إعادة تطبيع السجل القادم من السيرفر

      setItem(normalizedSaved);
      setNotice("FAQ page saved successfully.");
    } catch (saveError) {
      console.error("faq handleSave error:", saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save FAQ page."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetUnsavedChanges() {
    // إعادة الحالة إلى النسخة الأولية القادمة من السيرفر
    setItem(cloneDeep(normalizedInitial));
    setNotice("");
    setError("");
  }

  return (
    <main className="admin-faq-editor">
      {/* الغلاف العام لمحرر FAQ */}

      <section className="admin-faq-editor__header">
        <div>
          <h1>FAQ Page Management</h1>
          <p>
            Manage the public FAQ page, including hero content, categories,
            questions, answers, CTA block, and footer settings from a single dashboard.
          </p>
        </div>

        <div className="admin-faq-editor__headerActions">
          <a
            href="/faq"
            target="_blank"
            rel="noreferrer"
            className="admin-faq-editor__ghostBtn"
          >
            Open Public Page
          </a>

          <button
            type="button"
            className="admin-faq-editor__ghostBtn"
            onClick={resetUnsavedChanges}
            disabled={saving}
          >
            Reset Changes
          </button>

          <button
            type="button"
            className="admin-faq-editor__primaryBtn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </section>

      <section className="admin-faq-editor__stats">
        {/* بطاقات الإحصائيات */}
        <article className="admin-faq-editor__statCard">
          <span>Categories</span>
          <strong>{stats.categoriesCount}</strong>
          <small>{stats.activeCategoriesCount} active</small>
        </article>

        <article className="admin-faq-editor__statCard">
          <span>Questions</span>
          <strong>{stats.questionsCount}</strong>
          <small>{stats.activeQuestionsCount} active</small>
        </article>

        <article className="admin-faq-editor__statCard">
          <span>Uncategorized</span>
          <strong>{stats.uncategorizedQuestionsCount}</strong>
        </article>

        <article className="admin-faq-editor__statCard">
          <span>Publish State</span>
          <strong>{item.is_published ? "Live" : "Draft"}</strong>
        </article>
      </section>

      {notice ? (
        <div className="admin-faq-editor__notice admin-faq-editor__notice--success">
          {notice}
        </div>
      ) : null}
      {/* رسالة النجاح */}

      {error ? (
        <div className="admin-faq-editor__notice admin-faq-editor__notice--error">
          {error}
        </div>
      ) : null}
      {/* رسالة الخطأ */}

      <section className="admin-faq-editor__section">
        {/* بيانات الصفحة الأساسية */}
        <div className="admin-faq-editor__sectionHead">
          <h2>Page Meta</h2>
          <p>General titles, summary text, and publish state for the FAQ page.</p>
        </div>

        <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
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

        <div className="admin-faq-editor__inlineRow">
          <ToggleInput
            label="Published"
            checked={item.is_published}
            onChange={(checked) => updateRootField("is_published", checked)}
          />

          <div className="admin-faq-editor__metaTag">
            <span>Slug:</span>
            <strong>{item.slug}</strong>
          </div>

          <div className="admin-faq-editor__metaTag">
            <span>Page Type:</span>
            <strong>{item.page_type || "faq"}</strong>
          </div>
        </div>
      </section>

      <section className="admin-faq-editor__section">
        {/* قسم Hero */}
        <div className="admin-faq-editor__sectionHead">
          <h2>Hero</h2>
          <p>The main heading and summary block shown at the top of the public FAQ page.</p>
        </div>

        <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
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
            label="Hero Button AR"
            value={sections.hero.btn_ar}
            onChange={(value) => updateAtPath(["hero", "btn_ar"], value)}
          />

          <TextInput
            label="Hero Button EN"
            value={sections.hero.btn_en}
            onChange={(value) => updateAtPath(["hero", "btn_en"], value)}
          />

          <TextInput
            label="Hero Button Href"
            value={sections.hero.btn_href}
            onChange={(value) => updateAtPath(["hero", "btn_href"], value)}
          />
        </div>
      </section>

      <section className="admin-faq-editor__section">
        {/* قسم التصنيفات */}
        <div className="admin-faq-editor__sectionHead">
          <h2>Categories</h2>
          <p>Manage FAQ category labels, ordering, activation, and internal keys.</p>
        </div>

        <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
          <TextInput
            label="Categories Title AR"
            value={sections.categories.title_ar}
            onChange={(value) => updateAtPath(["categories", "title_ar"], value)}
          />

          <TextInput
            label="Categories Title EN"
            value={sections.categories.title_en}
            onChange={(value) => updateAtPath(["categories", "title_en"], value)}
          />

          <TextArea
            label="Categories Description AR"
            value={sections.categories.desc_ar}
            onChange={(value) => updateAtPath(["categories", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Categories Description EN"
            value={sections.categories.desc_en}
            onChange={(value) => updateAtPath(["categories", "desc_en"], value)}
            rows={4}
          />
        </div>

        <div className="admin-faq-editor__arrayHeader">
          <h3>Category Items</h3>

          <button
            type="button"
            className="admin-faq-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["categories", "items"],
                createEmptyCategoryItem(categoryItems.length + 1)
              )
            }
          >
            Add Category
          </button>
        </div>

        <div className="admin-faq-editor__stack">
          {categoryItems.length === 0 ? (
            <div className="admin-faq-editor__emptyState">
              No categories yet.
            </div>
          ) : (
            categoryItems.map((entry, itemIndex) => (
              <details
                key={entry.id}
                className="admin-faq-editor__item"
                open
              >
                <summary className="admin-faq-editor__itemSummary">
                  <div>
                    <strong>{entry.label_en || entry.label_ar || `Category ${itemIndex + 1}`}</strong>
                    <span>{entry.key || "category-key"}</span>
                  </div>

                  <div className="admin-faq-editor__summaryTags">
                    <span className="admin-faq-editor__tag">#{itemIndex + 1}</span>
                    <span
                      className={`admin-faq-editor__tag ${
                        entry.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {entry.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-faq-editor__itemBody">
                  <div className="admin-faq-editor__itemActions">
                    <button
                      type="button"
                      className="admin-faq-editor__ghostBtn"
                      onClick={() => moveInArray(["categories", "items"], itemIndex, -1)}
                      disabled={itemIndex === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-faq-editor__ghostBtn"
                      onClick={() => moveInArray(["categories", "items"], itemIndex, 1)}
                      disabled={itemIndex === categoryItems.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-faq-editor__dangerBtn"
                      onClick={() => removeFromArray(["categories", "items"], itemIndex)}
                    >
                      Delete Category
                    </button>
                  </div>

                  <div className="admin-faq-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={entry.is_active}
                      onChange={(checked) =>
                        updateAtPath(["categories", "items", itemIndex, "is_active"], checked)
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(entry.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["categories", "items", itemIndex, "sort_order"],
                          Number(value) || itemIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
                    <TextInput
                      label="Category ID"
                      value={entry.id}
                      onChange={(value) =>
                        updateAtPath(["categories", "items", itemIndex, "id"], value)
                      }
                    />

                    <TextInput
                      label="Category Key"
                      value={entry.key}
                      onChange={(value) =>
                        updateAtPath(["categories", "items", itemIndex, "key"], value)
                      }
                      placeholder="general"
                    />

                    <TextInput
                      label="Label AR"
                      value={entry.label_ar}
                      onChange={(value) =>
                        updateAtPath(["categories", "items", itemIndex, "label_ar"], value)
                      }
                    />

                    <TextInput
                      label="Label EN"
                      value={entry.label_en}
                      onChange={(value) =>
                        updateAtPath(["categories", "items", itemIndex, "label_en"], value)
                      }
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-faq-editor__section">
        {/* قسم الأسئلة والأجوبة */}
        <div className="admin-faq-editor__sectionHead">
          <h2>FAQ Items</h2>
          <p>Manage questions, answers, category mapping, ordering, and visibility.</p>
        </div>

        <div className="admin-faq-editor__arrayHeader">
          <h3>Questions & Answers</h3>

          <button
            type="button"
            className="admin-faq-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["faqItems", "items"],
                createEmptyFaqItem(faqItems.length + 1)
              )
            }
          >
            Add FAQ Item
          </button>
        </div>

        <div className="admin-faq-editor__stack">
          {faqItems.length === 0 ? (
            <div className="admin-faq-editor__emptyState">
              No FAQ items yet.
            </div>
          ) : (
            faqItems.map((entry, itemIndex) => (
              <details
                key={entry.id}
                className="admin-faq-editor__item"
                open
              >
                <summary className="admin-faq-editor__itemSummary">
                  <div>
                    <strong>{entry.question_en || entry.question_ar || `Question ${itemIndex + 1}`}</strong>
                    <span>{entry.category_key || "general"}</span>
                  </div>

                  <div className="admin-faq-editor__summaryTags">
                    <span className="admin-faq-editor__tag">#{itemIndex + 1}</span>
                    <span
                      className={`admin-faq-editor__tag ${
                        entry.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {entry.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-faq-editor__itemBody">
                  <div className="admin-faq-editor__itemActions">
                    <button
                      type="button"
                      className="admin-faq-editor__ghostBtn"
                      onClick={() => moveInArray(["faqItems", "items"], itemIndex, -1)}
                      disabled={itemIndex === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-faq-editor__ghostBtn"
                      onClick={() => moveInArray(["faqItems", "items"], itemIndex, 1)}
                      disabled={itemIndex === faqItems.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-faq-editor__dangerBtn"
                      onClick={() => removeFromArray(["faqItems", "items"], itemIndex)}
                    >
                      Delete FAQ Item
                    </button>
                  </div>

                  <div className="admin-faq-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={entry.is_active}
                      onChange={(checked) =>
                        updateAtPath(["faqItems", "items", itemIndex, "is_active"], checked)
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(entry.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["faqItems", "items", itemIndex, "sort_order"],
                          Number(value) || itemIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
                    <TextInput
                      label="FAQ Item ID"
                      value={entry.id}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "id"], value)
                      }
                    />

                    <SelectInput
                      label="Category Key"
                      value={entry.category_key}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "category_key"], value)
                      }
                      options={
                        categoryOptions.length > 0
                          ? categoryOptions
                          : [{ label: "General (general)", value: "general" }]
                      }
                    />

                    <TextArea
                      label="Question AR"
                      value={entry.question_ar}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "question_ar"], value)
                      }
                      rows={3}
                    />

                    <TextArea
                      label="Question EN"
                      value={entry.question_en}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "question_en"], value)
                      }
                      rows={3}
                    />

                    <TextArea
                      label="Answer AR"
                      value={entry.answer_ar}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "answer_ar"], value)
                      }
                      rows={6}
                    />

                    <TextArea
                      label="Answer EN"
                      value={entry.answer_en}
                      onChange={(value) =>
                        updateAtPath(["faqItems", "items", itemIndex, "answer_en"], value)
                      }
                      rows={6}
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-faq-editor__section">
        {/* قسم CTA النهائي */}
        <div className="admin-faq-editor__sectionHead">
          <h2>Final CTA</h2>
          <p>The final call-to-action block shown below the FAQ content.</p>
        </div>

        <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
          <TextArea
            label="CTA Title AR"
            value={sections.cta.title_ar}
            onChange={(value) => updateAtPath(["cta", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="CTA Title EN"
            value={sections.cta.title_en}
            onChange={(value) => updateAtPath(["cta", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="CTA Description AR"
            value={sections.cta.desc_ar}
            onChange={(value) => updateAtPath(["cta", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="CTA Description EN"
            value={sections.cta.desc_en}
            onChange={(value) => updateAtPath(["cta", "desc_en"], value)}
            rows={4}
          />

          <TextInput
            label="CTA Button AR"
            value={sections.cta.button_ar}
            onChange={(value) => updateAtPath(["cta", "button_ar"], value)}
          />

          <TextInput
            label="CTA Button EN"
            value={sections.cta.button_en}
            onChange={(value) => updateAtPath(["cta", "button_en"], value)}
          />

          <TextInput
            label="CTA Button Href"
            value={sections.cta.button_href}
            onChange={(value) => updateAtPath(["cta", "button_href"], value)}
          />
        </div>
      </section>

      <section className="admin-faq-editor__section">
        {/* قسم الفوتر */}
        <div className="admin-faq-editor__sectionHead">
          <h2>Footer</h2>
          <p>Manage footer links and general contact information for the FAQ page.</p>
        </div>

        <div className="admin-faq-editor__grid admin-faq-editor__grid--2">
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

      <section className="admin-faq-editor__footerActions">
        {/* أزرار الحفظ النهائية */}
        <button
          type="button"
          className="admin-faq-editor__ghostBtn"
          onClick={resetUnsavedChanges}
          disabled={saving}
        >
          Reset Changes
        </button>

        <button
          type="button"
          className="admin-faq-editor__primaryBtn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </section>
    </main>
  );
}