"use client";
// هذا الملف عميل لأنه يحتوي على state والتفاعل مع القائمة والصور

import Link from "next/link";
// روابط التنقل الداخلية

import { useMemo, useState } from "react";
// useState للحالات المحلية
// useMemo للترتيب والتصفية

import LanguageSwitch from "@/components/site/LanguageSwitch";
// استخدام مبدّل اللغة المعتمد في المشروع بدل الزر اليدوي القديم

export type Lang = "ar" | "en";
// نوع اللغة المدعومة

export type ServiceItem = {
  id: string;
  is_active: boolean;
  sort_order: number;
  icon: string;
  image_url: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  cta_label_ar: string;
  cta_label_en: string;
  href: string;
};

export type TestimonialItem = {
  id: string;
  is_active: boolean;
  sort_order: number;
  text_ar: string;
  text_en: string;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  image_url: string;
};

export type GalleryImageItem = {
  id: string;
  is_active: boolean;
  sort_order: number;
  image_url: string;
  alt_ar: string;
  alt_en: string;
};

export type ServicesSections = {
  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    btn1_ar: string;
    btn1_en: string;
    btn1_href: string;
    btn2_ar: string;
    btn2_en: string;
    btn2_href: string;
    image_url: string;
  };

  servicesSection: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    items: ServiceItem[];
  };

  testimonials: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    btn_ar: string;
    btn_en: string;
    btn_href: string;
    items: TestimonialItem[];
  };

  gallery: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    images: GalleryImageItem[];
  };

  cta: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    label_ar: string;
    label_en: string;
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
// تعريف الشكل الكامل لبيانات صفحة الخدمات

function textByLang(lang: Lang, ar: string, en: string) {
  // اختيار النص المناسب حسب اللغة
  return lang === "ar" ? ar : en;
}

function normalizeServicesAssetPath(src?: string | null): string {
  // توحيد مسار الصور سواء كانت:
  // - صورًا محلية مستوردة من Next وتبدأ بـ /_next/...
  // - أو صورًا محفوظة في القاعدة بمسارات عامة
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

function sortActive<T extends { is_active: boolean; sort_order: number }>(items: T[]) {
  // إرجاع العناصر الفعالة فقط مرتبة حسب sort_order
  return [...items]
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function normalizeInternalServiceHref(value: string | undefined, fallback: string) {
  // هذه الدالة تمنع روابط Services من الرجوع إلى:
  // /about أو /contact أو /request-consultation أو /portfolio
  // لأن المطلوب أن تبقى منظومة Services مستقلة قدر الإمكان
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const clean = value.trim();

  if (!clean) {
    return fallback;
  }

  if (clean === "/") {
    return "/";
  }
  // نسمح فقط بالرئيسية كارتباط خارجي مباشر

  if (clean.startsWith("#")) {
    return clean;
  }
  // نسمح بالروابط الداخلية داخل نفس الصفحة

  if (clean === "/services" || clean.startsWith("/services/")) {
    return clean;
  }
  // نسمح فقط بمسارات الخدمات الداخلية

  return fallback;
  // أي رابط آخر نعتبره غير مرغوب ونستبدله بالمسار الداخلي الافتراضي
}

function ServicesImage({
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
  // مكوّن صورة بخاصية fade-in وplaceholder
  const [loaded, setLoaded] = useState(false);

  const finalSrc = normalizeServicesAssetPath(src);

  if (!finalSrc) {
    return <div className={`${className} services-imageFallback`}>{fallback}</div>;
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${className} services-dynamicImage ${loaded ? "is-loaded" : ""}`}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(false)}
    />
  );
}

export default function ServicesClient({
  lang,
  dir,
  sections,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  sections: ServicesSections;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // حالة فتح وإغلاق القائمة الجانبية

  const servicesItems = useMemo(
    () => sortActive(sections.servicesSection.items),
    [sections.servicesSection.items]
  );
  // الخدمات الفعالة والمرتبة

  const testimonialItems = useMemo(
    () => sortActive(sections.testimonials.items),
    [sections.testimonials.items]
  );
  // التقييمات الفعالة والمرتبة

  const galleryItems = useMemo(
    () => sortActive(sections.gallery.images),
    [sections.gallery.images]
  );
  // صور المعرض الفعالة والمرتبة

  const heroPrimaryHref = normalizeInternalServiceHref(
    sections.hero.btn1_href,
    "/services/explore"
  );
  // زر الهيرو الرئيسي

  const heroSecondaryHref = normalizeInternalServiceHref(
    sections.hero.btn2_href,
    "/services/service-desk"
  );
  // زر الهيرو الثانوي

  const testimonialsHref = normalizeInternalServiceHref(
    sections.testimonials.btn_href,
    "/services/service-desk"
  );
  // زر قسم التقييمات

  const ctaHref = normalizeInternalServiceHref(
    sections.cta.button_href,
    "/services/service-desk"
  );
  // زر CTA النهائي

  const serviceFallbackHrefById: Record<string, string> = {
    "service-1": "/services/project-development",
    "service-2": "/services/asset-assessment",
    "service-3": "/services/strategic-advisory",
    "service-4": "/services/market-positioning",
  };
  // مسارات افتراضية داخلية لكل بطاقة خدمة

  return (
    <main dir={dir} className="services-page">
      {/* الغلاف العام للصفحة */}

      <header className="services-topbar">
        {/* الشريط العلوي */}
        {/* ملاحظة: لا يوجد هنا زر Admin كما طلبت */}

        <div className="services-topbar__right">
          <Link href="/" className="services-brand" aria-label="Go to home page">
            <div className="services-brand__mark">⌂</div>

            <div className="services-brand__text">
              <strong>ALZUHA</strong>
              <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
            </div>
          </Link>
        </div>

        <nav className="services-topbar__nav" aria-label="Services navigation">
          {/* التنقل هنا مستقل عن About وContact وFAQ وPortfolio */}
          <Link href="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
          <Link href="/services/explore" className="is-active">
            {lang === "ar" ? "استكشف الخدمات" : "Explore"}
          </Link>
          <Link href="/services/project-development">
            {lang === "ar" ? "تطوير المشاريع" : "Project Development"}
          </Link>
          <Link href="/services/asset-assessment">
            {lang === "ar" ? "تقييم الأصل" : "Asset Assessment"}
          </Link>
          <Link href="/services/strategic-advisory">
            {lang === "ar" ? "الاستشارات" : "Advisory"}
          </Link>
          <Link href="/services/market-positioning">
            {lang === "ar" ? "التموضع السوقي" : "Positioning"}
          </Link>
        </nav>

        <div className="services-topbar__left">
          <Link href="/services/service-desk" className="services-btn services-btn--white-small">
            {lang === "ar" ? "مكتب الخدمات" : "Service Desk"}
          </Link>

          <LanguageSwitch />
          {/* استخدام LanguageSwitch الحالي وعدم إضافة زر لغة يدوي */}

          <button
            type="button"
            className="services-burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`services-sidepanel ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية للموبايل */}

        <div className="services-sidepanel__header">
          <strong>{lang === "ar" ? "القائمة" : "Menu"}</strong>

          <button
            type="button"
            className="services-sidepanel__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="services-sidepanel__nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link
            href="/services/explore"
            onClick={() => setMenuOpen(false)}
            className="is-active"
          >
            {lang === "ar" ? "استكشف الخدمات" : "Explore"}
          </Link>

          <Link href="/services/project-development" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "تطوير المشاريع" : "Project Development"}
          </Link>

          <Link href="/services/asset-assessment" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "تقييم الأصل" : "Asset Assessment"}
          </Link>

          <Link href="/services/strategic-advisory" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الاستشارات" : "Advisory"}
          </Link>

          <Link href="/services/market-positioning" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "التموضع السوقي" : "Positioning"}
          </Link>

          <Link href="/services/service-desk" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "مكتب الخدمات" : "Service Desk"}
          </Link>
        </nav>
      </aside>

      <section id="services-hero" className="services-hero">
        {/* القسم الافتتاحي */}

        <div className="services-container services-hero__inner">
          <div className="services-hero__content">
            <span className="services-kicker">
              {textByLang(lang, sections.hero.kicker_ar, sections.hero.kicker_en)}
            </span>

            <h1
              className="services-hero__title"
              dangerouslySetInnerHTML={{
                __html: textByLang(lang, sections.hero.title_ar, sections.hero.title_en),
              }}
            />

            <p className="services-hero__desc">
              {textByLang(lang, sections.hero.desc_ar, sections.hero.desc_en)}
            </p>

            <div className="services-hero__actions">
              <Link href={heroPrimaryHref} className="services-btn services-btn--white">
                {textByLang(lang, sections.hero.btn1_ar, sections.hero.btn1_en)}
              </Link>

              <Link
                href={heroSecondaryHref}
                className="services-btn services-btn--outline-white"
              >
                {textByLang(lang, sections.hero.btn2_ar, sections.hero.btn2_en)}
              </Link>
            </div>
          </div>

          <div className="services-hero__media">
            <div className="services-imageFrame services-imageFrame--hero">
              <ServicesImage
                src={sections.hero.image_url}
                alt={textByLang(lang, sections.hero.title_ar, sections.hero.title_en)}
                className="services-hero__image"
                fallback="ALZUHA"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services-grid" className="services-section services-section--white">
        {/* قسم قائمة الخدمات */}

        <div className="services-container">
          <header className="services-sectionHeader">
            <h2
              className="services-sectionTitle"
              dangerouslySetInnerHTML={{
                __html: textByLang(
                  lang,
                  sections.servicesSection.title_ar,
                  sections.servicesSection.title_en
                ),
              }}
            />

            <p className="services-sectionDesc">
              {textByLang(lang, sections.servicesSection.desc_ar, sections.servicesSection.desc_en)}
            </p>
          </header>

          <div className="services-grid">
            {servicesItems.map((item) => {
              const safeHref = normalizeInternalServiceHref(
                item.href,
                serviceFallbackHrefById[item.id] || "/services/explore"
              );

              return (
                <article key={item.id} className="services-card">
                  {(item.image_url || item.icon) && (
                    <div className="services-card__media">
                      {item.image_url ? (
                        <ServicesImage
                          src={item.image_url}
                          alt={textByLang(lang, item.title_ar, item.title_en)}
                          className="services-card__image"
                          fallback={item.icon || "ALZ"}
                        />
                      ) : (
                        <div className="services-card__icon">{item.icon}</div>
                      )}
                    </div>
                  )}

                  <div className="services-card__body">
                    <h3 className="services-card__title">
                      {textByLang(lang, item.title_ar, item.title_en)}
                    </h3>

                    <p className="services-card__desc">
                      {textByLang(lang, item.desc_ar, item.desc_en)}
                    </p>

                    <Link href={safeHref} className="services-card__link">
                      {textByLang(lang, item.cta_label_ar, item.cta_label_en)}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="services-impact" className="services-section services-section--gray">
        {/* قسم الأثر والتقييمات */}

        <div className="services-container">
          <header className="services-sectionHeader">
            <span className="services-kicker services-kicker--dark">
              {textByLang(
                lang,
                sections.testimonials.kicker_ar,
                sections.testimonials.kicker_en
              )}
            </span>

            <h2 className="services-sectionTitle">
              {textByLang(lang, sections.testimonials.title_ar, sections.testimonials.title_en)}
            </h2>

            <p className="services-sectionDesc">
              {textByLang(lang, sections.testimonials.desc_ar, sections.testimonials.desc_en)}
            </p>

            <div className="services-sectionHeader__cta">
              <Link href={testimonialsHref} className="services-btn services-btn--blue">
                {textByLang(lang, sections.testimonials.btn_ar, sections.testimonials.btn_en)}
              </Link>
            </div>
          </header>

          <div className="services-testimonialsGrid">
            {testimonialItems.map((item) => (
              <article key={item.id} className="services-testimonialCard">
                <p className="services-testimonialCard__text">
                  “{textByLang(lang, item.text_ar, item.text_en)}”
                </p>

                <div className="services-testimonialCard__author">
                  <div className="services-avatarFrame">
                    <ServicesImage
                      src={item.image_url}
                      alt={textByLang(lang, item.name_ar, item.name_en)}
                      className="services-avatar"
                      fallback={textByLang(lang, item.name_ar, item.name_en).slice(0, 1)}
                    />
                  </div>

                  <div className="services-testimonialCard__authorInfo">
                    <h4>{textByLang(lang, item.name_ar, item.name_en)}</h4>
                    <span>{textByLang(lang, item.role_ar, item.role_en)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services-gallery" className="services-gallerySection">
        {/* قسم المعرض */}

        <div className="services-container">
          <header className="services-sectionHeader services-sectionHeader--light">
            <h2 className="services-sectionTitle services-sectionTitle--light">
              {textByLang(lang, sections.gallery.title_ar, sections.gallery.title_en)}
            </h2>

            <p className="services-sectionDesc services-sectionDesc--light">
              {textByLang(lang, sections.gallery.desc_ar, sections.gallery.desc_en)}
            </p>
          </header>

          <div className="services-galleryGrid">
            {galleryItems.map((item) => (
              <div key={item.id} className="services-galleryCard">
                <ServicesImage
                  src={item.image_url}
                  alt={textByLang(lang, item.alt_ar, item.alt_en)}
                  className="services-galleryImage"
                  fallback={textByLang(lang, item.alt_ar, item.alt_en)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="service-desk" className="services-ctaSection">
        {/* قسم مكتب الخدمات */}

        <div className="services-container">
          <div className="services-ctaCard">
            <span className="services-kicker services-kicker--dark">
              {textByLang(lang, sections.cta.label_ar, sections.cta.label_en)}
            </span>

            <h2
              className="services-sectionTitle"
              dangerouslySetInnerHTML={{
                __html: textByLang(lang, sections.cta.title_ar, sections.cta.title_en),
              }}
            />

            <p className="services-sectionDesc">
              {textByLang(lang, sections.cta.desc_ar, sections.cta.desc_en)}
            </p>

            <div className="services-ctaCard__actions">
              <Link href={ctaHref} className="services-btn services-btn--blue">
                {textByLang(lang, sections.cta.button_ar, sections.cta.button_en)}
              </Link>

              <Link href="/services/explore" className="services-btn services-btn--outline-dark">
                {lang === "ar" ? "استعراض المسارات" : "Browse Service Paths"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="services-footer">
        {/* الفوتر */}

        <div className="services-container services-footer__inner">
          <a className="services-footer__email" href={`mailto:${sections.footer.email}`}>
            {sections.footer.email}
          </a>

          <div className="services-footer__socials">
            <a href={sections.footer.social1_href}>
              {textByLang(lang, sections.footer.social1_ar, sections.footer.social1_en)}
            </a>
            <a href={sections.footer.social2_href}>
              {textByLang(lang, sections.footer.social2_ar, sections.footer.social2_en)}
            </a>
            <a href={sections.footer.social3_href}>
              {textByLang(lang, sections.footer.social3_ar, sections.footer.social3_en)}
            </a>
          </div>

          <div className="services-footer__bottom">
            <span>{textByLang(lang, sections.footer.copy_ar, sections.footer.copy_en)}</span>

            <a href={sections.footer.privacy_href}>
              {textByLang(lang, sections.footer.privacy_ar, sections.footer.privacy_en)}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}