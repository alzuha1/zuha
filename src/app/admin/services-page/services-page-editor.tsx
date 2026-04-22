"use client";
// هذا الملف عميل لأنه يحتوي على state وإدارة النموذج والتفاعل مع الأدمن

import { useMemo, useState } from "react";
// useState لإدارة الحالة المحلية
// useMemo لحساب الإحصائيات والتشخيصات بدون إعادة حساب غير ضرورية

type ServiceCardItem = {
  id: string;
  slug: string;
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
// نوع بطاقة الخدمة في الصفحة الرئيسية

type ServiceDetailCapability = {
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
};
// نوع كل Capability داخل الصفحة الفرعية

type ServiceDetailGalleryItem = {
  image_url: string;
  alt_ar: string;
  alt_en: string;
};
// نوع صور المعرض داخل الصفحة الفرعية الواحدة

type ServiceDetailItem = {
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

  capabilities: ServiceDetailCapability[];

  gallery: ServiceDetailGalleryItem[];

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
// نوع الصفحة الفرعية للخدمة

type TestimonialItem = {
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
// نوع شهادة العميل

type PublicGalleryImage = {
  id: string;
  is_active: boolean;
  sort_order: number;
  image_url: string;
  alt_ar: string;
  alt_en: string;
};
// نوع صورة المعرض العام في الصفحة الرئيسية

type ServicesPageSections = {
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
    items: ServiceCardItem[];
  };

  serviceDetails: {
    items: ServiceDetailItem[];
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
    images: PublicGalleryImage[];
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
// الشكل الكامل لـ sections_json في صفحة الخدمات

type ServicesPageAdminRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: ServicesPageSections | null;
};
// السجل الكامل الذي تتعامل معه لوحة الأدمن

type PathSegment = string | number;
// نوع المقطع داخل المسار الديناميكي عند التحديث الداخلي

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تحويل أي قيمة إلى نص منظف
  return String(value ?? fallback).trim();
}

function normalizeBoolean(value: unknown, fallback = false) {
  // إرجاع boolean آمن
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  // إرجاع رقم آمن
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeSlug(value: unknown) {
  // تحويل النص إلى slug داخلي صالح للمسارات
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createId(prefix: string) {
  // إنشاء معرف داخلي بسيط للعناصر الجديدة
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDeep<T>(value: T): T {
  // نسخ عميق للحالة قبل التعديل
  // مناسب هنا لأن بياناتنا JSON-like
  return JSON.parse(JSON.stringify(value)) as T;
}

function serviceHrefFromSlug(slug: string) {
  // توليد الرابط الداخلي الصحيح للخدمة
  const normalized = normalizeSlug(slug);
  return normalized ? `/services/${normalized}` : "/services/explore";
}

function createEmptyServiceCard(order = 1): ServiceCardItem {
  // إنشاء بطاقة خدمة جديدة افتراضية
  const slug = `new-service-${order}`;

  return {
    id: createId("service"),
    slug,
    is_active: true,
    sort_order: order,
    icon: "✨",
    image_url: "",
    title_ar: "خدمة جديدة",
    title_en: "New Service",
    desc_ar: "وصف مختصر للخدمة الجديدة.",
    desc_en: "Short description for the new service.",
    cta_label_ar: "افتح المسار",
    cta_label_en: "Open Path",
    href: serviceHrefFromSlug(slug),
  };
}

function createEmptyCapability(): ServiceDetailCapability {
  // إنشاء capability افتراضي
  return {
    title_ar: "ميزة جديدة",
    title_en: "New Capability",
    desc_ar: "وصف مختصر للميزة.",
    desc_en: "Short capability description.",
  };
}

function createEmptyDetailGalleryImage(): ServiceDetailGalleryItem {
  // إنشاء صورة جديدة داخل الصفحة الفرعية
  return {
    image_url: "",
    alt_ar: "صورة للخدمة",
    alt_en: "Service image",
  };
}

function createEmptyServiceDetail(order = 1): ServiceDetailItem {
  // إنشاء صفحة فرعية جديدة للخدمة
  const slug = `new-service-${order}`;

  return {
    id: createId("detail"),
    slug,
    is_active: true,
    sort_order: order,

    hero: {
      kicker_ar: "خدمة متخصصة",
      kicker_en: "Specialized Service",
      title_ar: "خدمة جديدة",
      title_en: "New Service",
      desc_ar: "وصف افتتاحي للخدمة.",
      desc_en: "Introductory service description.",
      image_url: "",
    },

    overview: {
      title_ar: "نظرة عامة",
      title_en: "Overview",
      desc_ar: "شرح مختصر عن نطاق هذه الخدمة.",
      desc_en: "A brief explanation of the service scope.",
    },

    capabilities: [createEmptyCapability()],

    gallery: [createEmptyDetailGalleryImage()],

    cta: {
      title_ar: "الخطوة التالية",
      title_en: "Next Step",
      desc_ar: "دعوة لاتخاذ الخطوة التالية.",
      desc_en: "A call to take the next step.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
    },
  };
}

function createDetailFromServiceCard(card: ServiceCardItem, order = 1): ServiceDetailItem {
  // توليد صفحة فرعية تلقائيًا من بطاقة خدمة
  // هذا مفيد حتى لا يضطر الأدمن إلى إعادة إدخال كل شيء من الصفر
  return {
    id: createId("detail"),
    slug: normalizeSlug(card.slug) || `service-${order}`,
    is_active: true,
    sort_order: order,

    hero: {
      kicker_ar: "خدمة متخصصة",
      kicker_en: "Specialized Service",
      title_ar: card.title_ar || "خدمة",
      title_en: card.title_en || "Service",
      desc_ar: card.desc_ar || "وصف الخدمة.",
      desc_en: card.desc_en || "Service description.",
      image_url: card.image_url || "",
    },

    overview: {
      title_ar: "نطاق الخدمة",
      title_en: "Service Scope",
      desc_ar:
        card.desc_ar || "يمكن تعديل هذا القسم لاحقًا من لوحة الأدمن.",
      desc_en:
        card.desc_en || "This section can be updated later from the admin panel.",
    },

    capabilities: [createEmptyCapability()],

    gallery: [
      {
        image_url: card.image_url || "",
        alt_ar: card.title_ar || "صورة للخدمة",
        alt_en: card.title_en || "Service image",
      },
    ],

    cta: {
      title_ar: "الخطوة التالية",
      title_en: "Next Step",
      desc_ar: "يمكن تخصيص هذا القسم لاحقًا من لوحة الأدمن.",
      desc_en: "This section can be customized later from the admin panel.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
    },
  };
}

function createEmptyTestimonial(order = 1): TestimonialItem {
  // إنشاء شهادة عميل جديدة
  return {
    id: createId("testimonial"),
    is_active: true,
    sort_order: order,
    text_ar: "نص الشهادة بالعربية.",
    text_en: "Testimonial text in English.",
    name_ar: "اسم العميل",
    name_en: "Client Name",
    role_ar: "الصفة",
    role_en: "Role",
    image_url: "",
  };
}

function createEmptyPublicGalleryImage(order = 1): PublicGalleryImage {
  // إنشاء صورة جديدة في المعرض العام
  return {
    id: createId("gallery"),
    is_active: true,
    sort_order: order,
    image_url: "",
    alt_ar: `صورة ${order}`,
    alt_en: `Image ${order}`,
  };
}

function createDefaultSections(): ServicesPageSections {
  // البنية الافتراضية الكاملة للصفحة
  // نستخدمها إذا كانت البيانات ناقصة أو غير صالحة
  return {
    hero: {
      kicker_ar: "منظومة خدمات الزُهى",
      kicker_en: "ALZUHA Service Platform",
      title_ar: "حلول عقارية تنفيذية<br/>مصممة للنمو والجودة",
      title_en: "Executive Real-Estate Solutions<br/>Built for Growth and Quality",
      desc_ar:
        "صُممت خدمات الزُهى لتخدم دورة الأصل العقاري كاملة ضمن إطار يوازن بين القيمة، الكفاءة، والانضباط التنفيذي.",
      desc_en:
        "ALZUHA services are designed to support the full life cycle of a real-estate asset through a framework that balances value, efficiency, and execution discipline.",
      btn1_ar: "استكشف خدماتنا",
      btn1_en: "Explore Our Services",
      btn1_href: "/services/explore",
      btn2_ar: "مكتب الخدمات",
      btn2_en: "Service Desk",
      btn2_href: "/services/service-desk",
      image_url: "",
    },

    servicesSection: {
      title_ar: "خدمات متخصصة<br/>لكل مرحلة من دورة الأصل",
      title_en: "Specialized Services<br/>for Every Asset Stage",
      desc_ar:
        "منظومة خدمات متخصصة تساعد على بناء المشروع، تقييم الأصل، دعم القرار، وتحسين التمركز السوقي.",
      desc_en:
        "A specialized service platform built to support development, asset assessment, decision support, and market positioning.",
      items: [],
    },

    serviceDetails: {
      items: [],
    },

    testimonials: {
      kicker_ar: "الأثر الحقيقي للخدمة",
      kicker_en: "The Real Impact of Service",
      title_ar: "نتائج تعكس جودة التنفيذ",
      title_en: "Results That Reflect Execution Quality",
      desc_ar: "تجارب تعكس وضوح المعالجة وقوة التنفيذ.",
      desc_en: "Experiences reflecting clarity of approach and quality of execution.",
      btn_ar: "مكتب الخدمات",
      btn_en: "Service Desk",
      btn_href: "/services/service-desk",
      items: [],
    },

    gallery: {
      title_ar: "نماذج منتقاة من البيئات والمخرجات",
      title_en: "Selected Environments & Outputs",
      desc_ar: "صور تعبّر عن الجودة والانضباط والهوية العقارية.",
      desc_en: "Visual selections reflecting quality, discipline, and real-estate identity.",
      images: [],
    },

    cta: {
      title_ar: "اختر المسار الخدمي<br/>الأنسب لاحتياجك",
      title_en: "Choose the Service Path<br/>That Fits Your Need",
      desc_ar: "ابدأ من المسار الأنسب حسب طبيعة الاحتياج الحالي.",
      desc_en: "Start from the path that best matches your current need.",
      label_ar: "مكتب الخدمات",
      label_en: "Service Desk",
      button_ar: "الدخول إلى مكتب الخدمات",
      button_en: "Open Service Desk",
      button_href: "/services/service-desk",
    },

    footer: {
      email: "info@alzuharealestate.com",
      social1_ar: "لينكدإن",
      social1_en: "LinkedIn",
      social1_href: "#",
      social2_ar: "انستغرام",
      social2_en: "Instagram",
      social2_href: "#",
      social3_ar: "دريبل",
      social3_en: "Dribbble",
      social3_href: "#",
      copy_ar: "جميع الحقوق محفوظة © الزُهى 2026",
      copy_en: "All rights reserved © ALZUHA 2026",
      privacy_ar: "سياسة الخصوصية",
      privacy_en: "Privacy Policy",
      privacy_href: "/privacy-policy",
    },
  };
}

function normalizeServiceCard(value: unknown, index: number): ServiceCardItem {
  // تطبيع بطاقة خدمة واحدة
  const obj = asObject(value);

  const slug = normalizeSlug(obj.slug || `service-${index + 1}`);

  return {
    id: normalizeText(obj.id, createId("service")),
    slug,
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    icon: normalizeText(obj.icon, "✨"),
    image_url: normalizeText(obj.image_url, ""),
    title_ar: normalizeText(obj.title_ar, "خدمة"),
    title_en: normalizeText(obj.title_en, "Service"),
    desc_ar: normalizeText(obj.desc_ar, "وصف مختصر للخدمة."),
    desc_en: normalizeText(obj.desc_en, "Short service description."),
    cta_label_ar: normalizeText(obj.cta_label_ar, "افتح المسار"),
    cta_label_en: normalizeText(obj.cta_label_en, "Open Path"),
    href: normalizeText(obj.href, serviceHrefFromSlug(slug)),
  };
}

function normalizeServiceDetail(value: unknown, index: number): ServiceDetailItem {
  // تطبيع صفحة فرعية واحدة
  const obj = asObject(value);

  const slug = normalizeSlug(obj.slug || `service-${index + 1}`);
  const hero = asObject(obj.hero);
  const overview = asObject(obj.overview);
  const cta = asObject(obj.cta);

  const capabilities = Array.isArray(obj.capabilities)
    ? obj.capabilities.map((capability) => {
        const cap = asObject(capability);

        return {
          title_ar: normalizeText(cap.title_ar, "ميزة"),
          title_en: normalizeText(cap.title_en, "Capability"),
          desc_ar: normalizeText(cap.desc_ar, "وصف مختصر."),
          desc_en: normalizeText(cap.desc_en, "Short description."),
        };
      })
    : [createEmptyCapability()];

  const gallery = Array.isArray(obj.gallery)
    ? obj.gallery.map((entry) => {
        const image = asObject(entry);

        return {
          image_url: normalizeText(image.image_url, ""),
          alt_ar: normalizeText(image.alt_ar, "صورة للخدمة"),
          alt_en: normalizeText(image.alt_en, "Service image"),
        };
      })
    : [createEmptyDetailGalleryImage()];

  return {
    id: normalizeText(obj.id, createId("detail")),
    slug,
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),

    hero: {
      kicker_ar: normalizeText(hero.kicker_ar, "خدمة متخصصة"),
      kicker_en: normalizeText(hero.kicker_en, "Specialized Service"),
      title_ar: normalizeText(hero.title_ar, "خدمة"),
      title_en: normalizeText(hero.title_en, "Service"),
      desc_ar: normalizeText(hero.desc_ar, "وصف افتتاحي للخدمة."),
      desc_en: normalizeText(hero.desc_en, "Introductory service description."),
      image_url: normalizeText(hero.image_url, ""),
    },

    overview: {
      title_ar: normalizeText(overview.title_ar, "نظرة عامة"),
      title_en: normalizeText(overview.title_en, "Overview"),
      desc_ar: normalizeText(overview.desc_ar, "شرح مختصر عن الخدمة."),
      desc_en: normalizeText(overview.desc_en, "Brief overview of the service."),
    },

    capabilities,
    gallery,

    cta: {
      title_ar: normalizeText(cta.title_ar, "الخطوة التالية"),
      title_en: normalizeText(cta.title_en, "Next Step"),
      desc_ar: normalizeText(cta.desc_ar, "دعوة لاتخاذ الخطوة التالية."),
      desc_en: normalizeText(cta.desc_en, "A call to take the next step."),
      btn_ar: normalizeText(cta.btn_ar, "مكتب الخدمات"),
      btn_en: normalizeText(cta.btn_en, "Service Desk"),
      btn_href: normalizeText(cta.btn_href, "/services/service-desk"),
    },
  };
}

function normalizeTestimonial(value: unknown, index: number): TestimonialItem {
  // تطبيع شهادة عميل واحدة
  const obj = asObject(value);

  return {
    id: normalizeText(obj.id, createId("testimonial")),
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    text_ar: normalizeText(obj.text_ar, "نص الشهادة بالعربية."),
    text_en: normalizeText(obj.text_en, "Testimonial text in English."),
    name_ar: normalizeText(obj.name_ar, "اسم العميل"),
    name_en: normalizeText(obj.name_en, "Client Name"),
    role_ar: normalizeText(obj.role_ar, "الصفة"),
    role_en: normalizeText(obj.role_en, "Role"),
    image_url: normalizeText(obj.image_url, ""),
  };
}

function normalizePublicGalleryImage(value: unknown, index: number): PublicGalleryImage {
  // تطبيع عنصر واحد في المعرض العام
  const obj = asObject(value);

  return {
    id: normalizeText(obj.id, createId("gallery")),
    is_active: normalizeBoolean(obj.is_active, true),
    sort_order: normalizeNumber(obj.sort_order, index + 1),
    image_url: normalizeText(obj.image_url, ""),
    alt_ar: normalizeText(obj.alt_ar, `صورة ${index + 1}`),
    alt_en: normalizeText(obj.alt_en, `Image ${index + 1}`),
  };
}

function normalizeSections(value: unknown): ServicesPageSections {
  // تطبيع البنية الكاملة لـ sections_json
  const defaults = createDefaultSections();
  const obj = asObject(value);

  const hero = asObject(obj.hero);
  const servicesSection = asObject(obj.servicesSection);
  const serviceDetails = asObject(obj.serviceDetails);
  const testimonials = asObject(obj.testimonials);
  const gallery = asObject(obj.gallery);
  const cta = asObject(obj.cta);
  const footer = asObject(obj.footer);

  return {
    hero: {
      kicker_ar: normalizeText(hero.kicker_ar, defaults.hero.kicker_ar),
      kicker_en: normalizeText(hero.kicker_en, defaults.hero.kicker_en),
      title_ar: normalizeText(hero.title_ar, defaults.hero.title_ar),
      title_en: normalizeText(hero.title_en, defaults.hero.title_en),
      desc_ar: normalizeText(hero.desc_ar, defaults.hero.desc_ar),
      desc_en: normalizeText(hero.desc_en, defaults.hero.desc_en),
      btn1_ar: normalizeText(hero.btn1_ar, defaults.hero.btn1_ar),
      btn1_en: normalizeText(hero.btn1_en, defaults.hero.btn1_en),
      btn1_href: normalizeText(hero.btn1_href, defaults.hero.btn1_href),
      btn2_ar: normalizeText(hero.btn2_ar, defaults.hero.btn2_ar),
      btn2_en: normalizeText(hero.btn2_en, defaults.hero.btn2_en),
      btn2_href: normalizeText(hero.btn2_href, defaults.hero.btn2_href),
      image_url: normalizeText(hero.image_url, defaults.hero.image_url),
    },

    servicesSection: {
      title_ar: normalizeText(
        servicesSection.title_ar,
        defaults.servicesSection.title_ar
      ),
      title_en: normalizeText(
        servicesSection.title_en,
        defaults.servicesSection.title_en
      ),
      desc_ar: normalizeText(
        servicesSection.desc_ar,
        defaults.servicesSection.desc_ar
      ),
      desc_en: normalizeText(
        servicesSection.desc_en,
        defaults.servicesSection.desc_en
      ),
      items: Array.isArray(servicesSection.items)
        ? servicesSection.items.map((item, index) => normalizeServiceCard(item, index))
        : defaults.servicesSection.items,
    },

    serviceDetails: {
      items: Array.isArray(serviceDetails.items)
        ? serviceDetails.items.map((item, index) => normalizeServiceDetail(item, index))
        : defaults.serviceDetails.items,
    },

    testimonials: {
      kicker_ar: normalizeText(
        testimonials.kicker_ar,
        defaults.testimonials.kicker_ar
      ),
      kicker_en: normalizeText(
        testimonials.kicker_en,
        defaults.testimonials.kicker_en
      ),
      title_ar: normalizeText(
        testimonials.title_ar,
        defaults.testimonials.title_ar
      ),
      title_en: normalizeText(
        testimonials.title_en,
        defaults.testimonials.title_en
      ),
      desc_ar: normalizeText(
        testimonials.desc_ar,
        defaults.testimonials.desc_ar
      ),
      desc_en: normalizeText(
        testimonials.desc_en,
        defaults.testimonials.desc_en
      ),
      btn_ar: normalizeText(testimonials.btn_ar, defaults.testimonials.btn_ar),
      btn_en: normalizeText(testimonials.btn_en, defaults.testimonials.btn_en),
      btn_href: normalizeText(testimonials.btn_href, defaults.testimonials.btn_href),
      items: Array.isArray(testimonials.items)
        ? testimonials.items.map((item, index) => normalizeTestimonial(item, index))
        : defaults.testimonials.items,
    },

    gallery: {
      title_ar: normalizeText(gallery.title_ar, defaults.gallery.title_ar),
      title_en: normalizeText(gallery.title_en, defaults.gallery.title_en),
      desc_ar: normalizeText(gallery.desc_ar, defaults.gallery.desc_ar),
      desc_en: normalizeText(gallery.desc_en, defaults.gallery.desc_en),
      images: Array.isArray(gallery.images)
        ? gallery.images.map((image, index) => normalizePublicGalleryImage(image, index))
        : defaults.gallery.images,
    },

    cta: {
      title_ar: normalizeText(cta.title_ar, defaults.cta.title_ar),
      title_en: normalizeText(cta.title_en, defaults.cta.title_en),
      desc_ar: normalizeText(cta.desc_ar, defaults.cta.desc_ar),
      desc_en: normalizeText(cta.desc_en, defaults.cta.desc_en),
      label_ar: normalizeText(cta.label_ar, defaults.cta.label_ar),
      label_en: normalizeText(cta.label_en, defaults.cta.label_en),
      button_ar: normalizeText(cta.button_ar, defaults.cta.button_ar),
      button_en: normalizeText(cta.button_en, defaults.cta.button_en),
      button_href: normalizeText(cta.button_href, defaults.cta.button_href),
    },

    footer: {
      email: normalizeText(footer.email, defaults.footer.email),
      social1_ar: normalizeText(footer.social1_ar, defaults.footer.social1_ar),
      social1_en: normalizeText(footer.social1_en, defaults.footer.social1_en),
      social1_href: normalizeText(footer.social1_href, defaults.footer.social1_href),
      social2_ar: normalizeText(footer.social2_ar, defaults.footer.social2_ar),
      social2_en: normalizeText(footer.social2_en, defaults.footer.social2_en),
      social2_href: normalizeText(footer.social2_href, defaults.footer.social2_href),
      social3_ar: normalizeText(footer.social3_ar, defaults.footer.social3_ar),
      social3_en: normalizeText(footer.social3_en, defaults.footer.social3_en),
      social3_href: normalizeText(footer.social3_href, defaults.footer.social3_href),
      copy_ar: normalizeText(footer.copy_ar, defaults.footer.copy_ar),
      copy_en: normalizeText(footer.copy_en, defaults.footer.copy_en),
      privacy_ar: normalizeText(footer.privacy_ar, defaults.footer.privacy_ar),
      privacy_en: normalizeText(footer.privacy_en, defaults.footer.privacy_en),
      privacy_href: normalizeText(footer.privacy_href, defaults.footer.privacy_href),
    },
  };
}

function normalizeRecord(value: ServicesPageAdminRecord): ServicesPageAdminRecord {
  // تطبيع السجل الكامل القادم من السيرفر
  return {
    slug: normalizeText(value.slug, "services"),
    title_ar: normalizeText(value.title_ar, "الخدمات"),
    title_en: normalizeText(value.title_en, "Services"),
    content_ar: normalizeText(
      value.content_ar,
      "منظومة خدمات عقارية تنفيذية متقدمة."
    ),
    content_en: normalizeText(
      value.content_en,
      "An advanced executive real-estate service platform."
    ),
    is_published: normalizeBoolean(value.is_published, true),
    page_type: normalizeText(value.page_type, "services") || "services",
    sections_json: normalizeSections(value.sections_json),
  };
}

function getNestedValue(target: any, path: PathSegment[]) {
  // قراءة قيمة داخلية من object أو array عبر مسار ديناميكي
  return path.reduce((acc, segment) => {
    if (acc == null) return undefined;
    return acc[segment as keyof typeof acc];
  }, target);
}

function setNestedValue(target: any, path: PathSegment[], value: unknown) {
  // تحديث قيمة داخلية داخل object/array عبر مسار ديناميكي
  let cursor = target;

  for (let index = 0; index < path.length - 1; index += 1) {
    const current = path[index];
    const next = path[index + 1];

    if (cursor[current] == null) {
      cursor[current] = typeof next === "number" ? [] : {};
    }

    cursor = cursor[current];
  }

  cursor[path[path.length - 1]] = value;
}

function moveArrayItem<T>(items: T[], fromIndex: number, direction: -1 | 1) {
  // تحريك عنصر لأعلى أو لأسفل داخل المصفوفة
  const targetIndex = fromIndex + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  next.splice(targetIndex, 0, moved);

  return next;
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  // حقل نصي موحد
  return (
    <label className="admin-services-editor__field">
      <span>{label}</span>
      <input
        className="admin-services-editor__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  // حقل textarea موحد
  return (
    <label className="admin-services-editor__field">
      <span>{label}</span>
      <textarea
        className="admin-services-editor__textarea"
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function ToggleInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  // Checkbox موحد
  return (
    <label className="admin-services-editor__toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export default function ServicesPageEditor({
  initialItem,
}: {
  initialItem: ServicesPageAdminRecord;
}) {
  // المكوّن الرئيسي لمحرر صفحة الخدمات

  const normalizedInitial = useMemo(
    () => normalizeRecord(initialItem),
    [initialItem]
  );
  // تطبيع السجل الأولي مرة واحدة

  const [item, setItem] = useState<ServicesPageAdminRecord>(normalizedInitial);
  // الحالة الحالية للمحرر

  const [saving, setSaving] = useState(false);
  // حالة الحفظ الحالية

  const [notice, setNotice] = useState<string>("");
  // رسالة نجاح

  const [error, setError] = useState<string>("");
  // رسالة خطأ

  const sections = item.sections_json ?? createDefaultSections();
  // اختصار للوصول إلى الأقسام

  const serviceCards = sections.servicesSection.items;
  // بطاقات الخدمات الرئيسية

  const detailPages = sections.serviceDetails.items;
  // الصفحات الفرعية للخدمات

  const testimonials = sections.testimonials.items;
  // الشهادات

  const publicGallery = sections.gallery.images;
  // صور المعرض العام

  const diagnostics = useMemo(() => {
    // تشخيص مهم:
    // هل كل بطاقة خدمة لديها صفحة فرعية مقابلة بنفس slug؟
    const detailSlugSet = new Set(
      detailPages.map((detail) => normalizeSlug(detail.slug))
    );

    return serviceCards.map((card) => ({
      id: card.id,
      slug: normalizeSlug(card.slug),
      title_ar: card.title_ar,
      title_en: card.title_en,
      hasMatchingDetail: detailSlugSet.has(normalizeSlug(card.slug)),
    }));
  }, [serviceCards, detailPages]);

  const stats = useMemo(
    () => ({
      serviceCardsCount: serviceCards.length,
      activeServiceCardsCount: serviceCards.filter((card) => card.is_active).length,
      detailPagesCount: detailPages.length,
      activeDetailPagesCount: detailPages.filter((detail) => detail.is_active).length,
      testimonialsCount: testimonials.length,
      galleryCount: publicGallery.length,
    }),
    [serviceCards, detailPages, testimonials, publicGallery]
  );
  // إحصائيات مختصرة للواجهة

  function updateRootField(
    field: keyof Pick<
      ServicesPageAdminRecord,
      "title_ar" | "title_en" | "content_ar" | "content_en" | "is_published"
    >,
    value: string | boolean
  ) {
    // تحديث الحقول الجذرية في السجل
    setItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateAtPath(path: PathSegment[], value: unknown) {
    // تحديث أي قيمة داخلية داخل sections_json عبر مسار ديناميكي
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      setNestedValue(next.sections_json, path, value);

      return next;
    });
  }

  function appendToArray(path: PathSegment[], value: unknown) {
    // إضافة عنصر جديد إلى مصفوفة داخلية داخل sections_json
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        currentArray.push(value);
      } else {
        setNestedValue(next.sections_json, path, [value]);
      }

      return next;
    });
  }

  function removeFromArray(path: PathSegment[], index: number) {
    // حذف عنصر من مصفوفة داخلية
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        currentArray.splice(index, 1);
      }

      return next;
    });
  }

  function moveInArray(path: PathSegment[], index: number, direction: -1 | 1) {
    // تحريك عنصر داخل مصفوفة لأعلى أو لأسفل
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentArray = getNestedValue(next.sections_json, path);

      if (Array.isArray(currentArray)) {
        const reordered = moveArrayItem(currentArray, index, direction);
        setNestedValue(next.sections_json, path, reordered);
      }

      return next;
    });
  }

  function updateServiceCardField(
    index: number,
    field: keyof ServiceCardItem,
    value: string | boolean | number
  ) {
    // تحديث بطاقة خدمة
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const cards = next.sections_json.servicesSection.items;
      const card = cards[index];

      if (!card) {
        return prev;
      }

      (card as any)[field] = value;

      if (field === "slug") {
        // إذا تغير الـ slug نطبعه ونحدّث href تلقائيًا
        const normalizedSlug = normalizeSlug(value);
        card.slug = normalizedSlug;
        card.href = serviceHrefFromSlug(normalizedSlug);
      }

      return next;
    });
  }

  function createDetailPageFromCard(card: ServiceCardItem) {
    // إنشاء صفحة فرعية تلقائيًا إذا كانت غير موجودة
    setItem((prev) => {
      const next = cloneDeep(prev);

      if (!next.sections_json) {
        next.sections_json = createDefaultSections();
      }

      const currentDetails = next.sections_json.serviceDetails.items;
      const hasExisting = currentDetails.some(
        (detail) => normalizeSlug(detail.slug) === normalizeSlug(card.slug)
      );

      if (!hasExisting) {
        currentDetails.push(
          createDetailFromServiceCard(card, currentDetails.length + 1)
        );
      }

      return next;
    });
  }

  function updateDetailSlug(index: number, value: string) {
    // تحديث slug الصفحة الفرعية مع التطبيع
    const normalized = normalizeSlug(value);

    updateAtPath(["serviceDetails", "items", index, "slug"], normalized);
  }

  async function handleSave() {
    // حفظ التعديلات عبر API الأدمن
    try {
      setSaving(true);
      setNotice("");
      setError("");

      const response = await fetch("/api/admin/services-page", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title_ar: item.title_ar,
          title_en: item.title_en,
          content_ar: item.content_ar,
          content_en: item.content_en,
          is_published: item.is_published,
          sections_json: item.sections_json,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || "Failed to save services page.");
      }

      const normalizedSaved = normalizeRecord(payload.item as ServicesPageAdminRecord);
      // إعادة تطبيع السجل القادم من السيرفر

      setItem(normalizedSaved);
      // تحديث الحالة بالسجل المحفوظ

      setNotice("Services page saved successfully.");
    } catch (saveError) {
      console.error("handleSave error:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save services page."
      );
    } finally {
      setSaving(false);
    }
  }

  function resetUnsavedChanges() {
    // إرجاع النموذج إلى الحالة الأولية القادمة من السيرفر
    setItem(cloneDeep(normalizedInitial));
    setNotice("");
    setError("");
  }

  return (
    <main className="admin-services-editor">
      {/* الغلاف العام لمحرر الأدمن */}

      <section className="admin-services-editor__header">
        <div>
          <h1>Services Page Management</h1>
          <p>
            Manage the public Services page, its internal service routes, images,
            text blocks, and structure from one place.
          </p>
        </div>

        <div className="admin-services-editor__headerActions">
          <a
            href="/services"
            target="_blank"
            rel="noreferrer"
            className="admin-services-editor__ghostBtn"
          >
            Open Public Page
          </a>

          <button
            type="button"
            className="admin-services-editor__ghostBtn"
            onClick={resetUnsavedChanges}
            disabled={saving}
          >
            Reset Changes
          </button>

          <button
            type="button"
            className="admin-services-editor__primaryBtn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </section>

      <section className="admin-services-editor__stats">
        {/* بطاقات إحصائية مختصرة */}
        <article className="admin-services-editor__statCard">
          <span>Service Cards</span>
          <strong>{stats.serviceCardsCount}</strong>
          <small>{stats.activeServiceCardsCount} active</small>
        </article>

        <article className="admin-services-editor__statCard">
          <span>Detail Pages</span>
          <strong>{stats.detailPagesCount}</strong>
          <small>{stats.activeDetailPagesCount} active</small>
        </article>

        <article className="admin-services-editor__statCard">
          <span>Testimonials</span>
          <strong>{stats.testimonialsCount}</strong>
        </article>

        <article className="admin-services-editor__statCard">
          <span>Gallery Images</span>
          <strong>{stats.galleryCount}</strong>
        </article>
      </section>

      {notice ? (
        <div className="admin-services-editor__notice admin-services-editor__notice--success">
          {notice}
        </div>
      ) : null}
      {/* رسالة النجاح */}

      {error ? (
        <div className="admin-services-editor__notice admin-services-editor__notice--error">
          {error}
        </div>
      ) : null}
      {/* رسالة الخطأ */}

      <section className="admin-services-editor__section">
        {/* معلومات الصفحة الأساسية */}
        <div className="admin-services-editor__sectionHead">
          <h2>Page Meta</h2>
          <p>General titles, descriptions, and publish state for the services page.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="Title AR"
            value={item.title_ar}
            onChange={(value) => updateRootField("title_ar", value)}
          />

          <TextInput
            label="Title EN"
            value={item.title_en}
            onChange={(value) => updateRootField("title_en", value)}
          />

          <TextArea
            label="Content AR"
            value={item.content_ar}
            onChange={(value) => updateRootField("content_ar", value)}
            rows={4}
          />

          <TextArea
            label="Content EN"
            value={item.content_en}
            onChange={(value) => updateRootField("content_en", value)}
            rows={4}
          />
        </div>

        <div className="admin-services-editor__inlineRow">
          <ToggleInput
            label="Published"
            checked={item.is_published}
            onChange={(checked) => updateRootField("is_published", checked)}
          />

          <div className="admin-services-editor__metaTag">
            <span>Slug:</span>
            <strong>{item.slug}</strong>
          </div>

          <div className="admin-services-editor__metaTag">
            <span>Page Type:</span>
            <strong>{item.page_type || "services"}</strong>
          </div>
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* Hero */}
        <div className="admin-services-editor__sectionHead">
          <h2>Hero</h2>
          <p>Primary visual and messaging block for the main services page.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="Hero Kicker AR"
            value={sections.hero.kicker_ar}
            onChange={(value) => updateAtPath(["hero", "kicker_ar"], value)}
          />

          <TextInput
            label="Hero Kicker EN"
            value={sections.hero.kicker_en}
            onChange={(value) => updateAtPath(["hero", "kicker_en"], value)}
          />

          <TextArea
            label="Hero Title AR"
            value={sections.hero.title_ar}
            onChange={(value) => updateAtPath(["hero", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Hero Title EN"
            value={sections.hero.title_en}
            onChange={(value) => updateAtPath(["hero", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Hero Description AR"
            value={sections.hero.desc_ar}
            onChange={(value) => updateAtPath(["hero", "desc_ar"], value)}
            rows={5}
          />

          <TextArea
            label="Hero Description EN"
            value={sections.hero.desc_en}
            onChange={(value) => updateAtPath(["hero", "desc_en"], value)}
            rows={5}
          />

          <TextInput
            label="Hero Button 1 AR"
            value={sections.hero.btn1_ar}
            onChange={(value) => updateAtPath(["hero", "btn1_ar"], value)}
          />

          <TextInput
            label="Hero Button 1 EN"
            value={sections.hero.btn1_en}
            onChange={(value) => updateAtPath(["hero", "btn1_en"], value)}
          />

          <TextInput
            label="Hero Button 1 Href"
            value={sections.hero.btn1_href}
            onChange={(value) => updateAtPath(["hero", "btn1_href"], value)}
          />

          <TextInput
            label="Hero Button 2 AR"
            value={sections.hero.btn2_ar}
            onChange={(value) => updateAtPath(["hero", "btn2_ar"], value)}
          />

          <TextInput
            label="Hero Button 2 EN"
            value={sections.hero.btn2_en}
            onChange={(value) => updateAtPath(["hero", "btn2_en"], value)}
          />

          <TextInput
            label="Hero Button 2 Href"
            value={sections.hero.btn2_href}
            onChange={(value) => updateAtPath(["hero", "btn2_href"], value)}
          />

          <TextInput
            label="Hero Image URL"
            value={sections.hero.image_url}
            onChange={(value) => updateAtPath(["hero", "image_url"], value)}
            placeholder="/_next/static/media/..."
          />
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* تشخيص الروابط الداخلية */}
        <div className="admin-services-editor__sectionHead">
          <h2>Internal Route Diagnostics</h2>
          <p>
            This panel helps detect whether each service card has a matching detail page
            with the same slug.
          </p>
        </div>

        <div className="admin-services-editor__diagnostics">
          {diagnostics.length === 0 ? (
            <div className="admin-services-editor__emptyState">
              No service cards yet.
            </div>
          ) : (
            diagnostics.map((entry) => (
              <div key={entry.id} className="admin-services-editor__diagnosticRow">
                <div>
                  <strong>{entry.title_en || entry.title_ar || entry.slug}</strong>
                  <span>{entry.slug}</span>
                </div>

                <span
                  className={`admin-services-editor__diagnosticBadge ${
                    entry.hasMatchingDetail ? "is-ok" : "is-missing"
                  }`}
                >
                  {entry.hasMatchingDetail ? "Detail page found" : "Missing detail page"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* بطاقات الخدمات الرئيسية */}
        <div className="admin-services-editor__sectionHead">
          <h2>Main Service Cards</h2>
          <p>
            Manage the services shown on the main /services page and connect them to
            internal service routes.
          </p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextArea
            label="Services Section Title AR"
            value={sections.servicesSection.title_ar}
            onChange={(value) => updateAtPath(["servicesSection", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="Services Section Title EN"
            value={sections.servicesSection.title_en}
            onChange={(value) => updateAtPath(["servicesSection", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="Services Section Description AR"
            value={sections.servicesSection.desc_ar}
            onChange={(value) => updateAtPath(["servicesSection", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Services Section Description EN"
            value={sections.servicesSection.desc_en}
            onChange={(value) => updateAtPath(["servicesSection", "desc_en"], value)}
            rows={4}
          />
        </div>

        <div className="admin-services-editor__arrayHeader">
          <h3>Cards</h3>

          <button
            type="button"
            className="admin-services-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["servicesSection", "items"],
                createEmptyServiceCard(serviceCards.length + 1)
              )
            }
          >
            Add Service Card
          </button>
        </div>

        <div className="admin-services-editor__stack">
          {serviceCards.length === 0 ? (
            <div className="admin-services-editor__emptyState">
              No service cards yet.
            </div>
          ) : (
            serviceCards.map((card, index) => (
              <details
                key={card.id}
                className="admin-services-editor__item"
                open
              >
                <summary className="admin-services-editor__itemSummary">
                  <div>
                    <strong>{card.title_en || card.title_ar || `Service ${index + 1}`}</strong>
                    <span>{card.slug || "no-slug"}</span>
                  </div>

                  <div className="admin-services-editor__summaryTags">
                    <span className="admin-services-editor__tag">
                      #{index + 1}
                    </span>
                    <span
                      className={`admin-services-editor__tag ${
                        card.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {card.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-services-editor__itemBody">
                  <div className="admin-services-editor__itemActions">
                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["servicesSection", "items"], index, -1)
                      }
                      disabled={index === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["servicesSection", "items"], index, 1)
                      }
                      disabled={index === serviceCards.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() => createDetailPageFromCard(card)}
                    >
                      Create Detail Page
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__dangerBtn"
                      onClick={() => removeFromArray(["servicesSection", "items"], index)}
                    >
                      Delete Card
                    </button>
                  </div>

                  <div className="admin-services-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={card.is_active}
                      onChange={(checked) =>
                        updateServiceCardField(index, "is_active", checked)
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(card.sort_order)}
                      onChange={(value) =>
                        updateServiceCardField(
                          index,
                          "sort_order",
                          Number(value) || index + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-services-editor__grid admin-services-editor__grid--2">
                    <TextInput
                      label="Card ID"
                      value={card.id}
                      onChange={(value) => updateServiceCardField(index, "id", value)}
                    />

                    <TextInput
                      label="Slug"
                      value={card.slug}
                      onChange={(value) => updateServiceCardField(index, "slug", value)}
                      placeholder="project-development"
                    />

                    <TextInput
                      label="Icon"
                      value={card.icon}
                      onChange={(value) => updateServiceCardField(index, "icon", value)}
                    />

                    <TextInput
                      label="Image URL"
                      value={card.image_url}
                      onChange={(value) =>
                        updateServiceCardField(index, "image_url", value)
                      }
                    />

                    <TextInput
                      label="Title AR"
                      value={card.title_ar}
                      onChange={(value) =>
                        updateServiceCardField(index, "title_ar", value)
                      }
                    />

                    <TextInput
                      label="Title EN"
                      value={card.title_en}
                      onChange={(value) =>
                        updateServiceCardField(index, "title_en", value)
                      }
                    />

                    <TextArea
                      label="Description AR"
                      value={card.desc_ar}
                      onChange={(value) =>
                        updateServiceCardField(index, "desc_ar", value)
                      }
                      rows={4}
                    />

                    <TextArea
                      label="Description EN"
                      value={card.desc_en}
                      onChange={(value) =>
                        updateServiceCardField(index, "desc_en", value)
                      }
                      rows={4}
                    />

                    <TextInput
                      label="CTA Label AR"
                      value={card.cta_label_ar}
                      onChange={(value) =>
                        updateServiceCardField(index, "cta_label_ar", value)
                      }
                    />

                    <TextInput
                      label="CTA Label EN"
                      value={card.cta_label_en}
                      onChange={(value) =>
                        updateServiceCardField(index, "cta_label_en", value)
                      }
                    />

                    <TextInput
                      label="Href"
                      value={card.href}
                      onChange={(value) =>
                        updateServiceCardField(index, "href", value)
                      }
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* الصفحات الفرعية للخدمات */}
        <div className="admin-services-editor__sectionHead">
          <h2>Service Detail Pages</h2>
          <p>
            Manage the dynamic subpages under /services/[serviceSlug]. Each service
            path can have its own hero, overview, capabilities, gallery, and CTA.
          </p>
        </div>

        <div className="admin-services-editor__arrayHeader">
          <h3>Detail Routes</h3>

          <button
            type="button"
            className="admin-services-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["serviceDetails", "items"],
                createEmptyServiceDetail(detailPages.length + 1)
              )
            }
          >
            Add Detail Page
          </button>
        </div>

        <div className="admin-services-editor__stack">
          {detailPages.length === 0 ? (
            <div className="admin-services-editor__emptyState">
              No detail pages yet.
            </div>
          ) : (
            detailPages.map((detail, detailIndex) => (
              <details
                key={detail.id}
                className="admin-services-editor__item"
                open
              >
                <summary className="admin-services-editor__itemSummary">
                  <div>
                    <strong>
                      {detail.hero.title_en || detail.hero.title_ar || `Detail ${detailIndex + 1}`}
                    </strong>
                    <span>{detail.slug || "no-slug"}</span>
                  </div>

                  <div className="admin-services-editor__summaryTags">
                    <span className="admin-services-editor__tag">
                      /services/{detail.slug || "slug"}
                    </span>
                    <span
                      className={`admin-services-editor__tag ${
                        detail.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {detail.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-services-editor__itemBody">
                  <div className="admin-services-editor__itemActions">
                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["serviceDetails", "items"], detailIndex, -1)
                      }
                      disabled={detailIndex === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["serviceDetails", "items"], detailIndex, 1)
                      }
                      disabled={detailIndex === detailPages.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__dangerBtn"
                      onClick={() =>
                        removeFromArray(["serviceDetails", "items"], detailIndex)
                      }
                    >
                      Delete Detail Page
                    </button>
                  </div>

                  <div className="admin-services-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={detail.is_active}
                      onChange={(checked) =>
                        updateAtPath(
                          ["serviceDetails", "items", detailIndex, "is_active"],
                          checked
                        )
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(detail.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["serviceDetails", "items", detailIndex, "sort_order"],
                          Number(value) || detailIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-services-editor__grid admin-services-editor__grid--2">
                    <TextInput
                      label="Detail ID"
                      value={detail.id}
                      onChange={(value) =>
                        updateAtPath(["serviceDetails", "items", detailIndex, "id"], value)
                      }
                    />

                    <TextInput
                      label="Slug"
                      value={detail.slug}
                      onChange={(value) => updateDetailSlug(detailIndex, value)}
                      placeholder="project-development"
                    />
                  </div>

                  <div className="admin-services-editor__subSection">
                    <h4>Hero</h4>

                    <div className="admin-services-editor__grid admin-services-editor__grid--2">
                      <TextInput
                        label="Hero Kicker AR"
                        value={detail.hero.kicker_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "kicker_ar"],
                            value
                          )
                        }
                      />

                      <TextInput
                        label="Hero Kicker EN"
                        value={detail.hero.kicker_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "kicker_en"],
                            value
                          )
                        }
                      />

                      <TextArea
                        label="Hero Title AR"
                        value={detail.hero.title_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "title_ar"],
                            value
                          )
                        }
                        rows={3}
                      />

                      <TextArea
                        label="Hero Title EN"
                        value={detail.hero.title_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "title_en"],
                            value
                          )
                        }
                        rows={3}
                      />

                      <TextArea
                        label="Hero Description AR"
                        value={detail.hero.desc_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "desc_ar"],
                            value
                          )
                        }
                        rows={4}
                      />

                      <TextArea
                        label="Hero Description EN"
                        value={detail.hero.desc_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "desc_en"],
                            value
                          )
                        }
                        rows={4}
                      />

                      <TextInput
                        label="Hero Image URL"
                        value={detail.hero.image_url}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "hero", "image_url"],
                            value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="admin-services-editor__subSection">
                    <h4>Overview</h4>

                    <div className="admin-services-editor__grid admin-services-editor__grid--2">
                      <TextInput
                        label="Overview Title AR"
                        value={detail.overview.title_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "overview", "title_ar"],
                            value
                          )
                        }
                      />

                      <TextInput
                        label="Overview Title EN"
                        value={detail.overview.title_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "overview", "title_en"],
                            value
                          )
                        }
                      />

                      <TextArea
                        label="Overview Description AR"
                        value={detail.overview.desc_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "overview", "desc_ar"],
                            value
                          )
                        }
                        rows={5}
                      />

                      <TextArea
                        label="Overview Description EN"
                        value={detail.overview.desc_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "overview", "desc_en"],
                            value
                          )
                        }
                        rows={5}
                      />
                    </div>
                  </div>

                  <div className="admin-services-editor__subSection">
                    <div className="admin-services-editor__arrayHeader">
                      <h4>Capabilities</h4>

                      <button
                        type="button"
                        className="admin-services-editor__ghostBtn"
                        onClick={() =>
                          appendToArray(
                            ["serviceDetails", "items", detailIndex, "capabilities"],
                            createEmptyCapability()
                          )
                        }
                      >
                        Add Capability
                      </button>
                    </div>

                    <div className="admin-services-editor__stack">
                      {detail.capabilities.map((capability, capabilityIndex) => (
                        <div
                          key={capabilityIndex}
                          className="admin-services-editor__nestedCard"
                        >
                          <div className="admin-services-editor__itemActions">
                            <button
                              type="button"
                              className="admin-services-editor__dangerBtn"
                              onClick={() =>
                                removeFromArray(
                                  ["serviceDetails", "items", detailIndex, "capabilities"],
                                  capabilityIndex
                                )
                              }
                            >
                              Delete Capability
                            </button>
                          </div>

                          <div className="admin-services-editor__grid admin-services-editor__grid--2">
                            <TextInput
                              label="Capability Title AR"
                              value={capability.title_ar}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "capabilities",
                                    capabilityIndex,
                                    "title_ar",
                                  ],
                                  value
                                )
                              }
                            />

                            <TextInput
                              label="Capability Title EN"
                              value={capability.title_en}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "capabilities",
                                    capabilityIndex,
                                    "title_en",
                                  ],
                                  value
                                )
                              }
                            />

                            <TextArea
                              label="Capability Description AR"
                              value={capability.desc_ar}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "capabilities",
                                    capabilityIndex,
                                    "desc_ar",
                                  ],
                                  value
                                )
                              }
                              rows={3}
                            />

                            <TextArea
                              label="Capability Description EN"
                              value={capability.desc_en}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "capabilities",
                                    capabilityIndex,
                                    "desc_en",
                                  ],
                                  value
                                )
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-services-editor__subSection">
                    <div className="admin-services-editor__arrayHeader">
                      <h4>Detail Gallery</h4>

                      <button
                        type="button"
                        className="admin-services-editor__ghostBtn"
                        onClick={() =>
                          appendToArray(
                            ["serviceDetails", "items", detailIndex, "gallery"],
                            createEmptyDetailGalleryImage()
                          )
                        }
                      >
                        Add Gallery Image
                      </button>
                    </div>

                    <div className="admin-services-editor__stack">
                      {detail.gallery.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="admin-services-editor__nestedCard"
                        >
                          <div className="admin-services-editor__itemActions">
                            <button
                              type="button"
                              className="admin-services-editor__dangerBtn"
                              onClick={() =>
                                removeFromArray(
                                  ["serviceDetails", "items", detailIndex, "gallery"],
                                  imageIndex
                                )
                              }
                            >
                              Delete Image
                            </button>
                          </div>

                          <div className="admin-services-editor__grid admin-services-editor__grid--2">
                            <TextInput
                              label="Image URL"
                              value={image.image_url}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "gallery",
                                    imageIndex,
                                    "image_url",
                                  ],
                                  value
                                )
                              }
                            />

                            <TextInput
                              label="Alt AR"
                              value={image.alt_ar}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "gallery",
                                    imageIndex,
                                    "alt_ar",
                                  ],
                                  value
                                )
                              }
                            />

                            <TextInput
                              label="Alt EN"
                              value={image.alt_en}
                              onChange={(value) =>
                                updateAtPath(
                                  [
                                    "serviceDetails",
                                    "items",
                                    detailIndex,
                                    "gallery",
                                    imageIndex,
                                    "alt_en",
                                  ],
                                  value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-services-editor__subSection">
                    <h4>Detail CTA</h4>

                    <div className="admin-services-editor__grid admin-services-editor__grid--2">
                      <TextInput
                        label="CTA Title AR"
                        value={detail.cta.title_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "title_ar"],
                            value
                          )
                        }
                      />

                      <TextInput
                        label="CTA Title EN"
                        value={detail.cta.title_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "title_en"],
                            value
                          )
                        }
                      />

                      <TextArea
                        label="CTA Description AR"
                        value={detail.cta.desc_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "desc_ar"],
                            value
                          )
                        }
                        rows={4}
                      />

                      <TextArea
                        label="CTA Description EN"
                        value={detail.cta.desc_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "desc_en"],
                            value
                          )
                        }
                        rows={4}
                      />

                      <TextInput
                        label="CTA Button AR"
                        value={detail.cta.btn_ar}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "btn_ar"],
                            value
                          )
                        }
                      />

                      <TextInput
                        label="CTA Button EN"
                        value={detail.cta.btn_en}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "btn_en"],
                            value
                          )
                        }
                      />

                      <TextInput
                        label="CTA Button Href"
                        value={detail.cta.btn_href}
                        onChange={(value) =>
                          updateAtPath(
                            ["serviceDetails", "items", detailIndex, "cta", "btn_href"],
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* Testimonials */}
        <div className="admin-services-editor__sectionHead">
          <h2>Testimonials</h2>
          <p>Manage testimonial section titles, button, and items.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="Testimonials Kicker AR"
            value={sections.testimonials.kicker_ar}
            onChange={(value) => updateAtPath(["testimonials", "kicker_ar"], value)}
          />

          <TextInput
            label="Testimonials Kicker EN"
            value={sections.testimonials.kicker_en}
            onChange={(value) => updateAtPath(["testimonials", "kicker_en"], value)}
          />

          <TextInput
            label="Testimonials Title AR"
            value={sections.testimonials.title_ar}
            onChange={(value) => updateAtPath(["testimonials", "title_ar"], value)}
          />

          <TextInput
            label="Testimonials Title EN"
            value={sections.testimonials.title_en}
            onChange={(value) => updateAtPath(["testimonials", "title_en"], value)}
          />

          <TextArea
            label="Testimonials Description AR"
            value={sections.testimonials.desc_ar}
            onChange={(value) => updateAtPath(["testimonials", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Testimonials Description EN"
            value={sections.testimonials.desc_en}
            onChange={(value) => updateAtPath(["testimonials", "desc_en"], value)}
            rows={4}
          />

          <TextInput
            label="Testimonials Button AR"
            value={sections.testimonials.btn_ar}
            onChange={(value) => updateAtPath(["testimonials", "btn_ar"], value)}
          />

          <TextInput
            label="Testimonials Button EN"
            value={sections.testimonials.btn_en}
            onChange={(value) => updateAtPath(["testimonials", "btn_en"], value)}
          />

          <TextInput
            label="Testimonials Button Href"
            value={sections.testimonials.btn_href}
            onChange={(value) => updateAtPath(["testimonials", "btn_href"], value)}
          />
        </div>

        <div className="admin-services-editor__arrayHeader">
          <h3>Testimonial Items</h3>

          <button
            type="button"
            className="admin-services-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["testimonials", "items"],
                createEmptyTestimonial(testimonials.length + 1)
              )
            }
          >
            Add Testimonial
          </button>
        </div>

        <div className="admin-services-editor__stack">
          {testimonials.length === 0 ? (
            <div className="admin-services-editor__emptyState">
              No testimonials yet.
            </div>
          ) : (
            testimonials.map((entry, testimonialIndex) => (
              <details
                key={entry.id}
                className="admin-services-editor__item"
                open
              >
                <summary className="admin-services-editor__itemSummary">
                  <div>
                    <strong>{entry.name_en || entry.name_ar || `Testimonial ${testimonialIndex + 1}`}</strong>
                    <span>{entry.role_en || entry.role_ar}</span>
                  </div>

                  <div className="admin-services-editor__summaryTags">
                    <span className="admin-services-editor__tag">
                      #{testimonialIndex + 1}
                    </span>
                    <span
                      className={`admin-services-editor__tag ${
                        entry.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {entry.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-services-editor__itemBody">
                  <div className="admin-services-editor__itemActions">
                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["testimonials", "items"], testimonialIndex, -1)
                      }
                      disabled={testimonialIndex === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() =>
                        moveInArray(["testimonials", "items"], testimonialIndex, 1)
                      }
                      disabled={testimonialIndex === testimonials.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__dangerBtn"
                      onClick={() =>
                        removeFromArray(["testimonials", "items"], testimonialIndex)
                      }
                    >
                      Delete Testimonial
                    </button>
                  </div>

                  <div className="admin-services-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={entry.is_active}
                      onChange={(checked) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "is_active"],
                          checked
                        )
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(entry.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "sort_order"],
                          Number(value) || testimonialIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-services-editor__grid admin-services-editor__grid--2">
                    <TextInput
                      label="Name AR"
                      value={entry.name_ar}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "name_ar"],
                          value
                        )
                      }
                    />

                    <TextInput
                      label="Name EN"
                      value={entry.name_en}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "name_en"],
                          value
                        )
                      }
                    />

                    <TextInput
                      label="Role AR"
                      value={entry.role_ar}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "role_ar"],
                          value
                        )
                      }
                    />

                    <TextInput
                      label="Role EN"
                      value={entry.role_en}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "role_en"],
                          value
                        )
                      }
                    />

                    <TextInput
                      label="Image URL"
                      value={entry.image_url}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "image_url"],
                          value
                        )
                      }
                    />

                    <TextArea
                      label="Text AR"
                      value={entry.text_ar}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "text_ar"],
                          value
                        )
                      }
                      rows={4}
                    />

                    <TextArea
                      label="Text EN"
                      value={entry.text_en}
                      onChange={(value) =>
                        updateAtPath(
                          ["testimonials", "items", testimonialIndex, "text_en"],
                          value
                        )
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* المعرض العام */}
        <div className="admin-services-editor__sectionHead">
          <h2>Public Gallery</h2>
          <p>Manage the main gallery section on the public services page.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="Gallery Title AR"
            value={sections.gallery.title_ar}
            onChange={(value) => updateAtPath(["gallery", "title_ar"], value)}
          />

          <TextInput
            label="Gallery Title EN"
            value={sections.gallery.title_en}
            onChange={(value) => updateAtPath(["gallery", "title_en"], value)}
          />

          <TextArea
            label="Gallery Description AR"
            value={sections.gallery.desc_ar}
            onChange={(value) => updateAtPath(["gallery", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="Gallery Description EN"
            value={sections.gallery.desc_en}
            onChange={(value) => updateAtPath(["gallery", "desc_en"], value)}
            rows={4}
          />
        </div>

        <div className="admin-services-editor__arrayHeader">
          <h3>Gallery Images</h3>

          <button
            type="button"
            className="admin-services-editor__primaryBtn"
            onClick={() =>
              appendToArray(
                ["gallery", "images"],
                createEmptyPublicGalleryImage(publicGallery.length + 1)
              )
            }
          >
            Add Gallery Image
          </button>
        </div>

        <div className="admin-services-editor__stack">
          {publicGallery.length === 0 ? (
            <div className="admin-services-editor__emptyState">
              No gallery images yet.
            </div>
          ) : (
            publicGallery.map((image, galleryIndex) => (
              <details
                key={image.id}
                className="admin-services-editor__item"
                open
              >
                <summary className="admin-services-editor__itemSummary">
                  <div>
                    <strong>{image.alt_en || image.alt_ar || `Image ${galleryIndex + 1}`}</strong>
                    <span>{image.image_url || "No image URL"}</span>
                  </div>

                  <div className="admin-services-editor__summaryTags">
                    <span className="admin-services-editor__tag">
                      #{galleryIndex + 1}
                    </span>
                    <span
                      className={`admin-services-editor__tag ${
                        image.is_active ? "is-active" : "is-inactive"
                      }`}
                    >
                      {image.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </summary>

                <div className="admin-services-editor__itemBody">
                  <div className="admin-services-editor__itemActions">
                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() => moveInArray(["gallery", "images"], galleryIndex, -1)}
                      disabled={galleryIndex === 0}
                    >
                      Move Up
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__ghostBtn"
                      onClick={() => moveInArray(["gallery", "images"], galleryIndex, 1)}
                      disabled={galleryIndex === publicGallery.length - 1}
                    >
                      Move Down
                    </button>

                    <button
                      type="button"
                      className="admin-services-editor__dangerBtn"
                      onClick={() => removeFromArray(["gallery", "images"], galleryIndex)}
                    >
                      Delete Image
                    </button>
                  </div>

                  <div className="admin-services-editor__inlineRow">
                    <ToggleInput
                      label="Active"
                      checked={image.is_active}
                      onChange={(checked) =>
                        updateAtPath(["gallery", "images", galleryIndex, "is_active"], checked)
                      }
                    />

                    <TextInput
                      label="Sort Order"
                      value={String(image.sort_order)}
                      onChange={(value) =>
                        updateAtPath(
                          ["gallery", "images", galleryIndex, "sort_order"],
                          Number(value) || galleryIndex + 1
                        )
                      }
                    />
                  </div>

                  <div className="admin-services-editor__grid admin-services-editor__grid--2">
                    <TextInput
                      label="Image ID"
                      value={image.id}
                      onChange={(value) =>
                        updateAtPath(["gallery", "images", galleryIndex, "id"], value)
                      }
                    />

                    <TextInput
                      label="Image URL"
                      value={image.image_url}
                      onChange={(value) =>
                        updateAtPath(
                          ["gallery", "images", galleryIndex, "image_url"],
                          value
                        )
                      }
                    />

                    <TextInput
                      label="Alt AR"
                      value={image.alt_ar}
                      onChange={(value) =>
                        updateAtPath(["gallery", "images", galleryIndex, "alt_ar"], value)
                      }
                    />

                    <TextInput
                      label="Alt EN"
                      value={image.alt_en}
                      onChange={(value) =>
                        updateAtPath(["gallery", "images", galleryIndex, "alt_en"], value)
                      }
                    />
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* CTA */}
        <div className="admin-services-editor__sectionHead">
          <h2>Main CTA</h2>
          <p>The final call-to-action block on the main public services page.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="CTA Label AR"
            value={sections.cta.label_ar}
            onChange={(value) => updateAtPath(["cta", "label_ar"], value)}
          />

          <TextInput
            label="CTA Label EN"
            value={sections.cta.label_en}
            onChange={(value) => updateAtPath(["cta", "label_en"], value)}
          />

          <TextArea
            label="CTA Title AR"
            value={sections.cta.title_ar}
            onChange={(value) => updateAtPath(["cta", "title_ar"], value)}
            rows={3}
          />

          <TextArea
            label="CTA Title EN"
            value={sections.cta.title_en}
            onChange={(value) => updateAtPath(["cta", "title_en"], value)}
            rows={3}
          />

          <TextArea
            label="CTA Description AR"
            value={sections.cta.desc_ar}
            onChange={(value) => updateAtPath(["cta", "desc_ar"], value)}
            rows={4}
          />

          <TextArea
            label="CTA Description EN"
            value={sections.cta.desc_en}
            onChange={(value) => updateAtPath(["cta", "desc_en"], value)}
            rows={4}
          />

          <TextInput
            label="CTA Button AR"
            value={sections.cta.button_ar}
            onChange={(value) => updateAtPath(["cta", "button_ar"], value)}
          />

          <TextInput
            label="CTA Button EN"
            value={sections.cta.button_en}
            onChange={(value) => updateAtPath(["cta", "button_en"], value)}
          />

          <TextInput
            label="CTA Button Href"
            value={sections.cta.button_href}
            onChange={(value) => updateAtPath(["cta", "button_href"], value)}
          />
        </div>
      </section>

      <section className="admin-services-editor__section">
        {/* Footer */}
        <div className="admin-services-editor__sectionHead">
          <h2>Footer</h2>
          <p>Manage the footer content specific to the services experience.</p>
        </div>

        <div className="admin-services-editor__grid admin-services-editor__grid--2">
          <TextInput
            label="Footer Email"
            value={sections.footer.email}
            onChange={(value) => updateAtPath(["footer", "email"], value)}
          />

          <TextInput
            label="Privacy Href"
            value={sections.footer.privacy_href}
            onChange={(value) => updateAtPath(["footer", "privacy_href"], value)}
          />

          <TextInput
            label="Social 1 AR"
            value={sections.footer.social1_ar}
            onChange={(value) => updateAtPath(["footer", "social1_ar"], value)}
          />

          <TextInput
            label="Social 1 EN"
            value={sections.footer.social1_en}
            onChange={(value) => updateAtPath(["footer", "social1_en"], value)}
          />

          <TextInput
            label="Social 1 Href"
            value={sections.footer.social1_href}
            onChange={(value) => updateAtPath(["footer", "social1_href"], value)}
          />

          <TextInput
            label="Social 2 AR"
            value={sections.footer.social2_ar}
            onChange={(value) => updateAtPath(["footer", "social2_ar"], value)}
          />

          <TextInput
            label="Social 2 EN"
            value={sections.footer.social2_en}
            onChange={(value) => updateAtPath(["footer", "social2_en"], value)}
          />

          <TextInput
            label="Social 2 Href"
            value={sections.footer.social2_href}
            onChange={(value) => updateAtPath(["footer", "social2_href"], value)}
          />

          <TextInput
            label="Social 3 AR"
            value={sections.footer.social3_ar}
            onChange={(value) => updateAtPath(["footer", "social3_ar"], value)}
          />

          <TextInput
            label="Social 3 EN"
            value={sections.footer.social3_en}
            onChange={(value) => updateAtPath(["footer", "social3_en"], value)}
          />

          <TextInput
            label="Social 3 Href"
            value={sections.footer.social3_href}
            onChange={(value) => updateAtPath(["footer", "social3_href"], value)}
          />

          <TextInput
            label="Copy AR"
            value={sections.footer.copy_ar}
            onChange={(value) => updateAtPath(["footer", "copy_ar"], value)}
          />

          <TextInput
            label="Copy EN"
            value={sections.footer.copy_en}
            onChange={(value) => updateAtPath(["footer", "copy_en"], value)}
          />

          <TextInput
            label="Privacy AR"
            value={sections.footer.privacy_ar}
            onChange={(value) => updateAtPath(["footer", "privacy_ar"], value)}
          />

          <TextInput
            label="Privacy EN"
            value={sections.footer.privacy_en}
            onChange={(value) => updateAtPath(["footer", "privacy_en"], value)}
          />
        </div>
      </section>

      <section className="admin-services-editor__footerActions">
        {/* أزرار الحفظ النهائية */}
        <button
          type="button"
          className="admin-services-editor__ghostBtn"
          onClick={resetUnsavedChanges}
          disabled={saving}
        >
          Reset Changes
        </button>

        <button
          type="button"
          className="admin-services-editor__primaryBtn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </section>
    </main>
  );
}