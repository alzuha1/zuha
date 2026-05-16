/* eslint-disable @next/next/no-img-element */
// تعطيل تحذير Next.js الخاص باستخدام <img> لأن الصفحة تعتمد على صور ديناميكية من القاعدة ومن fallback.

import Link from "next/link";
// استيراد Link للتنقل الداخلي بين صفحات Next.js بدون إعادة تحميل كاملة.

import Script from "next/script";
// استيراد Script لتحميل ملفات JavaScript الخاصة بسلوك الصفحة بعد التفاعل.

import { cookies, headers } from "next/headers";
// استيراد cookies لقراءة لغة المستخدم، وheaders لبناء رابط الموقع الحالي ديناميكيًا.

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية لأننا نقرأ الكوكيز ونطلب APIs مباشرة بدون كاش ثابت.

type Dict = Record<string, string>;
// تعريف نوع قاموس الترجمة: مفتاح نصي وقيمة نصية.

type SiteData = {
  // تعريف نوع بيانات الموقع العامة القادمة من /api/site.
  statsValue?: string;
  // قيمة المؤشر المالي أو الإحصائي.
  location?: string;
  // موقع الشركة.
  phone?: string;
  // رقم الهاتف.
  email?: string;
  // البريد الإلكتروني.
  hero_image?: string;
  // صورة الهيرو.
  project_image_1?: string;
  // صورة المشروع الأول.
  project_image_2?: string;
  // صورة المشروع الثاني.
  project_image_3?: string;
  // صورة المشروع الثالث.
  quote_image?: string;
  // صورة بطاقة العميل.
  team_image_1?: string;
  // صورة عضو الفريق الأول.
  team_image_2?: string;
  // صورة عضو الفريق الثاني.
  team_image_3?: string;
  // صورة عضو الفريق الثالث.
  brand_wall_image?: string;
  // صورة الواجهة الأخيرة قبل الفوتر.
};
// نهاية نوع SiteData.

async function resolveBaseUrl() {
  // بناء رابط الأساس الحالي للتطبيق بدل تثبيت localhost أو الدومين يدويًا.

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // إذا كان رابط الموقع معرفًا في متغيرات البيئة.
    return process.env.NEXT_PUBLIC_SITE_URL;
    // استخدام الرابط القادم من البيئة مباشرة.
  }

  const h: any = await Promise.resolve(headers() as any);
  // قراءة headers بطريقة متوافقة مع نسخ Next المختلفة.

  const host =
    h?.get?.("x-forwarded-host") ||
    h?.get?.("host") ||
    "localhost:3000";
  // تحديد اسم المضيف الحالي من البروكسي أو السيرفر أو fallback محلي.

  const proto =
    h?.get?.("x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  // تحديد البروتوكول حسب الهيدر أو حسب كون البيئة محلية أم إنتاجية.

  return `${proto}://${host}`;
  // إرجاع رابط الأساس النهائي.
}
// نهاية resolveBaseUrl.

function normalizeText(value?: string | null, fallback = "") {
  // تنظيف النصوص من null و undefined والفراغات الزائدة.
  return String(value ?? fallback).trim();
  // إرجاع النص النهائي بعد التنظيف.
}
// نهاية normalizeText.

function normalizePhoneForTel(value?: string | null, fallback = "+9640000000000") {
  // تنظيف رقم الهاتف حتى يصلح داخل tel:.
  const raw = normalizeText(value, fallback);
  // تحويل القيمة إلى نص آمن.
  return raw.replace(/[^\d+]/g, "");
  // حذف أي رموز غير الأرقام وعلامة +.
}
// نهاية normalizePhoneForTel.

function normalizeImageSrc(value?: string | null, fallback = "") {
  // توحيد مسارات الصور القادمة من القاعدة أو fallback.

  const raw = normalizeText(value, "");
  // قراءة قيمة الصورة كنص نظيف.

  if (!raw) {
    // إذا لم توجد صورة.
    return fallback;
    // استخدام صورة fallback.
  }

  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) {
    // إذا كانت الصورة رابطًا كاملًا أو data URI.
    return encodeURI(raw);
    // إرجاع الرابط بعد ترميزه.
  }

  if (raw.startsWith("/")) {
    // إذا كان المسار يبدأ من جذر public.
    return encodeURI(raw);
    // إرجاع المسار كما هو بعد الترميز.
  }

  if (raw.startsWith("pages/")) {
    // إذا كان المسار يبدأ بـ pages.
    return encodeURI(`/${raw}`);
    // إضافة / في البداية.
  }

  if (raw.startsWith("home/")) {
    // إذا كان المسار يبدأ بـ home.
    return encodeURI(`/pages/${raw}`);
    // تحويله إلى مسار public الصحيح.
  }

  if (raw.startsWith("img/")) {
    // إذا كان المسار يبدأ بمجلد img.
    return encodeURI(`/pages/home/${raw}`);
    // تحويله إلى مسار صور الهوم.
  }

  return encodeURI(`/pages/home/img/${raw.replace(/^\.?\//, "")}`);
  // fallback نهائي لأي اسم صورة فقط.
}
// نهاية normalizeImageSrc.

async function fetchJsonSafe<T>(url: string, fallback: T): Promise<T> {
  // جلب JSON بشكل آمن مع fallback عند أي فشل.

  try {
    // محاولة تنفيذ الطلب.
    const res = await fetch(url, { cache: "no-store" });
    // جلب البيانات بدون كاش.

    if (!res.ok) {
      // إذا كانت الاستجابة غير ناجحة.
      return fallback;
      // إرجاع fallback.
    }

    return (await res.json()) as T;
    // إرجاع JSON بعد تحويله للنوع المطلوب.
  } catch {
    // إذا فشل الاتصال أو التحويل.
    return fallback;
    // إرجاع fallback بدل إسقاط الصفحة.
  }
}
// نهاية fetchJsonSafe.

async function getLang() {
  // قراءة اللغة الحالية من الكوكيز.

  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز بطريقة متوافقة مع Next.

  return cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // إرجاع en إذا كانت موجودة، وإلا ar.
}
// نهاية getLang.

const HOME_IMAGES = {
  // صور fallback الثابتة للصفحة الرئيسية.
  hero: "/pages/home/img/img (1).jpg",
  // صورة الهيرو الافتراضية.
  project1: "/pages/home/img/img (2).jpg",
  // صورة المشروع الأول الافتراضية.
  project2: "/pages/home/img/img (3).jpg",
  // صورة المشروع الثاني الافتراضية.
  project3: "/pages/home/img/img (4).jpg",
  // صورة المشروع الثالث الافتراضية.
  quote: "/pages/home/img/img (5).jpg",
  // صورة العميل الافتراضية.
  team1: "/pages/home/img/img (6).jpg",
  // صورة عضو الفريق الأول الافتراضية.
  team2: "/pages/home/img/img (7).jpg",
  // صورة عضو الفريق الثاني الافتراضية.
  team3: "/pages/home/img/img (8).jpg",
  // صورة عضو الفريق الثالث الافتراضية.
  brand: "/pages/home/img/img (9).jpg",
  // صورة الواجهة الأخيرة الافتراضية.
};
// نهاية HOME_IMAGES.

const FALLBACKS: Record<"ar" | "en", Dict> = {
  // قواميس fallback للنصوص العربية والإنجليزية.
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
    "hero.desc": "منصة رقمية متقدمة متخصصة في التطوير والاستثمار العقاري، إدارة الأصول، الاستشارات، ودعم المستثمرين بمعلومات دقيقة وتجربة سلسة على جميع الأجهزة.",
    "hero.btn1": "تواصل الآن",
    "hero.btn2": "اعرف المزيد",
    "trust.eyebrow": "مؤشرات الأداء",
    "trust.title": "أرقام تعكس الخبرة",
    "trust.desc": "القيمة الإجمالية للصفقات والمشاريع المُدارة، ضمن منهجية واضحة توازن بين العائد والمخاطر.",
    "trust.logo1": "التطوير",
    "trust.logo2": "الاستثمار",
    "trust.logo3": "الأصول",
    "trust.logo4": "الدعم",
    "trust.logo5": "المحفظة",
    "trust.logo6": "الاستشارات",
    "services.eyebrow": "الخدمات الأساسية",
    "services.title": "خدمات عقارية موثوقة",
    "services.desc": "التطوير، الاستثمار، الاستشارات، وإدارة الأصول ضمن نموذج تشغيلي منضبط.",
    "services.item1.title": "التطوير العقاري",
    "services.item1.desc": "تطوير مشاريع منظمة بمنطق تشغيلي واستثماري واضح.",
    "services.item2.title": "الاستشارات الاستثمارية",
    "services.item2.desc": "قراءة السوق وفرز الفرص واتخاذ القرار الاستثماري بانضباط.",
    "services.item3.title": "إدارة الأصول",
    "services.item3.desc": "إدارة تشغيلية واستراتيجية للأصول بما يرفع الكفاءة والعائد.",
    "services.cta": "استعرض الخدمات",
    "stats.eyebrow": "مؤشرات الأداء",
    "stats.title": "أرقام تعكس الخبرة",
    "stats.desc": "القيمة الإجمالية للصفقات والمشاريع المُدارة ضمن منهجية واضحة تحقق توازنًا بين العائد والمخاطر.",
    "projects.title": "مشاريع بحضور استراتيجي",
    "projects.desc": "فرص عقارية مختارة تُعرض بهوية بصرية قوية وتخطيط منضبط ورؤية واعية بالموقع.",
    "quote.brand": "عميل ALZUHA",
    "quote.text": "فريق موثوق بتنفيذ منضبط وتواصل واضح وفهم حقيقي للقيمة العقارية.",
    "quote.author": "مستثمر خاص",
    "quote.role": "النجف",
    "quote.cta": "عرض الأعمال",
    "newsletter.title": "ابقَ مطلعًا على الفرص الجادة",
    "newsletter.desc": "استقبل تحديثات مختارة عن المشاريع، وإشارات السوق، والفرص الجاهزة للاستثمار.",
    "newsletter.placeholder": "بريدك الإلكتروني",
    "newsletter.btn": "اشتراك",
    "team.eyebrow": "القيادة",
    "team.title": "الوجوه التي تقف خلف القرار",
    "team.desc": "فريق مركز يجمع بين التطوير والاستثمار والاستشارات والتشغيل.",
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
    "contact.desc": "تواصل معنا لتطوير المشاريع أو الاستشارات أو الدعم الاستثماري أو الاستفسارات المباشرة.",
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
    "hero.desc": "A modern platform focused on real-estate development, investment, asset management, consulting, and investor support—built for clarity across all devices.",
    "hero.btn1": "Contact Now",
    "hero.btn2": "Learn More",
    "trust.eyebrow": "Performance indicators",
    "trust.title": "Numbers that reflect expertise",
    "trust.desc": "Aggregate value of managed deals and projects, supported by a clear methodology balancing return and risk.",
    "trust.logo1": "Development",
    "trust.logo2": "Investment",
    "trust.logo3": "Assets",
    "trust.logo4": "Support",
    "trust.logo5": "Portfolio",
    "trust.logo6": "Consulting",
    "services.eyebrow": "Core services",
    "services.title": "Reliable real-estate services",
    "services.desc": "Development, investment, consulting, and asset management under one disciplined operating model.",
    "services.item1.title": "Real Estate Development",
    "services.item1.desc": "Structured project development with strong operational and investment logic.",
    "services.item2.title": "Investment Advisory",
    "services.item2.desc": "Market reading, opportunity filtering, and disciplined investment decisions.",
    "services.item3.title": "Asset Management",
    "services.item3.desc": "Operational control focused on sustainability, efficiency, and long-term returns.",
    "services.cta": "Explore Services",
    "stats.eyebrow": "Performance indicators",
    "stats.title": "Numbers that reflect expertise",
    "stats.desc": "Aggregate value of managed deals and projects through a disciplined methodology balancing return and risk.",
    "projects.title": "Projects with strategic visibility",
    "projects.desc": "Selected real-estate opportunities presented through a strong visual identity, disciplined planning, and location-aware strategy.",
    "quote.brand": "ALZUHA Client",
    "quote.text": "A reliable team with disciplined execution, transparent communication, and a clear understanding of real-estate value.",
    "quote.author": "Private Investor",
    "quote.role": "Najaf",
    "quote.cta": "View Portfolio",
    "newsletter.title": "Stay informed about serious opportunities",
    "newsletter.desc": "Receive selected updates on projects, market signals, and investment-ready opportunities.",
    "newsletter.placeholder": "Your email address",
    "newsletter.btn": "Subscribe",
    "team.eyebrow": "Leadership",
    "team.title": "The people behind the decisions",
    "team.desc": "A focused team across development, investment, advisory, and operations.",
    "team.item1.name": "Adam Nassar",
    "team.item1.role": "Projects Development Lead",
    "team.item2.name": "Sarah Jaber",
    "team.item2.role": "Investment Advisor",
    "team.item3.name": "Lian Murad",
    "team.item3.role": "Asset Management Specialist",
    "faq.title": "Frequently asked questions",
    "faq.desc": "Clear answers to the most common real-estate and investment questions.",
    "faq.q1": "What types of projects do you work on?",
    "faq.a1": "Residential, commercial, mixed-use developments, and selected investment opportunities.",
    "faq.q2": "Do you provide advisory before purchase?",
    "faq.a2": "Yes. We support market reading, evaluation, and investment decision guidance.",
    "faq.q3": "Can you manage existing assets?",
    "faq.a3": "Yes. We manage assets operationally and strategically to improve efficiency and returns.",
    "faq.q4": "How do I start with you?",
    "faq.a4": "Start with a consultation request so we can understand the objective and propose the right path.",
    "faq.cta": "Talk to us",
    "contact.eyebrow": "Let’s connect",
    "contact.title": "Start your next real-estate step with clarity",
    "contact.desc": "Contact us for development, advisory, investor support, and direct real-estate inquiries.",
    "contact.card1.title": "Email",
    "contact.card1.desc": "Send your inquiry anytime.",
    "contact.card2.title": "Phone",
    "contact.card2.desc": "Direct line for consultation and follow-up.",
    "contact.card3.title": "Location",
    "contact.card3.desc": "Our operations and investor-support center.",
    "contact.cta": "Request Consultation",
  },
};
// نهاية FALLBACKS.

const mediaImgStyle: React.CSSProperties = {
  // تنسيق موحد لكل الصور داخل الصفحة.
  display: "block",
  // جعل الصورة عنصر block لإزالة الفراغات السفلية.
  width: "100%",
  // جعل الصورة تملأ عرض الحاوية.
  height: "100%",
  // جعل الصورة تملأ ارتفاع الحاوية.
  objectFit: "cover",
  // قص الصورة بشكل احترافي داخل الإطار.
};
// نهاية mediaImgStyle.

export default async function HomePage() {
  // الصفحة الرئيسية الفعلية.

  const lang = await getLang();
  // قراءة اللغة الحالية من الكوكي.

  const origin = await resolveBaseUrl();
  // تحديد رابط الأساس الحالي.

  const dictFallback = FALLBACKS[lang];
  // اختيار قاموس fallback حسب اللغة.

  const siteFallback: SiteData = {
    // fallback كامل لبيانات الموقع.
    statsValue: "1,024,125.02",
    // قيمة المؤشر الافتراضية.
    location: lang === "ar" ? "العراق / النجف" : "Iraq / Najaf",
    // الموقع الافتراضي حسب اللغة.
    phone: "+964 7802335555",
    // الهاتف الافتراضي.
    email: "info@zuha.us",
    // البريد الافتراضي.
    hero_image: HOME_IMAGES.hero,
    // صورة الهيرو الافتراضية.
    project_image_1: HOME_IMAGES.project1,
    // صورة المشروع الأول الافتراضية.
    project_image_2: HOME_IMAGES.project2,
    // صورة المشروع الثاني الافتراضية.
    project_image_3: HOME_IMAGES.project3,
    // صورة المشروع الثالث الافتراضية.
    quote_image: HOME_IMAGES.quote,
    // صورة العميل الافتراضية.
    team_image_1: HOME_IMAGES.team1,
    // صورة عضو الفريق الأول الافتراضية.
    team_image_2: HOME_IMAGES.team2,
    // صورة عضو الفريق الثاني الافتراضية.
    team_image_3: HOME_IMAGES.team3,
    // صورة عضو الفريق الثالث الافتراضية.
    brand_wall_image: HOME_IMAGES.brand,
    // صورة الفوتر الافتراضية.
  };
  // نهاية siteFallback.

  const [dictRes, siteRes] = await Promise.all([
    // تنفيذ طلب الترجمة وطلب بيانات الموقع بالتوازي.
    fetchJsonSafe<{ ok?: boolean; dict?: Dict }>(`${origin}/api/i18n?lang=${lang}`, { ok: false, dict: {} }),
    // جلب قاموس اللغة من API.
    fetchJsonSafe<{ ok?: boolean; data?: SiteData }>(`${origin}/api/site`, { ok: false, data: siteFallback }),
    // جلب بيانات الموقع من API.
  ]);
  // نهاية Promise.all.

  const dict: Dict = {
    // دمج قاموس fallback مع القاموس القادم من API.
    ...dictFallback,
    // وضع fallback أولًا.
    ...(dictRes?.dict || {}),
    // تطبيق النصوص القادمة من API فوق fallback.
  };
  // نهاية dict.

  const safeData: SiteData = {
    // دمج بيانات fallback مع بيانات API.
    ...siteFallback,
    // وضع بيانات fallback أولًا.
    ...(siteRes?.data || {}),
    // تطبيق بيانات API فوقها.
  };
  // نهاية safeData.

  const t = (key: string) => dict[key] || dictFallback[key] || key;
  // دالة ترجمة آمنة تعيد النص أو fallback أو المفتاح نفسه.

  const heroImage = normalizeImageSrc(safeData.hero_image, HOME_IMAGES.hero);
  // تجهيز صورة الهيرو النهائية.

  const project1 = normalizeImageSrc(safeData.project_image_1, HOME_IMAGES.project1);
  // تجهيز صورة المشروع الأول.

  const project2 = normalizeImageSrc(safeData.project_image_2, HOME_IMAGES.project2);
  // تجهيز صورة المشروع الثاني.

  const project3 = normalizeImageSrc(safeData.project_image_3, HOME_IMAGES.project3);
  // تجهيز صورة المشروع الثالث.

  const quoteImage = normalizeImageSrc(safeData.quote_image, HOME_IMAGES.quote);
  // تجهيز صورة العميل.

  const team1 = normalizeImageSrc(safeData.team_image_1, HOME_IMAGES.team1);
  // تجهيز صورة عضو الفريق الأول.

  const team2 = normalizeImageSrc(safeData.team_image_2, HOME_IMAGES.team2);
  // تجهيز صورة عضو الفريق الثاني.

  const team3 = normalizeImageSrc(safeData.team_image_3, HOME_IMAGES.team3);
  // تجهيز صورة عضو الفريق الثالث.

  const brandImage = normalizeImageSrc(safeData.brand_wall_image, HOME_IMAGES.brand);
  // تجهيز صورة الواجهة الأخيرة.

  return (
    <>
      <link rel="stylesheet" href="/pages/home/css/page.css" />
      {/* ربط CSS القديم الخاص بالصفحة الرئيسية كما هو. */}

      <main dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* تحديد اتجاه الصفحة حسب اللغة الحالية. */}

        <section className="hero">
          {/* بداية قسم الهيرو. */}

          <div className="container hero__grid">
            {/* حاوية الهيرو الرئيسية. */}

            <figure className="shot shot--lg">
              {/* إطار صورة الهيرو بدون رقم زخرفي. */}

              <img src={heroImage} alt="Hero visual" loading="eager" style={mediaImgStyle} />
              {/* صورة الهيرو الرئيسية بعد حذف رقم 01. */}
            </figure>

            <div className="hero__copy">
              {/* حاوية نصوص الهيرو. */}

              <p className="eyebrow">{t("hero.eyebrow")}</p>
              {/* النص الصغير أعلى عنوان الهيرو. */}

              <h1 className="hero__title" style={{ whiteSpace: "pre-line" }}>
                {/* عنوان الهيرو مع دعم الأسطر الجديدة. */}
                {t("hero.title")}
                {/* نص العنوان حسب اللغة. */}
              </h1>

              <p className="hero__desc">{t("hero.desc")}</p>
              {/* وصف الهيرو. */}

              <div className="hero__actions">
                {/* أزرار الهيرو. */}

                <Link className="btn btn--white" href="/request-consultation">
                  {/* زر التواصل أو طلب الاستشارة. */}
                  {t("hero.btn1")}
                  {/* نص الزر الأول. */}
                </Link>

                <Link className="btn btn--ghost" href="/about">
                  {/* زر معرفة المزيد. */}
                  {t("hero.btn2")}
                  {/* نص الزر الثاني. */}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="trust">
          {/* بداية قسم الثقة والمؤشرات. */}

          <div className="container trust__grid">
            {/* شبكة قسم الثقة. */}

            <div>
              {/* حاوية النصوص. */}
              <p className="kicker">{t("trust.eyebrow")}</p>
              {/* النص الصغير. */}
              <h2 className="trust__title">{t("trust.title")}</h2>
              {/* عنوان القسم. */}
              <p className="trust__desc">{t("trust.desc")}</p>
              {/* وصف القسم. */}
            </div>

            <div className="logos">
              {/* شبكة الشعارات النصية. */}
              <div className="logoCard">{t("trust.logo1")}</div>
              {/* بطاقة شعار 1. */}
              <div className="logoCard">{t("trust.logo2")}</div>
              {/* بطاقة شعار 2. */}
              <div className="logoCard">{t("trust.logo3")}</div>
              {/* بطاقة شعار 3. */}
              <div className="logoCard">{t("trust.logo4")}</div>
              {/* بطاقة شعار 4. */}
              <div className="logoCard">{t("trust.logo5")}</div>
              {/* بطاقة شعار 5. */}
              <div className="logoCard">{t("trust.logo6")}</div>
              {/* بطاقة شعار 6. */}
            </div>
          </div>
        </section>

        <section className="servicesLite">
          {/* بداية قسم الخدمات المختصرة. */}

          <div className="container">
            {/* حاوية القسم. */}

            <p className="kicker">{t("services.eyebrow")}</p>
            {/* النص الصغير. */}

            <h2 className="display">{t("services.title")}</h2>
            {/* عنوان الخدمات. */}

            <p className="sublead">{t("services.desc")}</p>
            {/* وصف الخدمات. */}

            <div className="featureGrid">
              {/* شبكة بطاقات الخدمات. */}

              <article className="feature">
                {/* بطاقة الخدمة الأولى. */}
                <div className="feature__icon">01</div>
                {/* رقم الخدمة الأولى محفوظ لأنه جزء من تصميم الخدمات وليس رقم صورة. */}
                <h3>{t("services.item1.title")}</h3>
                {/* عنوان الخدمة الأولى. */}
                <p>{t("services.item1.desc")}</p>
                {/* وصف الخدمة الأولى. */}
              </article>

              <article className="feature">
                {/* بطاقة الخدمة الثانية. */}
                <div className="feature__icon">02</div>
                {/* رقم الخدمة الثانية محفوظ لأنه جزء من تصميم الخدمات. */}
                <h3>{t("services.item2.title")}</h3>
                {/* عنوان الخدمة الثانية. */}
                <p>{t("services.item2.desc")}</p>
                {/* وصف الخدمة الثانية. */}
              </article>

              <article className="feature">
                {/* بطاقة الخدمة الثالثة. */}
                <div className="feature__icon">03</div>
                {/* رقم الخدمة الثالثة محفوظ لأنه جزء من تصميم الخدمات. */}
                <h3>{t("services.item3.title")}</h3>
                {/* عنوان الخدمة الثالثة. */}
                <p>{t("services.item3.desc")}</p>
                {/* وصف الخدمة الثالثة. */}
              </article>
            </div>

            <div className="center">
              {/* حاوية زر الخدمات. */}
              <Link className="btn btn--primary" href="/services">
                {/* رابط صفحة الخدمات. */}
                {t("services.cta")}
                {/* نص زر الخدمات. */}
              </Link>
            </div>
          </div>
        </section>

        <section className="stats">
          {/* بداية قسم الإحصائيات. */}

          <div className="container stats__inner">
            {/* حاوية الإحصائيات. */}

            <p className="stats__eyebrow">{t("stats.eyebrow")}</p>
            {/* النص الصغير. */}

            <h2 className="stats__title">{t("stats.title")}</h2>
            {/* عنوان الإحصائيات. */}

            <div className="stats__value">${normalizeText(safeData.statsValue, "1,024,125.02")}</div>
            {/* قيمة الإحصائية المالية. */}

            <p className="stats__desc">{t("stats.desc")}</p>
            {/* وصف الإحصائيات. */}

            <div className="stats__metaLine" style={{ marginTop: "16px", color: "#5b6677", fontSize: "14px", fontWeight: 600, lineHeight: 1.9 }}>
              {/* سطر معلومات الموقع والهاتف والبريد. */}

              <span>{normalizeText(safeData.location, "Iraq / Najaf")}</span>
              {/* عرض الموقع. */}

              <span style={{ marginInline: "8px" }}>•</span>
              {/* فاصل بصري. */}

              <a href={`tel:${normalizePhoneForTel(safeData.phone, "+9647802335555")}`} style={{ color: "inherit", textDecoration: "none" }}>
                {/* رابط الاتصال الهاتفي. */}
                {normalizeText(safeData.phone, "+964 7802335555")}
                {/* نص الهاتف. */}
              </a>

              <span style={{ marginInline: "8px" }}>•</span>
              {/* فاصل بصري. */}

              <a href={`mailto:${normalizeText(safeData.email, "info@zuha.us")}`} style={{ color: "inherit", textDecoration: "none" }}>
                {/* رابط البريد الإلكتروني. */}
                {normalizeText(safeData.email, "info@zuha.us")}
                {/* نص البريد الإلكتروني. */}
              </a>
            </div>
          </div>
        </section>

        <section className="projects">
          {/* بداية قسم المشاريع. */}

          <div className="container">
            {/* حاوية المشاريع. */}

            <h2 className="projects__title">{t("projects.title")}</h2>
            {/* عنوان المشاريع. */}

            <p className="projects__desc">{t("projects.desc")}</p>
            {/* وصف المشاريع. */}

            <div className="gallery">
              {/* معرض صور المشاريع بدون أرقام زخرفية. */}

              <figure className="tile tile--wide">
                {/* بطاقة المشروع الأول بدون رقم 04. */}
                <img src={project1} alt="Project 1" style={mediaImgStyle} />
                {/* صورة المشروع الأول. */}
              </figure>

              <div className="stack">
                {/* عمود صور المشاريع الجانبية. */}

                <figure className="tile">
                  {/* بطاقة المشروع الثاني بدون رقم 05. */}
                  <img src={project2} alt="Project 2" style={mediaImgStyle} />
                  {/* صورة المشروع الثاني. */}
                </figure>

                <figure className="tile">
                  {/* بطاقة المشروع الثالث بدون رقم 06. */}
                  <img src={project3} alt="Project 3" style={mediaImgStyle} />
                  {/* صورة المشروع الثالث. */}
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial">
          {/* بداية قسم شهادة العميل. */}

          <div className="container">
            {/* حاوية القسم. */}

            <figure className="quoteCard">
              {/* بطاقة العميل. */}

              <div className="quoteCard__media">
                {/* حاوية صورة العميل بدون رقم 07. */}
                <img src={quoteImage} alt="Client visual" style={mediaImgStyle} />
                {/* صورة العميل. */}
              </div>

              <figcaption className="quoteCard__body">
                {/* جسم بطاقة العميل. */}

                <div className="quoteBrand">{t("quote.brand")}</div>
                {/* اسم/تصنيف العميل. */}

                <blockquote className="quoteText">{t("quote.text")}</blockquote>
                {/* نص شهادة العميل. */}

                <div className="quoteMeta">
                  {/* بيانات العميل. */}
                  <span>{t("quote.author")}</span>
                  {/* اسم أو صفة العميل. */}
                  <span className="dot">•</span>
                  {/* فاصل. */}
                  <span>{t("quote.role")}</span>
                  {/* موقع أو دور العميل. */}
                </div>

                <Link className="btn btn--primary" href="/portfolio">
                  {/* رابط عرض الأعمال. */}
                  {t("quote.cta")}
                  {/* نص الرابط. */}
                </Link>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="newsletter">
          {/* بداية قسم النشرة البريدية بدون رقم 08. */}

          <div className="container">
            {/* حاوية القسم. */}

            <div className="newsletterCard">
              {/* بطاقة النشرة البريدية. */}

              <div>
                {/* حاوية النصوص. */}
                <h2 className="newsletterCard__title">{t("newsletter.title")}</h2>
                {/* عنوان النشرة. */}
                <p className="newsletterCard__desc">{t("newsletter.desc")}</p>
                {/* وصف النشرة. */}
              </div>

              <form className="newsletterForm" id="newsForm">
                {/* نموذج الاشتراك. */}

                <input type="email" name="email" placeholder={t("newsletter.placeholder")} aria-label="Email" />
                {/* حقل البريد الإلكتروني. */}

                <button className="btn btn--primary" type="submit">
                  {/* زر الاشتراك. */}
                  {t("newsletter.btn")}
                  {/* نص زر الاشتراك. */}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="team">
          {/* بداية قسم الفريق. */}

          <div className="container">
            {/* حاوية الفريق. */}

            <p className="kicker">{t("team.eyebrow")}</p>
            {/* النص الصغير لقسم الفريق. */}

            <h2 className="display">{t("team.title")}</h2>
            {/* عنوان قسم الفريق. */}

            <p className="sublead">{t("team.desc")}</p>
            {/* وصف قسم الفريق. */}

            <div className="teamGrid">
              {/* شبكة أعضاء الفريق بدون أرقام 09 و10 و11. */}

              <figure className="member">
                {/* بطاقة عضو الفريق الأول. */}
                <img src={team1} alt="Team member 1" style={mediaImgStyle} />
                {/* صورة عضو الفريق الأول. */}
                <figcaption>
                  {/* نص بطاقة عضو الفريق الأول. */}
                  <strong>{t("team.item1.name")}</strong>
                  {/* اسم عضو الفريق الأول. */}
                  <span>{t("team.item1.role")}</span>
                  {/* دور عضو الفريق الأول. */}
                </figcaption>
              </figure>

              <figure className="member">
                {/* بطاقة عضو الفريق الثاني. */}
                <img src={team2} alt="Team member 2" style={mediaImgStyle} />
                {/* صورة عضو الفريق الثاني. */}
                <figcaption>
                  {/* نص بطاقة عضو الفريق الثاني. */}
                  <strong>{t("team.item2.name")}</strong>
                  {/* اسم عضو الفريق الثاني. */}
                  <span>{t("team.item2.role")}</span>
                  {/* دور عضو الفريق الثاني. */}
                </figcaption>
              </figure>

              <figure className="member">
                {/* بطاقة عضو الفريق الثالث. */}
                <img src={team3} alt="Team member 3" style={mediaImgStyle} />
                {/* صورة عضو الفريق الثالث. */}
                <figcaption>
                  {/* نص بطاقة عضو الفريق الثالث. */}
                  <strong>{t("team.item3.name")}</strong>
                  {/* اسم عضو الفريق الثالث. */}
                  <span>{t("team.item3.role")}</span>
                  {/* دور عضو الفريق الثالث. */}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="faq">
          {/* بداية قسم FAQ بدون الرقم الزخرفي 12. */}

          <div className="container">
            {/* حاوية FAQ. */}

            <h2 className="faq__title">{t("faq.title")}</h2>
            {/* عنوان FAQ. */}

            <p className="faq__desc">{t("faq.desc")}</p>
            {/* وصف FAQ. */}

            <div className="faqGrid">
              {/* شبكة الأسئلة. */}

              <details className="qa">
                {/* سؤال 1. */}
                <summary>{t("faq.q1")}</summary>
                {/* عنوان السؤال 1. */}
                <p>{t("faq.a1")}</p>
                {/* إجابة السؤال 1. */}
              </details>

              <details className="qa">
                {/* سؤال 2. */}
                <summary>{t("faq.q2")}</summary>
                {/* عنوان السؤال 2. */}
                <p>{t("faq.a2")}</p>
                {/* إجابة السؤال 2. */}
              </details>

              <details className="qa">
                {/* سؤال 3. */}
                <summary>{t("faq.q3")}</summary>
                {/* عنوان السؤال 3. */}
                <p>{t("faq.a3")}</p>
                {/* إجابة السؤال 3. */}
              </details>

              <details className="qa">
                {/* سؤال 4. */}
                <summary>{t("faq.q4")}</summary>
                {/* عنوان السؤال 4. */}
                <p>{t("faq.a4")}</p>
                {/* إجابة السؤال 4. */}
              </details>
            </div>

            <div className="faqFooter">
              {/* نهاية قسم FAQ. */}
              <Link className="linkArrow" href="/faq">
                {/* رابط صفحة FAQ. */}
                {t("faq.cta")}
                {/* نص الرابط. */}
              </Link>
            </div>
          </div>
        </section>

        <section className="homeContactShowcase" aria-labelledby="home-contact-showcase-title">
          {/* بداية قسم الصورة والفوتر النهائي. */}

          <div className="container">
            {/* حاوية الصورة الخارجية. */}

            <figure className="homeContactShowcase__media">
              {/* إطار الصورة الوسطية فوق الفوتر. */}

              <img src={brandImage} alt={lang === "ar" ? "زها للتجارة العامة والاستثمار العقاري" : "ALZUHA real estate showcase"} className="homeContactShowcase__image" />
              {/* الصورة الأخيرة بحجم متوسط وبدون أرقام زخرفية. */}
            </figure>
          </div>

          <footer className="homeContactFooterBar" aria-label={lang === "ar" ? "معلومات التواصل" : "Contact information"}>
            {/* فوتر معلومات التواصل. */}

            <div className="container">
              {/* حاوية محتوى الفوتر. */}

              <div className="homeContactShowcase__head">
                {/* رأس الفوتر. */}

                <p className="kicker kicker--dark">{t("contact.eyebrow")}</p>
                {/* النص الصغير. */}

                <h2 id="home-contact-showcase-title" className="homeContactShowcase__title">
                  {/* عنوان الفوتر حسب اللغة. */}
                  {lang === "ar" ? (
                    <>
                      <span className="homeContactShowcase__titleLine">ابدأ خطوتك العقارية القادمة</span>
                      {/* السطر الأول من العنوان العربي. */}
                      <span className="homeContactShowcase__titleLine">بوضوح</span>
                      {/* السطر الثاني من العنوان العربي. */}
                    </>
                  ) : (
                    <>
                      <span className="homeContactShowcase__titleLine">Start your next real estate step</span>
                      {/* السطر الأول من العنوان الإنجليزي. */}
                      <span className="homeContactShowcase__titleLine">with clarity</span>
                      {/* السطر الثاني من العنوان الإنجليزي. */}
                    </>
                  )}
                </h2>

                <p className="homeContactShowcase__desc">{t("contact.desc")}</p>
                {/* وصف الفوتر. */}
              </div>

              <div className="homeContactFooterBar__grid">
                {/* شبكة بيانات التواصل. */}

                <a href="https://zuha.us" target="_blank" rel="noreferrer" className="homeContactFooterBar__item homeContactFooterBar__item--website">
                  {/* بطاقة الموقع الإلكتروني. */}
                  <span className="homeContactFooterBar__icon" aria-hidden="true">🌐</span>
                  {/* أيقونة الموقع. */}
                  <span className="homeContactFooterBar__text">
                    {/* نص بطاقة الموقع. */}
                    <span className="homeContactFooterBar__label">{lang === "ar" ? "الموقع الإلكتروني" : "Website"}</span>
                    {/* عنوان البطاقة. */}
                    <span className="homeContactFooterBar__value">zuha.us</span>
                    {/* قيمة الموقع. */}
                  </span>
                </a>

                <div className="homeContactFooterBar__item homeContactFooterBar__item--address">
                  {/* بطاقة العنوان. */}
                  <span className="homeContactFooterBar__icon" aria-hidden="true">🏢</span>
                  {/* أيقونة العنوان. */}
                  <span className="homeContactFooterBar__text">
                    {/* نص العنوان. */}
                    <span className="homeContactFooterBar__label">{lang === "ar" ? "العنوان" : "Address"}</span>
                    {/* عنوان البطاقة. */}
                    <span className="homeContactFooterBar__value">{lang === "ar" ? "العراق - النجف الأشرف" : "Iraq - Najaf Al-Ashraf"}</span>
                    {/* قيمة العنوان. */}
                  </span>
                </div>

                <a href={`tel:${normalizePhoneForTel(safeData.phone, "+9647802335555")}`} className="homeContactFooterBar__item homeContactFooterBar__item--phone">
                  {/* بطاقة الهاتف. */}
                  <span className="homeContactFooterBar__icon" aria-hidden="true">☎</span>
                  {/* أيقونة الهاتف. */}
                  <span className="homeContactFooterBar__text">
                    {/* نص الهاتف. */}
                    <span className="homeContactFooterBar__label">{lang === "ar" ? "الهاتف" : "Phone"}</span>
                    {/* عنوان البطاقة. */}
                    <span className="homeContactFooterBar__value">{normalizeText(safeData.phone, "+964 780 233 5555")}</span>
                    {/* قيمة الهاتف. */}
                  </span>
                </a>

                <a href={`mailto:${normalizeText(safeData.email, "info@zuha.us")}`} className="homeContactFooterBar__item homeContactFooterBar__item--email">
                  {/* بطاقة البريد الإلكتروني. */}
                  <span className="homeContactFooterBar__icon" aria-hidden="true">✉</span>
                  {/* أيقونة البريد. */}
                  <span className="homeContactFooterBar__text">
                    {/* نص البريد. */}
                    <span className="homeContactFooterBar__label">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</span>
                    {/* عنوان البطاقة. */}
                    <span className="homeContactFooterBar__value">{normalizeText(safeData.email, "info@zuha.us")}</span>
                    {/* قيمة البريد. */}
                  </span>
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>

      <Script src="/pages/home/js/projects-slider.js" strategy="afterInteractive" />
      {/* تشغيل سلايدر قسم المشاريع بعد تحميل الصفحة. */}

      <Script src="/pages/home/js/page.js" strategy="afterInteractive" />
      {/* تشغيل سلوك الواجهة العام بعد التفاعل. */}
    </>
  );
}
// نهاية HomePage.