"use client";
// هذا الملف Client Component لأن لوحة التحكم تحتاج state و hooks وعمليات حفظ مباشرة من المتصفح.

import { useEffect, useMemo, useState } from "react";
// نستورد hooks الأساسية فقط؛ لا نضيف مكتبات جديدة حتى يبقى التعديل آمنًا وخفيفًا.

type HeroSlide = {
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  image_url: string;
};
// تعريف شكل شريحة الهيرو داخل sections_json.

type ServiceItem = {
  label: string;
  title_ar: string;
  title_en: string;
  text_ar: string;
  text_en: string;
  btn_ar: string;
  btn_en: string;
  href: string;
  image_url: string;
};
// تعريف عنصر خدمة واحد داخل صفحة About.

type StatItem = {
  num: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
};
// تعريف عنصر إحصائي واحد.

type TeamMember = {
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  image_url: string;
};
// تعريف عضو فريق واحد.

type SocialItem = {
  label: string;
  href: string;
};
// تعريف رابط اجتماعي واحد في الفوتر.

type AboutSections = {
  hero: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    image_url: string;
    primary_btn_ar: string;
    primary_btn_en: string;
    primary_btn_href: string;
    secondary_btn_ar: string;
    secondary_btn_en: string;
    secondary_btn_href: string;
    slides: HeroSlide[];
  };
  vision: {
    kicker_ar: string;
    kicker_en: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  };
  services: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    items: ServiceItem[];
  };
  stats: {
    title_ar: string;
    title_en: string;
    items: StatItem[];
  };
  team: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    members: TeamMember[];
  };
  footer: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    email: string;
    phone: string;
    address_ar: string;
    address_en: string;
    social: SocialItem[];
  };
};
// تعريف sections_json كاملًا حتى يبقى المحرر type-safe وواضحًا.

type AboutPagePayload = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  hero_image_url: string;
  is_published: boolean;
  sections_json: AboutSections;
};
// تعريف السجل الكامل الذي يأتي من API ويُرسل للحفظ.

type AdminSectionId =
  | "overview"
  | "hero"
  | "slides"
  | "vision"
  | "services"
  | "stats"
  | "team"
  | "footer";
// تبويبات لوحة التحكم الجانبية.

type PreviewDevice = "desktop" | "tablet" | "mobile";
// أحجام المعاينة الحية.

type BuilderLang = "ar" | "en";
// نوع لغة واجهة لوحة التحكم نفسها؛ هذا لا يغيّر بيانات الصفحة، بل يغيّر أسماء الأزرار والعناوين فقط.

const builderCopy = {
  ar: {
    cms: "ALZUHA CMS",
    builderTitle: "منشئ صفحة النبذة",
    builderDesc: "جاهز — عدّل الحقول وشاهد التغييرات مباشرة.",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    viewPage: "عرض الصفحة",
    live: "منشور",
    draft: "مسودة",
    loading: "جارٍ تحميل محرر صفحة النبذة...",
    sections: "الأقسام",
    organizedEditor: "محرر منظم",
    livePreview: "معاينة مباشرة",
    aboutPage: "صفحة النبذة",
    desktop: "ديسكتوب",
    tablet: "تابلت",
    mobile: "موبايل",
    overview: "عام",
    overviewDesc: "عنوان الصفحة، الملخص، وحالة النشر",
    hero: "الهيرو",
    heroDesc: "المقدمة الرئيسية والأزرار والصورة الأساسية",
    slides: "الشرائح",
    slidesDesc: "معرض الهيرو المتحرك",
    vision: "الرؤية",
    visionDesc: "الرؤية والتموضع المؤسسي",
    services: "الخدمات",
    servicesDesc: "بطاقات الخدمات في صفحة النبذة",
    stats: "الإحصائيات",
    statsDesc: "الأرقام والمؤشرات ونقاط الإثبات",
    team: "الفريق",
    teamDesc: "بطاقات الفريق والأدوار القيادية",
    footer: "الفوتر",
    footerDesc: "بيانات التواصل والروابط الاجتماعية",
    addSlide: "إضافة شريحة",
    addService: "إضافة خدمة",
    addStat: "إضافة إحصائية",
    addMember: "إضافة عضو",
    addSocial: "إضافة رابط اجتماعي",
    remove: "حذف",
    publishedOnWebsite: "منشور على الموقع",
    pageTitleAr: "عنوان الصفحة AR",
    pageTitleEn: "عنوان الصفحة EN",
    summaryAr: "الملخص AR",
    summaryEn: "الملخص EN",
    heroKickerAr: "عبارة الهيرو AR",
    heroKickerEn: "عبارة الهيرو EN",
    heroTitleAr: "عنوان الهيرو AR",
    heroTitleEn: "عنوان الهيرو EN",
    heroDescAr: "وصف الهيرو AR",
    heroDescEn: "وصف الهيرو EN",
    mainHeroImage: "رابط صورة الهيرو الرئيسية",
    primaryButtonHref: "رابط الزر الأساسي",
    primaryButtonAr: "نص الزر الأساسي AR",
    primaryButtonEn: "نص الزر الأساسي EN",
    secondaryButtonHref: "رابط الزر الثانوي",
    secondaryButtonAr: "نص الزر الثانوي AR",
    secondaryButtonEn: "نص الزر الثانوي EN",
    imageHint: "مثال: /pages/about/img/img%20(1).jpg",
    titleAr: "العنوان AR",
    titleEn: "العنوان EN",
    descriptionAr: "الوصف AR",
    descriptionEn: "الوصف EN",
    imageUrl: "رابط الصورة",
    label: "الوسم",
    href: "الرابط",
    textAr: "النص AR",
    textEn: "النص EN",
    buttonAr: "الزر AR",
    buttonEn: "الزر EN",
    number: "الرقم",
    nameAr: "الاسم AR",
    nameEn: "الاسم EN",
    roleAr: "الدور AR",
    roleEn: "الدور EN",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    addressAr: "العنوان AR",
    addressEn: "العنوان EN",
    slide: "شريحة",
    service: "خدمة",
    stat: "إحصائية",
    member: "عضو",
    social: "رابط اجتماعي",
    savedSuccessfully: "تم الحفظ بنجاح.",
    failedSave: "فشل حفظ التغييرات.",
    failedLoad: "فشل تحميل بيانات المحرر.",
    failedLoadAbout: "فشل تحميل بيانات صفحة النبذة",
    aboutFallback: "معاينة صفحة النبذة",
    visionTitleFallback: "عنوان الرؤية",
    visionDescFallback: "وصف الرؤية",
    serviceTitleFallback: "عنوان الخدمة",
    serviceDescFallback: "وصف الخدمة",
    projectsFallback: "المشاريع",
    teamMemberFallback: "عضو الفريق",
    roleFallback: "الدور",
  },
  en: {
    cms: "ALZUHA CMS",
    builderTitle: "About Live Builder",
    builderDesc: "Ready — edit fields and preview changes live.",
    save: "Save Changes",
    saving: "Saving...",
    viewPage: "View Page",
    live: "Live",
    draft: "Draft",
    loading: "Loading About page editor...",
    sections: "Sections",
    organizedEditor: "Organized editor",
    livePreview: "Live Preview",
    aboutPage: "About Page",
    desktop: "desktop",
    tablet: "tablet",
    mobile: "mobile",
    overview: "Overview",
    overviewDesc: "Page title, summary, publish",
    hero: "Hero",
    heroDesc: "Main hero content and buttons",
    slides: "Slides",
    slidesDesc: "Stacked hero gallery",
    vision: "Vision",
    visionDesc: "Institutional vision and positioning",
    services: "Services",
    servicesDesc: "Cards shown in the About service section",
    stats: "Stats",
    statsDesc: "Numbers, proof points, and impact",
    team: "Team",
    teamDesc: "Team cards and leadership presentation",
    footer: "Footer",
    footerDesc: "Contact details and social links",
    addSlide: "Add Slide",
    addService: "Add Service",
    addStat: "Add Stat",
    addMember: "Add Member",
    addSocial: "Add Social",
    remove: "Remove",
    publishedOnWebsite: "Published on website",
    pageTitleAr: "Page Title AR",
    pageTitleEn: "Page Title EN",
    summaryAr: "Summary AR",
    summaryEn: "Summary EN",
    heroKickerAr: "Hero Kicker AR",
    heroKickerEn: "Hero Kicker EN",
    heroTitleAr: "Hero Title AR",
    heroTitleEn: "Hero Title EN",
    heroDescAr: "Hero Description AR",
    heroDescEn: "Hero Description EN",
    mainHeroImage: "Main Hero Image URL",
    primaryButtonHref: "Primary Button Href",
    primaryButtonAr: "Primary Button AR",
    primaryButtonEn: "Primary Button EN",
    secondaryButtonHref: "Secondary Button Href",
    secondaryButtonAr: "Secondary Button AR",
    secondaryButtonEn: "Secondary Button EN",
    imageHint: "Example: /pages/about/img/img%20(1).jpg",
    titleAr: "Title AR",
    titleEn: "Title EN",
    descriptionAr: "Description AR",
    descriptionEn: "Description EN",
    imageUrl: "Image URL",
    label: "Label",
    href: "Href",
    textAr: "Text AR",
    textEn: "Text EN",
    buttonAr: "Button AR",
    buttonEn: "Button EN",
    number: "Number",
    nameAr: "Name AR",
    nameEn: "Name EN",
    roleAr: "Role AR",
    roleEn: "Role EN",
    email: "Email",
    phone: "Phone",
    addressAr: "Address AR",
    addressEn: "Address EN",
    slide: "Slide",
    service: "Service",
    stat: "Stat",
    member: "Member",
    social: "Social",
    savedSuccessfully: "Saved successfully.",
    failedSave: "Failed to save changes.",
    failedLoad: "Failed to load editor data",
    failedLoadAbout: "Failed to load About page data",
    aboutFallback: "About page preview",
    visionTitleFallback: "Vision title",
    visionDescFallback: "Vision description",
    serviceTitleFallback: "Service title",
    serviceDescFallback: "Service description",
    projectsFallback: "Projects",
    teamMemberFallback: "Team Member",
    roleFallback: "Role",
  },
} as const;
// قاموس النصوص الخاص بواجهة الأدمن؛ وضعناه محليًا حتى لا نغيّر API أو قاعدة البيانات.

type BuilderCopy = (typeof builderCopy)[BuilderLang];
// نوع مساعد يضمن أن كل المكوّنات تستخدم مفاتيح ترجمة صحيحة.

function createDefaultPayload(): AboutPagePayload {
  // نسخة احتياطية تمنع انهيار اللوحة إذا تأخر API أو رجع سجلًا ناقصًا.
  return {
    slug: "about",
    title_ar: "من نحن",
    title_en: "About",
    content_ar: "نبذة مؤسسية تعكس رؤية الزُهى وهويتها وخدماتها.",
    content_en:
      "An institutional profile reflecting ALZUHA’s vision, identity, and services.",
    hero_image_url: "/pages/about/img/img%20(1).jpg",
    is_published: true,
    sections_json: {
      hero: {
        kicker_ar: "نبذة مؤسسية",
        kicker_en: "Institutional profile",
        title_ar: "رؤية واضحة. استثمار موثوق. مستقبل مشرق.",
        title_en: "Clear vision. Trusted investment. Brighter future.",
        desc_ar:
          "نعرض في الزُهى خبرتنا المؤسسية ورؤيتنا العقارية بلغة احترافية توازن بين الهوية والاستثمار والتنفيذ.",
        desc_en:
          "At ALZUHA, we present our institutional profile and real-estate vision through a professional narrative balancing identity, investment, and execution.",
        image_url: "/pages/about/img/img%20(1).jpg",
        primary_btn_ar: "طلب استشارة",
        primary_btn_en: "Request Consultation",
        primary_btn_href: "/request-consultation",
        secondary_btn_ar: "تواصل معنا",
        secondary_btn_en: "Contact Us",
        secondary_btn_href: "/contact",
        slides: [
          {
            title_ar: "رؤية مؤسسية واضحة",
            title_en: "A clear institutional vision",
            desc_ar: "نقدّم صورة مؤسسية تعكس الثقة والانضباط وجودة الحضور العقاري.",
            desc_en:
              "We present an institutional image that reflects trust, discipline, and quality real-estate presence.",
            image_url: "/pages/about/img/img%20(1).jpg",
          },
        ],
      },
      vision: {
        kicker_ar: "رؤية الزُهى",
        kicker_en: "ALZUHA Vision",
        title_ar: "نحو حضور عقاري موثوق ومؤثر",
        title_en: "Toward a trusted and influential real-estate presence",
        desc_ar:
          "نهدف إلى بناء علامة عقارية قوية ترتكز على الوضوح، الانضباط، والخبرة العملية في التطوير والاستثمار وإدارة الأصول.",
        desc_en:
          "We aim to build a strong real-estate brand grounded in clarity, discipline, and practical experience in development, investment, and asset management.",
      },
      services: {
        title_ar: "كيف نترجم الرؤية إلى قيمة عملية",
        title_en: "How we translate vision into practical value",
        desc_ar:
          "نربط بين الهوية المؤسسية والخدمات العقارية المتخصصة في إطار متماسك يخدم العميل والمستثمر.",
        desc_en:
          "We connect institutional identity with specialized real-estate services in one coherent framework serving both clients and investors.",
        items: [
          {
            label: "01",
            title_ar: "الاستشارات العقارية",
            title_en: "Real Estate Advisory",
            text_ar: "استشارات مبنية على قراءة دقيقة للسوق والفرص والتموضع والقرار.",
            text_en:
              "Advisory built on accurate market reading, opportunity analysis, positioning, and decision support.",
            btn_ar: "استكشف الخدمة",
            btn_en: "Explore Service",
            href: "/services",
            image_url: "/pages/about/img/img%20(2).jpg",
          },
        ],
      },
      stats: {
        title_ar: "أرقام تعكس مكانتنا المؤسسية",
        title_en: "Numbers that reflect our institutional position",
        items: [
          {
            num: "+100",
            title_ar: "مشروع وخدمة",
            title_en: "Projects & Services",
            desc_ar: "تنوع في التنفيذ والاستشارات والمخرجات العقارية.",
            desc_en:
              "A diversified footprint across execution, advisory, and real-estate outputs.",
          },
        ],
      },
      team: {
        title_ar: "الفريق الذي يقود الحضور المؤسسي",
        title_en: "The team driving the institutional presence",
        desc_ar: "نمزج بين الخبرة، الحضور، والانضباط المهني في فريق يعكس هوية الزُهى.",
        desc_en:
          "We combine expertise, presence, and professional discipline in a team that reflects ALZUHA’s identity.",
        members: [
          {
            name_ar: "آدم نصار",
            name_en: "Adam Nassar",
            role_ar: "مدير تطوير المشاريع",
            role_en: "Projects Development Lead",
            image_url: "/pages/about/img/img%20(6).jpg",
          },
        ],
      },
      footer: {
        title_ar: "حضور مؤسسي يستحق المتابعة",
        title_en: "An institutional presence worth following",
        desc_ar: "تابع الزُهى وتواصل معنا للاطلاع على رؤيتنا وخدماتنا وفرصنا العقارية.",
        desc_en:
          "Follow ALZUHA and connect with us to explore our vision, services, and real-estate opportunities.",
        email: "info@zuha.us",
        phone: "+964 7802335555",
        address_ar: "العراق / النجف",
        address_en: "Iraq / Najaf",
        social: [{ label: "Instagram", href: "https://instagram.com/" }],
      },
    },
  };
}

function clone<T>(value: T): T {
  // استنساخ عميق مناسب لبنية JSON الحالية.
  return JSON.parse(JSON.stringify(value)) as T;
}

function safeText(value: string | undefined | null, fallback: string): string {
  // يمنع ظهور حقول فارغة داخل المعاينة.
  return typeof value === "string" && value.trim() ? value : fallback;
}

function safeImage(value: string | undefined | null, fallback: string): string {
  // يمنع انكسار الصور في المعاينة إذا لم يدخل المستخدم مسارًا.
  return typeof value === "string" && value.trim() ? value : fallback;
}

function Field(props: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  // حقل إدخال موحد حتى تكون الواجهة متماسكة.
  return (
    <label className="about-field">
      <span className="about-field__label">{props.label}</span>
      {props.hint ? <span className="about-field__hint">{props.hint}</span> : null}
      {props.children}
    </label>
  );
}

function BuilderHeader(props: {
  message: string;
  saving: boolean;
  published: boolean;
  lang: BuilderLang;
  copy: BuilderCopy;
  onSave: () => void;
  onLangChange: (lang: BuilderLang) => void;
}) {
  // شريط علوي ثابت نسبيًا يحفظ أهم الإجراءات أمام المستخدم.
  return (
    <div className="about-builder-topbar">
      <div>
        <span className="about-builder-topbar__eyebrow">{props.copy.cms}</span>
        <h2>{props.copy.builderTitle}</h2>
        <p>{props.message || props.copy.builderDesc}</p>
      </div>

      <div className="about-builder-topbar__actions">
        <div className="about-builder-lang" aria-label="Admin builder language">
          <button
            type="button"
            className={props.lang === "ar" ? "is-active" : ""}
            onClick={() => props.onLangChange("ar")}
          >
            AR
          </button>
          <button
            type="button"
            className={props.lang === "en" ? "is-active" : ""}
            onClick={() => props.onLangChange("en")}
          >
            EN
          </button>
        </div>

        <span className={props.published ? "about-publish-pill is-live" : "about-publish-pill"}>
          {props.published ? props.copy.live : props.copy.draft}
        </span>
        <a className="about-open-page" href="/about" target="_blank" rel="noreferrer">
          {props.copy.viewPage}
        </a>
        <button
          type="button"
          className="about-editor-save"
          onClick={props.onSave}
          disabled={props.saving}
        >
          {props.saving ? props.copy.saving : props.copy.save}
        </button>
      </div>
    </div>
  );
}

function SectionNav(props: {
  active: AdminSectionId;
  setActive: (id: AdminSectionId) => void;
  counts: Record<AdminSectionId, string>;
  copy: BuilderCopy;
}) {
  // قائمة أقسام جانبية بدل نموذج طويل مرهق.
  const items: Array<{ id: AdminSectionId; title: string; desc: string }> = [
    { id: "overview", title: props.copy.overview, desc: props.copy.overviewDesc },
    { id: "hero", title: props.copy.hero, desc: props.copy.heroDesc },
    { id: "slides", title: props.copy.slides, desc: props.copy.slidesDesc },
    { id: "vision", title: props.copy.vision, desc: props.copy.visionDesc },
    { id: "services", title: props.copy.services, desc: props.copy.servicesDesc },
    { id: "stats", title: props.copy.stats, desc: props.copy.statsDesc },
    { id: "team", title: props.copy.team, desc: props.copy.teamDesc },
    { id: "footer", title: props.copy.footer, desc: props.copy.footerDesc },
  ];

  return (
    <aside className="about-builder-nav" aria-label={props.copy.sections}>
      <div className="about-builder-nav__head">
        <strong>{props.copy.sections}</strong>
        <span>{props.copy.organizedEditor}</span>
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={props.active === item.id ? "about-builder-nav__item is-active" : "about-builder-nav__item"}
          onClick={() => props.setActive(item.id)}
        >
          <span>
            <strong>{item.title}</strong>
            <small>{item.desc}</small>
          </span>
          <em>{props.counts[item.id]}</em>
        </button>
      ))}
    </aside>
  );
}

function AboutLivePreview(props: {
  form: AboutPagePayload;
  device: PreviewDevice;
  lang: BuilderLang;
  copy: BuilderCopy;
  setDevice: (device: PreviewDevice) => void;
}) {
  // معاينة مصغّرة تعتمد على نفس form الحالي، لذلك تتغير فور الكتابة.
  const sections = props.form.sections_json;
  const isArabic = props.lang === "ar";
  const firstSlide = sections.hero.slides[0];
  const firstService = sections.services.items[0];
  const firstStat = sections.stats.items[0];
  const firstMember = sections.team.members[0];
  const heroImage = safeImage(
    firstSlide?.image_url || sections.hero.image_url || props.form.hero_image_url,
    "/pages/about/img/img%20(1).jpg"
  );

  const heroKicker = isArabic ? sections.hero.kicker_ar : sections.hero.kicker_en;
  const heroTitle = isArabic ? sections.hero.title_ar : sections.hero.title_en;
  const heroDesc = isArabic ? sections.hero.desc_ar : sections.hero.desc_en;
  const pageTitle = isArabic ? props.form.title_ar : props.form.title_en;
  const pageSummary = isArabic ? props.form.content_ar : props.form.content_en;
  const visionKicker = isArabic ? sections.vision.kicker_ar : sections.vision.kicker_en;
  const visionTitle = isArabic ? sections.vision.title_ar : sections.vision.title_en;
  const visionDesc = isArabic ? sections.vision.desc_ar : sections.vision.desc_en;
  const servicesTitle = isArabic ? sections.services.title_ar : sections.services.title_en;
  const serviceTitle = isArabic ? firstService?.title_ar : firstService?.title_en;
  const serviceText = isArabic ? firstService?.text_ar : firstService?.text_en;
  const statTitle = isArabic ? firstStat?.title_ar : firstStat?.title_en;
  const memberName = isArabic ? firstMember?.name_ar : firstMember?.name_en;
  const memberRole = isArabic ? firstMember?.role_ar : firstMember?.role_en;

  return (
    <aside className="about-live-preview" dir={isArabic ? "rtl" : "ltr"}>
      <div className="about-live-preview__toolbar">
        <div>
          <span className="about-live-preview__eyebrow">{props.copy.livePreview}</span>
          <strong>{props.copy.aboutPage}</strong>
        </div>

        <div className="about-live-preview__devices" aria-label="Preview device size">
          {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((device) => (
            <button
              key={device}
              type="button"
              className={props.device === device ? "is-active" : ""}
              onClick={() => props.setDevice(device)}
            >
              {props.copy[device]}
            </button>
          ))}
        </div>
      </div>

      <div className={`about-live-preview__stage is-${props.device}`}>
        <article className="about-preview-page">
          <section className="about-preview-hero">
            <img src={heroImage} alt={props.copy.aboutPage} />
            <div className="about-preview-hero__copy">
              <span>{safeText(heroKicker, isArabic ? "نبذة مؤسسية" : "Institutional profile")}</span>
              <h2>{safeText(heroTitle, pageTitle || props.copy.aboutPage)}</h2>
              <p>{safeText(heroDesc, pageSummary || props.copy.aboutFallback)}</p>
            </div>
          </section>

          <section className="about-preview-section about-preview-section--blue">
            <span>{safeText(visionKicker, isArabic ? "رؤية الزُهى" : "ALZUHA Vision")}</span>
            <h3>{safeText(visionTitle, props.copy.visionTitleFallback)}</h3>
            <p>{safeText(visionDesc, props.copy.visionDescFallback)}</p>
          </section>

          {firstService ? (
            <section className="about-preview-section">
              <span>{props.copy.services}</span>
              <h3>{safeText(servicesTitle, props.copy.services)}</h3>
              <article className="about-preview-card">
                <img src={safeImage(firstService.image_url, "/pages/about/img/img%20(2).jpg")} alt={props.copy.service} />
                <div>
                  <strong>{safeText(serviceTitle, props.copy.serviceTitleFallback)}</strong>
                  <p>{safeText(serviceText, props.copy.serviceDescFallback)}</p>
                </div>
              </article>
            </section>
          ) : null}

          <section className="about-preview-mini-grid">
            <div>
              <small>{props.copy.stat}</small>
              <strong>{safeText(firstStat?.num, "+100")}</strong>
              <span>{safeText(statTitle, props.copy.projectsFallback)}</span>
            </div>
            <div>
              <small>{props.copy.team}</small>
              <strong>{safeText(memberName, props.copy.teamMemberFallback)}</strong>
              <span>{safeText(memberRole, props.copy.roleFallback)}</span>
            </div>
          </section>
        </article>
      </div>
    </aside>
  );
}

export default function AboutPageEditor() {
  const [form, setForm] = useState<AboutPagePayload>(createDefaultPayload());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [activeSection, setActiveSection] = useState<AdminSectionId>("overview");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [builderLang, setBuilderLang] = useState<BuilderLang>("en");
  const copy = builderCopy[builderLang];

  function changeBuilderLang(nextLang: BuilderLang) {
    // تغيير لغة واجهة الأدمن فورًا، مع تحديث الكوكي ليستفيد الهيدر العام عند إعادة التحميل.
    setBuilderLang(nextLang);
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000`;
  }

  useEffect(() => {
    // قراءة لغة الموقع الحالية من الكوكي عند فتح محرر الأدمن.
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lang="))
      ?.split("=")[1];

    setBuilderLang(cookieLang === "ar" ? "ar" : "en");
  }, []);

  useEffect(() => {
    // تحميل بيانات الصفحة من API الإداري الحالي بدون تغيير الـ API.
    async function load() {
      setLoading(true);
      setMessage("");

      try {
        const res = await fetch("/api/admin/about-page", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok || !data?.ok) {
          throw new Error(data?.message || copy.failedLoadAbout);
        }

        setForm(data.page);
      } catch (error: unknown) {
        const text = error instanceof Error ? error.message : copy.failedLoad;
        setMessage(text);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function setTopField<K extends keyof AboutPagePayload>(key: K, value: AboutPagePayload[K]) {
    // تعديل حقل أعلى الصفحة مثل title أو publish state.
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSectionField<S extends keyof AboutSections, K extends keyof AboutSections[S]>(
    section: S,
    key: K,
    value: AboutSections[S][K]
  ) {
    // تعديل حقل مباشر داخل أي قسم من sections_json.
    setForm((prev) => ({
      ...prev,
      sections_json: {
        ...prev.sections_json,
        [section]: {
          ...prev.sections_json[section],
          [key]: value,
        },
      },
    }));
  }

  function updateHeroSlide(index: number, key: keyof HeroSlide, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides[index][key] = value;
      return next;
    });
  }

  function addHeroSlide() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides.push({ title_ar: "", title_en: "", desc_ar: "", desc_en: "", image_url: "" });
      return next;
    });
  }

  function removeHeroSlide(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides.splice(index, 1);
      if (next.sections_json.hero.slides.length === 0) next.sections_json.hero.slides.push({ title_ar: "", title_en: "", desc_ar: "", desc_en: "", image_url: "" });
      return next;
    });
  }

  function updateServiceItem(index: number, key: keyof ServiceItem, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items[index][key] = value;
      return next;
    });
  }

  function addServiceItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items.push({
        label: String(next.sections_json.services.items.length + 1).padStart(2, "0"),
        title_ar: "",
        title_en: "",
        text_ar: "",
        text_en: "",
        btn_ar: "",
        btn_en: "",
        href: "",
        image_url: "",
      });
      return next;
    });
  }

  function removeServiceItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items.splice(index, 1);
      if (next.sections_json.services.items.length === 0) next.sections_json.services.items.push({ label: "01", title_ar: "", title_en: "", text_ar: "", text_en: "", btn_ar: "", btn_en: "", href: "", image_url: "" });
      return next;
    });
  }

  function updateStatItem(index: number, key: keyof StatItem, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items[index][key] = value;
      return next;
    });
  }

  function addStatItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items.push({ num: "", title_ar: "", title_en: "", desc_ar: "", desc_en: "" });
      return next;
    });
  }

  function removeStatItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items.splice(index, 1);
      if (next.sections_json.stats.items.length === 0) next.sections_json.stats.items.push({ num: "", title_ar: "", title_en: "", desc_ar: "", desc_en: "" });
      return next;
    });
  }

  function updateTeamMember(index: number, key: keyof TeamMember, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members[index][key] = value;
      return next;
    });
  }

  function addTeamMember() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members.push({ name_ar: "", name_en: "", role_ar: "", role_en: "", image_url: "" });
      return next;
    });
  }

  function removeTeamMember(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members.splice(index, 1);
      if (next.sections_json.team.members.length === 0) next.sections_json.team.members.push({ name_ar: "", name_en: "", role_ar: "", role_en: "", image_url: "" });
      return next;
    });
  }

  function updateSocialItem(index: number, key: keyof SocialItem, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social[index][key] = value;
      return next;
    });
  }

  function addSocialItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social.push({ label: "", href: "" });
      return next;
    });
  }

  function removeSocialItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social.splice(index, 1);
      if (next.sections_json.footer.social.length === 0) next.sections_json.footer.social.push({ label: "", href: "" });
      return next;
    });
  }

  async function savePage() {
    // حفظ آمن بنفس نقطة API الحالية؛ لم نغيّر قاعدة البيانات ولا الـ route.
    setSaving(true);
    setMessage("");

    try {
      const payload = clone(form);
      payload.hero_image_url = payload.sections_json.hero.image_url || "";

      const res = await fetch("/api/admin/about-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data?.ok) throw new Error(data?.message || copy.failedSave);

      setForm(data.page);
      setMessage(copy.savedSuccessfully);
    } catch (error: unknown) {
      const text = error instanceof Error ? error.message : copy.failedSave;
      setMessage(text);
    } finally {
      setSaving(false);
    }
  }

  const isArabicBuilder = builderLang === "ar";

  const counts = useMemo<Record<AdminSectionId, string>>(
    () => ({
      overview: form.is_published ? copy.live : copy.draft,
      hero: isArabicBuilder ? "رئيسي" : "Main",
      slides: String(form.sections_json.hero.slides.length),
      vision: "1",
      services: String(form.sections_json.services.items.length),
      stats: String(form.sections_json.stats.items.length),
      team: String(form.sections_json.team.members.length),
      footer: String(form.sections_json.footer.social.length),
    }),
    [form, copy.live, copy.draft, builderLang]
  );

  if (loading) return <section className="about-editor-loading">{copy.loading}</section>;

  function renderOverview() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-section-heading">
          <span>01</span>
          <div>
            <h2>{copy.overview}</h2>
            <p>{copy.overviewDesc}</p>
          </div>
        </div>

        <div className="about-grid two">
          <Field label={copy.pageTitleAr}><input value={form.title_ar} onChange={(e) => setTopField("title_ar", e.target.value)} /></Field>
          <Field label={copy.pageTitleEn}><input value={form.title_en} onChange={(e) => setTopField("title_en", e.target.value)} /></Field>
          <Field label={copy.summaryAr}><textarea rows={4} value={form.content_ar} onChange={(e) => setTopField("content_ar", e.target.value)} /></Field>
          <Field label={copy.summaryEn}><textarea rows={4} value={form.content_en} onChange={(e) => setTopField("content_en", e.target.value)} /></Field>
        </div>

        <label className="about-checkbox about-checkbox--large">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setTopField("is_published", e.target.checked)} />
          <span>{copy.publishedOnWebsite}</span>
        </label>
      </section>
    );
  }

  function renderHero() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-section-heading">
          <span>02</span>
          <div>
            <h2>{copy.hero}</h2>
            <p>{copy.heroDesc}</p>
          </div>
        </div>

        <div className="about-grid two">
          <Field label={copy.heroKickerAr}><input value={form.sections_json.hero.kicker_ar} onChange={(e) => setSectionField("hero", "kicker_ar", e.target.value)} /></Field>
          <Field label={copy.heroKickerEn}><input value={form.sections_json.hero.kicker_en} onChange={(e) => setSectionField("hero", "kicker_en", e.target.value)} /></Field>
          <Field label={copy.heroTitleAr}><textarea rows={3} value={form.sections_json.hero.title_ar} onChange={(e) => setSectionField("hero", "title_ar", e.target.value)} /></Field>
          <Field label={copy.heroTitleEn}><textarea rows={3} value={form.sections_json.hero.title_en} onChange={(e) => setSectionField("hero", "title_en", e.target.value)} /></Field>
          <Field label={copy.heroDescAr}><textarea rows={4} value={form.sections_json.hero.desc_ar} onChange={(e) => setSectionField("hero", "desc_ar", e.target.value)} /></Field>
          <Field label={copy.heroDescEn}><textarea rows={4} value={form.sections_json.hero.desc_en} onChange={(e) => setSectionField("hero", "desc_en", e.target.value)} /></Field>
          <Field label={copy.mainHeroImage} hint={copy.imageHint}><input value={form.sections_json.hero.image_url} onChange={(e) => setSectionField("hero", "image_url", e.target.value)} /></Field>
          <Field label={copy.primaryButtonHref}><input value={form.sections_json.hero.primary_btn_href} onChange={(e) => setSectionField("hero", "primary_btn_href", e.target.value)} /></Field>
          <Field label={copy.primaryButtonAr}><input value={form.sections_json.hero.primary_btn_ar} onChange={(e) => setSectionField("hero", "primary_btn_ar", e.target.value)} /></Field>
          <Field label={copy.primaryButtonEn}><input value={form.sections_json.hero.primary_btn_en} onChange={(e) => setSectionField("hero", "primary_btn_en", e.target.value)} /></Field>
          <Field label={copy.secondaryButtonHref}><input value={form.sections_json.hero.secondary_btn_href} onChange={(e) => setSectionField("hero", "secondary_btn_href", e.target.value)} /></Field>
          <Field label={copy.secondaryButtonAr}><input value={form.sections_json.hero.secondary_btn_ar} onChange={(e) => setSectionField("hero", "secondary_btn_ar", e.target.value)} /></Field>
          <Field label={copy.secondaryButtonEn}><input value={form.sections_json.hero.secondary_btn_en} onChange={(e) => setSectionField("hero", "secondary_btn_en", e.target.value)} /></Field>
        </div>
      </section>
    );
  }

  function renderSlides() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky">
          <div className="about-section-heading compact">
            <span>03</span>
            <div>
              <h2>{copy.slides}</h2>
              <p>{copy.slidesDesc}</p>
            </div>
          </div>
          <button type="button" className="about-add-btn" onClick={addHeroSlide}>{copy.addSlide}</button>
        </div>

        <div className="about-stack">
          {form.sections_json.hero.slides.map((slide, index) => (
            <div className="about-item-card" key={`hero-slide-${index}`}>
              <div className="about-item-head"><strong>{copy.slide} #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeHeroSlide(index)}>{copy.remove}</button></div>
              <div className="about-grid two">
                <Field label={copy.titleAr}><input value={slide.title_ar} onChange={(e) => updateHeroSlide(index, "title_ar", e.target.value)} /></Field>
                <Field label={copy.titleEn}><input value={slide.title_en} onChange={(e) => updateHeroSlide(index, "title_en", e.target.value)} /></Field>
                <Field label={copy.descriptionAr}><textarea rows={3} value={slide.desc_ar} onChange={(e) => updateHeroSlide(index, "desc_ar", e.target.value)} /></Field>
                <Field label={copy.descriptionEn}><textarea rows={3} value={slide.desc_en} onChange={(e) => updateHeroSlide(index, "desc_en", e.target.value)} /></Field>
                <Field label={copy.imageUrl}><input value={slide.image_url} onChange={(e) => updateHeroSlide(index, "image_url", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderVision() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-section-heading"><span>04</span><div><h2>{copy.vision}</h2><p>{copy.visionDesc}</p></div></div>
        <div className="about-grid two">
          <Field label={copy.heroKickerAr}><input value={form.sections_json.vision.kicker_ar} onChange={(e) => setSectionField("vision", "kicker_ar", e.target.value)} /></Field>
          <Field label={copy.heroKickerEn}><input value={form.sections_json.vision.kicker_en} onChange={(e) => setSectionField("vision", "kicker_en", e.target.value)} /></Field>
          <Field label={copy.titleAr}><textarea rows={3} value={form.sections_json.vision.title_ar} onChange={(e) => setSectionField("vision", "title_ar", e.target.value)} /></Field>
          <Field label={copy.titleEn}><textarea rows={3} value={form.sections_json.vision.title_en} onChange={(e) => setSectionField("vision", "title_en", e.target.value)} /></Field>
          <Field label={copy.descriptionAr}><textarea rows={4} value={form.sections_json.vision.desc_ar} onChange={(e) => setSectionField("vision", "desc_ar", e.target.value)} /></Field>
          <Field label={copy.descriptionEn}><textarea rows={4} value={form.sections_json.vision.desc_en} onChange={(e) => setSectionField("vision", "desc_en", e.target.value)} /></Field>
        </div>
      </section>
    );
  }

  function renderServices() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>05</span><div><h2>{copy.services}</h2><p>{copy.servicesDesc}</p></div></div><button type="button" className="about-add-btn" onClick={addServiceItem}>{copy.addService}</button></div>
        <div className="about-grid two about-block-gap">
          <Field label={copy.titleAr}><input value={form.sections_json.services.title_ar} onChange={(e) => setSectionField("services", "title_ar", e.target.value)} /></Field>
          <Field label={copy.titleEn}><input value={form.sections_json.services.title_en} onChange={(e) => setSectionField("services", "title_en", e.target.value)} /></Field>
          <Field label={copy.descriptionAr}><textarea rows={4} value={form.sections_json.services.desc_ar} onChange={(e) => setSectionField("services", "desc_ar", e.target.value)} /></Field>
          <Field label={copy.descriptionEn}><textarea rows={4} value={form.sections_json.services.desc_en} onChange={(e) => setSectionField("services", "desc_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.services.items.map((item, index) => (
            <div className="about-item-card" key={`service-${index}`}>
              <div className="about-item-head"><strong>{copy.service} #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeServiceItem(index)}>{copy.remove}</button></div>
              <div className="about-grid two">
                <Field label={copy.label}><input value={item.label} onChange={(e) => updateServiceItem(index, "label", e.target.value)} /></Field>
                <Field label={copy.href}><input value={item.href} onChange={(e) => updateServiceItem(index, "href", e.target.value)} /></Field>
                <Field label={copy.titleAr}><input value={item.title_ar} onChange={(e) => updateServiceItem(index, "title_ar", e.target.value)} /></Field>
                <Field label={copy.titleEn}><input value={item.title_en} onChange={(e) => updateServiceItem(index, "title_en", e.target.value)} /></Field>
                <Field label={copy.textAr}><textarea rows={4} value={item.text_ar} onChange={(e) => updateServiceItem(index, "text_ar", e.target.value)} /></Field>
                <Field label={copy.textEn}><textarea rows={4} value={item.text_en} onChange={(e) => updateServiceItem(index, "text_en", e.target.value)} /></Field>
                <Field label={copy.buttonAr}><input value={item.btn_ar} onChange={(e) => updateServiceItem(index, "btn_ar", e.target.value)} /></Field>
                <Field label={copy.buttonEn}><input value={item.btn_en} onChange={(e) => updateServiceItem(index, "btn_en", e.target.value)} /></Field>
                <Field label={copy.imageUrl}><input value={item.image_url} onChange={(e) => updateServiceItem(index, "image_url", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderStats() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>06</span><div><h2>{copy.stats}</h2><p>{copy.statsDesc}</p></div></div><button type="button" className="about-add-btn" onClick={addStatItem}>{copy.addStat}</button></div>
        <div className="about-grid two about-block-gap">
          <Field label={copy.titleAr}><input value={form.sections_json.stats.title_ar} onChange={(e) => setSectionField("stats", "title_ar", e.target.value)} /></Field>
          <Field label={copy.titleEn}><input value={form.sections_json.stats.title_en} onChange={(e) => setSectionField("stats", "title_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.stats.items.map((item, index) => (
            <div className="about-item-card" key={`stat-${index}`}>
              <div className="about-item-head"><strong>{copy.stat} #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeStatItem(index)}>{copy.remove}</button></div>
              <div className="about-grid two">
                <Field label={copy.number}><input value={item.num} onChange={(e) => updateStatItem(index, "num", e.target.value)} /></Field>
                <Field label={copy.titleAr}><input value={item.title_ar} onChange={(e) => updateStatItem(index, "title_ar", e.target.value)} /></Field>
                <Field label={copy.titleEn}><input value={item.title_en} onChange={(e) => updateStatItem(index, "title_en", e.target.value)} /></Field>
                <Field label={copy.descriptionAr}><textarea rows={3} value={item.desc_ar} onChange={(e) => updateStatItem(index, "desc_ar", e.target.value)} /></Field>
                <Field label={copy.descriptionEn}><textarea rows={3} value={item.desc_en} onChange={(e) => updateStatItem(index, "desc_en", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderTeam() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>07</span><div><h2>{copy.team}</h2><p>{copy.teamDesc}</p></div></div><button type="button" className="about-add-btn" onClick={addTeamMember}>{copy.addMember}</button></div>
        <div className="about-grid two about-block-gap">
          <Field label={copy.titleAr}><input value={form.sections_json.team.title_ar} onChange={(e) => setSectionField("team", "title_ar", e.target.value)} /></Field>
          <Field label={copy.titleEn}><input value={form.sections_json.team.title_en} onChange={(e) => setSectionField("team", "title_en", e.target.value)} /></Field>
          <Field label={copy.descriptionAr}><textarea rows={4} value={form.sections_json.team.desc_ar} onChange={(e) => setSectionField("team", "desc_ar", e.target.value)} /></Field>
          <Field label={copy.descriptionEn}><textarea rows={4} value={form.sections_json.team.desc_en} onChange={(e) => setSectionField("team", "desc_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.team.members.map((member, index) => (
            <div className="about-item-card" key={`member-${index}`}>
              <div className="about-item-head"><strong>{copy.member} #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeTeamMember(index)}>{copy.remove}</button></div>
              <div className="about-grid two">
                <Field label={copy.nameAr}><input value={member.name_ar} onChange={(e) => updateTeamMember(index, "name_ar", e.target.value)} /></Field>
                <Field label={copy.nameEn}><input value={member.name_en} onChange={(e) => updateTeamMember(index, "name_en", e.target.value)} /></Field>
                <Field label={copy.roleAr}><input value={member.role_ar} onChange={(e) => updateTeamMember(index, "role_ar", e.target.value)} /></Field>
                <Field label={copy.roleEn}><input value={member.role_en} onChange={(e) => updateTeamMember(index, "role_en", e.target.value)} /></Field>
                <Field label={copy.imageUrl}><input value={member.image_url} onChange={(e) => updateTeamMember(index, "image_url", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderFooter() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>08</span><div><h2>{copy.footer}</h2><p>{copy.footerDesc}</p></div></div><button type="button" className="about-add-btn" onClick={addSocialItem}>{copy.addSocial}</button></div>
        <div className="about-grid two about-block-gap">
          <Field label={copy.titleAr}><input value={form.sections_json.footer.title_ar} onChange={(e) => setSectionField("footer", "title_ar", e.target.value)} /></Field>
          <Field label={copy.titleEn}><input value={form.sections_json.footer.title_en} onChange={(e) => setSectionField("footer", "title_en", e.target.value)} /></Field>
          <Field label={copy.descriptionAr}><textarea rows={4} value={form.sections_json.footer.desc_ar} onChange={(e) => setSectionField("footer", "desc_ar", e.target.value)} /></Field>
          <Field label={copy.descriptionEn}><textarea rows={4} value={form.sections_json.footer.desc_en} onChange={(e) => setSectionField("footer", "desc_en", e.target.value)} /></Field>
          <Field label={copy.email}><input value={form.sections_json.footer.email} onChange={(e) => setSectionField("footer", "email", e.target.value)} /></Field>
          <Field label={copy.phone}><input value={form.sections_json.footer.phone} onChange={(e) => setSectionField("footer", "phone", e.target.value)} /></Field>
          <Field label={copy.addressAr}><input value={form.sections_json.footer.address_ar} onChange={(e) => setSectionField("footer", "address_ar", e.target.value)} /></Field>
          <Field label={copy.addressEn}><input value={form.sections_json.footer.address_en} onChange={(e) => setSectionField("footer", "address_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.footer.social.map((social, index) => (
            <div className="about-item-card" key={`social-${index}`}>
              <div className="about-item-head"><strong>{copy.social} #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeSocialItem(index)}>{copy.remove}</button></div>
              <div className="about-grid two">
                <Field label={copy.label}><input value={social.label} onChange={(e) => updateSocialItem(index, "label", e.target.value)} /></Field>
                <Field label={copy.href}><input value={social.href} onChange={(e) => updateSocialItem(index, "href", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderActiveSection() {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "hero": return renderHero();
      case "slides": return renderSlides();
      case "vision": return renderVision();
      case "services": return renderServices();
      case "stats": return renderStats();
      case "team": return renderTeam();
      case "footer": return renderFooter();
      default: return renderOverview();
    }
  }

  return (
    <section className="about-editor about-editor--builder" dir={isArabicBuilder ? "rtl" : "ltr"}>
      <BuilderHeader
        message={message}
        saving={saving}
        published={form.is_published}
        lang={builderLang}
        copy={copy}
        onSave={savePage}
        onLangChange={changeBuilderLang}
      />

      <div className="about-builder-workspace">
        <SectionNav active={activeSection} setActive={setActiveSection} counts={counts} copy={copy} />

        <main className="about-builder-panel" aria-live="polite">
          {renderActiveSection()}
        </main>

        <AboutLivePreview form={form} device={previewDevice} lang={builderLang} copy={copy} setDevice={setPreviewDevice} />
      </div>
    </section>
  );
}
