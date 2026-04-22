"use client";
// هذا الملف عميل لأنه يحتوي على:
// - state للقائمة الجانبية
// - state لتصفية التصنيفات
// - state لفتح/إغلاق الأسئلة
// - واجهة FAQ العامة كاملة

import Link from "next/link";
// Link للتنقل الداخلي داخل Next.js بدون إعادة تحميل كاملة

import { useMemo, useState } from "react";
// useState لإدارة الحالات المحلية
// useMemo لحساب القيم المشتقة بكفاءة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// مبدّل اللغة الحقيقي الخاص بالمشروع

type Lang = "ar" | "en";
// اللغات المدعومة

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
// السجل الكامل الذي تستقبله الواجهة من page.tsx

type CategoryFilterKey = "all" | string;
// نوع مفتاح التصنيف النشط

function textByLang(lang: Lang, ar: string, en: string) {
  // اختيار النص المناسب حسب اللغة الحالية
  return lang === "ar" ? ar : en;
}

function normalizeHref(value: string | undefined, fallback = "/faq") {
  // حماية الروابط القادمة من قاعدة البيانات
  // نقبل:
  // - روابط داخلية تبدأ بـ /
  // - روابط خارجية تبدأ بـ http/https
  // وإلا نرجع fallback
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const clean = value.trim();

  if (!clean) {
    return fallback;
  }

  if (clean.startsWith("/")) {
    return clean;
  }

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  return fallback;
}

export default function FaqClient({
  lang,
  dir,
  pageData,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  pageData: FaqPageRecord;
}) {
  // المكوّن الرئيسي لعرض صفحة FAQ العامة

  const [menuOpen, setMenuOpen] = useState(false);
  // حالة القائمة الجانبية للموبايل

  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>("all");
  // التصنيف النشط حاليًا في قسم الأسئلة

  const [openItems, setOpenItems] = useState<string[]>([]);
  // معرفات الأسئلة المفتوحة حاليًا
  // استخدمنا array بدل قيمة واحدة حتى نسمح بفتح أكثر من سؤال معًا

  const sections = pageData.sections_json;
  // اختصار للوصول إلى sections_json

  const hero = sections.hero;
  // قسم Hero

  const categoriesSection = sections.categories;
  // قسم التصنيفات

  const faqSection = sections.faqItems;
  // قسم الأسئلة

  const cta = sections.cta;
  // قسم CTA النهائي

  const footer = sections.footer;
  // الفوتر

  const orderedActiveCategories = useMemo(
    () =>
      [...categoriesSection.items]
        .filter((item) => item.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categoriesSection.items]
  );
  // التصنيفات النشطة المرتبة فقط

  const orderedActiveFaqItems = useMemo(
    () =>
      [...faqSection.items]
        .filter((item) => item.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [faqSection.items]
  );
  // الأسئلة النشطة المرتبة فقط

  const filteredFaqItems = useMemo(() => {
    // تصفية الأسئلة حسب التصنيف الحالي
    if (activeCategory === "all") {
      return orderedActiveFaqItems;
    }

    return orderedActiveFaqItems.filter(
      (item) => item.category_key === activeCategory
    );
  }, [activeCategory, orderedActiveFaqItems]);

  const activeCategoryLabel = useMemo(() => {
    // اسم التصنيف النشط لعرضه في الواجهة
    if (activeCategory === "all") {
      return lang === "ar" ? "الكل" : "All";
    }

    const matched = orderedActiveCategories.find(
      (category) => category.key === activeCategory
    );

    return matched
      ? textByLang(lang, matched.label_ar, matched.label_en)
      : activeCategory;
  }, [activeCategory, lang, orderedActiveCategories]);

  function toggleFaqItem(id: string) {
    // فتح/إغلاق سؤال معيّن
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  }

  function isFaqItemOpen(id: string) {
    // التحقق هل السؤال مفتوح حاليًا
    return openItems.includes(id);
  }

  function closeMenu() {
    // إغلاق القائمة الجانبية
    setMenuOpen(false);
  }

  return (
    <main dir={dir} className="faq-page">
      {/* الغلاف العام لصفحة FAQ */}

      <header className="faq-topbar">
        {/* الشريط العلوي */}
        {/* لا يوجد زر Admin هنا كما طلبت */}

        <div className="faq-topbar__right">
          <Link href="/" className="faq-brand" aria-label="Go to home page">
            <div className="faq-brand__text">
              <strong>ALZUHA</strong>
              <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
            </div>

            <div className="faq-brand__mark">⌂</div>
          </Link>
        </div>

        <nav className="faq-topbar__nav" aria-label="Primary navigation">
          <Link href="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
          <Link href="/about">{lang === "ar" ? "من نحن" : "About"}</Link>
          <Link href="/services">{lang === "ar" ? "الخدمات" : "Services"}</Link>
          <Link href="/portfolio">{lang === "ar" ? "الأعمال" : "Portfolio"}</Link>
          <Link href="/faq" className="is-active">
            {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
          </Link>
          <Link href="/contact">{lang === "ar" ? "تواصل" : "Contact"}</Link>
        </nav>

        <div className="faq-topbar__left">
          <Link href="/request-consultation" className="faq-btn faq-btn--white-small">
            {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
          </Link>

          <LanguageSwitch />
          {/* مبدّل اللغة الحقيقي */}

          <button
            type="button"
            className="faq-burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`faq-sidepanel ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية للموبايل */}

        <div className="faq-sidepanel__header">
          <strong>{lang === "ar" ? "القائمة" : "Menu"}</strong>

          <button
            type="button"
            className="faq-sidepanel__close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>

        <nav className="faq-sidepanel__nav">
          <Link href="/" onClick={closeMenu}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link href="/about" onClick={closeMenu}>
            {lang === "ar" ? "من نحن" : "About"}
          </Link>

          <Link href="/services" onClick={closeMenu}>
            {lang === "ar" ? "الخدمات" : "Services"}
          </Link>

          <Link href="/portfolio" onClick={closeMenu}>
            {lang === "ar" ? "الأعمال" : "Portfolio"}
          </Link>

          <Link href="/faq" className="is-active" onClick={closeMenu}>
            {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            {lang === "ar" ? "تواصل" : "Contact"}
          </Link>

          <Link href="/request-consultation" onClick={closeMenu}>
            {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
          </Link>
        </nav>
      </aside>

      <section className="faq-hero">
        {/* قسم Hero */}

        <div className="faq-container">
          <div className="faq-hero__content">
            <span className="faq-kicker">
              {textByLang(lang, hero.kicker_ar, hero.kicker_en)}
            </span>

            <h1
              className="faq-hero__title"
              dangerouslySetInnerHTML={{
                __html: textByLang(lang, hero.title_ar, hero.title_en),
              }}
            />
            {/* استخدمنا dangerouslySetInnerHTML لأن النص قد يحتوي <br/> من لوحة الأدمن */}

            <p className="faq-hero__desc">
              {textByLang(lang, hero.desc_ar, hero.desc_en)}
            </p>

            <div className="faq-hero__actions">
              <Link
                href={normalizeHref(hero.btn_href, "/request-consultation")}
                className="faq-btn faq-btn--white"
              >
                {textByLang(lang, hero.btn_ar, hero.btn_en)}
              </Link>

              <Link href="/contact" className="faq-btn faq-btn--outline-white">
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section faq-section--white">
        {/* قسم التصنيفات والأسئلة */}

        <div className="faq-container">
          <div className="faq-sectionHeader">
            <span className="faq-sectionLabel">
              {lang === "ar" ? "التصنيفات" : "Categories"}
            </span>

            <h2 className="faq-sectionTitle">
              {textByLang(lang, categoriesSection.title_ar, categoriesSection.title_en)}
            </h2>

            <p className="faq-sectionDesc">
              {textByLang(lang, categoriesSection.desc_ar, categoriesSection.desc_en)}
            </p>
          </div>

          <div className="faq-filters" role="tablist" aria-label="FAQ categories">
            <button
              type="button"
              className={`faq-filter ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              {lang === "ar" ? "الكل" : "All"}
            </button>

            {orderedActiveCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`faq-filter ${
                  activeCategory === category.key ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory(category.key)}
              >
                {textByLang(lang, category.label_ar, category.label_en)}
              </button>
            ))}
          </div>

          <div className="faq-overviewBar">
            <div className="faq-overviewBar__item">
              <span>{lang === "ar" ? "التصنيف الحالي" : "Current category"}</span>
              <strong>{activeCategoryLabel}</strong>
            </div>

            <div className="faq-overviewBar__item">
              <span>{lang === "ar" ? "عدد الإجابات" : "Answers count"}</span>
              <strong>{filteredFaqItems.length}</strong>
            </div>
          </div>

          <div className="faq-accordion">
            {filteredFaqItems.length === 0 ? (
              <div className="faq-emptyState">
                {lang === "ar"
                  ? "لا توجد أسئلة ضمن هذا التصنيف حاليًا."
                  : "There are no questions in this category right now."}
              </div>
            ) : (
              filteredFaqItems.map((item, index) => {
                const open = isFaqItemOpen(item.id);
                const answerId = `faq-answer-${item.id}`;

                return (
                  <article key={item.id} className={`faq-item ${open ? "is-open" : ""}`}>
                    <button
                      type="button"
                      className="faq-item__question"
                      aria-expanded={open}
                      aria-controls={answerId}
                      onClick={() => toggleFaqItem(item.id)}
                    >
                      <span className="faq-item__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="faq-item__questionText">
                        {textByLang(lang, item.question_ar, item.question_en)}
                      </span>

                      <span className="faq-item__toggle">{open ? "−" : "+"}</span>
                    </button>

                    <div
                      id={answerId}
                      className="faq-item__answer"
                      hidden={!open}
                    >
                      <p>{textByLang(lang, item.answer_ar, item.answer_en)}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="faq-cta">
        {/* قسم CTA النهائي */}

        <div className="faq-container faq-cta__inner">
          <span className="faq-sectionLabel faq-sectionLabel--light">
            {lang === "ar" ? "الخطوة التالية" : "Next Step"}
          </span>

          <h2 className="faq-sectionTitle faq-sectionTitle--light">
            {textByLang(lang, cta.title_ar, cta.title_en)}
          </h2>

          <p className="faq-sectionDesc faq-sectionDesc--light">
            {textByLang(lang, cta.desc_ar, cta.desc_en)}
          </p>

          <Link
            href={normalizeHref(cta.button_href, "/request-consultation")}
            className="faq-btn faq-btn--white"
          >
            {textByLang(lang, cta.button_ar, cta.button_en)}
          </Link>
        </div>
      </section>

      <footer className="faq-footer">
        {/* الفوتر */}

        <div className="faq-container faq-footer__inner">
          <a className="faq-footer__email" href={`mailto:${footer.email}`}>
            {footer.email}
          </a>

          <div className="faq-footer__socials">
            <a href={normalizeHref(footer.social1_href, "#")}>
              {textByLang(lang, footer.social1_ar, footer.social1_en)}
            </a>
            <a href={normalizeHref(footer.social2_href, "#")}>
              {textByLang(lang, footer.social2_ar, footer.social2_en)}
            </a>
            <a href={normalizeHref(footer.social3_href, "#")}>
              {textByLang(lang, footer.social3_ar, footer.social3_en)}
            </a>
          </div>

          <div className="faq-footer__bottom">
            <span>{textByLang(lang, footer.copy_ar, footer.copy_en)}</span>

            <a href={normalizeHref(footer.privacy_href, "/privacy-policy")}>
              {textByLang(lang, footer.privacy_ar, footer.privacy_en)}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}