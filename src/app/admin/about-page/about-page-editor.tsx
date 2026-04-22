"use client";

import { useEffect, useMemo, useState } from "react";

type HeroSlide = {
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  image_url: string;
};

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

type StatItem = {
  num: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
};

type TeamMember = {
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  image_url: string;
};

type SocialItem = {
  label: string;
  href: string;
};

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

// نسخة افتراضية محلية حتى لا ينهار المحرر قبل رجوع API
function createDefaultPayload(): AboutPagePayload {
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
            desc_ar:
              "نقدّم صورة مؤسسية تعكس الثقة والانضباط وجودة الحضور العقاري.",
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
            text_ar:
              "استشارات مبنية على قراءة دقيقة للسوق والفرص والتموضع والقرار.",
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
        desc_ar:
          "نمزج بين الخبرة، الحضور، والانضباط المهني في فريق يعكس هوية الزُهى.",
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
        desc_ar:
          "تابع الزُهى وتواصل معنا للاطلاع على رؤيتنا وخدماتنا وفرصنا العقارية.",
        desc_en:
          "Follow ALZUHA and connect with us to explore our vision, services, and real-estate opportunities.",
        email: "info@zuha.us",
        phone: "+964 7802335555",
        address_ar: "العراق / النجف",
        address_en: "Iraq / Najaf",
        social: [
          { label: "Instagram", href: "https://instagram.com/" },
        ],
      },
    },
  };
}

// استنساخ آمن لبيانات form
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// عنصر عنوان حقل موحّد
function Field(props: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="about-field">
      <span className="about-field__label">{props.label}</span>
      {props.hint ? (
        <span className="about-field__hint">{props.hint}</span>
      ) : null}
      {props.children}
    </label>
  );
}

export default function AboutPageEditor() {
  const [form, setForm] = useState<AboutPagePayload>(createDefaultPayload());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  // تحميل بيانات About الحالية
  useEffect(() => {
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
      } catch (error: any) {
        setMessage(error?.message || "Failed to load editor data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // تعديل أي حقل علوي في الصفحة
  function setTopField<K extends keyof AboutPagePayload>(
    key: K,
    value: AboutPagePayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // تعديل أي حقل بسيط داخل قسم
  function setSectionField<
    S extends keyof AboutSections,
    K extends keyof AboutSections[S]
  >(section: S, key: K, value: AboutSections[S][K]) {
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

  // تحديث شريحة Hero
  function updateHeroSlide(
    index: number,
    key: keyof HeroSlide,
    value: string
  ) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides[index][key] = value;
      return next;
    });
  }

  // إضافة شريحة جديدة
  function addHeroSlide() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides.push({
        title_ar: "",
        title_en: "",
        desc_ar: "",
        desc_en: "",
        image_url: "",
      });
      return next;
    });
  }

  // حذف شريحة
  function removeHeroSlide(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.hero.slides.splice(index, 1);

      if (next.sections_json.hero.slides.length === 0) {
        next.sections_json.hero.slides.push({
          title_ar: "",
          title_en: "",
          desc_ar: "",
          desc_en: "",
          image_url: "",
        });
      }

      return next;
    });
  }

  // تحديث عنصر خدمة
  function updateServiceItem(
    index: number,
    key: keyof ServiceItem,
    value: string
  ) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items[index][key] = value;
      return next;
    });
  }

  // إضافة خدمة
  function addServiceItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items.push({
        label: String(next.sections_json.services.items.length + 1).padStart(
          2,
          "0"
        ),
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

  // حذف خدمة
  function removeServiceItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.services.items.splice(index, 1);

      if (next.sections_json.services.items.length === 0) {
        next.sections_json.services.items.push({
          label: "01",
          title_ar: "",
          title_en: "",
          text_ar: "",
          text_en: "",
          btn_ar: "",
          btn_en: "",
          href: "",
          image_url: "",
        });
      }

      return next;
    });
  }

  // تحديث عنصر إحصائي
  function updateStatItem(index: number, key: keyof StatItem, value: string) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items[index][key] = value;
      return next;
    });
  }

  // إضافة عنصر إحصائي
  function addStatItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items.push({
        num: "",
        title_ar: "",
        title_en: "",
        desc_ar: "",
        desc_en: "",
      });
      return next;
    });
  }

  // حذف عنصر إحصائي
  function removeStatItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.stats.items.splice(index, 1);

      if (next.sections_json.stats.items.length === 0) {
        next.sections_json.stats.items.push({
          num: "",
          title_ar: "",
          title_en: "",
          desc_ar: "",
          desc_en: "",
        });
      }

      return next;
    });
  }

  // تحديث عضو فريق
  function updateTeamMember(
    index: number,
    key: keyof TeamMember,
    value: string
  ) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members[index][key] = value;
      return next;
    });
  }

  // إضافة عضو
  function addTeamMember() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members.push({
        name_ar: "",
        name_en: "",
        role_ar: "",
        role_en: "",
        image_url: "",
      });
      return next;
    });
  }

  // حذف عضو
  function removeTeamMember(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.team.members.splice(index, 1);

      if (next.sections_json.team.members.length === 0) {
        next.sections_json.team.members.push({
          name_ar: "",
          name_en: "",
          role_ar: "",
          role_en: "",
          image_url: "",
        });
      }

      return next;
    });
  }

  // تحديث رابط اجتماعي
  function updateSocialItem(
    index: number,
    key: keyof SocialItem,
    value: string
  ) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social[index][key] = value;
      return next;
    });
  }

  // إضافة رابط اجتماعي
  function addSocialItem() {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social.push({
        label: "",
        href: "",
      });
      return next;
    });
  }

  // حذف رابط اجتماعي
  function removeSocialItem(index: number) {
    setForm((prev) => {
      const next = clone(prev);
      next.sections_json.footer.social.splice(index, 1);

      if (next.sections_json.footer.social.length === 0) {
        next.sections_json.footer.social.push({
          label: "",
          href: "",
        });
      }

      return next;
    });
  }

  // حفظ الصفحة
  async function savePage() {
    setSaving(true);
    setMessage("");

    try {
      const payload = clone(form);

      // نجعل الحقل العلوي hero_image_url متطابقًا مع صورة الهيرو
      payload.hero_image_url = payload.sections_json.hero.image_url || "";

      const res = await fetch("/api/admin/about-page", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to save About page");
      }

      setForm(data.page);
      setMessage("Saved successfully.");
    } catch (error: any) {
      setMessage(error?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  const slideCount = useMemo(
    () => form.sections_json.hero.slides.length,
    [form.sections_json.hero.slides.length]
  );

  if (loading) {
    return (
      <section className="about-editor-loading">
        Loading About page editor...
      </section>
    );
  }

  return (
    <section className="about-editor">
      <div className="about-editor-actions">
        <div className="about-editor-status">
          {message ? message : "Ready"}
        </div>

        <button
          type="button"
          className="about-editor-save"
          onClick={savePage}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save About Page"}
        </button>
      </div>

      <section className="about-editor-card">
        <h2 className="about-editor-card__title">General Page Fields</h2>

        <div className="about-grid two">
          <Field label="Page Title AR">
            <input
              value={form.title_ar}
              onChange={(e) => setTopField("title_ar", e.target.value)}
            />
          </Field>

          <Field label="Page Title EN">
            <input
              value={form.title_en}
              onChange={(e) => setTopField("title_en", e.target.value)}
            />
          </Field>

          <Field label="Summary AR">
            <textarea
              rows={3}
              value={form.content_ar}
              onChange={(e) => setTopField("content_ar", e.target.value)}
            />
          </Field>

          <Field label="Summary EN">
            <textarea
              rows={3}
              value={form.content_en}
              onChange={(e) => setTopField("content_en", e.target.value)}
            />
          </Field>
        </div>

        <label className="about-checkbox">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setTopField("is_published", e.target.checked)}
          />
          <span>Published</span>
        </label>
      </section>

      <section className="about-editor-card">
        <h2 className="about-editor-card__title">Hero Section</h2>

        <div className="about-grid two">
          <Field label="Hero Kicker AR">
            <input
              value={form.sections_json.hero.kicker_ar}
              onChange={(e) =>
                setSectionField("hero", "kicker_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Hero Kicker EN">
            <input
              value={form.sections_json.hero.kicker_en}
              onChange={(e) =>
                setSectionField("hero", "kicker_en", e.target.value)
              }
            />
          </Field>

          <Field label="Hero Title AR">
            <textarea
              rows={3}
              value={form.sections_json.hero.title_ar}
              onChange={(e) =>
                setSectionField("hero", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Hero Title EN">
            <textarea
              rows={3}
              value={form.sections_json.hero.title_en}
              onChange={(e) =>
                setSectionField("hero", "title_en", e.target.value)
              }
            />
          </Field>

          <Field label="Hero Description AR">
            <textarea
              rows={4}
              value={form.sections_json.hero.desc_ar}
              onChange={(e) =>
                setSectionField("hero", "desc_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Hero Description EN">
            <textarea
              rows={4}
              value={form.sections_json.hero.desc_en}
              onChange={(e) =>
                setSectionField("hero", "desc_en", e.target.value)
              }
            />
          </Field>

          <Field
            label="Main Hero Image URL"
            hint="يمكنك وضع مسار من public مثل /pages/about/img/img%20(1).jpg"
          >
            <input
              value={form.sections_json.hero.image_url}
              onChange={(e) =>
                setSectionField("hero", "image_url", e.target.value)
              }
            />
          </Field>

          <Field label="Primary Button Href">
            <input
              value={form.sections_json.hero.primary_btn_href}
              onChange={(e) =>
                setSectionField("hero", "primary_btn_href", e.target.value)
              }
            />
          </Field>

          <Field label="Primary Button AR">
            <input
              value={form.sections_json.hero.primary_btn_ar}
              onChange={(e) =>
                setSectionField("hero", "primary_btn_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Primary Button EN">
            <input
              value={form.sections_json.hero.primary_btn_en}
              onChange={(e) =>
                setSectionField("hero", "primary_btn_en", e.target.value)
              }
            />
          </Field>

          <Field label="Secondary Button Href">
            <input
              value={form.sections_json.hero.secondary_btn_href}
              onChange={(e) =>
                setSectionField("hero", "secondary_btn_href", e.target.value)
              }
            />
          </Field>

          <Field label="Secondary Button AR">
            <input
              value={form.sections_json.hero.secondary_btn_ar}
              onChange={(e) =>
                setSectionField("hero", "secondary_btn_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Secondary Button EN">
            <input
              value={form.sections_json.hero.secondary_btn_en}
              onChange={(e) =>
                setSectionField("hero", "secondary_btn_en", e.target.value)
              }
            />
          </Field>
        </div>

        <div className="about-subheader">
          <h3>Hero Slides ({slideCount})</h3>
          <button type="button" className="about-add-btn" onClick={addHeroSlide}>
            Add Slide
          </button>
        </div>

        <div className="about-stack">
          {form.sections_json.hero.slides.map((slide, index) => (
            <div className="about-item-card" key={`hero-slide-${index}`}>
              <div className="about-item-head">
                <strong>Slide #{index + 1}</strong>
                <button
                  type="button"
                  className="about-remove-btn"
                  onClick={() => removeHeroSlide(index)}
                >
                  Remove
                </button>
              </div>

              <div className="about-grid two">
                <Field label="Slide Title AR">
                  <input
                    value={slide.title_ar}
                    onChange={(e) =>
                      updateHeroSlide(index, "title_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Slide Title EN">
                  <input
                    value={slide.title_en}
                    onChange={(e) =>
                      updateHeroSlide(index, "title_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Slide Description AR">
                  <textarea
                    rows={3}
                    value={slide.desc_ar}
                    onChange={(e) =>
                      updateHeroSlide(index, "desc_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Slide Description EN">
                  <textarea
                    rows={3}
                    value={slide.desc_en}
                    onChange={(e) =>
                      updateHeroSlide(index, "desc_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Slide Image URL">
                  <input
                    value={slide.image_url}
                    onChange={(e) =>
                      updateHeroSlide(index, "image_url", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-editor-card">
        <h2 className="about-editor-card__title">Vision Section</h2>

        <div className="about-grid two">
          <Field label="Vision Kicker AR">
            <input
              value={form.sections_json.vision.kicker_ar}
              onChange={(e) =>
                setSectionField("vision", "kicker_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Vision Kicker EN">
            <input
              value={form.sections_json.vision.kicker_en}
              onChange={(e) =>
                setSectionField("vision", "kicker_en", e.target.value)
              }
            />
          </Field>

          <Field label="Vision Title AR">
            <textarea
              rows={3}
              value={form.sections_json.vision.title_ar}
              onChange={(e) =>
                setSectionField("vision", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Vision Title EN">
            <textarea
              rows={3}
              value={form.sections_json.vision.title_en}
              onChange={(e) =>
                setSectionField("vision", "title_en", e.target.value)
              }
            />
          </Field>

          <Field label="Vision Description AR">
            <textarea
              rows={4}
              value={form.sections_json.vision.desc_ar}
              onChange={(e) =>
                setSectionField("vision", "desc_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Vision Description EN">
            <textarea
              rows={4}
              value={form.sections_json.vision.desc_en}
              onChange={(e) =>
                setSectionField("vision", "desc_en", e.target.value)
              }
            />
          </Field>
        </div>
      </section>

      <section className="about-editor-card">
        <div className="about-subheader">
          <h2 className="about-editor-card__title">Services Section</h2>
          <button type="button" className="about-add-btn" onClick={addServiceItem}>
            Add Service Item
          </button>
        </div>

        <div className="about-grid two">
          <Field label="Services Title AR">
            <input
              value={form.sections_json.services.title_ar}
              onChange={(e) =>
                setSectionField("services", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Services Title EN">
            <input
              value={form.sections_json.services.title_en}
              onChange={(e) =>
                setSectionField("services", "title_en", e.target.value)
              }
            />
          </Field>

          <Field label="Services Description AR">
            <textarea
              rows={4}
              value={form.sections_json.services.desc_ar}
              onChange={(e) =>
                setSectionField("services", "desc_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Services Description EN">
            <textarea
              rows={4}
              value={form.sections_json.services.desc_en}
              onChange={(e) =>
                setSectionField("services", "desc_en", e.target.value)
              }
            />
          </Field>
        </div>

        <div className="about-stack">
          {form.sections_json.services.items.map((item, index) => (
            <div className="about-item-card" key={`service-${index}`}>
              <div className="about-item-head">
                <strong>Service #{index + 1}</strong>
                <button
                  type="button"
                  className="about-remove-btn"
                  onClick={() => removeServiceItem(index)}
                >
                  Remove
                </button>
              </div>

              <div className="about-grid two">
                <Field label="Label">
                  <input
                    value={item.label}
                    onChange={(e) =>
                      updateServiceItem(index, "label", e.target.value)
                    }
                  />
                </Field>

                <Field label="Href">
                  <input
                    value={item.href}
                    onChange={(e) =>
                      updateServiceItem(index, "href", e.target.value)
                    }
                  />
                </Field>

                <Field label="Title AR">
                  <input
                    value={item.title_ar}
                    onChange={(e) =>
                      updateServiceItem(index, "title_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Title EN">
                  <input
                    value={item.title_en}
                    onChange={(e) =>
                      updateServiceItem(index, "title_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Text AR">
                  <textarea
                    rows={4}
                    value={item.text_ar}
                    onChange={(e) =>
                      updateServiceItem(index, "text_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Text EN">
                  <textarea
                    rows={4}
                    value={item.text_en}
                    onChange={(e) =>
                      updateServiceItem(index, "text_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Button AR">
                  <input
                    value={item.btn_ar}
                    onChange={(e) =>
                      updateServiceItem(index, "btn_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Button EN">
                  <input
                    value={item.btn_en}
                    onChange={(e) =>
                      updateServiceItem(index, "btn_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Image URL">
                  <input
                    value={item.image_url}
                    onChange={(e) =>
                      updateServiceItem(index, "image_url", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-editor-card">
        <div className="about-subheader">
          <h2 className="about-editor-card__title">Stats Section</h2>
          <button type="button" className="about-add-btn" onClick={addStatItem}>
            Add Stat Item
          </button>
        </div>

        <div className="about-grid two">
          <Field label="Stats Title AR">
            <input
              value={form.sections_json.stats.title_ar}
              onChange={(e) =>
                setSectionField("stats", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Stats Title EN">
            <input
              value={form.sections_json.stats.title_en}
              onChange={(e) =>
                setSectionField("stats", "title_en", e.target.value)
              }
            />
          </Field>
        </div>

        <div className="about-stack">
          {form.sections_json.stats.items.map((item, index) => (
            <div className="about-item-card" key={`stat-${index}`}>
              <div className="about-item-head">
                <strong>Stat #{index + 1}</strong>
                <button
                  type="button"
                  className="about-remove-btn"
                  onClick={() => removeStatItem(index)}
                >
                  Remove
                </button>
              </div>

              <div className="about-grid two">
                <Field label="Number">
                  <input
                    value={item.num}
                    onChange={(e) =>
                      updateStatItem(index, "num", e.target.value)
                    }
                  />
                </Field>

                <Field label="Title AR">
                  <input
                    value={item.title_ar}
                    onChange={(e) =>
                      updateStatItem(index, "title_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Title EN">
                  <input
                    value={item.title_en}
                    onChange={(e) =>
                      updateStatItem(index, "title_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Description AR">
                  <textarea
                    rows={3}
                    value={item.desc_ar}
                    onChange={(e) =>
                      updateStatItem(index, "desc_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Description EN">
                  <textarea
                    rows={3}
                    value={item.desc_en}
                    onChange={(e) =>
                      updateStatItem(index, "desc_en", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-editor-card">
        <div className="about-subheader">
          <h2 className="about-editor-card__title">Team Section</h2>
          <button type="button" className="about-add-btn" onClick={addTeamMember}>
            Add Team Member
          </button>
        </div>

        <div className="about-grid two">
          <Field label="Team Title AR">
            <input
              value={form.sections_json.team.title_ar}
              onChange={(e) =>
                setSectionField("team", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Team Title EN">
            <input
              value={form.sections_json.team.title_en}
              onChange={(e) =>
                setSectionField("team", "title_en", e.target.value)
              }
            />
          </Field>

          <Field label="Team Description AR">
            <textarea
              rows={4}
              value={form.sections_json.team.desc_ar}
              onChange={(e) =>
                setSectionField("team", "desc_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Team Description EN">
            <textarea
              rows={4}
              value={form.sections_json.team.desc_en}
              onChange={(e) =>
                setSectionField("team", "desc_en", e.target.value)
              }
            />
          </Field>
        </div>

        <div className="about-stack">
          {form.sections_json.team.members.map((member, index) => (
            <div className="about-item-card" key={`member-${index}`}>
              <div className="about-item-head">
                <strong>Member #{index + 1}</strong>
                <button
                  type="button"
                  className="about-remove-btn"
                  onClick={() => removeTeamMember(index)}
                >
                  Remove
                </button>
              </div>

              <div className="about-grid two">
                <Field label="Name AR">
                  <input
                    value={member.name_ar}
                    onChange={(e) =>
                      updateTeamMember(index, "name_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Name EN">
                  <input
                    value={member.name_en}
                    onChange={(e) =>
                      updateTeamMember(index, "name_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Role AR">
                  <input
                    value={member.role_ar}
                    onChange={(e) =>
                      updateTeamMember(index, "role_ar", e.target.value)
                    }
                  />
                </Field>

                <Field label="Role EN">
                  <input
                    value={member.role_en}
                    onChange={(e) =>
                      updateTeamMember(index, "role_en", e.target.value)
                    }
                  />
                </Field>

                <Field label="Image URL">
                  <input
                    value={member.image_url}
                    onChange={(e) =>
                      updateTeamMember(index, "image_url", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-editor-card">
        <div className="about-subheader">
          <h2 className="about-editor-card__title">Footer Section</h2>
          <button type="button" className="about-add-btn" onClick={addSocialItem}>
            Add Social Link
          </button>
        </div>

        <div className="about-grid two">
          <Field label="Footer Title AR">
            <input
              value={form.sections_json.footer.title_ar}
              onChange={(e) =>
                setSectionField("footer", "title_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Footer Title EN">
            <input
              value={form.sections_json.footer.title_en}
              onChange={(e) =>
                setSectionField("footer", "title_en", e.target.value)
              }
            />
          </Field>

          <Field label="Footer Description AR">
            <textarea
              rows={4}
              value={form.sections_json.footer.desc_ar}
              onChange={(e) =>
                setSectionField("footer", "desc_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Footer Description EN">
            <textarea
              rows={4}
              value={form.sections_json.footer.desc_en}
              onChange={(e) =>
                setSectionField("footer", "desc_en", e.target.value)
              }
            />
          </Field>

          <Field label="Email">
            <input
              value={form.sections_json.footer.email}
              onChange={(e) =>
                setSectionField("footer", "email", e.target.value)
              }
            />
          </Field>

          <Field label="Phone">
            <input
              value={form.sections_json.footer.phone}
              onChange={(e) =>
                setSectionField("footer", "phone", e.target.value)
              }
            />
          </Field>

          <Field label="Address AR">
            <input
              value={form.sections_json.footer.address_ar}
              onChange={(e) =>
                setSectionField("footer", "address_ar", e.target.value)
              }
            />
          </Field>

          <Field label="Address EN">
            <input
              value={form.sections_json.footer.address_en}
              onChange={(e) =>
                setSectionField("footer", "address_en", e.target.value)
              }
            />
          </Field>
        </div>

        <div className="about-stack">
          {form.sections_json.footer.social.map((social, index) => (
            <div className="about-item-card" key={`social-${index}`}>
              <div className="about-item-head">
                <strong>Social #{index + 1}</strong>
                <button
                  type="button"
                  className="about-remove-btn"
                  onClick={() => removeSocialItem(index)}
                >
                  Remove
                </button>
              </div>

              <div className="about-grid two">
                <Field label="Label">
                  <input
                    value={social.label}
                    onChange={(e) =>
                      updateSocialItem(index, "label", e.target.value)
                    }
                  />
                </Field>

                <Field label="Href">
                  <input
                    value={social.href}
                    onChange={(e) =>
                      updateSocialItem(index, "href", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}