import "./contact.css";
// استيراد CSS الخاص بصفحة Contact فقط

import { cookies } from "next/headers";
// قراءة اللغة الحالية من الكوكيز على جهة السيرفر

import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

import ContactClient, {
  type ContactCopy,
  type ContactSections,
  type Lang,
} from "./contact-client";
// استيراد مكوّن العميل والأنواع المستخدمة

export const dynamic = "force-dynamic";
// جعل الصفحة ديناميكية حتى تقرأ اللغة الحالية وتُجلب البيانات مباشرة

const FALLBACK_SECTIONS: ContactSections = {
  hero: {
    kicker_ar: "تواصل مع الزُهى",
    kicker_en: "Get in Touch with ALZUHA",
    title_ar: "نحن هنا للإجابة، التوجيه، وبناء الفرصة المناسبة",
    title_en: "We are here to answer, guide, and build the right opportunity",
    desc_ar:
      "تواصل معنا للاستفسارات العامة، الفرص العقارية، الشراكات، أو أي احتياج يرتبط بخدمات الزُهى العقارية.",
    desc_en:
      "Reach out for general inquiries, real estate opportunities, partnerships, or anything related to ALZUHA real-estate services.",
    image_url: "/pages/contact/img/img%20(1).jpg",
  },

  contact_cards: {
    title_ar: "قنوات التواصل",
    title_en: "Contact Channels",
    items: [
      {
        icon: "📞",
        label_ar: "الهاتف",
        label_en: "Phone",
        value_ar: "+964 780 233 5555",
        value_en: "+964 780 233 5555",
        href: "tel:+9647802335555",
      },
      {
        icon: "✉️",
        label_ar: "البريد الإلكتروني",
        label_en: "Email",
        value_ar: "info@zuha.us",
        value_en: "info@zuha.us",
        href: "mailto:info@zuha.us",
      },
      {
        icon: "💬",
        label_ar: "واتساب",
        label_en: "WhatsApp",
        value_ar: "+964 780 233 5555",
        value_en: "+964 780 233 5555",
        href: "https://wa.me/9647802335555",
      },
      {
        icon: "📍",
        label_ar: "الموقع",
        label_en: "Location",
        value_ar: "النجف، العراق",
        value_en: "Najaf, Iraq",
        href: "/contact",
      },
    ],
  },

  offices: {
    title_ar: "الفروع والمكاتب",
    title_en: "Offices & Branches",
    items: [
      {
        name_ar: "الفرع الرئيسي",
        name_en: "Head Office",
        address_ar: "النجف، العراق",
        address_en: "Najaf, Iraq",
        phone: "+964 780 233 5555",
        email: "info@zuha.us",
        map_url: "#",
      },
    ],
  },

  form: {
    title_ar: "أرسل لنا رسالة",
    title_en: "Send Us a Message",
    desc_ar:
      "إذا كان لديك استفسار عام أو طلب تواصل بخصوص أحد المشاريع أو الشراكات، أرسل رسالتك وسنتواصل معك في أقرب وقت.",
    desc_en:
      "If you have a general inquiry or a communication request regarding projects or partnerships, send us your message and we will get back to you shortly.",

    name_label_ar: "الاسم الكامل",
    name_label_en: "Full Name",
    name_placeholder_ar: "الاسم الكامل",
    name_placeholder_en: "Full Name",

    phone_label_ar: "رقم الهاتف",
    phone_label_en: "Phone Number",
    phone_placeholder_ar: "07800000000",
    phone_placeholder_en: "+964 XXX XXX XXXX",

    email_label_ar: "البريد الإلكتروني",
    email_label_en: "Email Address",
    email_placeholder_ar: "البريد الإلكتروني",
    email_placeholder_en: "email@example.com",

    message_label_ar: "الرسالة",
    message_label_en: "Message",
    message_placeholder_ar: "اكتب رسالتك هنا...",
    message_placeholder_en: "Write your message here...",

    submit_ar: "إرسال الرسالة",
    submit_en: "Send Message",

    success_ar: "تم إرسال رسالتك بنجاح. سيتواصل معك فريقنا قريبًا.",
    success_en:
      "Your message has been sent successfully. Our team will contact you shortly.",

    error_ar: "تعذر إرسال الرسالة حاليًا. حاول مرة أخرى.",
    error_en: "Unable to send your message right now. Please try again.",
  },

  social: {
    title_ar: "تابعنا",
    title_en: "Follow Us",
    items: [
      { label_ar: "لينكدإن", label_en: "LinkedIn", href: "#" },
      { label_ar: "انستغرام", label_en: "Instagram", href: "#" },
      { label_ar: "دريبل", label_en: "Dribbble", href: "#" },
    ],
  },

  footer: {
    email: "info@zuha.us",
    copy_ar: "جميع الحقوق محفوظة © الزُهى 2026",
    copy_en: "All rights reserved © ALZUHA 2026",
    privacy_label_ar: "سياسة الخصوصية",
    privacy_label_en: "Privacy Policy",
    privacy_href: "/privacy-policy",
  },
};
// هذه النسخة الاحتياطية تضمن أن الصفحة تعمل حتى قبل ربط الأدمن الكامل

function text(value: unknown, fallback = ""): string {
  // إرجاع نص آمن مهما كانت القيمة المدخلة
  return typeof value === "string" ? value.trim() : fallback;
}

function asObject(value: unknown): Record<string, any> {
  // تحويل القيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, any>)
    : {};
}

function asArray<T>(value: unknown, fallback: T[] = []): T[] {
  // تحويل القيمة إلى array آمنة
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function textByLang(
  lang: Lang,
  ar?: string | null,
  en?: string | null,
  fallback = ""
) {
  // إرجاع النص حسب اللغة الحالية مع fallback آمن
  if (lang === "ar") return ar || en || fallback;
  return en || ar || fallback;
}

function normalizeContactCard(input: any, fallback: any) {
  // تطبيع بطاقة تواصل واحدة
  return {
    icon: text(input?.icon, fallback.icon),
    label_ar: text(input?.label_ar, fallback.label_ar),
    label_en: text(input?.label_en, fallback.label_en),
    value_ar: text(input?.value_ar, fallback.value_ar),
    value_en: text(input?.value_en, fallback.value_en),
    href: text(input?.href, fallback.href),
  };
}

function normalizeOffice(input: any, fallback: any) {
  // تطبيع بطاقة مكتب / فرع
  return {
    name_ar: text(input?.name_ar, fallback.name_ar),
    name_en: text(input?.name_en, fallback.name_en),
    address_ar: text(input?.address_ar, fallback.address_ar),
    address_en: text(input?.address_en, fallback.address_en),
    phone: text(input?.phone, fallback.phone),
    email: text(input?.email, fallback.email),
    map_url: text(input?.map_url, fallback.map_url),
  };
}

function normalizeSocial(input: any, fallback: any) {
  // تطبيع عنصر اجتماعي
  return {
    label_ar: text(input?.label_ar, fallback.label_ar),
    label_en: text(input?.label_en, fallback.label_en),
    href: text(input?.href, fallback.href),
  };
}

function normalizeContactSections(input: unknown): ContactSections {
  // تطبيع sections_json كاملًا بدل استخدام cast مباشر قد يكسر الصفحة
  const sections = asObject(input);

  const hero = asObject(sections.hero);
  const contactCards = asObject(sections.contact_cards);
  const offices = asObject(sections.offices);
  const form = asObject(sections.form);
  const social = asObject(sections.social);
  const footer = asObject(sections.footer);

  const normalizedCards = asArray<any>(
    contactCards.items,
    FALLBACK_SECTIONS.contact_cards.items
  ).map((item, index) =>
    normalizeContactCard(
      item,
      FALLBACK_SECTIONS.contact_cards.items[
        index % FALLBACK_SECTIONS.contact_cards.items.length
      ]
    )
  );

  const normalizedOffices = asArray<any>(
    offices.items,
    FALLBACK_SECTIONS.offices.items
  ).map((item, index) =>
    normalizeOffice(
      item,
      FALLBACK_SECTIONS.offices.items[
        index % FALLBACK_SECTIONS.offices.items.length
      ]
    )
  );

  const normalizedSocial = asArray<any>(
    social.items,
    FALLBACK_SECTIONS.social.items
  ).map((item, index) =>
    normalizeSocial(
      item,
      FALLBACK_SECTIONS.social.items[
        index % FALLBACK_SECTIONS.social.items.length
      ]
    )
  );

  return {
    hero: {
      kicker_ar: text(hero.kicker_ar, FALLBACK_SECTIONS.hero.kicker_ar),
      kicker_en: text(hero.kicker_en, FALLBACK_SECTIONS.hero.kicker_en),
      title_ar: text(hero.title_ar, FALLBACK_SECTIONS.hero.title_ar),
      title_en: text(hero.title_en, FALLBACK_SECTIONS.hero.title_en),
      desc_ar: text(hero.desc_ar, FALLBACK_SECTIONS.hero.desc_ar),
      desc_en: text(hero.desc_en, FALLBACK_SECTIONS.hero.desc_en),
      image_url: text(hero.image_url, FALLBACK_SECTIONS.hero.image_url),
    },

    contact_cards: {
      title_ar: text(
        contactCards.title_ar,
        FALLBACK_SECTIONS.contact_cards.title_ar
      ),
      title_en: text(
        contactCards.title_en,
        FALLBACK_SECTIONS.contact_cards.title_en
      ),
      items:
        normalizedCards.length > 0
          ? normalizedCards
          : FALLBACK_SECTIONS.contact_cards.items,
    },

    offices: {
      title_ar: text(offices.title_ar, FALLBACK_SECTIONS.offices.title_ar),
      title_en: text(offices.title_en, FALLBACK_SECTIONS.offices.title_en),
      items:
        normalizedOffices.length > 0
          ? normalizedOffices
          : FALLBACK_SECTIONS.offices.items,
    },

    form: {
      title_ar: text(form.title_ar, FALLBACK_SECTIONS.form.title_ar),
      title_en: text(form.title_en, FALLBACK_SECTIONS.form.title_en),
      desc_ar: text(form.desc_ar, FALLBACK_SECTIONS.form.desc_ar),
      desc_en: text(form.desc_en, FALLBACK_SECTIONS.form.desc_en),

      name_label_ar: text(
        form.name_label_ar,
        FALLBACK_SECTIONS.form.name_label_ar
      ),
      name_label_en: text(
        form.name_label_en,
        FALLBACK_SECTIONS.form.name_label_en
      ),
      name_placeholder_ar: text(
        form.name_placeholder_ar,
        FALLBACK_SECTIONS.form.name_placeholder_ar
      ),
      name_placeholder_en: text(
        form.name_placeholder_en,
        FALLBACK_SECTIONS.form.name_placeholder_en
      ),

      phone_label_ar: text(
        form.phone_label_ar,
        FALLBACK_SECTIONS.form.phone_label_ar
      ),
      phone_label_en: text(
        form.phone_label_en,
        FALLBACK_SECTIONS.form.phone_label_en
      ),
      phone_placeholder_ar: text(
        form.phone_placeholder_ar,
        FALLBACK_SECTIONS.form.phone_placeholder_ar
      ),
      phone_placeholder_en: text(
        form.phone_placeholder_en,
        FALLBACK_SECTIONS.form.phone_placeholder_en
      ),

      email_label_ar: text(
        form.email_label_ar,
        FALLBACK_SECTIONS.form.email_label_ar
      ),
      email_label_en: text(
        form.email_label_en,
        FALLBACK_SECTIONS.form.email_label_en
      ),
      email_placeholder_ar: text(
        form.email_placeholder_ar,
        FALLBACK_SECTIONS.form.email_placeholder_ar
      ),
      email_placeholder_en: text(
        form.email_placeholder_en,
        FALLBACK_SECTIONS.form.email_placeholder_en
      ),

      message_label_ar: text(
        form.message_label_ar,
        FALLBACK_SECTIONS.form.message_label_ar
      ),
      message_label_en: text(
        form.message_label_en,
        FALLBACK_SECTIONS.form.message_label_en
      ),
      message_placeholder_ar: text(
        form.message_placeholder_ar,
        FALLBACK_SECTIONS.form.message_placeholder_ar
      ),
      message_placeholder_en: text(
        form.message_placeholder_en,
        FALLBACK_SECTIONS.form.message_placeholder_en
      ),

      submit_ar: text(form.submit_ar, FALLBACK_SECTIONS.form.submit_ar),
      submit_en: text(form.submit_en, FALLBACK_SECTIONS.form.submit_en),

      success_ar: text(form.success_ar, FALLBACK_SECTIONS.form.success_ar),
      success_en: text(form.success_en, FALLBACK_SECTIONS.form.success_en),

      error_ar: text(form.error_ar, FALLBACK_SECTIONS.form.error_ar),
      error_en: text(form.error_en, FALLBACK_SECTIONS.form.error_en),
    },

    social: {
      title_ar: text(social.title_ar, FALLBACK_SECTIONS.social.title_ar),
      title_en: text(social.title_en, FALLBACK_SECTIONS.social.title_en),
      items:
        normalizedSocial.length > 0
          ? normalizedSocial
          : FALLBACK_SECTIONS.social.items,
    },

    footer: {
      email: text(footer.email, FALLBACK_SECTIONS.footer.email),
      copy_ar: text(footer.copy_ar, FALLBACK_SECTIONS.footer.copy_ar),
      copy_en: text(footer.copy_en, FALLBACK_SECTIONS.footer.copy_en),
      privacy_label_ar: text(
        footer.privacy_label_ar,
        FALLBACK_SECTIONS.footer.privacy_label_ar
      ),
      privacy_label_en: text(
        footer.privacy_label_en,
        FALLBACK_SECTIONS.footer.privacy_label_en
      ),
      privacy_href: text(
        footer.privacy_href,
        FALLBACK_SECTIONS.footer.privacy_href
      ),
    },
  };
}

async function getContactSections(lang: Lang): Promise<ContactSections> {
  // محاولة جلب محتوى صفحة contact من قاعدة البيانات مع تطبيع كامل
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select("title_ar,title_en,content_ar,content_en,sections_json,is_published")
      .eq("slug", "contact")
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_SECTIONS;
    }
    // عند فشل الجلب نستخدم النسخة الاحتياطية بدل إسقاط الصفحة

    const normalized = normalizeContactSections(data.sections_json);

    return {
      hero: {
        kicker_ar: text(
          normalized.hero.kicker_ar,
          FALLBACK_SECTIONS.hero.kicker_ar
        ),
        kicker_en: text(
          normalized.hero.kicker_en,
          FALLBACK_SECTIONS.hero.kicker_en
        ),
        title_ar: text(data.title_ar, normalized.hero.title_ar),
        title_en: text(data.title_en, normalized.hero.title_en),
        desc_ar: text(data.content_ar, normalized.hero.desc_ar),
        desc_en: text(data.content_en, normalized.hero.desc_en),
        image_url: text(normalized.hero.image_url, FALLBACK_SECTIONS.hero.image_url),
      },

      contact_cards: normalized.contact_cards,
      offices: normalized.offices,
      form: normalized.form,
      social: normalized.social,
      footer: normalized.footer,
    };
  } catch (error) {
    console.error("Contact page fetch error:", error);
    return FALLBACK_SECTIONS;
  }
}

export default async function ContactPage() {
  // الدالة الرئيسية لصفحة contact

  const cookieStore: any = await Promise.resolve(cookies() as any);

  const lang: Lang = cookieStore?.get?.("lang")?.value === "en" ? "en" : "ar";
  // تحديد اللغة الحالية من الكوكيز

  const dir = lang === "ar" ? "rtl" : "ltr";
  // تحديد اتجاه الصفحة

  const sections = await getContactSections(lang);
  // جلب محتوى الصفحة من DB أو fallback

  const copy: ContactCopy = {
    nav: {
      home: lang === "ar" ? "الرئيسية" : "Home",
      about: lang === "ar" ? "من نحن" : "About",
      portfolio: lang === "ar" ? "الأعمال" : "Portfolio",
      services: lang === "ar" ? "الخدمات" : "Services",
      contact: lang === "ar" ? "تواصل" : "Contact",
      cta: lang === "ar" ? "طلب استشارة" : "Request Consultation",
      menuTitle: lang === "ar" ? "القائمة" : "Menu",
    },
    socialTitle:
      lang === "ar" ? sections.social.title_ar : sections.social.title_en,
  };
  // النصوص العامة الخاصة بالتنقل والعناوين الثابتة

  return (
    <ContactClient
      lang={lang}
      dir={dir}
      copy={copy}
      sections={sections}
    />
  );
}