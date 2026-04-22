"use client";
// هذا الملف عميل لأنه يحتوي على state والتفاعل مع القائمة والصور

import Link from "next/link";
// روابط التنقل الداخلية

import { useMemo, useState } from "react";
// useState للحالات المحلية
// useMemo لحساب المسارات المرتبطة دون إعادة حساب غير لازمة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// استخدام مبدّل اللغة الحالي في المشروع

export type Lang = "ar" | "en";
// اللغات المدعومة

export type ServiceNavItem = {
  slug: string;
  label_ar: string;
  label_en: string;
  href: string;
  is_active: boolean;
};
// نوع عناصر التنقل بين المسارات الخدمية

export type FooterBlock = {
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
// نوع بيانات الفوتر

export type ServiceDetailItem = {
  id: string;
  slug: string;
  is_active: boolean;
  sort_order: number;

  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    image_url: string;
  };

  overview: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  };

  capabilities: Array<{
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  }>;

  gallery: Array<{
    image_url: string;
    alt_ar: string;
    alt_en: string;
  }>;

  cta: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    btn_ar: string;
    btn_en: string;
    btn_href: string;
  };
};
// نوع بيانات صفحة الخدمة الفرعية

function textByLang(lang: Lang, ar: string, en: string) {
  // اختيار النص المناسب حسب اللغة الحالية
  return lang === "ar" ? ar : en;
}

function normalizeAssetPath(src?: string | null): string {
  // توحيد مسار الصور سواء كانت محلية من Next أو روابط عامة
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

function normalizeInternalServiceHref(value: string | undefined, fallback: string) {
  // السماح فقط بالرئيسية "/" أو مسارات /services/...
  // لمنع ربط صفحات الخدمات الداخلية بصفحات أخرى لا نريدها هنا
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

  if (clean === "/services" || clean.startsWith("/services/")) {
    return clean;
  }

  if (clean.startsWith("#")) {
    return clean;
  }

  return fallback;
}

function ServiceImage({
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
  // مكوّن صورة يدعم fade-in وfallback بصري
  const [loaded, setLoaded] = useState(false);

  const finalSrc = normalizeAssetPath(src);

  if (!finalSrc) {
    return <div className={`${className} service-detail-imageFallback`}>{fallback}</div>;
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${className} service-detail-dynamicImage ${loaded ? "is-loaded" : ""}`}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(false)}
    />
  );
}

export default function ServiceDetailClient({
  lang,
  dir,
  currentItem,
  navItems,
  footer,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  currentItem: ServiceDetailItem;
  navItems: ServiceNavItem[];
  footer: FooterBlock;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // حالة فتح وإغلاق القائمة الجانبية

  const currentHref = `/services/${currentItem.slug}`;
  // الرابط الحالي للصفحة المفتوحة

  const deskHref = "/services/service-desk";
  // رابط مكتب الخدمات

  const exploreHref = "/services/explore";
  // رابط استكشاف الخدمات

  const sanitizedCtaHref = normalizeInternalServiceHref(
    currentItem.cta.btn_href,
    deskHref
  );
  // حماية زر CTA النهائي من أي روابط خارج منظومة الخدمات

  const desktopNavItems = useMemo(
    () => navItems.filter((item) => item.slug !== "service-desk"),
    [navItems]
  );
  // نُبقي service-desk كزر مستقل لا كعنصر ضمن شريط الروابط الرئيسي

  const relatedItems = useMemo(
    () =>
      navItems
        .filter(
          (item) =>
            item.slug !== currentItem.slug &&
            item.slug !== "explore" &&
            item.slug !== "service-desk"
        )
        .slice(0, 3),
    [navItems, currentItem.slug]
  );
  // مسارات مرتبطة نقترحها أسفل الصفحة لزيادة الترابط الداخلي

  return (
    <main dir={dir} className="service-detail-page">
      {/* الغلاف العام للصفحة */}

      <header className="service-detail-topbar">
        {/* الشريط العلوي */}
        {/* لا يوجد هنا زر Admin كما طلبت */}

        <div className="service-detail-topbar__right">
          <Link href="/" className="service-detail-brand" aria-label="Go to home page">
            <div className="service-detail-brand__mark">⌂</div>

            <div className="service-detail-brand__text">
              <strong>ALZUHA</strong>
              <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
            </div>
          </Link>
        </div>

        <nav className="service-detail-topbar__nav" aria-label="Services navigation">
          <Link href="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>

          {desktopNavItems.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={item.href === currentHref ? "is-active" : ""}
            >
              {textByLang(lang, item.label_ar, item.label_en)}
            </Link>
          ))}
        </nav>

        <div className="service-detail-topbar__left">
          <Link href={deskHref} className="service-detail-btn service-detail-btn--white-small">
            {lang === "ar" ? "مكتب الخدمات" : "Service Desk"}
          </Link>

          <LanguageSwitch />
          {/* استخدام مبدّل اللغة الحالي بالمشروع */}

          <button
            type="button"
            className="service-detail-burger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`service-detail-sidepanel ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية للموبايل */}

        <div className="service-detail-sidepanel__header">
          <strong>{lang === "ar" ? "القائمة" : "Menu"}</strong>

          <button
            type="button"
            className="service-detail-sidepanel__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="service-detail-sidepanel__nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link
            href={exploreHref}
            onClick={() => setMenuOpen(false)}
            className={currentItem.slug === "explore" ? "is-active" : ""}
          >
            {lang === "ar" ? "استكشف الخدمات" : "Explore"}
          </Link>

          {navItems
            .filter((item) => item.slug !== "explore")
            .map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={item.href === currentHref ? "is-active" : ""}
              >
                {textByLang(lang, item.label_ar, item.label_en)}
              </Link>
            ))}
        </nav>
      </aside>

      <section className="service-detail-hero">
        {/* القسم الافتتاحي الخاص بالخدمة */}

        <div className="service-detail-container">
          <div className="service-detail-breadcrumb">
            <Link href="/">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
            <span>/</span>
            <Link href="/services/explore">
              {lang === "ar" ? "الخدمات" : "Services"}
            </Link>
            <span>/</span>
            <span>
              {textByLang(lang, currentItem.hero.title_ar, currentItem.hero.title_en)}
            </span>
          </div>

          <div className="service-detail-hero__grid">
            <div className="service-detail-hero__content">
              <span className="service-detail-kicker">
                {textByLang(lang, currentItem.hero.kicker_ar, currentItem.hero.kicker_en)}
              </span>

              <h1 className="service-detail-hero__title">
                {textByLang(lang, currentItem.hero.title_ar, currentItem.hero.title_en)}
              </h1>

              <p className="service-detail-hero__desc">
                {textByLang(lang, currentItem.hero.desc_ar, currentItem.hero.desc_en)}
              </p>

              <div className="service-detail-hero__actions">
                <Link
                  href={sanitizedCtaHref}
                  className="service-detail-btn service-detail-btn--white"
                >
                  {textByLang(lang, currentItem.cta.btn_ar, currentItem.cta.btn_en)}
                </Link>

                <Link
                  href={exploreHref}
                  className="service-detail-btn service-detail-btn--outline-white"
                >
                  {lang === "ar" ? "كل الخدمات" : "All Services"}
                </Link>
              </div>
            </div>

            <div className="service-detail-hero__media">
              <div className="service-detail-imageFrame service-detail-imageFrame--hero">
                <ServiceImage
                  src={currentItem.hero.image_url}
                  alt={textByLang(lang, currentItem.hero.title_ar, currentItem.hero.title_en)}
                  className="service-detail-hero__image"
                  fallback="ALZUHA"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-detail-section service-detail-section--white">
        {/* نظرة عامة على الخدمة */}

        <div className="service-detail-container service-detail-overview">
          <div className="service-detail-overview__left">
            <span className="service-detail-sectionLabel">
              {lang === "ar" ? "نظرة عامة" : "Overview"}
            </span>

            <h2 className="service-detail-sectionTitle">
              {textByLang(lang, currentItem.overview.title_ar, currentItem.overview.title_en)}
            </h2>
          </div>

          <div className="service-detail-overview__right">
            <p className="service-detail-sectionDesc">
              {textByLang(lang, currentItem.overview.desc_ar, currentItem.overview.desc_en)}
            </p>
          </div>
        </div>
      </section>

      <section className="service-detail-section service-detail-section--gray">
        {/* القدرات / ما الذي تتضمنه الخدمة */}

        <div className="service-detail-container">
          <div className="service-detail-sectionHeader">
            <span className="service-detail-sectionLabel">
              {lang === "ar" ? "ما الذي تتضمنه الخدمة" : "What This Service Includes"}
            </span>

            <h2 className="service-detail-sectionTitle">
              {lang === "ar" ? "قدرات ومسارات تنفيذية" : "Capabilities & Delivery Tracks"}
            </h2>
          </div>

          <div className="service-detail-capabilitiesGrid">
            {currentItem.capabilities.map((item, index) => (
              <article key={index} className="service-detail-capabilityCard">
                <div className="service-detail-capabilityCard__index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="service-detail-capabilityCard__title">
                  {textByLang(lang, item.title_ar, item.title_en)}
                </h3>

                <p className="service-detail-capabilityCard__desc">
                  {textByLang(lang, item.desc_ar, item.desc_en)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-detail-gallerySection">
        {/* معرض خاص بهذه الخدمة */}

        <div className="service-detail-container">
          <div className="service-detail-sectionHeader service-detail-sectionHeader--light">
            <span className="service-detail-sectionLabel service-detail-sectionLabel--light">
              {lang === "ar" ? "صور مختارة" : "Selected Visuals"}
            </span>

            <h2 className="service-detail-sectionTitle service-detail-sectionTitle--light">
              {lang === "ar" ? "بيئات ومخرجات مرتبطة بالخدمة" : "Environments & Outputs Related to the Service"}
            </h2>
          </div>

          <div className="service-detail-galleryGrid">
            {currentItem.gallery.map((image, index) => (
              <div key={index} className="service-detail-galleryCard">
                <ServiceImage
                  src={image.image_url}
                  alt={textByLang(lang, image.alt_ar, image.alt_en)}
                  className="service-detail-galleryImage"
                  fallback={textByLang(lang, image.alt_ar, image.alt_en)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedItems.length > 0 ? (
        <section className="service-detail-section service-detail-section--white">
          {/* مسارات مرتبطة لزيادة التماسك الداخلي */}

          <div className="service-detail-container">
            <div className="service-detail-sectionHeader">
              <span className="service-detail-sectionLabel">
                {lang === "ar" ? "مسارات ذات صلة" : "Related Paths"}
              </span>

              <h2 className="service-detail-sectionTitle">
                {lang === "ar" ? "قد ترغب أيضًا في استكشاف" : "You May Also Want to Explore"}
              </h2>
            </div>

            <div className="service-detail-relatedGrid">
              {relatedItems.map((item) => (
                <Link key={item.slug} href={item.href} className="service-detail-relatedCard">
                  <h3>{textByLang(lang, item.label_ar, item.label_en)}</h3>
                  <span>{lang === "ar" ? "افتح المسار" : "Open Path"}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="service-detail-section service-detail-section--white">
        {/* CTA النهائي للخدمة */}

        <div className="service-detail-container">
          <div className="service-detail-ctaCard">
            <span className="service-detail-sectionLabel">
              {lang === "ar" ? "الخطوة التالية" : "Next Step"}
            </span>

            <h2 className="service-detail-sectionTitle">
              {textByLang(lang, currentItem.cta.title_ar, currentItem.cta.title_en)}
            </h2>

            <p className="service-detail-sectionDesc">
              {textByLang(lang, currentItem.cta.desc_ar, currentItem.cta.desc_en)}
            </p>

            <div className="service-detail-ctaCard__actions">
              <Link
                href={sanitizedCtaHref}
                className="service-detail-btn service-detail-btn--blue"
              >
                {textByLang(lang, currentItem.cta.btn_ar, currentItem.cta.btn_en)}
              </Link>

              <Link
                href={exploreHref}
                className="service-detail-btn service-detail-btn--outline-dark"
              >
                {lang === "ar" ? "استعراض كل الخدمات" : "Browse All Services"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="service-detail-footer">
        {/* الفوتر */}

        <div className="service-detail-container service-detail-footer__inner">
          <a className="service-detail-footer__email" href={`mailto:${footer.email}`}>
            {footer.email}
          </a>

          <div className="service-detail-footer__socials">
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

          <div className="service-detail-footer__bottom">
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