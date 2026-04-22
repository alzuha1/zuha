"use client";
// هذا المكوّن يعمل على جهة المتصفح لأنه يحتوي على useState و useEffect

import Link from "next/link";
// للتنقل الداخلي داخل مشروع Next.js

import { useEffect, useMemo, useState } from "react";
// useState للحالات الداخلية
// useEffect للتأثيرات الجانبية مثل السلايدر والقائمة
// useMemo للقيم المشتقة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// مبدّل اللغة الموجود أصلًا في المشروع

export type Lang = "ar" | "en";
// تصدير نوع اللغة حتى يمكن إعادة استخدامه في about/page.tsx بدل تكراره

export type AboutPageRecord = {
  slug: string;
  // معرف الصفحة

  title_ar: string;
  // عنوان الصفحة بالعربية

  title_en: string;
  // عنوان الصفحة بالإنجليزية

  content_ar: string;
  // وصف عام بالعربية

  content_en: string;
  // وصف عام بالإنجليزية

  hero_image_url?: string | null;
  // صورة رئيسية اختيارية

  is_published: boolean;
  // هل الصفحة منشورة أم لا

  page_type?: string | null;
  // مهم جدًا:
  // هنا دعمنا null صراحةً حتى يتطابق النوع مع about/page.tsx
  // وحتى لا يظهر خطأ build الخاص بعدم التوافق

  meta_json?: Record<string, unknown> | null;
  // بيانات إضافية اختيارية

  sections_json?: Record<string, unknown> | null;
  // الأقسام الديناميكية للصفحة
};
// شكل سجل صفحة About القادم من السيرفر

type SlideItem = {
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  desc_ar?: string;
  desc_en?: string;
};
// عنصر شريحة واحدة داخل الهيرو

type ServiceItem = {
  label?: string;
  title_ar?: string;
  title_en?: string;
  text_ar?: string;
  text_en?: string;
  btn_ar?: string;
  btn_en?: string;
  href?: string;
  image_url?: string;
};
// عنصر خدمة واحدة

type StatItem = {
  num?: string;
  title_ar?: string;
  title_en?: string;
  desc_ar?: string;
  desc_en?: string;
};
// عنصر إحصائية واحدة

type TeamMember = {
  name_ar?: string;
  name_en?: string;
  role_ar?: string;
  role_en?: string;
  image_url?: string;
};
// عضو فريق

type SocialItem = {
  label?: string;
  href?: string;
};
// عنصر اجتماعي

function textByLang(
  lang: Lang,
  ar?: string | null,
  en?: string | null,
  fallback = ""
) {
  // إرجاع النص المناسب حسب اللغة
  if (lang === "ar") return ar || en || fallback;
  return en || ar || fallback;
}

function asObject(value: unknown): Record<string, unknown> {
  // تحويل القيمة إلى object آمن بدل كسر الواجهة
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asArray<T>(value: unknown): T[] {
  // تحويل القيمة إلى array آمن
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeAboutAssetPath(src?: string | null): string {
  // هذه الدالة توحّد مسارات صور صفحة About بشكل آمن
  if (!src) return "";

  const clean = src.trim();

  if (!clean) return "";

  // لو الرابط خارجي كامل نتركه كما هو
  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  // لو المسار صحيح أصلًا
  if (clean.startsWith("/pages/about/img/")) {
    return clean;
  }

  // لو ينقصه فقط slash في البداية
  if (clean.startsWith("pages/about/img/")) {
    return `/${clean}`;
  }

  // لو جاء بصيغة /about/... نحوله إلى /pages/about/...
  if (clean.startsWith("/about/")) {
    return `/pages${clean}`;
  }

  // لو جاء بصيغة about/... نحوله إلى /pages/about/...
  if (clean.startsWith("about/")) {
    return `/pages/${clean}`;
  }

  // لو جاء بصيغة /img/... نربطه بمجلد صور about
  if (clean.startsWith("/img/")) {
    return `/pages/about${clean}`;
  }

  // لو جاء بصيغة img/... نربطه بمجلد صور about
  if (clean.startsWith("img/")) {
    return `/pages/about/${clean}`;
  }

  // أي مسار يبدأ بـ / نتركه كما هو
  if (clean.startsWith("/")) {
    return clean;
  }

  // إذا كان فقط اسم ملف نضعه داخل مجلد صور about
  return `/pages/about/img/${clean}`;
}

function ImageOrPlaceholder({
  src,
  alt,
  className,
  fallbackText,
}: {
  src?: string;
  alt: string;
  className: string;
  fallbackText: string;
}) {
  // هذا المكوّن يعرض الصورة إذا كان المسار صالحًا
  // أو يعرض بلوك بديل إذا لم توجد صورة

  const finalSrc = normalizeAboutAssetPath(src);

  if (!finalSrc) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eeeeee",
          color: "#666666",
          fontWeight: 700,
          minHeight: "220px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {fallbackText}
      </div>
    );
  }

  return <img className={className} src={finalSrc} alt={alt} />;
}

export default function AboutInstitutional({
  page,
  lang,
}: {
  page: AboutPageRecord;
  lang: Lang;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // حالة القائمة الجانبية للموبايل

  const sections = asObject(page.sections_json);
  // تحويل sections_json إلى object آمن

  const hero = asObject(sections.hero);
  const vision = asObject(sections.vision);
  const services = asObject(sections.services);
  const stats = asObject(sections.stats);
  const team = asObject(sections.team);
  const footer = asObject(sections.footer);
  // استخراج الأقسام الرئيسية

  const slides = asArray<SlideItem>(hero.slides);
  const serviceItems = asArray<ServiceItem>(services.items);
  const statItems = asArray<StatItem>(stats.items);
  const teamMembers = asArray<TeamMember>(team.members);
  const socialItems = asArray<SocialItem>(footer.social);
  // استخراج عناصر كل قسم بشكل آمن

  const [activeSlide, setActiveSlide] = useState(0);
  // الشريحة الحالية

  const totalSlides = slides.length;
  // عدد الشرائح

  const consultationHref = "/request-consultation";
  // رابط طلب الاستشارة

  const contactHref = "/contact";
  // رابط صفحة التواصل

  useEffect(() => {
    // تشغيل السلايدر تلقائيًا إذا كان لدينا أكثر من شريحة
    if (totalSlides <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    // إغلاق القائمة بزر Escape
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    // منع تمرير الخلفية عند فتح القائمة
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const prevIndex = useMemo(() => {
    // حساب الشريحة السابقة حتى تظهر خلف الشريحة النشطة
    if (totalSlides === 0) return -1;
    return (activeSlide - 1 + totalSlides) % totalSlides;
  }, [activeSlide, totalSlides]);

  const pageTitle = textByLang(
    lang,
    page.title_ar,
    page.title_en,
    lang === "ar" ? "من نحن" : "About Us"
  );

  const pageSummary = textByLang(
    lang,
    page.content_ar,
    page.content_en,
    lang === "ar" ? "صفحة تعريفية مؤسسية." : "Institutional about page."
  );

  const heroHint = textByLang(
    lang,
    hero.hint_ar as string,
    hero.hint_en as string,
    "Approach"
  );

  const visionKicker = textByLang(
    lang,
    vision.kicker_ar as string,
    vision.kicker_en as string,
    "ALZUHA Vision"
  );

  const visionTitle = textByLang(
    lang,
    vision.title_ar as string,
    vision.title_en as string,
    pageTitle
  );

  const visionDesc = textByLang(
    lang,
    vision.desc_ar as string,
    vision.desc_en as string,
    pageSummary
  );

  const servicesTitle = textByLang(
    lang,
    services.title_ar as string,
    services.title_en as string,
    "Services"
  );

  const servicesDesc = textByLang(
    lang,
    services.desc_ar as string,
    services.desc_en as string,
    ""
  );

  const statsTitle = textByLang(
    lang,
    stats.title_ar as string,
    stats.title_en as string,
    "Statistics"
  );

  const teamKicker = textByLang(
    lang,
    team.kicker_ar as string,
    team.kicker_en as string,
    "Our Team"
  );

  const teamTitle = textByLang(
    lang,
    team.title_ar as string,
    team.title_en as string,
    "Experts in real estate & investment"
  );

  const teamDesc = textByLang(
    lang,
    team.desc_ar as string,
    team.desc_en as string,
    ""
  );

  const teamCta = textByLang(
    lang,
    team.cta_ar as string,
    team.cta_en as string,
    "Request Consultation"
  );

  const footerEmail = (footer.email as string) || "info@zuha.us";

  const footerLocation = textByLang(
    lang,
    footer.location_ar as string,
    footer.location_en as string,
    lang === "ar" ? "العراق، النجف" : "Iraq, Najaf"
  );

  const footerBrand = (footer.brand as string) || "ALZUHA";

  const footerCopy = textByLang(
    lang,
    footer.copy_ar as string,
    footer.copy_en as string,
    "All rights reserved © ALZUHA 2025"
  );

  const footerPolicy = textByLang(
    lang,
    footer.policy_ar as string,
    footer.policy_en as string,
    lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"
  );

  function goPrevSlide() {
    // الانتقال إلى الشريحة السابقة
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }

  function goNextSlide() {
    // الانتقال إلى الشريحة التالية
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* بداية الصفحة مع ضبط الاتجاه حسب اللغة */}

      <header className="topbar">
        {/* الشريط العلوي */}

        <div className="topbar__right">
          <Link href="/" className="topbar__logo-link" aria-label="Go to home page">
            <div className="topbar__logo-icon">⌂</div>
          </Link>

          <div className="topbar__logo-text">
            <strong>ALZUHA</strong>
            <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
          </div>
        </div>

        <div className="topbar__left">
          <Link href={consultationHref} className="topbar__btn">
            {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
          </Link>

          <LanguageSwitch />

          <button
            type="button"
            className="topbar__menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`side-menu ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية */}

        <div className="side-menu__header">
          <strong>{lang === "ar" ? "القائمة" : "Menu"}</strong>

          <button
            type="button"
            className="side-menu__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="side-menu__nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <Link href="/about" className="active" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "من نحن" : "About"}
          </Link>

          <Link href="/services" onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "الخدمات" : "Services"}
          </Link>

          <Link href={contactHref} onClick={() => setMenuOpen(false)}>
            {lang === "ar" ? "تواصل" : "Contact"}
          </Link>
        </nav>

        <Link
          href={consultationHref}
          className="side-menu__btn"
          onClick={() => setMenuOpen(false)}
        >
          {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
        </Link>
      </aside>

      <section className="about-stack">
        {/* قسم السلايدر الرئيسي */}

        <div className="about-stack__sticky">
          {/* الجزء الثابت بصريًا أثناء التمرير */}

          <div className="about-stack__frame">
            {/* الإطار الخارجي للسلايدر */}

            <div className="about-stack__slides">
              {/* حاوية الشرائح */}

              {slides.length === 0 ? (
                <article className="about-slide is-active">
                  <div
                    className="about-slide__img"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#eeeeee",
                      color: "#666666",
                      fontWeight: 700,
                    }}
                  >
                    {lang === "ar" ? "لا توجد شرائح" : "No slides"}
                  </div>
                </article>
              ) : (
                slides.map((slide, index) => {
                  const isActive = index === activeSlide;
                  const isPrev = index === prevIndex;

                  let stateClass = "about-slide is-hidden-top";

                  if (isActive) stateClass = "about-slide is-active";
                  else if (isPrev) stateClass = "about-slide is-prev";

                  return (
                    <article key={index} className={stateClass}>
                      <ImageOrPlaceholder
                        className="about-slide__img"
                        src={slide.image_url}
                        alt={textByLang(
                          lang,
                          slide.title_ar,
                          slide.title_en,
                          `About slide ${index + 1}`
                        )}
                        fallbackText={
                          lang === "ar" ? "الصورة غير موجودة" : "Image not found"
                        }
                      />
                    </article>
                  );
                })
              )}
            </div>

            {totalSlides > 1 ? (
              <div className="about-stack__controls" aria-label="Slider controls">
                {/* أزرار التنقل اليدوي بالسلايدر على جانبي الصورة */}

                <button
                  type="button"
                  className="about-stack__arrow about-stack__arrow--prev"
                  onClick={goPrevSlide}
                  aria-label={lang === "ar" ? "الشريحة السابقة" : "Previous slide"}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="about-stack__arrow about-stack__arrow--next"
                  onClick={goNextSlide}
                  aria-label={lang === "ar" ? "الشريحة التالية" : "Next slide"}
                >
                  ›
                </button>
              </div>
            ) : null}

            <div className="about-stack__hint">{heroHint}</div>
            {/* النص الصغير أسفل الإطار */}
          </div>
        </div>
      </section>

      <section className="about-vision">
        <div className="about-vision__content">
          <span className="about-vision__kicker">{visionKicker}</span>
          <h1 className="about-vision__title">{visionTitle}</h1>
          <p className="about-vision__desc">{visionDesc}</p>
        </div>
      </section>

      <section className="about-services">
        <div className="about-services__header">
          <h2 className="about-services__title">{servicesTitle}</h2>
          <p className="about-services__desc">{servicesDesc}</p>
        </div>

        <div className="about-services__cards">
          {serviceItems.map((item, index) => (
            <article key={index} className="service-card">
              <div className="service-card__image-wrapper">
                <ImageOrPlaceholder
                  className="service-card__img"
                  src={item.image_url}
                  alt={textByLang(
                    lang,
                    item.title_ar,
                    item.title_en,
                    `Service ${index + 1}`
                  )}
                  fallbackText={lang === "ar" ? "لا توجد صورة" : "No image"}
                />
              </div>

              <div className="service-card__content">
                <span className="service-card__label">{item.label || ""}</span>

                <h3 className="service-card__title">
                  {textByLang(lang, item.title_ar, item.title_en, "")}
                </h3>

                <p className="service-card__text">
                  {textByLang(lang, item.text_ar, item.text_en, "")}
                </p>

                <Link
                  href={item.href || contactHref}
                  className="service-card__btn"
                >
                  {textByLang(
                    lang,
                    item.btn_ar,
                    item.btn_en,
                    lang === "ar" ? "اطلب استشارة" : "Learn More"
                  )}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-stats">
        <h2 className="about-stats__main-title">{statsTitle}</h2>

        <div className="about-stats__grid">
          {statItems.map((item, index) => (
            <article key={index} className="stat-card">
              <div className="stat-card__number">{item.num || ""}</div>

              <h3 className="stat-card__title">
                {textByLang(lang, item.title_ar, item.title_en, "")}
              </h3>

              <p className="stat-card__desc">
                {textByLang(lang, item.desc_ar, item.desc_en, "")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-team">
        <div className="about-team__header">
          <span className="about-team__kicker">{teamKicker}</span>
          <h2 className="about-team__title">{teamTitle}</h2>
          <p className="about-team__desc">{teamDesc}</p>

          <Link href={consultationHref} className="about-team__btn">
            {teamCta}
          </Link>
        </div>

        <div className="about-team__grid">
          {teamMembers.map((member, index) => (
            <article key={index} className="team-card">
              <ImageOrPlaceholder
                className="team-card__img"
                src={member.image_url}
                alt={textByLang(
                  lang,
                  member.name_ar,
                  member.name_en,
                  `Team member ${index + 1}`
                )}
                fallbackText={lang === "ar" ? "لا توجد صورة" : "No image"}
              />

              <h3 className="team-card__name">
                {textByLang(lang, member.name_ar, member.name_en, "")}
              </h3>

              <p className="team-card__role">
                {textByLang(lang, member.role_ar, member.role_en, "")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-logoCard">
        <div className="about-logoCard__inner">
          <div className="about-logoCard__logo">
            {footerBrand}
            <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="about-footer__contact">
          <a href={`mailto:${footerEmail}`}>{footerEmail}</a>
          <br />
          <a href="#">{footerLocation}</a>
        </div>

        <div className="about-footer__social">
          {socialItems.map((item, index) => (
            <a key={index} href={item.href || "#"}>
              {item.label || ""}
            </a>
          ))}
        </div>

        <div className="about-footer__brand">
          <div className="about-footer__icon">⌂</div>
          <div className="about-footer__brand-text">{footerBrand}</div>
        </div>

        <div className="about-footer__bottom">
          <span>{footerCopy}</span>
          <a href="#" className="about-footer__policy">
            {footerPolicy}
          </a>
        </div>
      </footer>
    </main>
  );
}