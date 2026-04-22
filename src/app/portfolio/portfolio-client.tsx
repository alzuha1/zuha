"use client";
// هذا الملف عميل لأنه يحتوي على:
// - state للقائمة الجانبية
// - state لتبويب التصنيفات
// - state لنموذج التواصل
// - منطق تحميل الصور والـ placeholders

import Link from "next/link";
// Link للتنقل الداخلي داخل الموقع

import { useMemo, useState } from "react";
// useState لإدارة الحالات المحلية
// useMemo لتقليل إعادة الحساب للعناصر المفلترة والمرتبة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// استخدام مبدّل اللغة الحقيقي الموجود في المشروع
// بدل النظام اليدوي القديم في الملفات السابقة

type Lang = "ar" | "en";
// اللغات المدعومة

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
// نوع العنصر الواحد داخل قسم الأعمال المختارة

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
// بنية sections_json القادمة من page.tsx

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
// السجل الكامل الذي تستقبله الواجهة من الصفحة السيرفرية

type PortfolioTabKey = "all" | "dev" | "inv" | "mng";
// مفاتيح التصنيفات المعتمدة في قسم الأعمال

function textByLang(lang: Lang, ar: string, en: string) {
  // إرجاع النص حسب اللغة الحالية
  return lang === "ar" ? ar : en;
}

function normalizeAssetPath(src?: string | null): string {
  // توحيد مسار الصورة
  // يدعم:
  // - روابط http/https
  // - مسارات public مثل /portfolio/img/...
  // - مسارات ناتجة عن import من Next
  if (!src) return "";

  const clean = src.trim();

  if (!clean) return "";

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  if (clean.startsWith("/")) {
    return clean;
  }

  return `/${clean}`;
}

function normalizePortfolioHref(value: string | undefined, fallback = "/portfolio") {
  // حماية روابط العناصر بحيث لا تخرج بشكل غير مرغوب
  // نسمح حاليًا بروابط داخلية فقط
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

function PortfolioImage({
  src,
  alt,
  className,
  fallback,
}: {
  src?: string;
  alt: string;
  className: string;
  fallback: string;
}) {
  // مكوّن صورة موحد
  // يعرض placeholder أنيق إذا لم تكن الصورة موجودة أو لم تُحمّل بعد
  const [loaded, setLoaded] = useState(false);

  const finalSrc = normalizeAssetPath(src);

  if (!finalSrc) {
    return <div className={`${className} portfolio-imageFallback`}>{fallback}</div>;
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${className} portfolio-dynamicImage ${loaded ? "is-loaded" : ""}`}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(false)}
    />
  );
}

export default function PortfolioClient({
  lang,
  dir,
  pageData,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  pageData: PortfolioPageRecord;
}) {
  // المكوّن الرئيسي لعرض صفحة Portfolio العامة

  const [menuOpen, setMenuOpen] = useState(false);
  // حالة القائمة الجانبية للموبايل

  const [activeTab, setActiveTab] = useState<PortfolioTabKey>("all");
  // التصنيف النشط في قسم الأعمال

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    message: "",
  });
  // بيانات نموذج التواصل

  const [submitting, setSubmitting] = useState(false);
  // حالة الإرسال

  const [submitNotice, setSubmitNotice] = useState("");
  // رسالة النجاح

  const [submitError, setSubmitError] = useState("");
  // رسالة الخطأ

  const sections = pageData.sections_json;
  // اختصار للوصول إلى sections_json

  const hero = sections.hero;
  // قسم الهيرو

  const showcase = sections.showcase;
  // قسم الأعمال المختارة

  const insight = sections.insight;
  // القسم التحليلي/التفسيري

  const contact = sections.contact;
  // قسم التواصل

  const footer = sections.footer;
  // الفوتر

  const tabLabels = useMemo(
    () => ({
      all: textByLang(lang, showcase.tabs.all_ar, showcase.tabs.all_en),
      dev: textByLang(lang, showcase.tabs.dev_ar, showcase.tabs.dev_en),
      inv: textByLang(lang, showcase.tabs.inv_ar, showcase.tabs.inv_en),
      mng: textByLang(lang, showcase.tabs.mng_ar, showcase.tabs.mng_en),
    }),
    [lang, showcase.tabs]
  );
  // أسماء التبويبات بحسب اللغة الحالية

  const orderedActiveItems = useMemo(
    () =>
      [...showcase.items]
        .filter((item) => item.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [showcase.items]
  );
  // جميع العناصر النشطة مرتبة حسب sort_order

  const filteredItems = useMemo(() => {
    // تصفية العناصر حسب التصنيف الحالي
    if (activeTab === "all") {
      return orderedActiveItems;
    }

    return orderedActiveItems.filter((item) => item.category_key === activeTab);
  }, [activeTab, orderedActiveItems]);

  function updateFormField(
    field: "firstName" | "secondName" | "lastName" | "email" | "message",
    value: string
  ) {
    // تحديث حقل واحد داخل نموذج التواصل
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    // إرسال نموذج التواصل
    // نستخدم API الموجود مسبقًا لتجميع الرسائل داخل المشروع
    event.preventDefault();

    setSubmitNotice("");
    setSubmitError("");

    const fullName = [
      formData.firstName,
      formData.secondName,
      formData.lastName,
    ]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(" ");

    if (!fullName || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError(
        lang === "ar"
          ? "يرجى تعبئة الاسم والبريد الإلكتروني والرسالة."
          : "Please fill in the full name, email, and message."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/contact-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone: "-",
          // الصفحة لا تحتوي حقل هاتف في schema الحالية
          // لذلك نرسل قيمة ثابتة بسيطة بدل ترك الحقل مفقودًا
          email: formData.email.trim(),
          message: `[Portfolio Inquiry]\n${formData.message.trim()}`,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Failed to submit message.");
      }

      setSubmitNotice(
        lang === "ar"
          ? "تم إرسال رسالتك بنجاح."
          : "Your message has been sent successfully."
      );

      setFormData({
        firstName: "",
        secondName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("portfolio contact submit error:", error);

      setSubmitError(
        lang === "ar"
          ? "تعذر إرسال الرسالة حاليًا."
          : "Unable to send the message right now."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir={dir} className="portfolio-page">
      {/* الغلاف العام للصفحة */}

      <header className="portfolio-topbar">
        {/* الشريط العلوي */}
        {/* لا يوجد هنا زر Admin كما طلبت */}

        <div className="portfolio-topbar__right">
          <Link href="/" className="portfolio-brand" aria-label="Go to home page">
            <div className="portfolio-brand__text">
              <strong>ALZUHA</strong>
              <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
            </div>

            <div className="portfolio-brand__mark">⌂</div>
          </Link>
        </div>

        <nav className="portfolio-topbar__nav" aria-label="Primary navigation">
          <Link href="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
          <Link href="/about">{lang === "ar" ? "من نحن" : "About"}</Link>
          <Link href="/services">{lang === "ar" ? "الخدمات" : "Services"}</Link>
          <Link href="/portfolio" className="is-active">
            {lang === "ar" ? "الأعمال" : "Portfolio"}
          </Link>
          <Link href="/faq">{lang === "ar" ? "FAQ" : "FAQ"}</Link>
          <Link href="/contact">{lang === "ar" ? "تواصل" : "Contact"}</Link>
        </nav>

        <div className="portfolio-topbar__left">
          <Link href="/request-consultation" className="portfolio-btn portfolio-btn--white-small">
            {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
          </Link>

          <LanguageSwitch />
          {/* استخدام مبدل اللغة الحقيقي بالمشروع */}

          <button
            type="button"
            className="portfolio-burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`portfolio-sidepanel ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية للموبايل */}

        <div className="portfolio-sidepanel__header">
          <strong>{lang === "ar" ? "القائمة" : "Menu"}</strong>

          <button
            type="button"
            className="portfolio-sidepanel__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="portfolio-sidepanel__nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link href="/about" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "من نحن" : "About"}
          </Link>

          <Link href="/services" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الخدمات" : "Services"}
          </Link>

          <Link href="/portfolio" className="is-active" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الأعمال" : "Portfolio"}
          </Link>

          <Link href="/faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </Link>

          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "تواصل" : "Contact"}
          </Link>

          <Link href="/request-consultation" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
          </Link>
        </nav>
      </aside>

      <section className="portfolio-hero">
        {/* قسم الهيرو الرئيسي */}

        <div className="portfolio-container">
          <div className="portfolio-hero__grid">
            <div className="portfolio-hero__media">
              <div className="portfolio-imageFrame portfolio-imageFrame--hero">
                <PortfolioImage
                  src={hero.image_url}
                  alt={textByLang(lang, pageData.title_ar, pageData.title_en)}
                  className="portfolio-hero__image"
                  fallback="ALZUHA"
                />
              </div>
            </div>

            <div className="portfolio-hero__content">
              <span className="portfolio-kicker">
                {textByLang(lang, hero.kicker_ar, hero.kicker_en)}
              </span>

              <h1
                className="portfolio-hero__title"
                dangerouslySetInnerHTML={{
                  __html: textByLang(lang, hero.title_ar, hero.title_en),
                }}
              />
              {/* استخدمنا dangerouslySetInnerHTML لأن النص يسمح بـ <br/> من لوحة الأدمن */}

              <p className="portfolio-hero__desc">
                {textByLang(lang, hero.desc_ar, hero.desc_en)}
              </p>

              <div className="portfolio-hero__actions">
                <Link
                  href={normalizePortfolioHref(hero.card_btn_href, "/portfolio")}
                  className="portfolio-btn portfolio-btn--white"
                >
                  {textByLang(lang, hero.card_btn_ar, hero.card_btn_en)}
                </Link>

                <Link
                  href="/request-consultation"
                  className="portfolio-btn portfolio-btn--outline-white"
                >
                  {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
                </Link>
              </div>

              <div className="portfolio-heroCard">
                <div className="portfolio-heroCard__media">
                  <PortfolioImage
                    src={hero.card_image_url}
                    alt={textByLang(lang, hero.card_title_ar, hero.card_title_en)}
                    className="portfolio-heroCard__image"
                    fallback="Portfolio"
                  />
                </div>

                <div className="portfolio-heroCard__content">
                  <h2>{textByLang(lang, hero.card_title_ar, hero.card_title_en)}</h2>
                  <p>{textByLang(lang, hero.card_desc_ar, hero.card_desc_en)}</p>

                  <Link
                    href={normalizePortfolioHref(hero.card_btn_href, "/portfolio")}
                    className="portfolio-heroCard__link"
                  >
                    {textByLang(lang, hero.card_btn_ar, hero.card_btn_en)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-section portfolio-section--white">
        {/* قسم الأعمال المختارة */}

        <div className="portfolio-container">
          <div className="portfolio-sectionHeader">
            <span className="portfolio-sectionLabel">
              {textByLang(lang, showcase.kicker_ar, showcase.kicker_en)}
            </span>

            <h2
              className="portfolio-sectionTitle"
              dangerouslySetInnerHTML={{
                __html: textByLang(lang, showcase.title_ar, showcase.title_en),
              }}
            />

            <p className="portfolio-sectionDesc">
              {textByLang(lang, showcase.desc_ar, showcase.desc_en)}
            </p>
          </div>

          <div className="portfolio-tabs" role="tablist" aria-label="Portfolio categories">
            <button
              type="button"
              className={`portfolio-tab ${activeTab === "all" ? "is-active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              {tabLabels.all}
            </button>

            <button
              type="button"
              className={`portfolio-tab ${activeTab === "dev" ? "is-active" : ""}`}
              onClick={() => setActiveTab("dev")}
            >
              {tabLabels.dev}
            </button>

            <button
              type="button"
              className={`portfolio-tab ${activeTab === "inv" ? "is-active" : ""}`}
              onClick={() => setActiveTab("inv")}
            >
              {tabLabels.inv}
            </button>

            <button
              type="button"
              className={`portfolio-tab ${activeTab === "mng" ? "is-active" : ""}`}
              onClick={() => setActiveTab("mng")}
            >
              {tabLabels.mng}
            </button>
          </div>

          <div className="portfolio-showcaseGrid">
            {filteredItems.length === 0 ? (
              <div className="portfolio-emptyState">
                {lang === "ar"
                  ? "لا توجد عناصر ضمن هذا التصنيف حاليًا."
                  : "There are no items in this category right now."}
              </div>
            ) : (
              filteredItems.map((item) => (
                <article key={item.id} className="portfolio-card">
                  <Link
                    href={normalizePortfolioHref(item.href, "/portfolio")}
                    className="portfolio-card__cover"
                  >
                    <PortfolioImage
                      src={item.cover_image_url}
                      alt={textByLang(lang, item.title_ar, item.title_en)}
                      className="portfolio-card__coverImage"
                      fallback={textByLang(lang, item.tag_ar, item.tag_en)}
                    />
                  </Link>

                  <div className="portfolio-card__body">
                    <span className="portfolio-card__tag">
                      {textByLang(lang, item.tag_ar, item.tag_en)}
                    </span>

                    <h3 className="portfolio-card__title">
                      <Link href={normalizePortfolioHref(item.href, "/portfolio")}>
                        {textByLang(lang, item.title_ar, item.title_en)}
                      </Link>
                    </h3>

                    <p className="portfolio-card__desc">
                      {textByLang(lang, item.desc_ar, item.desc_en)}
                    </p>

                    <div className="portfolio-card__meta">
                      <div className="portfolio-card__author">
                        <div className="portfolio-card__authorAvatar">
                          <PortfolioImage
                            src={item.author_image_url}
                            alt={textByLang(lang, item.author_ar, item.author_en)}
                            className="portfolio-card__authorImage"
                            fallback={textByLang(lang, item.author_ar, item.author_en).slice(0, 1)}
                          />
                        </div>

                        <div className="portfolio-card__authorText">
                          <strong>{textByLang(lang, item.author_ar, item.author_en)}</strong>
                          <span>{textByLang(lang, item.role_ar, item.role_en)}</span>
                        </div>
                      </div>

                      <span className="portfolio-card__date">
                        {textByLang(lang, item.date_ar, item.date_en)}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="portfolio-insight">
        {/* قسم الرؤية / الملاحظة التحليلية */}

        <div className="portfolio-container portfolio-insight__inner">
          <span className="portfolio-sectionLabel portfolio-sectionLabel--light">
            {textByLang(lang, insight.kicker_ar, insight.kicker_en)}
          </span>

          <h2 className="portfolio-sectionTitle portfolio-sectionTitle--light">
            {textByLang(lang, insight.title_ar, insight.title_en)}
          </h2>

          <p className="portfolio-sectionDesc portfolio-sectionDesc--light">
            {textByLang(lang, insight.desc_ar, insight.desc_en)}
          </p>
        </div>
      </section>

      <section className="portfolio-contact">
        {/* قسم التواصل */}

        <div className="portfolio-container">
          <div className="portfolio-contact__grid">
            <div className="portfolio-contact__content">
              <span className="portfolio-sectionLabel">
                {lang === "ar" ? "تواصل" : "Contact"}
              </span>

              <h2
                className="portfolio-sectionTitle"
                dangerouslySetInnerHTML={{
                  __html: textByLang(lang, contact.title_ar, contact.title_en),
                }}
              />

              <p className="portfolio-sectionDesc">
                {textByLang(lang, contact.desc_ar, contact.desc_en)}
              </p>

              <div className="portfolio-contact__quickLinks">
                <Link href="/request-consultation" className="portfolio-btn portfolio-btn--blue">
                  {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
                </Link>

                <Link href="/contact" className="portfolio-btn portfolio-btn--outline-dark">
                  {lang === "ar" ? "افتح صفحة التواصل" : "Open Contact Page"}
                </Link>
              </div>
            </div>

            <form className="portfolio-contactForm" onSubmit={handleContactSubmit}>
              <div className="portfolio-contactForm__grid">
                <label className="portfolio-contactForm__field">
                  <span>{textByLang(lang, contact.first_name_ar, contact.first_name_en)}</span>
                  <input
                    value={formData.firstName}
                    onChange={(event) => updateFormField("firstName", event.target.value)}
                    placeholder={textByLang(lang, contact.first_name_ar, contact.first_name_en)}
                  />
                </label>

                <label className="portfolio-contactForm__field">
                  <span>{textByLang(lang, contact.second_name_ar, contact.second_name_en)}</span>
                  <input
                    value={formData.secondName}
                    onChange={(event) => updateFormField("secondName", event.target.value)}
                    placeholder={textByLang(lang, contact.second_name_ar, contact.second_name_en)}
                  />
                </label>

                <label className="portfolio-contactForm__field">
                  <span>{textByLang(lang, contact.last_name_ar, contact.last_name_en)}</span>
                  <input
                    value={formData.lastName}
                    onChange={(event) => updateFormField("lastName", event.target.value)}
                    placeholder={textByLang(lang, contact.last_name_ar, contact.last_name_en)}
                  />
                </label>

                <label className="portfolio-contactForm__field">
                  <span>{textByLang(lang, contact.email_ar, contact.email_en)}</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateFormField("email", event.target.value)}
                    placeholder={textByLang(lang, contact.email_ar, contact.email_en)}
                  />
                </label>
              </div>

              <label className="portfolio-contactForm__field">
                <span>{textByLang(lang, contact.message_ar, contact.message_en)}</span>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(event) => updateFormField("message", event.target.value)}
                  placeholder={textByLang(lang, contact.message_ar, contact.message_en)}
                />
              </label>

              {submitNotice ? (
                <div className="portfolio-contactForm__notice portfolio-contactForm__notice--success">
                  {submitNotice}
                </div>
              ) : null}

              {submitError ? (
                <div className="portfolio-contactForm__notice portfolio-contactForm__notice--error">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                className="portfolio-btn portfolio-btn--blue"
                disabled={submitting}
              >
                {submitting
                  ? lang === "ar"
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : textByLang(lang, contact.submit_btn_ar, contact.submit_btn_en)}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="portfolio-footer">
        {/* الفوتر */}

        <div className="portfolio-container portfolio-footer__inner">
          <a className="portfolio-footer__email" href={`mailto:${footer.email}`}>
            {footer.email}
          </a>

          <div className="portfolio-footer__socials">
            <a href={footer.social1_href}>
              {textByLang(lang, footer.social1_ar, footer.social1_en)}
            </a>
            <a href={footer.social2_href}>
              {textByLang(lang, footer.social2_ar, footer.social2_en)}
            </a>
            <a href={footer.social3_href}>
              {textByLang(lang, footer.social3_ar, footer.social3_en)}
            </a>
          </div>

          <div className="portfolio-footer__bottom">
            <span>{textByLang(lang, footer.copy_ar, footer.copy_en)}</span>

            <a href={footer.privacy_href}>
              {textByLang(lang, footer.privacy_ar, footer.privacy_en)}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}