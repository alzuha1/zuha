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
  onSave: () => void;
}) {
  // شريط علوي ثابت نسبيًا يحفظ أهم الإجراءات أمام المستخدم.
  return (
    <div className="about-builder-topbar">
      <div>
        <span className="about-builder-topbar__eyebrow">ALZUHA CMS</span>
        <h2>About Live Builder</h2>
        <p>{props.message || "Ready — edit fields and preview changes live."}</p>
      </div>

      <div className="about-builder-topbar__actions">
        <span className={props.published ? "about-publish-pill is-live" : "about-publish-pill"}>
          {props.published ? "Live" : "Draft"}
        </span>
        <a className="about-open-page" href="/about" target="_blank" rel="noreferrer">
          View Page
        </a>
        <button
          type="button"
          className="about-editor-save"
          onClick={props.onSave}
          disabled={props.saving}
        >
          {props.saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function SectionNav(props: {
  active: AdminSectionId;
  setActive: (id: AdminSectionId) => void;
  counts: Record<AdminSectionId, string>;
}) {
  // قائمة أقسام جانبية بدل نموذج طويل مرهق.
  const items: Array<{ id: AdminSectionId; title: string; desc: string }> = [
    { id: "overview", title: "Overview", desc: "Page title, summary, publish" },
    { id: "hero", title: "Hero", desc: "Main hero content and buttons" },
    { id: "slides", title: "Slides", desc: "Stacked hero gallery" },
    { id: "vision", title: "Vision", desc: "Institutional statement" },
    { id: "services", title: "Services", desc: "Service cards" },
    { id: "stats", title: "Stats", desc: "Numbers and proof" },
    { id: "team", title: "Team", desc: "Members and roles" },
    { id: "footer", title: "Footer", desc: "Contact and socials" },
  ];

  return (
    <aside className="about-builder-nav" aria-label="About builder sections">
      <div className="about-builder-nav__head">
        <strong>Sections</strong>
        <span>Organized editor</span>
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
  setDevice: (device: PreviewDevice) => void;
}) {
  // معاينة مصغّرة تعتمد على نفس form الحالي، لذلك تتغير فور الكتابة.
  const sections = props.form.sections_json;
  const firstSlide = sections.hero.slides[0];
  const firstService = sections.services.items[0];
  const firstStat = sections.stats.items[0];
  const firstMember = sections.team.members[0];
  const heroImage = safeImage(
    firstSlide?.image_url || sections.hero.image_url || props.form.hero_image_url,
    "/pages/about/img/img%20(1).jpg"
  );

  return (
    <aside className="about-live-preview">
      <div className="about-live-preview__toolbar">
        <div>
          <span className="about-live-preview__eyebrow">Live Preview</span>
          <strong>About Page</strong>
        </div>

        <div className="about-live-preview__devices" aria-label="Preview device size">
          {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((device) => (
            <button
              key={device}
              type="button"
              className={props.device === device ? "is-active" : ""}
              onClick={() => props.setDevice(device)}
            >
              {device}
            </button>
          ))}
        </div>
      </div>

      <div className={`about-live-preview__stage is-${props.device}`}>
        <article className="about-preview-page">
          <section className="about-preview-hero">
            <img src={heroImage} alt="About preview hero" />
            <div className="about-preview-hero__copy">
              <span>{safeText(sections.hero.kicker_en, "Institutional profile")}</span>
              <h2>{safeText(sections.hero.title_en, props.form.title_en || "About")}</h2>
              <p>{safeText(sections.hero.desc_en, props.form.content_en || "About page preview")}</p>
            </div>
          </section>

          <section className="about-preview-section about-preview-section--blue">
            <span>{safeText(sections.vision.kicker_en, "ALZUHA Vision")}</span>
            <h3>{safeText(sections.vision.title_en, "Vision title")}</h3>
            <p>{safeText(sections.vision.desc_en, "Vision description")}</p>
          </section>

          {firstService ? (
            <section className="about-preview-section">
              <span>Services</span>
              <h3>{safeText(sections.services.title_en, "Services")}</h3>
              <article className="about-preview-card">
                <img src={safeImage(firstService.image_url, "/pages/about/img/img%20(2).jpg")} alt="Service preview" />
                <div>
                  <strong>{safeText(firstService.title_en, "Service title")}</strong>
                  <p>{safeText(firstService.text_en, "Service description")}</p>
                </div>
              </article>
            </section>
          ) : null}

          <section className="about-preview-mini-grid">
            <div>
              <small>Stat</small>
              <strong>{safeText(firstStat?.num, "+100")}</strong>
              <span>{safeText(firstStat?.title_en, "Projects")}</span>
            </div>
            <div>
              <small>Team</small>
              <strong>{safeText(firstMember?.name_en, "Team Member")}</strong>
              <span>{safeText(firstMember?.role_en, "Role")}</span>
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
          throw new Error(data?.message || "Failed to load About page data");
        }

        setForm(data.page);
      } catch (error: unknown) {
        const text = error instanceof Error ? error.message : "Failed to load editor data";
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

      if (!res.ok || !data?.ok) throw new Error(data?.message || "Failed to save About page");

      setForm(data.page);
      setMessage("Saved successfully.");
    } catch (error: unknown) {
      const text = error instanceof Error ? error.message : "Failed to save changes.";
      setMessage(text);
    } finally {
      setSaving(false);
    }
  }

  const counts = useMemo<Record<AdminSectionId, string>>(
    () => ({
      overview: form.is_published ? "Live" : "Draft",
      hero: "Main",
      slides: String(form.sections_json.hero.slides.length),
      vision: "1",
      services: String(form.sections_json.services.items.length),
      stats: String(form.sections_json.stats.items.length),
      team: String(form.sections_json.team.members.length),
      footer: String(form.sections_json.footer.social.length),
    }),
    [form]
  );

  if (loading) return <section className="about-editor-loading">Loading About page editor...</section>;

  function renderOverview() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-section-heading">
          <span>01</span>
          <div>
            <h2>Overview</h2>
            <p>Manage public title, summary, and publish state.</p>
          </div>
        </div>

        <div className="about-grid two">
          <Field label="Page Title AR"><input value={form.title_ar} onChange={(e) => setTopField("title_ar", e.target.value)} /></Field>
          <Field label="Page Title EN"><input value={form.title_en} onChange={(e) => setTopField("title_en", e.target.value)} /></Field>
          <Field label="Summary AR"><textarea rows={4} value={form.content_ar} onChange={(e) => setTopField("content_ar", e.target.value)} /></Field>
          <Field label="Summary EN"><textarea rows={4} value={form.content_en} onChange={(e) => setTopField("content_en", e.target.value)} /></Field>
        </div>

        <label className="about-checkbox about-checkbox--large">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setTopField("is_published", e.target.checked)} />
          <span>Published on website</span>
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
            <h2>Hero</h2>
            <p>Main introduction, buttons, and primary visual.</p>
          </div>
        </div>

        <div className="about-grid two">
          <Field label="Hero Kicker AR"><input value={form.sections_json.hero.kicker_ar} onChange={(e) => setSectionField("hero", "kicker_ar", e.target.value)} /></Field>
          <Field label="Hero Kicker EN"><input value={form.sections_json.hero.kicker_en} onChange={(e) => setSectionField("hero", "kicker_en", e.target.value)} /></Field>
          <Field label="Hero Title AR"><textarea rows={3} value={form.sections_json.hero.title_ar} onChange={(e) => setSectionField("hero", "title_ar", e.target.value)} /></Field>
          <Field label="Hero Title EN"><textarea rows={3} value={form.sections_json.hero.title_en} onChange={(e) => setSectionField("hero", "title_en", e.target.value)} /></Field>
          <Field label="Hero Description AR"><textarea rows={4} value={form.sections_json.hero.desc_ar} onChange={(e) => setSectionField("hero", "desc_ar", e.target.value)} /></Field>
          <Field label="Hero Description EN"><textarea rows={4} value={form.sections_json.hero.desc_en} onChange={(e) => setSectionField("hero", "desc_en", e.target.value)} /></Field>
          <Field label="Main Hero Image URL" hint="Example: /pages/about/img/img%20(1).jpg"><input value={form.sections_json.hero.image_url} onChange={(e) => setSectionField("hero", "image_url", e.target.value)} /></Field>
          <Field label="Primary Button Href"><input value={form.sections_json.hero.primary_btn_href} onChange={(e) => setSectionField("hero", "primary_btn_href", e.target.value)} /></Field>
          <Field label="Primary Button AR"><input value={form.sections_json.hero.primary_btn_ar} onChange={(e) => setSectionField("hero", "primary_btn_ar", e.target.value)} /></Field>
          <Field label="Primary Button EN"><input value={form.sections_json.hero.primary_btn_en} onChange={(e) => setSectionField("hero", "primary_btn_en", e.target.value)} /></Field>
          <Field label="Secondary Button Href"><input value={form.sections_json.hero.secondary_btn_href} onChange={(e) => setSectionField("hero", "secondary_btn_href", e.target.value)} /></Field>
          <Field label="Secondary Button AR"><input value={form.sections_json.hero.secondary_btn_ar} onChange={(e) => setSectionField("hero", "secondary_btn_ar", e.target.value)} /></Field>
          <Field label="Secondary Button EN"><input value={form.sections_json.hero.secondary_btn_en} onChange={(e) => setSectionField("hero", "secondary_btn_en", e.target.value)} /></Field>
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
              <h2>Hero Slides</h2>
              <p>Manage stacked visual storytelling.</p>
            </div>
          </div>
          <button type="button" className="about-add-btn" onClick={addHeroSlide}>Add Slide</button>
        </div>

        <div className="about-stack">
          {form.sections_json.hero.slides.map((slide, index) => (
            <div className="about-item-card" key={`hero-slide-${index}`}>
              <div className="about-item-head"><strong>Slide #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeHeroSlide(index)}>Remove</button></div>
              <div className="about-grid two">
                <Field label="Title AR"><input value={slide.title_ar} onChange={(e) => updateHeroSlide(index, "title_ar", e.target.value)} /></Field>
                <Field label="Title EN"><input value={slide.title_en} onChange={(e) => updateHeroSlide(index, "title_en", e.target.value)} /></Field>
                <Field label="Description AR"><textarea rows={3} value={slide.desc_ar} onChange={(e) => updateHeroSlide(index, "desc_ar", e.target.value)} /></Field>
                <Field label="Description EN"><textarea rows={3} value={slide.desc_en} onChange={(e) => updateHeroSlide(index, "desc_en", e.target.value)} /></Field>
                <Field label="Image URL"><input value={slide.image_url} onChange={(e) => updateHeroSlide(index, "image_url", e.target.value)} /></Field>
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
        <div className="about-section-heading"><span>04</span><div><h2>Vision</h2><p>Institutional vision and positioning.</p></div></div>
        <div className="about-grid two">
          <Field label="Vision Kicker AR"><input value={form.sections_json.vision.kicker_ar} onChange={(e) => setSectionField("vision", "kicker_ar", e.target.value)} /></Field>
          <Field label="Vision Kicker EN"><input value={form.sections_json.vision.kicker_en} onChange={(e) => setSectionField("vision", "kicker_en", e.target.value)} /></Field>
          <Field label="Vision Title AR"><textarea rows={3} value={form.sections_json.vision.title_ar} onChange={(e) => setSectionField("vision", "title_ar", e.target.value)} /></Field>
          <Field label="Vision Title EN"><textarea rows={3} value={form.sections_json.vision.title_en} onChange={(e) => setSectionField("vision", "title_en", e.target.value)} /></Field>
          <Field label="Vision Description AR"><textarea rows={4} value={form.sections_json.vision.desc_ar} onChange={(e) => setSectionField("vision", "desc_ar", e.target.value)} /></Field>
          <Field label="Vision Description EN"><textarea rows={4} value={form.sections_json.vision.desc_en} onChange={(e) => setSectionField("vision", "desc_en", e.target.value)} /></Field>
        </div>
      </section>
    );
  }

  function renderServices() {
    return (
      <section className="about-editor-card about-editor-card--active">
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>05</span><div><h2>Services</h2><p>Cards shown in the About service section.</p></div></div><button type="button" className="about-add-btn" onClick={addServiceItem}>Add Service</button></div>
        <div className="about-grid two about-block-gap">
          <Field label="Services Title AR"><input value={form.sections_json.services.title_ar} onChange={(e) => setSectionField("services", "title_ar", e.target.value)} /></Field>
          <Field label="Services Title EN"><input value={form.sections_json.services.title_en} onChange={(e) => setSectionField("services", "title_en", e.target.value)} /></Field>
          <Field label="Services Description AR"><textarea rows={4} value={form.sections_json.services.desc_ar} onChange={(e) => setSectionField("services", "desc_ar", e.target.value)} /></Field>
          <Field label="Services Description EN"><textarea rows={4} value={form.sections_json.services.desc_en} onChange={(e) => setSectionField("services", "desc_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.services.items.map((item, index) => (
            <div className="about-item-card" key={`service-${index}`}>
              <div className="about-item-head"><strong>Service #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeServiceItem(index)}>Remove</button></div>
              <div className="about-grid two">
                <Field label="Label"><input value={item.label} onChange={(e) => updateServiceItem(index, "label", e.target.value)} /></Field>
                <Field label="Href"><input value={item.href} onChange={(e) => updateServiceItem(index, "href", e.target.value)} /></Field>
                <Field label="Title AR"><input value={item.title_ar} onChange={(e) => updateServiceItem(index, "title_ar", e.target.value)} /></Field>
                <Field label="Title EN"><input value={item.title_en} onChange={(e) => updateServiceItem(index, "title_en", e.target.value)} /></Field>
                <Field label="Text AR"><textarea rows={4} value={item.text_ar} onChange={(e) => updateServiceItem(index, "text_ar", e.target.value)} /></Field>
                <Field label="Text EN"><textarea rows={4} value={item.text_en} onChange={(e) => updateServiceItem(index, "text_en", e.target.value)} /></Field>
                <Field label="Button AR"><input value={item.btn_ar} onChange={(e) => updateServiceItem(index, "btn_ar", e.target.value)} /></Field>
                <Field label="Button EN"><input value={item.btn_en} onChange={(e) => updateServiceItem(index, "btn_en", e.target.value)} /></Field>
                <Field label="Image URL"><input value={item.image_url} onChange={(e) => updateServiceItem(index, "image_url", e.target.value)} /></Field>
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
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>06</span><div><h2>Stats</h2><p>Numbers, proof points, and impact.</p></div></div><button type="button" className="about-add-btn" onClick={addStatItem}>Add Stat</button></div>
        <div className="about-grid two about-block-gap">
          <Field label="Stats Title AR"><input value={form.sections_json.stats.title_ar} onChange={(e) => setSectionField("stats", "title_ar", e.target.value)} /></Field>
          <Field label="Stats Title EN"><input value={form.sections_json.stats.title_en} onChange={(e) => setSectionField("stats", "title_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.stats.items.map((item, index) => (
            <div className="about-item-card" key={`stat-${index}`}>
              <div className="about-item-head"><strong>Stat #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeStatItem(index)}>Remove</button></div>
              <div className="about-grid two">
                <Field label="Number"><input value={item.num} onChange={(e) => updateStatItem(index, "num", e.target.value)} /></Field>
                <Field label="Title AR"><input value={item.title_ar} onChange={(e) => updateStatItem(index, "title_ar", e.target.value)} /></Field>
                <Field label="Title EN"><input value={item.title_en} onChange={(e) => updateStatItem(index, "title_en", e.target.value)} /></Field>
                <Field label="Description AR"><textarea rows={3} value={item.desc_ar} onChange={(e) => updateStatItem(index, "desc_ar", e.target.value)} /></Field>
                <Field label="Description EN"><textarea rows={3} value={item.desc_en} onChange={(e) => updateStatItem(index, "desc_en", e.target.value)} /></Field>
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
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>07</span><div><h2>Team</h2><p>Team cards and leadership presentation.</p></div></div><button type="button" className="about-add-btn" onClick={addTeamMember}>Add Member</button></div>
        <div className="about-grid two about-block-gap">
          <Field label="Team Title AR"><input value={form.sections_json.team.title_ar} onChange={(e) => setSectionField("team", "title_ar", e.target.value)} /></Field>
          <Field label="Team Title EN"><input value={form.sections_json.team.title_en} onChange={(e) => setSectionField("team", "title_en", e.target.value)} /></Field>
          <Field label="Team Description AR"><textarea rows={4} value={form.sections_json.team.desc_ar} onChange={(e) => setSectionField("team", "desc_ar", e.target.value)} /></Field>
          <Field label="Team Description EN"><textarea rows={4} value={form.sections_json.team.desc_en} onChange={(e) => setSectionField("team", "desc_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.team.members.map((member, index) => (
            <div className="about-item-card" key={`member-${index}`}>
              <div className="about-item-head"><strong>Member #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeTeamMember(index)}>Remove</button></div>
              <div className="about-grid two">
                <Field label="Name AR"><input value={member.name_ar} onChange={(e) => updateTeamMember(index, "name_ar", e.target.value)} /></Field>
                <Field label="Name EN"><input value={member.name_en} onChange={(e) => updateTeamMember(index, "name_en", e.target.value)} /></Field>
                <Field label="Role AR"><input value={member.role_ar} onChange={(e) => updateTeamMember(index, "role_ar", e.target.value)} /></Field>
                <Field label="Role EN"><input value={member.role_en} onChange={(e) => updateTeamMember(index, "role_en", e.target.value)} /></Field>
                <Field label="Image URL"><input value={member.image_url} onChange={(e) => updateTeamMember(index, "image_url", e.target.value)} /></Field>
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
        <div className="about-subheader about-subheader--sticky"><div className="about-section-heading compact"><span>08</span><div><h2>Footer</h2><p>Contact details and social links.</p></div></div><button type="button" className="about-add-btn" onClick={addSocialItem}>Add Social</button></div>
        <div className="about-grid two about-block-gap">
          <Field label="Footer Title AR"><input value={form.sections_json.footer.title_ar} onChange={(e) => setSectionField("footer", "title_ar", e.target.value)} /></Field>
          <Field label="Footer Title EN"><input value={form.sections_json.footer.title_en} onChange={(e) => setSectionField("footer", "title_en", e.target.value)} /></Field>
          <Field label="Footer Description AR"><textarea rows={4} value={form.sections_json.footer.desc_ar} onChange={(e) => setSectionField("footer", "desc_ar", e.target.value)} /></Field>
          <Field label="Footer Description EN"><textarea rows={4} value={form.sections_json.footer.desc_en} onChange={(e) => setSectionField("footer", "desc_en", e.target.value)} /></Field>
          <Field label="Email"><input value={form.sections_json.footer.email} onChange={(e) => setSectionField("footer", "email", e.target.value)} /></Field>
          <Field label="Phone"><input value={form.sections_json.footer.phone} onChange={(e) => setSectionField("footer", "phone", e.target.value)} /></Field>
          <Field label="Address AR"><input value={form.sections_json.footer.address_ar} onChange={(e) => setSectionField("footer", "address_ar", e.target.value)} /></Field>
          <Field label="Address EN"><input value={form.sections_json.footer.address_en} onChange={(e) => setSectionField("footer", "address_en", e.target.value)} /></Field>
        </div>
        <div className="about-stack">
          {form.sections_json.footer.social.map((social, index) => (
            <div className="about-item-card" key={`social-${index}`}>
              <div className="about-item-head"><strong>Social #{index + 1}</strong><button type="button" className="about-remove-btn" onClick={() => removeSocialItem(index)}>Remove</button></div>
              <div className="about-grid two">
                <Field label="Label"><input value={social.label} onChange={(e) => updateSocialItem(index, "label", e.target.value)} /></Field>
                <Field label="Href"><input value={social.href} onChange={(e) => updateSocialItem(index, "href", e.target.value)} /></Field>
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
    <section className="about-editor about-editor--builder">
      <BuilderHeader message={message} saving={saving} published={form.is_published} onSave={savePage} />

      <div className="about-builder-workspace">
        <SectionNav active={activeSection} setActive={setActiveSection} counts={counts} />

        <main className="about-builder-panel" aria-live="polite">
          {renderActiveSection()}
        </main>

        <AboutLivePreview form={form} device={previewDevice} setDevice={setPreviewDevice} />
      </div>
    </section>
  );
}
