/* eslint-disable @next/next/no-img-element */
// تعطيل تحذير Next.js الخاص باستخدام <img>
// لأن الصفحة تعتمد على صور ديناميكية من القاعدة ومن fallback

import Link from "next/link";
// Link للتنقل الداخلي داخل Next.js

import Script from "next/script";
// Script لتحميل سلوك الواجهة بعد اكتمال تحميل الصفحة

import { cookies, headers } from "next/headers";
// cookies لقراءة اللغة الحالية
// headers لاكتشاف الرابط والمنفذ الحالي بدل تثبيت 3001 أو 3000

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية لأننا نقرأ الكوكيز ونطلب APIs مباشرة

type Dict = Record<string, string>;
// نوع بسيط لقاموس الترجمة

type SiteData = {
  statsValue?: string;
  location?: string;
  phone?: string;
  email?: string;
  hero_image?: string;
  project_image_1?: string;
  project_image_2?: string;
  project_image_3?: string;
  quote_image?: string;
  team_image_1?: string;
  team_image_2?: string;
  team_image_3?: string;
  brand_wall_image?: string;
};
// نوع بيانات الموقع العامة القادمة من /api/site

async function resolveBaseUrl() {
  // بناء رابط الأساس الحالي للتطبيق بدل تثبيت localhost:3001

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const h: any = await Promise.resolve(headers() as any);

  const host =
    h?.get?.("x-forwarded-host") ||
    h?.get?.("host") ||
    "localhost:3000";

  const proto =
    h?.get?.("x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${proto}://${host}`;
}

function normalizeText(value?: string | null, fallback = "") {
  // تنظيف النصوص من null/undefined/الفراغات الزائدة
  return String(value ?? fallback).trim();
}

function normalizePhoneForTel(
  value?: string | null,
  fallback = "+9640000000000"
) {
  // تنظيف الهاتف حتى يصلح داخل tel:
  const raw = normalizeText(value, fallback);
  return raw.replace(/[^\d+]/g, "");
}

function normalizeImageSrc(value?: string | null, fallback = "") {
  // توحيد مسارات الصور القادمة من القاعدة أو fallback

  const raw = normalizeText(value, "");

  if (!raw) {
    return fallback;
  }

  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) {
    return encodeURI(raw);
  }

  if (raw.startsWith("/")) {
    return encodeURI(raw);
  }

  if (raw.startsWith("pages/")) {
    return encodeURI(`/${raw}`);
  }

  if (raw.startsWith("home/")) {
    return encodeURI(`/pages/${raw}`);
  }

  if (raw.startsWith("img/")) {
    return encodeURI(`/pages/home/${raw}`);
  }

  return encodeURI(`/pages/home/img/${raw.replace(/^\.?\//, "")}`);
}

async function fetchJsonSafe<T>(url: string, fallback: T): Promise<T> {
  // جلب JSON بشكل آمن مع fallback عند أي فشل

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return fallback;
    }

    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function getLang() {
  // قراءة اللغة الحالية من الكوكيز

  const cookieStore: any = await Promise.resolve(cookies() as any);

  return cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
}

const HOME_IMAGES = {
  // صور fallback الثابتة للصفحة الرئيسية
  hero: "/pages/home/img/img (1).jpg",
  project1: "/pages/home/img/img (2).jpg",
  project2: "/pages/home/img/img (3).jpg",
  project3: "/pages/home/img/img (4).jpg",
  quote: "/pages/home/img/img (5).jpg",
  team1: "/pages/home/img/img (6).jpg",
  team2: "/pages/home/img/img (7).jpg",
  team3: "/pages/home/img/img (8).jpg",
  brand: "/pages/home/img/img (9).jpg",
};

const FALLBACKS: Record<"ar" | "en", Dict> = {
  ar: {
    "brand.title": "ALZUHA",
    "brand.subtitle": "العقارات",

    "nav.about": "من نحن",
    "nav.services": "الخدمات",
    "nav.portfolio": "سجل الأعمال",
    "nav.faq": "الأسئلة الشائعة",
    "nav.contact": "تواصل",

    "hero.eyebrow": "حلول عقارية موثوقة وشفافة",
    "hero.title": "استثمر بثقة.\nاكتشف فرصك",
    "hero.desc":
      "منصة رقمية متقدمة متخصصة في التطوير والاستثمار العقاري، إدارة الأصول، الاستشارات، ودعم المستثمرين بمعلومات دقيقة وتجربة سلسة على جميع الأجهزة.",
    "hero.btn1": "تواصل الآن",
    "hero.btn2": "اعرف المزيد",

    "trust.eyebrow": "مؤشرات الأداء",
    "trust.title": "أرقام تعكس الخبرة",
    "trust.desc":
      "القيمة الإجمالية للصفقات والمشاريع المُدارة، ضمن منهجية واضحة توازن بين العائد والمخاطر.",
    "trust.logo1": "التطوير",
    "trust.logo2": "الاستثمار",
    "trust.logo3": "الأصول",
    "trust.logo4": "الدعم",
    "trust.logo5": "المحفظة",
    "trust.logo6": "الاستشارات",

    "services.eyebrow": "الخدمات الأساسية",
    "services.title": "خدمات عقارية موثوقة",
    "services.desc":
      "التطوير، الاستثمار، الاستشارات، وإدارة الأصول ضمن نموذج تشغيلي منضبط.",
    "services.item1.title": "التطوير العقاري",
    "services.item1.desc": "تطوير مشاريع منظمة بمنطق تشغيلي واستثماري واضح.",
    "services.item2.title": "الاستشارات الاستثمارية",
    "services.item2.desc":
      "قراءة السوق وفرز الفرص واتخاذ القرار الاستثماري بانضباط.",
    "services.item3.title": "إدارة الأصول",
    "services.item3.desc":
      "إدارة تشغيلية واستراتيجية للأصول بما يرفع الكفاءة والعائد.",
    "services.cta": "استعرض الخدمات",

    "stats.eyebrow": "مؤشرات الأداء",
    "stats.title": "أرقام تعكس الخبرة",
    "stats.desc":
      "القيمة الإجمالية للصفقات والمشاريع المُدارة ضمن منهجية واضحة تحقق توازنًا بين العائد والمخاطر.",

    "projects.title": "مشاريع بحضور استراتيجي",
    "projects.desc":
      "فرص عقارية مختارة تُعرض بهوية بصرية قوية وتخطيط منضبط ورؤية واعية بالموقع.",

    "quote.brand": "عميل ALZUHA",
    "quote.text":
      "فريق موثوق بتنفيذ منضبط وتواصل واضح وفهم حقيقي للقيمة العقارية.",
    "quote.author": "مستثمر خاص",
    "quote.role": "النجف",
    "quote.cta": "عرض الأعمال",

    "newsletter.title": "ابقَ مطلعًا على الفرص الجادة",
    "newsletter.desc":
      "استقبل تحديثات مختارة عن المشاريع، وإشارات السوق، والفرص الجاهزة للاستثمار.",
    "newsletter.placeholder": "بريدك الإلكتروني",
    "newsletter.btn": "اشتراك",

    "team.eyebrow": "القيادة",
    "team.title": "الوجوه التي تقف خلف القرار",
    "team.desc":
      "فريق مركز يجمع بين التطوير والاستثمار والاستشارات والتشغيل.",
    "team.item1.name": "آدم نصار",
    "team.item1.role": "مدير تطوير المشاريع",
    "team.item2.name": "سارة جابر",
    "team.item2.role": "مستشارة استثمار",
    "team.item3.name": "ليان مراد",
    "team.item3.role": "أخصائية إدارة الأصول",

    "faq.title": "الأسئلة الشائعة",
    "faq.desc": "إجابات واضحة على الأسئلة المتكررة في الاستثمار والعقار.",
    "faq.q1": "ما نوع المشاريع التي تعملون عليها؟",
    "faq.a1": "مشاريع سكنية وتجارية ومتعددة الاستخدام وفرص موجهة للاستثمار.",
    "faq.q2": "هل تقدمون استشارة قبل الشراء؟",
    "faq.a2": "نعم. ندعم التقييم وقراءة السوق وتوجيه القرار الاستثماري.",
    "faq.q3": "هل يمكنكم إدارة أصول قائمة؟",
    "faq.a3": "نعم. ندير الأصول تشغيليًا واستراتيجيًا لتحسين الكفاءة والعائد.",
    "faq.q4": "كيف أبدأ معكم؟",
    "faq.a4": "ابدأ بطلب استشارة حتى نفهم الهدف ونقترح المسار المناسب.",
    "faq.cta": "تحدث معنا",

    "contact.eyebrow": "لنتواصل",
    "contact.title": "ابدأ خطوتك العقارية القادمة بوضوح",
    "contact.desc":
      "تواصل معنا لتطوير المشاريع أو الاستشارات أو الدعم الاستثماري أو الاستفسارات المباشرة.",
    "contact.card1.title": "البريد الإلكتروني",
    "contact.card1.desc": "أرسل استفسارك في أي وقت.",
    "contact.card2.title": "الهاتف",
    "contact.card2.desc": "خط مباشر للاستشارات والمتابعة.",
    "contact.card3.title": "الموقع",
    "contact.card3.desc": "مركز عملياتنا ودعم المستثمرين.",
    "contact.cta": "طلب استشارة",
  },

  en: {
    "brand.title": "ALZUHA",
    "brand.subtitle": "Real Estate",

    "nav.about": "About",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",

    "hero.eyebrow": "Trusted, transparent real estate solutions",
    "hero.title": "Invest with confidence.\nDiscover your opportunities",
    "hero.desc":
      "A modern platform focused on real-estate development, investment, asset management, consulting, and investor support—built for clarity across all devices.",
    "hero.btn1": "Contact Now",
    "hero.btn2": "Learn More",

    "trust.eyebrow": "Performance indicators",
    "trust.title": "Numbers that reflect expertise",
    "trust.desc":
      "Aggregate value of managed deals and projects, supported by a clear methodology balancing return and risk.",
    "trust.logo1": "Development",
    "trust.logo2": "Investment",
    "trust.logo3": "Assets",
    "trust.logo4": "Support",
    "trust.logo5": "Portfolio",
    "trust.logo6": "Consulting",

    "services.eyebrow": "Core services",
    "services.title": "Reliable real-estate services",
    "services.desc":
      "Development, investment, consulting, and asset management under one disciplined operating model.",
    "services.item1.title": "Real Estate Development",
    "services.item1.desc":
      "Structured project development with strong operational and investment logic.",
    "services.item2.title": "Investment Advisory",
    "services.item2.desc":
      "Market reading, opportunity filtering, and disciplined investment decisions.",
    "services.item3.title": "Asset Management",
    "services.item3.desc":
      "Operational control focused on sustainability, efficiency, and long-term returns.",
    "services.cta": "Explore Services",

    "stats.eyebrow": "Performance indicators",
    "stats.title": "Numbers that reflect expertise",
    "stats.desc":
      "Aggregate value of managed deals and projects through a disciplined methodology balancing return and risk.",

    "projects.title": "Projects with strategic visibility",
    "projects.desc":
      "Selected real-estate opportunities presented through a strong visual identity, disciplined planning, and location-aware strategy.",

    "quote.brand": "ALZUHA Client",
    "quote.text":
      "A reliable team with disciplined execution, transparent communication, and a clear understanding of real-estate value.",
    "quote.author": "Private Investor",
    "quote.role": "Najaf",
    "quote.cta": "View Portfolio",

    "newsletter.title": "Stay informed about serious opportunities",
    "newsletter.desc":
      "Receive selected updates on projects, market signals, and investment-ready opportunities.",
    "newsletter.placeholder": "Your email address",
    "newsletter.btn": "Subscribe",

    "team.eyebrow": "Leadership",
    "team.title": "The people behind the decisions",
    "team.desc":
      "A focused team across development, investment, advisory, and operations.",
    "team.item1.name": "Adam Nassar",
    "team.item1.role": "Projects Development Lead",
    "team.item2.name": "Sarah Jaber",
    "team.item2.role": "Investment Advisor",
    "team.item3.name": "Lian Murad",
    "team.item3.role": "Asset Management Specialist",

    "faq.title": "Frequently asked questions",
    "faq.desc":
      "Clear answers to the most common real-estate and investment questions.",
    "faq.q1": "What types of projects do you work on?",
    "faq.a1":
      "Residential, commercial, mixed-use developments, and selected investment opportunities.",
    "faq.q2": "Do you provide advisory before purchase?",
    "faq.a2":
      "Yes. We support market reading, evaluation, and investment decision guidance.",
    "faq.q3": "Can you manage existing assets?",
    "faq.a3":
      "Yes. We manage assets operationally and strategically to improve efficiency and returns.",
    "faq.q4": "How do I start with you?",
    "faq.a4":
      "Start with a consultation request so we can understand the objective and propose the right path.",
    "faq.cta": "Talk to us",

    "contact.eyebrow": "Let’s connect",
    "contact.title": "Start your next real-estate step with clarity",
    "contact.desc":
      "Contact us for development, advisory, investor support, and direct real-estate inquiries.",
    "contact.card1.title": "Email",
    "contact.card1.desc": "Send your inquiry anytime.",
    "contact.card2.title": "Phone",
    "contact.card2.desc": "Direct line for consultation and follow-up.",
    "contact.card3.title": "Location",
    "contact.card3.desc": "Our operations and investor-support center.",
    "contact.cta": "Request Consultation",
  },
};

const mediaImgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default async function HomePage() {
  // الصفحة الرئيسية الفعلية

  const lang = await getLang();
  // اللغة الحالية من الكوكي

  const origin = await resolveBaseUrl();
  // رابط الأساس الحالي

  const dictFallback = FALLBACKS[lang];
  // fallback النصي حسب اللغة الحالية

  const siteFallback: SiteData = {
    statsValue: "1,024,125.02",
    location: lang === "ar" ? "العراق / النجف" : "Iraq / Najaf",
    phone: "+964 7802335555",
    email: "info@zuha.us",
    hero_image: HOME_IMAGES.hero,
    project_image_1: HOME_IMAGES.project1,
    project_image_2: HOME_IMAGES.project2,
    project_image_3: HOME_IMAGES.project3,
    quote_image: HOME_IMAGES.quote,
    team_image_1: HOME_IMAGES.team1,
    team_image_2: HOME_IMAGES.team2,
    team_image_3: HOME_IMAGES.team3,
    brand_wall_image: HOME_IMAGES.brand,
  };
  // fallback كامل للبيانات

  const [dictRes, siteRes] = await Promise.all([
    fetchJsonSafe<{ ok?: boolean; dict?: Dict }>(
      `${origin}/api/i18n?lang=${lang}`,
      { ok: false, dict: {} }
    ),
    fetchJsonSafe<{ ok?: boolean; data?: SiteData }>(
      `${origin}/api/site`,
      { ok: false, data: siteFallback }
    ),
  ]);

  const dict: Dict = {
    ...dictFallback,
    ...(dictRes?.dict || {}),
  };
  // دمج النصوص

  const safeData: SiteData = {
    ...siteFallback,
    ...(siteRes?.data || {}),
  };
  // دمج البيانات

  const t = (key: string) => dict[key] || dictFallback[key] || key;
  // دالة ترجمة آمنة

  const heroImage = normalizeImageSrc(safeData.hero_image, HOME_IMAGES.hero);
  const project1 = normalizeImageSrc(safeData.project_image_1, HOME_IMAGES.project1);
  const project2 = normalizeImageSrc(safeData.project_image_2, HOME_IMAGES.project2);
  const project3 = normalizeImageSrc(safeData.project_image_3, HOME_IMAGES.project3);
  const quoteImage = normalizeImageSrc(safeData.quote_image, HOME_IMAGES.quote);
  const team1 = normalizeImageSrc(safeData.team_image_1, HOME_IMAGES.team1);
  const team2 = normalizeImageSrc(safeData.team_image_2, HOME_IMAGES.team2);
  const team3 = normalizeImageSrc(safeData.team_image_3, HOME_IMAGES.team3);
  const brandImage = normalizeImageSrc(
    safeData.brand_wall_image,
    HOME_IMAGES.brand
  );
  // الصور النهائية بعد التطبيع

  return (
    <>
      <link rel="stylesheet" href="/pages/home/css/page.css" />
      {/* ربط CSS القديم كما هو */}

      <main dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* الهيدر لا يوجد هنا عمدًا. */}
        {/* السبب: layout.tsx يستدعي SiteHeader مرة واحدة لكل الموقع. */}
        {/* حذفنا الهيدر الداخلي من الصفحة الرئيسية لمنع تكراره. */}

        <section className="hero">
          <div className="container hero__grid">
            <figure className="shot shot--lg">
              <div className="shot__ph">01</div>

              <img
                src={heroImage}
                alt="Hero visual"
                loading="eager"
                style={mediaImgStyle}
              />
            </figure>

            <div className="hero__copy">
              <p className="eyebrow">{t("hero.eyebrow")}</p>

              <h1 className="hero__title" style={{ whiteSpace: "pre-line" }}>
                {t("hero.title")}
              </h1>

              <p className="hero__desc">{t("hero.desc")}</p>

              <div className="hero__actions">
                <Link className="btn btn--white" href="/request-consultation">
                  {t("hero.btn1")}
                </Link>

                <Link className="btn btn--ghost" href="/about">
                  {t("hero.btn2")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="trust">
          <div className="container trust__grid">
            <div>
              <p className="kicker">{t("trust.eyebrow")}</p>
              <h2 className="trust__title">{t("trust.title")}</h2>
              <p className="trust__desc">{t("trust.desc")}</p>
            </div>

            <div className="logos">
              <div className="logoCard">{t("trust.logo1")}</div>
              <div className="logoCard">{t("trust.logo2")}</div>
              <div className="logoCard">{t("trust.logo3")}</div>
              <div className="logoCard">{t("trust.logo4")}</div>
              <div className="logoCard">{t("trust.logo5")}</div>
              <div className="logoCard">{t("trust.logo6")}</div>
            </div>
          </div>
        </section>

        <section className="servicesLite">
          <div className="container">
            <p className="kicker">{t("services.eyebrow")}</p>
            <h2 className="display">{t("services.title")}</h2>
            <p className="sublead">{t("services.desc")}</p>

            <div className="featureGrid">
              <article className="feature">
                <div className="feature__icon">01</div>
                <h3>{t("services.item1.title")}</h3>
                <p>{t("services.item1.desc")}</p>
              </article>

              <article className="feature">
                <div className="feature__icon">02</div>
                <h3>{t("services.item2.title")}</h3>
                <p>{t("services.item2.desc")}</p>
              </article>

              <article className="feature">
                <div className="feature__icon">03</div>
                <h3>{t("services.item3.title")}</h3>
                <p>{t("services.item3.desc")}</p>
              </article>
            </div>

            <div className="center">
              <Link className="btn btn--primary" href="/services">
                {t("services.cta")}
              </Link>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="container stats__inner">
            <p className="stats__eyebrow">{t("stats.eyebrow")}</p>
            <h2 className="stats__title">{t("stats.title")}</h2>

            <div className="stats__value">
              ${normalizeText(safeData.statsValue, "1,024,125.02")}
            </div>

            <p className="stats__desc">{t("stats.desc")}</p>

            <div
              className="stats__metaLine"
              style={{
                marginTop: "16px",
                color: "#5b6677",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.9,
              }}
            >
              <span>{normalizeText(safeData.location, "Iraq / Najaf")}</span>
              <span style={{ marginInline: "8px" }}>•</span>

              <a
                href={`tel:${normalizePhoneForTel(
                  safeData.phone,
                  "+9647802335555"
                )}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {normalizeText(safeData.phone, "+964 7802335555")}
              </a>

              <span style={{ marginInline: "8px" }}>•</span>

              <a
                href={`mailto:${normalizeText(safeData.email, "info@zuha.us")}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {normalizeText(safeData.email, "info@zuha.us")}
              </a>
            </div>
          </div>
        </section>

        <section className="projects">
          <div className="container">
            <h2 className="projects__title">{t("projects.title")}</h2>
            <p className="projects__desc">{t("projects.desc")}</p>

            <div className="gallery">
              <figure className="tile tile--wide">
                <div className="shot__ph--inline">04</div>
                <img src={project1} alt="Project 1" style={mediaImgStyle} />
              </figure>

              <div className="stack">
                <figure className="tile">
                  <div className="shot__ph--inline">05</div>
                  <img src={project2} alt="Project 2" style={mediaImgStyle} />
                </figure>

                <figure className="tile">
                  <div className="shot__ph--inline">06</div>
                  <img src={project3} alt="Project 3" style={mediaImgStyle} />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial">
          <div className="container">
            <figure className="quoteCard">
              <div className="quoteCard__media">
                <div className="shot__ph--inline">07</div>
                <img src={quoteImage} alt="Client visual" style={mediaImgStyle} />
                <div className="quoteCard__num">07</div>
              </div>

              <figcaption className="quoteCard__body">
                <div className="quoteBrand">{t("quote.brand")}</div>
                <blockquote className="quoteText">{t("quote.text")}</blockquote>

                <div className="quoteMeta">
                  <span>{t("quote.author")}</span>
                  <span className="dot">•</span>
                  <span>{t("quote.role")}</span>
                </div>

                <Link className="btn btn--primary" href="/portfolio">
                  {t("quote.cta")}
                </Link>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="newsletter">
          <div className="container">
            <div className="newsletterCard">
              <div>
                <h2 className="newsletterCard__title">
                  {t("newsletter.title")}
                </h2>
                <p className="newsletterCard__desc">
                  {t("newsletter.desc")}
                </p>
              </div>

              <form className="newsletterForm" id="newsForm">
                <input
                  type="email"
                  name="email"
                  placeholder={t("newsletter.placeholder")}
                  aria-label="Email"
                />

                <button className="btn btn--primary" type="submit">
                  {t("newsletter.btn")}
                </button>
              </form>

              <div className="newsletterCard__num">08</div>
            </div>
          </div>
        </section>

        <section className="team">
          <div className="container">
            <p className="kicker">{t("team.eyebrow")}</p>
            <h2 className="display">{t("team.title")}</h2>
            <p className="sublead">{t("team.desc")}</p>

            <div className="teamGrid">
              <figure className="member">
                <div className="shot__ph--inline">09</div>
                <img src={team1} alt="Team member 1" style={mediaImgStyle} />
                <div className="member__num">09</div>
                <figcaption>
                  <strong>{t("team.item1.name")}</strong>
                  <span>{t("team.item1.role")}</span>
                </figcaption>
              </figure>

              <figure className="member">
                <div className="shot__ph--inline">10</div>
                <img src={team2} alt="Team member 2" style={mediaImgStyle} />
                <div className="member__num">10</div>
                <figcaption>
                  <strong>{t("team.item2.name")}</strong>
                  <span>{t("team.item2.role")}</span>
                </figcaption>
              </figure>

              <figure className="member">
                <div className="shot__ph--inline">11</div>
                <img src={team3} alt="Team member 3" style={mediaImgStyle} />
                <div className="member__num">11</div>
                <figcaption>
                  <strong>{t("team.item3.name")}</strong>
                  <span>{t("team.item3.role")}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2 className="faq__title">{t("faq.title")}</h2>
            <p className="faq__desc">{t("faq.desc")}</p>

            <div className="faqGrid">
              <details className="qa">
                <summary>{t("faq.q1")}</summary>
                <p>{t("faq.a1")}</p>
              </details>

              <details className="qa">
                <summary>{t("faq.q2")}</summary>
                <p>{t("faq.a2")}</p>
              </details>

              <details className="qa">
                <summary>{t("faq.q3")}</summary>
                <p>{t("faq.a3")}</p>
              </details>

              <details className="qa">
                <summary>{t("faq.q4")}</summary>
                <p>{t("faq.a4")}</p>
              </details>
            </div>

            <div className="faqFooter">
              <Link className="linkArrow" href="/faq">
                {t("faq.cta")}
              </Link>
              <span className="faqNum">12</span>
            </div>
          </div>
        </section>

        <section className="homeContactShowcase" aria-labelledby="home-contact-showcase-title">
          {/* بداية قسم الصورة والفوتر النهائي */}

          <div className="container">
            {/* حاوية الصورة الخارجية حتى تبقى الصورة فوق الفوتر وليست داخله */}

            <figure className="homeContactShowcase__media">
              {/* إطار الصورة الوسطية فوق الفوتر */}

              <img
                src={brandImage}
                alt={lang === "ar" ? "زها للتجارة العامة والاستثمار العقاري" : "ALZUHA real estate showcase"}
                className="homeContactShowcase__image"
              />
              {/* الصورة الأخيرة بحجم متوسط وبدون style موروث حتى لا تكبر داخل الفوتر */}
            </figure>
          </div>

          <footer className="homeContactFooterBar" aria-label={lang === "ar" ? "معلومات التواصل" : "Contact information"}>
            {/* فوتر أسود مستقل بارتفاع يقارب 7 سم على الديسكتوب */}

            <div className="container">
              {/* حاوية محتوى الفوتر */}

              <div className="homeContactShowcase__head">
                {/* رأس الفوتر: العنوان موزع على سطرين والوصف تحته */}

                <p className="kicker kicker--dark">{t("contact.eyebrow")}</p>
                {/* نص صغير أعلى العنوان */}

                <h2 id="home-contact-showcase-title" className="homeContactShowcase__title">
                  {/* العنوان موزع على سطرين واضحين تحت الصورة */}
                  {lang === "ar" ? (
                    <>
                      <span className="homeContactShowcase__titleLine">ابدأ خطوتك العقارية القادمة</span>
                      {/* السطر الأول من العنوان العربي */}
                      <span className="homeContactShowcase__titleLine">بوضوح</span>
                      {/* السطر الثاني من العنوان العربي */}
                    </>
                  ) : (
                    <>
                      <span className="homeContactShowcase__titleLine">Start your next real estate step</span>
                      {/* السطر الأول من العنوان الإنجليزي */}
                      <span className="homeContactShowcase__titleLine">with clarity</span>
                      {/* السطر الثاني من العنوان الإنجليزي */}
                    </>
                  )}
                </h2>

                <p className="homeContactShowcase__desc">
                  {/* وصف قصير داخل الفوتر */}
                  {t("contact.desc")}
                  {/* استخدام قاموس الترجمة الحالي */}
                </p>
              </div>

              <div className="homeContactFooterBar__grid">
                {/* شبكة أفقية لمعلومات التواصل داخل الفوتر */}

                <a
                  href="https://zuha.us"
                  target="_blank"
                  rel="noreferrer"
                  className="homeContactFooterBar__item homeContactFooterBar__item--website"
                >
                  {/* بطاقة الموقع الإلكتروني */}

                  <span className="homeContactFooterBar__icon" aria-hidden="true">🌐</span>
                  {/* رمز الموقع الإلكتروني بلون ذهبي من CSS */}

                  <span className="homeContactFooterBar__text">
                    {/* حاوية نص الموقع */}
                    <span className="homeContactFooterBar__label">
                      {lang === "ar" ? "الموقع الإلكتروني" : "Website"}
                    </span>
                    {/* عنوان بطاقة الموقع */}
                    <span className="homeContactFooterBar__value">zuha.us</span>
                    {/* قيمة الموقع */}
                  </span>
                </a>

                <div className="homeContactFooterBar__item homeContactFooterBar__item--address">
                  {/* بطاقة العنوان */}

                  <span className="homeContactFooterBar__icon" aria-hidden="true">🏢</span>
                  {/* رمز العنوان بلون أزرق من CSS */}

                  <span className="homeContactFooterBar__text">
                    {/* حاوية نص العنوان */}
                    <span className="homeContactFooterBar__label">
                      {lang === "ar" ? "العنوان" : "Address"}
                    </span>
                    {/* عنوان بطاقة العنوان */}
                    <span className="homeContactFooterBar__value">
                      {lang === "ar" ? "العراق - النجف الأشرف" : "Iraq - Najaf Al-Ashraf"}
                    </span>
                    {/* قيمة العنوان */}
                  </span>
                </div>

                <a
                  href={`tel:${normalizePhoneForTel(safeData.phone, "+9647802335555")}`}
                  className="homeContactFooterBar__item homeContactFooterBar__item--phone"
                >
                  {/* بطاقة الهاتف */}

                  <span className="homeContactFooterBar__icon" aria-hidden="true">☎</span>
                  {/* رمز الهاتف بلون أحمر من CSS */}

                  <span className="homeContactFooterBar__text">
                    {/* حاوية نص الهاتف */}
                    <span className="homeContactFooterBar__label">
                      {lang === "ar" ? "الهاتف" : "Phone"}
                    </span>
                    {/* عنوان بطاقة الهاتف */}
                    <span className="homeContactFooterBar__value">
                      {normalizeText(safeData.phone, "+964 780 233 5555")}
                    </span>
                    {/* قيمة الهاتف */}
                  </span>
                </a>

                <a
                  href={`mailto:${normalizeText(safeData.email, "info@zuha.us")}`}
                  className="homeContactFooterBar__item homeContactFooterBar__item--email"
                >
                  {/* بطاقة البريد الإلكتروني */}

                  <span className="homeContactFooterBar__icon" aria-hidden="true">✉</span>
                  {/* رمز البريد الإلكتروني بلون بنفسجي من CSS */}

                  <span className="homeContactFooterBar__text">
                    {/* حاوية نص البريد */}
                    <span className="homeContactFooterBar__label">
                      {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                    </span>
                    {/* عنوان بطاقة البريد */}
                    <span className="homeContactFooterBar__value">
                      {normalizeText(safeData.email, "info@zuha.us")}
                    </span>
                    {/* قيمة البريد الإلكتروني */}
                  </span>
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>

      <Script src="/pages/home/js/projects-slider.js" strategy="afterInteractive" />
      {/* تشغيل سلايدر العرض الوسطي لقسم المشاريع بعد تحميل الصفحة */}

      <Script src="/pages/home/js/page.js" strategy="afterInteractive" />
      {/* سلوك الواجهة العام */}
    </>
  );
}