"use client"; // تحويل الملف إلى Client Component لأنه يستخدم state وتفاعل مباشر.

import { useEffect, useMemo, useState } from "react"; // استيراد أدوات React المطلوبة للحالة والحسابات والقراءة الأولية.

type BuilderLang = "ar" | "en"; // نوع لغة واجهة الأدمن.
type PreviewDevice = "desktop" | "tablet" | "mobile"; // نوع جهاز المعاينة.
type ActiveSection = "meta" | "hero" | "categories" | "faqItems" | "cta" | "footer"; // مفاتيح أقسام المحرر.
type PathSegment = string | number; // نوع مقطع المسار المستخدم في التحديث الديناميكي.

type FaqCategoryItem = { // نوع التصنيف داخل صفحة FAQ.
  id: string; // معرف داخلي للتصنيف.
  key: string; // مفتاح التصنيف المستخدم لربط الأسئلة.
  is_active: boolean; // حالة تفعيل التصنيف.
  sort_order: number; // ترتيب التصنيف.
  label_ar: string; // اسم التصنيف عربي.
  label_en: string; // اسم التصنيف إنجليزي.
}; // نهاية نوع التصنيف.

type FaqItem = { // نوع عنصر سؤال وجواب.
  id: string; // معرف السؤال.
  category_key: string; // مفتاح التصنيف المرتبط.
  is_active: boolean; // حالة تفعيل السؤال.
  sort_order: number; // ترتيب السؤال.
  question_ar: string; // السؤال بالعربية.
  question_en: string; // السؤال بالإنجليزية.
  answer_ar: string; // الجواب بالعربية.
  answer_en: string; // الجواب بالإنجليزية.
}; // نهاية نوع السؤال.

type FaqPageSections = { // الشكل الكامل لمحتوى sections_json.
  hero: { kicker_ar: string; kicker_en: string; title_ar: string; title_en: string; desc_ar: string; desc_en: string; btn_ar: string; btn_en: string; btn_href: string }; // قسم Hero.
  categories: { title_ar: string; title_en: string; desc_ar: string; desc_en: string; items: FaqCategoryItem[] }; // قسم التصنيفات.
  faqItems: { items: FaqItem[] }; // قسم الأسئلة.
  cta: { title_ar: string; title_en: string; desc_ar: string; desc_en: string; button_ar: string; button_en: string; button_href: string }; // قسم CTA.
  footer: { email: string; social1_ar: string; social1_en: string; social1_href: string; social2_ar: string; social2_en: string; social2_href: string; social3_ar: string; social3_en: string; social3_href: string; copy_ar: string; copy_en: string; privacy_ar: string; privacy_en: string; privacy_href: string }; // قسم Footer.
}; // نهاية sections_json.

type FaqPageAdminRecord = { // نوع سجل صفحة FAQ القادم من السيرفر.
  slug: string; // slug الصفحة.
  title_ar: string; // عنوان الصفحة بالعربية.
  title_en: string; // عنوان الصفحة بالإنجليزية.
  content_ar: string; // ملخص الصفحة بالعربية.
  content_en: string; // ملخص الصفحة بالإنجليزية.
  is_published: boolean; // حالة النشر.
  page_type: string | null; // نوع الصفحة.
  sections_json: FaqPageSections | null; // محتوى الأقسام.
}; // نهاية نوع السجل.

const builderCopy = { // قاموس النصوص الخاص بواجهة Builder.
  ar: { // النصوص العربية.
    cms: "ALZUHA CMS", title: "منشئ صفحة الأسئلة الشائعة", desc: "تحكم كامل بالتصنيفات والأسئلة والأجوبة مع معاينة مباشرة.", open: "عرض الصفحة", reset: "إعادة التغييرات", save: "حفظ التغييرات", saving: "جارٍ الحفظ...", live: "منشور", draft: "مسودة", sections: "الأقسام", editor: "المحرر", preview: "معاينة مباشرة", desktop: "ديسكتوب", tablet: "تابلت", mobile: "موبايل", meta: "بيانات الصفحة", metaDesc: "العنوان والملخص وحالة النشر", hero: "الهيرو", heroDesc: "عنوان الصفحة وزر الاستشارة", categories: "التصنيفات", categoriesDesc: "تصنيفات الأسئلة", faqItems: "الأسئلة", faqItemsDesc: "الأسئلة والأجوبة", cta: "الدعوة للإجراء", ctaDesc: "القسم الختامي", footer: "الفوتر", footerDesc: "الروابط والتواصل", addCategory: "إضافة تصنيف", addFaq: "إضافة سؤال", moveUp: "أعلى", moveDown: "أسفل", deleteCategory: "حذف التصنيف", deleteFaq: "حذف السؤال", active: "مفعل", inactive: "غير مفعل", published: "منشور على الموقع", slug: "المسار", pageType: "نوع الصفحة", ready: "جاهز", saved: "تم الحفظ بنجاح.", failed: "فشل حفظ صفحة FAQ.", categoriesCount: "التصنيفات", questionsCount: "الأسئلة", uncategorized: "غير مصنفة", publishState: "حالة النشر", noCategories: "لا توجد تصنيفات بعد.", noQuestions: "لا توجد أسئلة بعد." }, // نهاية العربية.
  en: { // النصوص الإنجليزية.
    cms: "ALZUHA CMS", title: "FAQ Live Builder", desc: "Manage categories, questions, answers, CTA, footer, and preview changes live.", open: "Open Public Page", reset: "Reset Changes", save: "Save Changes", saving: "Saving...", live: "Live", draft: "Draft", sections: "Sections", editor: "Editor", preview: "Live Preview", desktop: "Desktop", tablet: "Tablet", mobile: "Mobile", meta: "Page Meta", metaDesc: "Title, summary, and publish state", hero: "Hero", heroDesc: "Main heading and consultation button", categories: "Categories", categoriesDesc: "Question categories", faqItems: "FAQ Items", faqItemsDesc: "Questions and answers", cta: "CTA", ctaDesc: "Final action block", footer: "Footer", footerDesc: "Links and contact", addCategory: "Add Category", addFaq: "Add FAQ Item", moveUp: "Move Up", moveDown: "Move Down", deleteCategory: "Delete Category", deleteFaq: "Delete FAQ", active: "Active", inactive: "Inactive", published: "Published", slug: "Slug", pageType: "Page Type", ready: "Ready", saved: "FAQ page saved successfully.", failed: "Failed to save FAQ page.", categoriesCount: "Categories", questionsCount: "Questions", uncategorized: "Uncategorized", publishState: "Publish State", noCategories: "No categories yet.", noQuestions: "No FAQ items yet." }, // نهاية الإنجليزية.
} as const; // تثبيت القاموس كقيم ثابتة.

function asObject(value: unknown): Record<string, unknown> { // تحويل القيمة إلى object آمن.
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {}; // إرجاع object أو كائن فارغ.
} // نهاية asObject.

function normalizeText(value: unknown, fallback = "") { // تطبيع النصوص.
  return String(value ?? fallback).trim(); // تحويل null/undefined إلى fallback وتنظيف الفراغات.
} // نهاية normalizeText.

function normalizeBoolean(value: unknown, fallback = false) { // تطبيع boolean.
  return typeof value === "boolean" ? value : fallback; // إرجاع القيمة إذا كانت boolean وإلا fallback.
} // نهاية normalizeBoolean.

function normalizeNumber(value: unknown, fallback = 0) { // تطبيع الأرقام.
  return typeof value === "number" && Number.isFinite(value) ? value : fallback; // قبول الرقم الصالح فقط.
} // نهاية normalizeNumber.

function createId(prefix: string) { // إنشاء معرف جديد.
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; // معرف بسيط مناسب لعناصر JSON.
} // نهاية createId.

function cloneDeep<T>(value: T): T { // نسخ عميق للحالة.
  return JSON.parse(JSON.stringify(value)) as T; // استخدام JSON لأن البيانات JSON-like.
} // نهاية cloneDeep.

function stripHtml(value: string) { // إزالة وسوم HTML في المعاينة المصغرة.
  return value.replace(/<br\s*\/?>(\s*)/gi, " ").replace(/<[^>]*>/g, ""); // تحويل br لمسافة وإزالة الباقي.
} // نهاية stripHtml.

function getText(lang: BuilderLang, ar: string, en: string) { // اختيار النص حسب اللغة.
  return lang === "ar" ? ar : en; // العربية عند AR والإنجليزية عند EN.
} // نهاية getText.

function getNestedValue(target: any, path: PathSegment[]) { // قراءة قيمة داخل مسار ديناميكي.
  return path.reduce((acc, segment) => (acc == null ? undefined : acc[segment as keyof typeof acc]), target); // تقليل آمن للمسار.
} // نهاية getNestedValue.

function setNestedValue(target: any, path: PathSegment[], value: unknown) { // كتابة قيمة داخل مسار ديناميكي.
  let cursor = target; // مؤشر الحركة داخل object.
  for (let index = 0; index < path.length - 1; index += 1) { // المرور على المسار حتى قبل آخر مفتاح.
    const current = path[index]; // المفتاح الحالي.
    const next = path[index + 1]; // المفتاح التالي.
    if (cursor[current] == null) cursor[current] = typeof next === "number" ? [] : {}; // إنشاء حاوية ناقصة إذا لزم.
    cursor = cursor[current]; // الانتقال للمستوى التالي.
  } // نهاية loop.
  cursor[path[path.length - 1]] = value; // كتابة القيمة في آخر مفتاح.
} // نهاية setNestedValue.

function moveArrayItem<T>(items: T[], fromIndex: number, direction: -1 | 1) { // تحريك عنصر داخل مصفوفة.
  const targetIndex = fromIndex + direction; // حساب الموقع الجديد.
  if (targetIndex < 0 || targetIndex >= items.length) return items; // منع الخروج عن الحدود.
  const next = [...items]; // نسخ المصفوفة.
  const [moved] = next.splice(fromIndex, 1); // استخراج العنصر.
  next.splice(targetIndex, 0, moved); // إدراج العنصر في مكانه الجديد.
  return next; // إرجاع المصفوفة الجديدة.
} // نهاية moveArrayItem.

function createDefaultCategoryItem(key: string, order: number, label_ar: string, label_en: string): FaqCategoryItem { // إنشاء تصنيف افتراضي.
  return { id: `faq-category-${key}`, key, is_active: true, sort_order: order, label_ar, label_en }; // إرجاع التصنيف.
} // نهاية createDefaultCategoryItem.

function createEmptyCategoryItem(order: number): FaqCategoryItem { // إنشاء تصنيف جديد من الأدمن.
  return { id: createId("faq-category"), key: `category-${order}`, is_active: true, sort_order: order, label_ar: "تصنيف جديد", label_en: "New Category" }; // إرجاع التصنيف الجديد.
} // نهاية createEmptyCategoryItem.

function createEmptyFaqItem(order: number): FaqItem { // إنشاء سؤال جديد من الأدمن.
  return { id: createId("faq-item"), category_key: "general", is_active: true, sort_order: order, question_ar: "سؤال جديد", question_en: "New Question", answer_ar: "إجابة السؤال بالعربية.", answer_en: "Answer to the question in English." }; // إرجاع السؤال الجديد.
} // نهاية createEmptyFaqItem.

function createDefaultSections(): FaqPageSections { // إنشاء البنية الافتراضية الكاملة.
  return { // بداية sections.
    hero: { kicker_ar: "إجابات واضحة", kicker_en: "Clear Answers", title_ar: "الأسئلة الشائعة<br/>بصياغة عملية ومباشرة", title_en: "Frequently Asked Questions<br/>With Practical, Direct Answers", desc_ar: "هذه الصفحة تجمع أكثر الأسئلة شيوعًا حول خدمات الزُهى وآلية العمل.", desc_en: "This page gathers the most common questions about ALZUHA services and workflow.", btn_ar: "طلب استشارة", btn_en: "Request Consultation", btn_href: "/request-consultation" }, // Hero الافتراضي.
    categories: { title_ar: "تصنيفات الأسئلة", title_en: "Question Categories", desc_ar: "رتب الأسئلة حسب الموضوع لتسهيل الوصول.", desc_en: "Organize questions by topic for faster access.", items: [createDefaultCategoryItem("general", 1, "عام", "General"), createDefaultCategoryItem("services", 2, "الخدمات", "Services"), createDefaultCategoryItem("investment", 3, "الاستثمار", "Investment"), createDefaultCategoryItem("contact", 4, "التواصل", "Contact")] }, // التصنيفات الافتراضية.
    faqItems: { items: [ { id: "faq-1", category_key: "general", is_active: true, sort_order: 1, question_ar: "ما طبيعة عمل شركة الزُهى؟", question_en: "What is the nature of ALZUHA’s work?", answer_ar: "نقدم حلولًا عقارية تشمل التطوير والاستشارات وتقييم الأصول ودعم القرار.", answer_en: "We provide real-estate solutions including development, advisory, asset assessment, and decision support." } ] }, // الأسئلة الافتراضية.
    cta: { title_ar: "لم تجد الإجابة التي تبحث عنها؟", title_en: "Didn’t Find the Answer You Need?", desc_ar: "يمكنك الانتقال مباشرة إلى طلب استشارة حتى نراجع حالتك بدقة.", desc_en: "You can move directly to a consultation request so we can review your case precisely.", button_ar: "طلب استشارة", button_en: "Request Consultation", button_href: "/request-consultation" }, // CTA الافتراضي.
    footer: { email: "info@alzuharealestate.com", social1_ar: "لينكدإن", social1_en: "LinkedIn", social1_href: "#", social2_ar: "انستغرام", social2_en: "Instagram", social2_href: "#", social3_ar: "دريبل", social3_en: "Dribbble", social3_href: "#", copy_ar: "جميع الحقوق محفوظة © الزُهى 2026", copy_en: "All rights reserved © ALZUHA 2026", privacy_ar: "سياسة الخصوصية", privacy_en: "Privacy Policy", privacy_href: "/privacy-policy" }, // Footer الافتراضي.
  }; // نهاية sections.
} // نهاية createDefaultSections.

function normalizeCategoryItem(value: unknown, index: number): FaqCategoryItem { // تطبيع تصنيف.
  const obj = asObject(value); // تحويل القيمة إلى object.
  return { id: normalizeText(obj.id, createId("faq-category")), key: normalizeText(obj.key, index === 0 ? "general" : `category-${index + 1}`), is_active: normalizeBoolean(obj.is_active, true), sort_order: normalizeNumber(obj.sort_order, index + 1), label_ar: normalizeText(obj.label_ar, "تصنيف"), label_en: normalizeText(obj.label_en, "Category") }; // إرجاع التصنيف المطبع.
} // نهاية normalizeCategoryItem.

function normalizeFaqItem(value: unknown, index: number): FaqItem { // تطبيع سؤال.
  const obj = asObject(value); // تحويل القيمة إلى object.
  return { id: normalizeText(obj.id, createId("faq-item")), category_key: normalizeText(obj.category_key, "general"), is_active: normalizeBoolean(obj.is_active, true), sort_order: normalizeNumber(obj.sort_order, index + 1), question_ar: normalizeText(obj.question_ar, "سؤال جديد"), question_en: normalizeText(obj.question_en, "New Question"), answer_ar: normalizeText(obj.answer_ar, "إجابة السؤال بالعربية."), answer_en: normalizeText(obj.answer_en, "Answer to the question in English.") }; // إرجاع السؤال المطبع.
} // نهاية normalizeFaqItem.

function normalizeSections(value: unknown): FaqPageSections { // تطبيع sections_json.
  const defaults = createDefaultSections(); // جلب البنية الافتراضية.
  const obj = asObject(value); // تحويل القيمة إلى object.
  const hero = asObject(obj.hero); // قراءة Hero.
  const categories = asObject(obj.categories); // قراءة التصنيفات.
  const faqItems = asObject(obj.faqItems); // قراءة الأسئلة.
  const cta = asObject(obj.cta); // قراءة CTA.
  const footer = asObject(obj.footer); // قراءة Footer.
  return { // بداية الإرجاع.
    hero: { kicker_ar: normalizeText(hero.kicker_ar, defaults.hero.kicker_ar), kicker_en: normalizeText(hero.kicker_en, defaults.hero.kicker_en), title_ar: normalizeText(hero.title_ar, defaults.hero.title_ar), title_en: normalizeText(hero.title_en, defaults.hero.title_en), desc_ar: normalizeText(hero.desc_ar, defaults.hero.desc_ar), desc_en: normalizeText(hero.desc_en, defaults.hero.desc_en), btn_ar: normalizeText(hero.btn_ar, defaults.hero.btn_ar), btn_en: normalizeText(hero.btn_en, defaults.hero.btn_en), btn_href: normalizeText(hero.btn_href, defaults.hero.btn_href) }, // Hero مطبع.
    categories: { title_ar: normalizeText(categories.title_ar, defaults.categories.title_ar), title_en: normalizeText(categories.title_en, defaults.categories.title_en), desc_ar: normalizeText(categories.desc_ar, defaults.categories.desc_ar), desc_en: normalizeText(categories.desc_en, defaults.categories.desc_en), items: Array.isArray(categories.items) && categories.items.length > 0 ? categories.items.map((item, index) => normalizeCategoryItem(item, index)) : defaults.categories.items }, // التصنيفات مطبعة.
    faqItems: { items: Array.isArray(faqItems.items) && faqItems.items.length > 0 ? faqItems.items.map((item, index) => normalizeFaqItem(item, index)) : defaults.faqItems.items }, // الأسئلة مطبعة.
    cta: { title_ar: normalizeText(cta.title_ar, defaults.cta.title_ar), title_en: normalizeText(cta.title_en, defaults.cta.title_en), desc_ar: normalizeText(cta.desc_ar, defaults.cta.desc_ar), desc_en: normalizeText(cta.desc_en, defaults.cta.desc_en), button_ar: normalizeText(cta.button_ar, defaults.cta.button_ar), button_en: normalizeText(cta.button_en, defaults.cta.button_en), button_href: normalizeText(cta.button_href, defaults.cta.button_href) }, // CTA مطبع.
    footer: { email: normalizeText(footer.email, defaults.footer.email), social1_ar: normalizeText(footer.social1_ar, defaults.footer.social1_ar), social1_en: normalizeText(footer.social1_en, defaults.footer.social1_en), social1_href: normalizeText(footer.social1_href, defaults.footer.social1_href), social2_ar: normalizeText(footer.social2_ar, defaults.footer.social2_ar), social2_en: normalizeText(footer.social2_en, defaults.footer.social2_en), social2_href: normalizeText(footer.social2_href, defaults.footer.social2_href), social3_ar: normalizeText(footer.social3_ar, defaults.footer.social3_ar), social3_en: normalizeText(footer.social3_en, defaults.footer.social3_en), social3_href: normalizeText(footer.social3_href, defaults.footer.social3_href), copy_ar: normalizeText(footer.copy_ar, defaults.footer.copy_ar), copy_en: normalizeText(footer.copy_en, defaults.footer.copy_en), privacy_ar: normalizeText(footer.privacy_ar, defaults.footer.privacy_ar), privacy_en: normalizeText(footer.privacy_en, defaults.footer.privacy_en), privacy_href: normalizeText(footer.privacy_href, defaults.footer.privacy_href) }, // Footer مطبع.
  }; // نهاية الإرجاع.
} // نهاية normalizeSections.

function normalizeRecord(value: FaqPageAdminRecord): FaqPageAdminRecord { // تطبيع السجل الكامل.
  return { slug: normalizeText(value.slug, "faq"), title_ar: normalizeText(value.title_ar, "الأسئلة الشائعة"), title_en: normalizeText(value.title_en, "FAQ"), content_ar: normalizeText(value.content_ar, "صفحة الأسئلة الشائعة تقدم إجابات عملية وواضحة."), content_en: normalizeText(value.content_en, "The FAQ page provides practical and clear answers."), is_published: normalizeBoolean(value.is_published, true), page_type: normalizeText(value.page_type, "faq") || "faq", sections_json: normalizeSections(value.sections_json) }; // إرجاع السجل المطبع.
} // نهاية normalizeRecord.

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { // مكوّن input موحد.
  return <label className="admin-faq-editor__field"><span>{label}</span><input className="admin-faq-editor__input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; // JSX للحقل.
} // نهاية TextInput.

function TextArea({ label, value, onChange, rows = 4, placeholder }: { label: string; value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) { // مكوّن textarea موحد.
  return <label className="admin-faq-editor__field"><span>{label}</span><textarea className="admin-faq-editor__textarea" value={value} rows={rows} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; // JSX للحقل.
} // نهاية TextArea.

function ToggleInput({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { // مكوّن checkbox موحد.
  return <label className="admin-faq-editor__toggle"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>; // JSX للتبديل.
} // نهاية ToggleInput.

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ label: string; value: string }> }) { // مكوّن select موحد.
  return <label className="admin-faq-editor__field"><span>{label}</span><select className="admin-faq-editor__input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; // JSX للقائمة.
} // نهاية SelectInput.

function Preview({ item, lang, device }: { item: FaqPageAdminRecord; lang: BuilderLang; device: PreviewDevice }) { // مكوّن المعاينة الحية.
  const sections = item.sections_json ?? createDefaultSections(); // جلب الأقسام.
  const activeFaqs = sections.faqItems.items.filter((faq) => faq.is_active).slice(0, 5); // أخذ أول خمسة أسئلة مفعلة.
  const activeCats = sections.categories.items.filter((cat) => cat.is_active).slice(0, 6); // أخذ أول ستة تصنيفات.
  return <aside className="admin-faq-editor__preview"><div className="admin-faq-editor__previewTop"><div><span>{builderCopy[lang].cms}</span><strong>{builderCopy[lang].preview}</strong></div><small>{device}</small></div><div className={`admin-faq-editor__previewStage is-${device}`}><div className="admin-faq-preview-page" dir={lang === "ar" ? "rtl" : "ltr"}><section className="admin-faq-preview-hero"><span>{getText(lang, sections.hero.kicker_ar, sections.hero.kicker_en)}</span><h2>{stripHtml(getText(lang, sections.hero.title_ar, sections.hero.title_en))}</h2><p>{stripHtml(getText(lang, sections.hero.desc_ar, sections.hero.desc_en))}</p><button type="button">{getText(lang, sections.hero.btn_ar, sections.hero.btn_en)}</button></section><section className="admin-faq-preview-cats">{activeCats.map((cat) => <span key={cat.id}>{getText(lang, cat.label_ar, cat.label_en)}</span>)}</section><section className="admin-faq-preview-list">{activeFaqs.map((faq) => <article key={faq.id}><strong>{getText(lang, faq.question_ar, faq.question_en)}</strong><p>{getText(lang, faq.answer_ar, faq.answer_en)}</p></article>)}</section><section className="admin-faq-preview-cta"><strong>{stripHtml(getText(lang, sections.cta.title_ar, sections.cta.title_en))}</strong><p>{stripHtml(getText(lang, sections.cta.desc_ar, sections.cta.desc_en))}</p></section></div></div></aside>; // JSX كامل للمعاينة.
} // نهاية Preview.

export default function FaqPageEditor({ initialItem }: { initialItem: FaqPageAdminRecord }) { // مكوّن محرر FAQ الرئيسي.
  const normalizedInitial = useMemo(() => normalizeRecord(initialItem), [initialItem]); // تطبيع السجل الأولي.
  const [item, setItem] = useState<FaqPageAdminRecord>(normalizedInitial); // حالة السجل.
  const [saving, setSaving] = useState(false); // حالة الحفظ.
  const [notice, setNotice] = useState(""); // رسالة النجاح.
  const [error, setError] = useState(""); // رسالة الخطأ.
  const [builderLang, setBuilderLang] = useState<BuilderLang>("en"); // لغة واجهة الأدمن.
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop"); // جهاز المعاينة.
  const [activeSection, setActiveSection] = useState<ActiveSection>("meta"); // القسم النشط في المحرر.
  const copy = builderCopy[builderLang]; // اختصار النصوص.
  const sections = item.sections_json ?? createDefaultSections(); // الأقسام الحالية.
  const categoryItems = sections.categories.items; // التصنيفات الحالية.
  const faqItems = sections.faqItems.items; // الأسئلة الحالية.

  useEffect(() => { // قراءة اللغة من الكوكي عند فتح المحرر.
    const cookieLang = document.cookie.split("; ").find((row) => row.startsWith("lang="))?.split("=")[1]; // قراءة قيمة lang.
    setBuilderLang(cookieLang === "ar" ? "ar" : "en"); // ضبط لغة الأدمن.
  }, []); // تشغيل مرة واحدة.

  const stats = useMemo(() => ({ categoriesCount: categoryItems.length, activeCategoriesCount: categoryItems.filter((entry) => entry.is_active).length, questionsCount: faqItems.length, activeQuestionsCount: faqItems.filter((entry) => entry.is_active).length, uncategorizedQuestionsCount: faqItems.filter((entry) => !categoryItems.some((category) => category.key === entry.category_key)).length }), [categoryItems, faqItems]); // إحصائيات اللوحة.
  const categoryOptions = useMemo(() => categoryItems.map((entry) => ({ label: `${getText(builderLang, entry.label_ar, entry.label_en)} (${entry.key})`, value: entry.key })), [categoryItems, builderLang]); // خيارات التصنيفات.
  const navItems = useMemo(() => ([{ key: "meta", label: copy.meta, desc: copy.metaDesc, count: item.is_published ? copy.live : copy.draft }, { key: "hero", label: copy.hero, desc: copy.heroDesc, count: "1" }, { key: "categories", label: copy.categories, desc: copy.categoriesDesc, count: String(categoryItems.length) }, { key: "faqItems", label: copy.faqItems, desc: copy.faqItemsDesc, count: String(faqItems.length) }, { key: "cta", label: copy.cta, desc: copy.ctaDesc, count: "1" }, { key: "footer", label: copy.footer, desc: copy.footerDesc, count: "1" }] as Array<{ key: ActiveSection; label: string; desc: string; count: string }>), [copy, item.is_published, categoryItems.length, faqItems.length]); // عناصر القائمة الجانبية.

  function changeBuilderLang(nextLang: BuilderLang) { // تغيير لغة واجهة الأدمن.
    setBuilderLang(nextLang); // تحديث الحالة.
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`; // تحديث الكوكي للموقع.
  } // نهاية changeBuilderLang.

  function updateRootField(field: keyof Pick<FaqPageAdminRecord, "title_ar" | "title_en" | "content_ar" | "content_en" | "is_published">, value: string | boolean) { // تحديث حقل جذري.
    setItem((prev) => ({ ...prev, [field]: value })); // تحديث الحالة.
  } // نهاية updateRootField.

  function updateAtPath(path: PathSegment[], value: unknown) { // تحديث قيمة داخل sections_json.
    setItem((prev) => { const next = cloneDeep(prev); if (!next.sections_json) next.sections_json = createDefaultSections(); setNestedValue(next.sections_json, path, value); return next; }); // تحديث آمن.
  } // نهاية updateAtPath.

  function appendToArray(path: PathSegment[], value: unknown) { // إضافة عنصر لمصفوفة.
    setItem((prev) => { const next = cloneDeep(prev); if (!next.sections_json) next.sections_json = createDefaultSections(); const currentArray = getNestedValue(next.sections_json, path); if (Array.isArray(currentArray)) currentArray.push(value); else setNestedValue(next.sections_json, path, [value]); return next; }); // إضافة آمنة.
  } // نهاية appendToArray.

  function removeFromArray(path: PathSegment[], index: number) { // حذف عنصر من مصفوفة.
    setItem((prev) => { const next = cloneDeep(prev); if (!next.sections_json) next.sections_json = createDefaultSections(); const currentArray = getNestedValue(next.sections_json, path); if (Array.isArray(currentArray)) currentArray.splice(index, 1); return next; }); // حذف آمن.
  } // نهاية removeFromArray.

  function moveInArray(path: PathSegment[], index: number, direction: -1 | 1) { // تحريك عنصر داخل مصفوفة.
    setItem((prev) => { const next = cloneDeep(prev); if (!next.sections_json) next.sections_json = createDefaultSections(); const currentArray = getNestedValue(next.sections_json, path); if (Array.isArray(currentArray)) setNestedValue(next.sections_json, path, moveArrayItem(currentArray, index, direction)); return next; }); // تحريك آمن.
  } // نهاية moveInArray.

  async function handleSave() { // حفظ التعديلات عبر API.
    try { // بدء الحفظ.
      setSaving(true); // تفعيل حالة الحفظ.
      setNotice(""); // مسح رسالة النجاح.
      setError(""); // مسح رسالة الخطأ.
      const response = await fetch("/api/admin/faq-page", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title_ar: item.title_ar, title_en: item.title_en, content_ar: item.content_ar, content_en: item.content_en, is_published: item.is_published, sections_json: item.sections_json }) }); // إرسال البيانات.
      const payload = await response.json().catch(() => ({})); // قراءة الرد.
      if (!response.ok || payload?.ok === false) throw new Error(payload?.message || copy.failed); // فحص الفشل.
      const normalizedSaved = normalizeRecord(payload.item as FaqPageAdminRecord); // تطبيع الرد.
      setItem(normalizedSaved); // تحديث الحالة.
      setNotice(copy.saved); // عرض نجاح.
    } catch (saveError) { // التقاط الخطأ.
      console.error("faq handleSave error:", saveError); // تسجيل الخطأ.
      setError(saveError instanceof Error ? saveError.message : copy.failed); // عرض الخطأ.
    } finally { // في كل الأحوال.
      setSaving(false); // إيقاف حالة الحفظ.
    } // نهاية finally.
  } // نهاية handleSave.

  function resetUnsavedChanges() { // إلغاء التعديلات غير المحفوظة.
    setItem(cloneDeep(normalizedInitial)); // الرجوع للنسخة الأولية.
    setNotice(""); // مسح النجاح.
    setError(""); // مسح الخطأ.
  } // نهاية resetUnsavedChanges.

  return <main className="admin-faq-editor admin-faq-editor--builder" dir={builderLang === "ar" ? "rtl" : "ltr"}> {/* غلاف Builder الرئيسي. */}
    <section className="admin-faq-editor__topbar"> {/* شريط أعلى الصفحة. */}
      <div><span>{copy.cms}</span><h1>{copy.title}</h1><p>{copy.desc}</p></div> {/* تعريف اللوحة. */}
      <div className="admin-faq-editor__topbarActions"><a href="/faq" target="_blank" rel="noreferrer" className="admin-faq-editor__ghostBtn">{copy.open}</a><button type="button" className="admin-faq-editor__ghostBtn" onClick={resetUnsavedChanges} disabled={saving}>{copy.reset}</button><button type="button" className="admin-faq-editor__primaryBtn" onClick={handleSave} disabled={saving}>{saving ? copy.saving : copy.save}</button><div className="admin-faq-editor__lang"><button type="button" className={builderLang === "ar" ? "is-active" : ""} onClick={() => changeBuilderLang("ar")}>AR</button><button type="button" className={builderLang === "en" ? "is-active" : ""} onClick={() => changeBuilderLang("en")}>EN</button></div></div> {/* أزرار التحكم. */}
    </section> {/* نهاية الشريط العلوي. */}

    <section className="admin-faq-editor__stats"> {/* بطاقات الإحصاء. */}
      <article className="admin-faq-editor__statCard"><span>{copy.categoriesCount}</span><strong>{stats.categoriesCount}</strong><small>{stats.activeCategoriesCount} {copy.active}</small></article> {/* إحصاء التصنيفات. */}
      <article className="admin-faq-editor__statCard"><span>{copy.questionsCount}</span><strong>{stats.questionsCount}</strong><small>{stats.activeQuestionsCount} {copy.active}</small></article> {/* إحصاء الأسئلة. */}
      <article className="admin-faq-editor__statCard"><span>{copy.uncategorized}</span><strong>{stats.uncategorizedQuestionsCount}</strong></article> {/* غير المصنفة. */}
      <article className="admin-faq-editor__statCard"><span>{copy.publishState}</span><strong>{item.is_published ? copy.live : copy.draft}</strong></article> {/* حالة النشر. */}
    </section> {/* نهاية الإحصائيات. */}

    {notice ? <div className="admin-faq-editor__notice admin-faq-editor__notice--success">{notice}</div> : null} {/* رسالة نجاح. */}
    {error ? <div className="admin-faq-editor__notice admin-faq-editor__notice--error">{error}</div> : null} {/* رسالة خطأ. */}

    <section className="admin-faq-editor__workspace"> {/* مساحة العمل الثلاثية. */}
      <aside className="admin-faq-editor__sidebar"><strong>{copy.sections}</strong>{navItems.map((nav) => <button key={nav.key} type="button" className={activeSection === nav.key ? "is-active" : ""} onClick={() => setActiveSection(nav.key)}><span>{nav.label}</span><small>{nav.desc}</small><em>{nav.count}</em></button>)}</aside> {/* قائمة الأقسام. */}
      <section className="admin-faq-editor__panel"> {/* لوحة المحرر الوسطية. */}
        <div className="admin-faq-editor__panelHead"><span>{copy.editor}</span><h2>{navItems.find((nav) => nav.key === activeSection)?.label}</h2><p>{navItems.find((nav) => nav.key === activeSection)?.desc}</p></div> {/* رأس اللوحة. */}
        {activeSection === "meta" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Title AR" value={item.title_ar} onChange={(value) => updateRootField("title_ar", value)} /><TextInput label="Title EN" value={item.title_en} onChange={(value) => updateRootField("title_en", value)} /><TextArea label="Content AR" value={item.content_ar} onChange={(value) => updateRootField("content_ar", value)} rows={4} /><TextArea label="Content EN" value={item.content_en} onChange={(value) => updateRootField("content_en", value)} rows={4} /></div><div className="admin-faq-editor__inlineRow"><ToggleInput label={copy.published} checked={item.is_published} onChange={(checked) => updateRootField("is_published", checked)} /><div className="admin-faq-editor__metaTag"><span>{copy.slug}</span><strong>{item.slug}</strong></div><div className="admin-faq-editor__metaTag"><span>{copy.pageType}</span><strong>{item.page_type || "faq"}</strong></div></div></div> : null} {/* قسم بيانات الصفحة. */}
        {activeSection === "hero" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Hero Kicker AR" value={sections.hero.kicker_ar} onChange={(value) => updateAtPath(["hero", "kicker_ar"], value)} /><TextInput label="Hero Kicker EN" value={sections.hero.kicker_en} onChange={(value) => updateAtPath(["hero", "kicker_en"], value)} /><TextArea label="Hero Title AR" value={sections.hero.title_ar} onChange={(value) => updateAtPath(["hero", "title_ar"], value)} rows={3} /><TextArea label="Hero Title EN" value={sections.hero.title_en} onChange={(value) => updateAtPath(["hero", "title_en"], value)} rows={3} /><TextArea label="Hero Description AR" value={sections.hero.desc_ar} onChange={(value) => updateAtPath(["hero", "desc_ar"], value)} rows={5} /><TextArea label="Hero Description EN" value={sections.hero.desc_en} onChange={(value) => updateAtPath(["hero", "desc_en"], value)} rows={5} /><TextInput label="Hero Button AR" value={sections.hero.btn_ar} onChange={(value) => updateAtPath(["hero", "btn_ar"], value)} /><TextInput label="Hero Button EN" value={sections.hero.btn_en} onChange={(value) => updateAtPath(["hero", "btn_en"], value)} /><TextInput label="Hero Button Href" value={sections.hero.btn_href} onChange={(value) => updateAtPath(["hero", "btn_href"], value)} /></div></div> : null} {/* قسم Hero. */}
        {activeSection === "categories" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Categories Title AR" value={sections.categories.title_ar} onChange={(value) => updateAtPath(["categories", "title_ar"], value)} /><TextInput label="Categories Title EN" value={sections.categories.title_en} onChange={(value) => updateAtPath(["categories", "title_en"], value)} /><TextArea label="Categories Description AR" value={sections.categories.desc_ar} onChange={(value) => updateAtPath(["categories", "desc_ar"], value)} rows={4} /><TextArea label="Categories Description EN" value={sections.categories.desc_en} onChange={(value) => updateAtPath(["categories", "desc_en"], value)} rows={4} /></div><div className="admin-faq-editor__arrayHeader"><h3>{copy.categories}</h3><button type="button" className="admin-faq-editor__primaryBtn" onClick={() => appendToArray(["categories", "items"], createEmptyCategoryItem(categoryItems.length + 1))}>{copy.addCategory}</button></div>{categoryItems.length === 0 ? <div className="admin-faq-editor__emptyState">{copy.noCategories}</div> : <div className="admin-faq-editor__stack">{categoryItems.map((entry, index) => <details key={entry.id} className="admin-faq-editor__item"><summary className="admin-faq-editor__itemSummary"><div><strong>{getText(builderLang, entry.label_ar, entry.label_en)}</strong><span>{entry.key}</span></div><div className="admin-faq-editor__summaryTags"><span className="admin-faq-editor__tag">#{index + 1}</span><span className={`admin-faq-editor__tag ${entry.is_active ? "is-active" : "is-inactive"}`}>{entry.is_active ? copy.active : copy.inactive}</span></div></summary><div className="admin-faq-editor__itemBody"><div className="admin-faq-editor__itemActions"><button type="button" className="admin-faq-editor__ghostBtn" onClick={() => moveInArray(["categories", "items"], index, -1)} disabled={index === 0}>{copy.moveUp}</button><button type="button" className="admin-faq-editor__ghostBtn" onClick={() => moveInArray(["categories", "items"], index, 1)} disabled={index === categoryItems.length - 1}>{copy.moveDown}</button><button type="button" className="admin-faq-editor__dangerBtn" onClick={() => removeFromArray(["categories", "items"], index)}>{copy.deleteCategory}</button></div><div className="admin-faq-editor__inlineRow"><ToggleInput label={copy.active} checked={entry.is_active} onChange={(checked) => updateAtPath(["categories", "items", index, "is_active"], checked)} /><TextInput label="Sort Order" value={String(entry.sort_order)} onChange={(value) => updateAtPath(["categories", "items", index, "sort_order"], Number(value) || index + 1)} /></div><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Category ID" value={entry.id} onChange={(value) => updateAtPath(["categories", "items", index, "id"], value)} /><TextInput label="Category Key" value={entry.key} onChange={(value) => updateAtPath(["categories", "items", index, "key"], value)} /><TextInput label="Label AR" value={entry.label_ar} onChange={(value) => updateAtPath(["categories", "items", index, "label_ar"], value)} /><TextInput label="Label EN" value={entry.label_en} onChange={(value) => updateAtPath(["categories", "items", index, "label_en"], value)} /></div></div></details>)}</div>}</div> : null} {/* قسم التصنيفات. */}
        {activeSection === "faqItems" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__arrayHeader"><h3>{copy.faqItems}</h3><button type="button" className="admin-faq-editor__primaryBtn" onClick={() => appendToArray(["faqItems", "items"], createEmptyFaqItem(faqItems.length + 1))}>{copy.addFaq}</button></div>{faqItems.length === 0 ? <div className="admin-faq-editor__emptyState">{copy.noQuestions}</div> : <div className="admin-faq-editor__stack">{faqItems.map((entry, index) => <details key={entry.id} className="admin-faq-editor__item"><summary className="admin-faq-editor__itemSummary"><div><strong>{getText(builderLang, entry.question_ar, entry.question_en)}</strong><span>{entry.category_key}</span></div><div className="admin-faq-editor__summaryTags"><span className="admin-faq-editor__tag">#{index + 1}</span><span className={`admin-faq-editor__tag ${entry.is_active ? "is-active" : "is-inactive"}`}>{entry.is_active ? copy.active : copy.inactive}</span></div></summary><div className="admin-faq-editor__itemBody"><div className="admin-faq-editor__itemActions"><button type="button" className="admin-faq-editor__ghostBtn" onClick={() => moveInArray(["faqItems", "items"], index, -1)} disabled={index === 0}>{copy.moveUp}</button><button type="button" className="admin-faq-editor__ghostBtn" onClick={() => moveInArray(["faqItems", "items"], index, 1)} disabled={index === faqItems.length - 1}>{copy.moveDown}</button><button type="button" className="admin-faq-editor__dangerBtn" onClick={() => removeFromArray(["faqItems", "items"], index)}>{copy.deleteFaq}</button></div><div className="admin-faq-editor__inlineRow"><ToggleInput label={copy.active} checked={entry.is_active} onChange={(checked) => updateAtPath(["faqItems", "items", index, "is_active"], checked)} /><TextInput label="Sort Order" value={String(entry.sort_order)} onChange={(value) => updateAtPath(["faqItems", "items", index, "sort_order"], Number(value) || index + 1)} /><SelectInput label="Category" value={entry.category_key} onChange={(value) => updateAtPath(["faqItems", "items", index, "category_key"], value)} options={categoryOptions} /></div><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Question ID" value={entry.id} onChange={(value) => updateAtPath(["faqItems", "items", index, "id"], value)} /><TextInput label="Question AR" value={entry.question_ar} onChange={(value) => updateAtPath(["faqItems", "items", index, "question_ar"], value)} /><TextInput label="Question EN" value={entry.question_en} onChange={(value) => updateAtPath(["faqItems", "items", index, "question_en"], value)} /><TextArea label="Answer AR" value={entry.answer_ar} onChange={(value) => updateAtPath(["faqItems", "items", index, "answer_ar"], value)} rows={5} /><TextArea label="Answer EN" value={entry.answer_en} onChange={(value) => updateAtPath(["faqItems", "items", index, "answer_en"], value)} rows={5} /></div></div></details>)}</div>}</div> : null} {/* قسم الأسئلة. */}
        {activeSection === "cta" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextArea label="CTA Title AR" value={sections.cta.title_ar} onChange={(value) => updateAtPath(["cta", "title_ar"], value)} rows={3} /><TextArea label="CTA Title EN" value={sections.cta.title_en} onChange={(value) => updateAtPath(["cta", "title_en"], value)} rows={3} /><TextArea label="CTA Description AR" value={sections.cta.desc_ar} onChange={(value) => updateAtPath(["cta", "desc_ar"], value)} rows={4} /><TextArea label="CTA Description EN" value={sections.cta.desc_en} onChange={(value) => updateAtPath(["cta", "desc_en"], value)} rows={4} /><TextInput label="CTA Button AR" value={sections.cta.button_ar} onChange={(value) => updateAtPath(["cta", "button_ar"], value)} /><TextInput label="CTA Button EN" value={sections.cta.button_en} onChange={(value) => updateAtPath(["cta", "button_en"], value)} /><TextInput label="CTA Button Href" value={sections.cta.button_href} onChange={(value) => updateAtPath(["cta", "button_href"], value)} /></div></div> : null} {/* قسم CTA. */}
        {activeSection === "footer" ? <div className="admin-faq-editor__section"><div className="admin-faq-editor__grid admin-faq-editor__grid--2"><TextInput label="Footer Email" value={sections.footer.email} onChange={(value) => updateAtPath(["footer", "email"], value)} /><TextInput label="Privacy Href" value={sections.footer.privacy_href} onChange={(value) => updateAtPath(["footer", "privacy_href"], value)} /><TextInput label="Social 1 AR" value={sections.footer.social1_ar} onChange={(value) => updateAtPath(["footer", "social1_ar"], value)} /><TextInput label="Social 1 EN" value={sections.footer.social1_en} onChange={(value) => updateAtPath(["footer", "social1_en"], value)} /><TextInput label="Social 1 Href" value={sections.footer.social1_href} onChange={(value) => updateAtPath(["footer", "social1_href"], value)} /><TextInput label="Social 2 AR" value={sections.footer.social2_ar} onChange={(value) => updateAtPath(["footer", "social2_ar"], value)} /><TextInput label="Social 2 EN" value={sections.footer.social2_en} onChange={(value) => updateAtPath(["footer", "social2_en"], value)} /><TextInput label="Social 2 Href" value={sections.footer.social2_href} onChange={(value) => updateAtPath(["footer", "social2_href"], value)} /><TextInput label="Social 3 AR" value={sections.footer.social3_ar} onChange={(value) => updateAtPath(["footer", "social3_ar"], value)} /><TextInput label="Social 3 EN" value={sections.footer.social3_en} onChange={(value) => updateAtPath(["footer", "social3_en"], value)} /><TextInput label="Social 3 Href" value={sections.footer.social3_href} onChange={(value) => updateAtPath(["footer", "social3_href"], value)} /><TextInput label="Copy AR" value={sections.footer.copy_ar} onChange={(value) => updateAtPath(["footer", "copy_ar"], value)} /><TextInput label="Copy EN" value={sections.footer.copy_en} onChange={(value) => updateAtPath(["footer", "copy_en"], value)} /><TextInput label="Privacy AR" value={sections.footer.privacy_ar} onChange={(value) => updateAtPath(["footer", "privacy_ar"], value)} /><TextInput label="Privacy EN" value={sections.footer.privacy_en} onChange={(value) => updateAtPath(["footer", "privacy_en"], value)} /></div></div> : null} {/* قسم Footer. */}
      </section> {/* نهاية لوحة المحرر. */}
      <aside className="admin-faq-editor__right"><div className="admin-faq-editor__deviceTabs"><button type="button" className={previewDevice === "desktop" ? "is-active" : ""} onClick={() => setPreviewDevice("desktop")}>{copy.desktop}</button><button type="button" className={previewDevice === "tablet" ? "is-active" : ""} onClick={() => setPreviewDevice("tablet")}>{copy.tablet}</button><button type="button" className={previewDevice === "mobile" ? "is-active" : ""} onClick={() => setPreviewDevice("mobile")}>{copy.mobile}</button></div><Preview item={item} lang={builderLang} device={previewDevice} /></aside> {/* المعاينة اليمنى. */}
    </section> {/* نهاية Workspace. */}
  </main>; // إرجاع الواجهة.
} // نهاية FaqPageEditor.
