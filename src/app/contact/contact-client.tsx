"use client";
// هذا الملف Client Component لأنه يحتوي على حالات محلية وتفاعل مباشر مع المستخدم

import Link from "next/link";
// Link للتنقل الداخلي داخل Next.js بدون إعادة تحميل الصفحة كاملة

import { useEffect, useMemo, useState } from "react";
// useState لإدارة الحالات المحلية
// useEffect للتعامل مع تأثيرات جانبية مثل إغلاق القائمة ومنع scroll
// useMemo لتجهيز القيم المشتقة بشكل أنظف وأهدأ

import LanguageSwitch from "@/components/site/LanguageSwitch";
// مبدّل اللغة الموجود أصلًا في المشروع

export type Lang = "ar" | "en";
// اللغتان المدعومتان في الصفحة

type ContactCardItem = {
  icon: string;
  label_ar: string;
  label_en: string;
  value_ar: string;
  value_en: string;
  href: string;
};
// بطاقة من بطاقات التواصل الرئيسية: هاتف / إيميل / واتساب / موقع

type OfficeItem = {
  name_ar: string;
  name_en: string;
  address_ar: string;
  address_en: string;
  phone: string;
  email: string;
  map_url: string;
};
// بطاقة مكتب أو فرع

type SocialItem = {
  label_ar: string;
  label_en: string;
  href: string;
};
// عنصر من عناصر الشبكات الاجتماعية

export type ContactSections = {
  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    image_url: string;
  };

  contact_cards: {
    title_ar: string;
    title_en: string;
    items: ContactCardItem[];
  };

  offices: {
    title_ar: string;
    title_en: string;
    items: OfficeItem[];
  };

  form: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;

    name_label_ar: string;
    name_label_en: string;
    name_placeholder_ar: string;
    name_placeholder_en: string;

    phone_label_ar: string;
    phone_label_en: string;
    phone_placeholder_ar: string;
    phone_placeholder_en: string;

    email_label_ar: string;
    email_label_en: string;
    email_placeholder_ar: string;
    email_placeholder_en: string;

    message_label_ar: string;
    message_label_en: string;
    message_placeholder_ar: string;
    message_placeholder_en: string;

    submit_ar: string;
    submit_en: string;

    success_ar: string;
    success_en: string;

    error_ar: string;
    error_en: string;
  };

  social: {
    title_ar: string;
    title_en: string;
    items: SocialItem[];
  };

  footer: {
    email: string;
    copy_ar: string;
    copy_en: string;
    privacy_label_ar: string;
    privacy_label_en: string;
    privacy_href: string;
  };
};
// هذا النوع يطابق sections_json القادم من السيرفر

export type ContactCopy = {
  nav: {
    home: string;
    about: string;
    portfolio: string;
    services: string;
    contact: string;
    cta: string;
    menuTitle: string;
  };
  socialTitle: string;
};
// النصوص العامة القادمة من page.tsx

type ContactFormState = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};
// حالة نموذج التواصل

function textByLang(
  lang: Lang,
  ar?: string | null,
  en?: string | null,
  fallback = ""
) {
  // اختيار النص المناسب بحسب اللغة الحالية
  if (lang === "ar") return ar || en || fallback;
  return en || ar || fallback;
}

function normalizeContactImagePath(src?: string | null): string {
  // توحيد مسار الصورة القادمة من القاعدة أو fallback
  // حتى لو جاءت بصيغ مختلفة مثل:
  // img (1).jpg
  // /pages/contact/img/img (1).jpg
  // pages/contact/img/img (1).jpg
  if (!src) return "";

  const clean = src.trim();

  if (!clean) return "";

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  if (clean.startsWith("/pages/contact/img/")) {
    return encodeURI(clean);
  }

  if (clean.startsWith("pages/contact/img/")) {
    return encodeURI(`/${clean}`);
  }

  if (clean.startsWith("/")) {
    return encodeURI(clean);
  }

  return encodeURI(`/pages/contact/img/${clean}`);
}

function normalizePhoneHref(phone?: string | null) {
  // تنظيف رقم الهاتف لاستخدامه داخل tel:
  const clean = String(phone || "").replace(/[^\d+]/g, "");
  return clean ? `tel:${clean}` : "#";
}

function normalizeEmailHref(email?: string | null) {
  // تجهيز رابط mailto صالح
  const clean = String(email || "").trim();
  return clean ? `mailto:${clean}` : "#";
}

function normalizeCardHref(href?: string | null) {
  // فلترة أولية للروابط القادمة من القاعدة
  const clean = String(href || "").trim();

  if (!clean) return "#";

  if (
    clean.startsWith("/") ||
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:")
  ) {
    return clean;
  }

  return "#";
}

function isExternalHref(href: string) {
  // تحديد هل الرابط خارجي ليُفتح في نافذة جديدة
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ContactClient({
  lang,
  dir,
  copy,
  sections,
}: {
  lang: Lang;
  dir: "rtl" | "ltr";
  copy: ContactCopy;
  sections: ContactSections;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // حالة فتح وإغلاق القائمة الجانبية للموبايل

  const [submitting, setSubmitting] = useState(false);
  // حالة إرسال النموذج

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // رسالة النجاح أو الخطأ بعد الإرسال

  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  // بيانات نموذج التواصل

  const heroTitle = useMemo(
    () =>
      textByLang(
        lang,
        sections.hero.title_ar,
        sections.hero.title_en,
        "Contact"
      ),
    [lang, sections.hero.title_ar, sections.hero.title_en]
  );
  // عنوان Hero بحسب اللغة الحالية

  const heroDesc = useMemo(
    () => textByLang(lang, sections.hero.desc_ar, sections.hero.desc_en, ""),
    [lang, sections.hero.desc_ar, sections.hero.desc_en]
  );
  // وصف Hero

  const heroKicker = useMemo(
    () => textByLang(lang, sections.hero.kicker_ar, sections.hero.kicker_en, ""),
    [lang, sections.hero.kicker_ar, sections.hero.kicker_en]
  );
  // النص الصغير أعلى العنوان

  const normalizedHeroImage = useMemo(
    () => normalizeContactImagePath(sections.hero.image_url),
    [sections.hero.image_url]
  );
  // تطبيع مسار الصورة القادمة من DB

  const fallbackHeroImage = "/pages/contact/img/img%20(1).jpg";
  // صورة احتياطية مضمونة من مجلد public

  const [currentHeroSrc, setCurrentHeroSrc] = useState<string>(
    normalizedHeroImage || fallbackHeroImage
  );
  // الصورة الحالية التي سنعرضها فعلًا داخل <img>

  const [heroBroken, setHeroBroken] = useState(false);
  // إذا فشلت الصورة الأصلية والفallback أيضًا

  useEffect(() => {
    // عند تغير الصورة من القاعدة نعيد ضبط حالة العرض
    setCurrentHeroSrc(normalizedHeroImage || fallbackHeroImage);
    setHeroBroken(false);
  }, [normalizedHeroImage]);

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
    // منع scroll للخلفية عند فتح قائمة الموبايل
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // إرسال نموذج التواصل إلى API
    event.preventDefault();

    setNotice(null);

    try {
      setSubmitting(true);

      const response = await fetch("/api/contact-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      // إرسال الحقول بعد تنظيف الفراغات الزائدة

      const payload = await response.json().catch(() => ({}));
      // حتى لو الرد لم يكن JSON مثاليًا لا ينهار الكود

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Request failed");
      }

      setNotice({
        type: "success",
        text: textByLang(lang, sections.form.success_ar, sections.form.success_en),
      });
      // إشعار نجاح حسب اللغة

      setForm({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });
      // تفريغ الحقول بعد النجاح
    } catch (error) {
      console.error("Contact message failed:", error);

      setNotice({
        type: "error",
        text: textByLang(lang, sections.form.error_ar, sections.form.error_en),
      });
      // إشعار الخطأ
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir={dir} className="contact-page">
      {/* الغلاف العام للصفحة */}

      <header className="contact-topbar">
        {/* الهيدر الرئيسي */}

        <div className="contact-topbar__brand">
          <Link href="/" className="contact-brand" aria-label="ALZUHA Home">
            <div className="contact-brand__mark">⌂</div>

            <div className="contact-brand__text">
              <strong>ALZUHA</strong>
              <span>{lang === "ar" ? "العقارات" : "Real Estate"}</span>
            </div>
          </Link>
        </div>

        <nav className="contact-topbar__nav" aria-label="Main navigation">
          <Link href="/about">{copy.nav.about}</Link>
          <Link href="/services">{copy.nav.services}</Link>
          <Link href="/portfolio">{copy.nav.portfolio}</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">{copy.nav.contact}</Link>
        </nav>

        <div className="contact-topbar__actions">
          <LanguageSwitch />
          {/* مبدّل اللغة */}

          <button
            type="button"
            className="contact-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <aside className={`contact-sidepanel ${menuOpen ? "is-open" : ""}`}>
        {/* القائمة الجانبية للموبايل */}

        <div className="contact-sidepanel__header">
          <strong>{copy.nav.menuTitle}</strong>

          <button
            type="button"
            className="contact-sidepanel__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="contact-sidepanel__nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {copy.nav.home}
          </Link>

          <Link href="/about" onClick={() => setMenuOpen(false)}>
            {copy.nav.about}
          </Link>

          <Link href="/portfolio" onClick={() => setMenuOpen(false)}>
            {copy.nav.portfolio}
          </Link>

          <Link href="/services" onClick={() => setMenuOpen(false)}>
            {copy.nav.services}
          </Link>

          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            {copy.nav.contact}
          </Link>
        </nav>
      </aside>

      <section className="contact-hero">
        {/* القسم العلوي الرئيسي */}

        <div className="contact-container contact-hero__grid">
          <div className="contact-hero__content">
            <span className="contact-kicker">{heroKicker}</span>
            <h1 className="contact-hero__title">{heroTitle}</h1>
            <p className="contact-hero__desc">{heroDesc}</p>
          </div>

          <div className="contact-hero__media">
            {/* استخدمنا نفس الكلاسات الموجودة أصلًا لتجنب كسر CSS الحالي */}
            <div className="contact-imagePlaceholder" data-num="01">
              {!heroBroken ? (
                <img
                  className="contact-dynamicImage"
                  src={currentHeroSrc}
                  alt={heroTitle}
                  loading="eager"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    opacity: 1,
                  }}
                  onError={() => {
                    // إذا فشلت الصورة الأصلية ننتقل مرة واحدة فقط إلى fallback
                    if (currentHeroSrc !== fallbackHeroImage) {
                      setCurrentHeroSrc(fallbackHeroImage);
                      return;
                    }

                    // إذا فشلت fallback أيضًا نعرض placeholder فقط
                    setHeroBroken(true);
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    color: "rgba(0,0,0,0.18)",
                    fontSize: "clamp(28px, 4vw, 54px)",
                    fontWeight: 800,
                    letterSpacing: "2px",
                  }}
                >
                  ALZUHA
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-main">
        {/* المحتوى الرئيسي */}

        <div className="contact-container">
          <section className="contact-cardsSection">
            <h2 className="contact-sectionTitle">
              {textByLang(
                lang,
                sections.contact_cards.title_ar,
                sections.contact_cards.title_en
              )}
            </h2>

            <div className="contact-cardsGrid">
              {sections.contact_cards.items.map((item, index) => {
                const safeHref = normalizeCardHref(item.href);
                const external = isExternalHref(safeHref);

                return (
                  <a
                    key={`${item.label_en || item.label_ar || "card"}-${index}`}
                    href={safeHref}
                    className="contact-card"
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={textByLang(lang, item.label_ar, item.label_en)}
                  >
                    <div className="contact-card__icon">{item.icon}</div>

                    <div className="contact-card__body">
                      <h3>{textByLang(lang, item.label_ar, item.label_en)}</h3>
                      <p>{textByLang(lang, item.value_ar, item.value_en)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="contact-officesSection">
            <h2 className="contact-sectionTitle">
              {textByLang(lang, sections.offices.title_ar, sections.offices.title_en)}
            </h2>

            <div className="contact-officesGrid">
              {sections.offices.items.map((office, index) => (
                <article
                  key={`${office.name_en || office.name_ar || "office"}-${index}`}
                  className="contact-officeCard"
                >
                  <h3>{textByLang(lang, office.name_ar, office.name_en)}</h3>

                  <p>{textByLang(lang, office.address_ar, office.address_en)}</p>

                  <div className="contact-officeCard__meta">
                    <a href={normalizePhoneHref(office.phone)}>{office.phone}</a>

                    <a href={normalizeEmailHref(office.email)}>{office.email}</a>

                    <a
                      href={normalizeCardHref(office.map_url || "#")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {lang === "ar" ? "الخريطة" : "Map"}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="contact-formSection">
            <div className="contact-formCard">
              <h2 className="contact-formCard__title">
                {textByLang(lang, sections.form.title_ar, sections.form.title_en)}
              </h2>

              <p className="contact-formCard__desc">
                {textByLang(lang, sections.form.desc_ar, sections.form.desc_en)}
              </p>

              {notice ? (
                <div
                  className={`contact-notice ${
                    notice.type === "success" ? "is-success" : "is-error"
                  }`}
                >
                  {notice.text}
                </div>
              ) : null}
              {/* إشعار النجاح أو الخطأ */}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-formRow">
                  <div className="contact-formGroup">
                    <label htmlFor="contactName">
                      {textByLang(
                        lang,
                        sections.form.name_label_ar,
                        sections.form.name_label_en
                      )}
                    </label>

                    <input
                      id="contactName"
                      type="text"
                      value={form.fullName}
                      placeholder={textByLang(
                        lang,
                        sections.form.name_placeholder_ar,
                        sections.form.name_placeholder_en
                      )}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="contact-formGroup">
                    <label htmlFor="contactPhone">
                      {textByLang(
                        lang,
                        sections.form.phone_label_ar,
                        sections.form.phone_label_en
                      )}
                    </label>

                    <input
                      id="contactPhone"
                      type="tel"
                      value={form.phone}
                      placeholder={textByLang(
                        lang,
                        sections.form.phone_placeholder_ar,
                        sections.form.phone_placeholder_en
                      )}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="contact-formGroup">
                  <label htmlFor="contactEmail">
                    {textByLang(
                      lang,
                      sections.form.email_label_ar,
                      sections.form.email_label_en
                    )}
                  </label>

                  <input
                    id="contactEmail"
                    type="email"
                    value={form.email}
                    placeholder={textByLang(
                      lang,
                      sections.form.email_placeholder_ar,
                      sections.form.email_placeholder_en
                    )}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="contact-formGroup">
                  <label htmlFor="contactMessage">
                    {textByLang(
                      lang,
                      sections.form.message_label_ar,
                      sections.form.message_label_en
                    )}
                  </label>

                  <textarea
                    id="contactMessage"
                    className="contact-textarea"
                    value={form.message}
                    placeholder={textByLang(
                      lang,
                      sections.form.message_placeholder_ar,
                      sections.form.message_placeholder_en
                    )}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, message: event.target.value }))
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submitBtn"
                  disabled={submitting}
                >
                  {submitting
                    ? lang === "ar"
                      ? "جارٍ الإرسال..."
                      : "Sending..."
                    : textByLang(
                        lang,
                        sections.form.submit_ar,
                        sections.form.submit_en
                      )}
                </button>
              </form>
            </div>
          </section>

          <section className="contact-socialSection">
            <h2 className="contact-sectionTitle">{copy.socialTitle}</h2>

            <div className="contact-socialGrid">
              {sections.social.items.map((item, index) => {
                const href = normalizeCardHref(item.href);
                const external = isExternalHref(href);

                return (
                  <a
                    key={`${item.label_en || item.label_ar || "social"}-${index}`}
                    href={href}
                    className="contact-socialLink"
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    {textByLang(lang, item.label_ar, item.label_en)}
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <footer className="contact-pageFooter">
        {/* الفوتر */}

        <div className="contact-container contact-pageFooter__inner">
          <div className="contact-pageFooter__copy">
            <p>{textByLang(lang, sections.footer.copy_ar, sections.footer.copy_en)}</p>
            <a href={normalizeEmailHref(sections.footer.email)}>
              {sections.footer.email}
            </a>
          </div>

          <Link href={sections.footer.privacy_href || "#"}>
            {textByLang(
              lang,
              sections.footer.privacy_label_ar,
              sections.footer.privacy_label_en
            )}
          </Link>
        </div>
      </footer>
    </main>
  );
}