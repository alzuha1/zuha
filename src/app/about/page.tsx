import "./about.css";
// استيراد ملف التنسيق الخاص بصفحة About حتى تبقى نفس الهوية البصرية المعتمدة

import { cookies } from "next/headers";
// قراءة كوكي اللغة الحالية على جهة السيرفر

import { readFile } from "node:fs/promises";
// قراءة ملفات JSON المحلية في حال فشل قاعدة البيانات

import path from "node:path";
// بناء مسارات الملفات المحلية بشكل صحيح وآمن

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر لجلب صفحة About من جدول pages

import AboutInstitutional, {
  type AboutPageRecord,
  type Lang,
} from "@/components/about/AboutInstitutional";
// استيراد مكوّن About نفسه
// والأهم: استيراد النوع نفسه من نفس المصدر
// حتى لا نكرر تعريف AboutPageRecord مرة ثانية ونصنع تعارضًا جديدًا

export const dynamic = "force-dynamic";
// إجبار الصفحة على العمل بشكل ديناميكي وعدم الاعتماد على كاش ثابت

type LocalHeroSlide = {
  image_url?: string;
  img?: string;
  title?: string;
  desc?: string;
};
// شكل الشريحة في ملفات JSON المحلية

type LocalServiceItem = {
  label?: string;
  title?: string;
  text?: string;
  btn?: string;
  href?: string;
  image_url?: string;
  img?: string;
};
// شكل عنصر الخدمة في ملفات JSON المحلية

type LocalStatItem = {
  num?: string;
  title?: string;
  desc?: string;
};
// شكل عنصر الإحصائيات في ملفات JSON المحلية

type LocalTeamMember = {
  name?: string;
  role?: string;
  image_url?: string;
  avatar?: string;
  img?: string;
};
// شكل عضو الفريق في ملفات JSON المحلية

type LocalSocialItem = {
  label?: string;
  href?: string;
};
// شكل روابط السوشيال في ملفات JSON المحلية

type LocalAboutJson = {
  heroHint?: string;
  vision?: {
    kicker?: string;
    title?: string;
    desc?: string;
  };
  heroSlides?: LocalHeroSlide[];
  services?: {
    title?: string;
    desc?: string;
    items?: LocalServiceItem[];
  };
  statsTitle?: string;
  stats?: {
    title?: string;
    items?: LocalStatItem[];
  };
  team?: {
    kicker?: string;
    title?: string;
    desc?: string;
    cta?: string;
    btn?: string;
    members?: LocalTeamMember[];
  };
  footer?: {
    email?: string;
    location?: string;
    brand?: string;
    copy?: string;
    policy?: string;
    social?: LocalSocialItem[];
  };
};
// هذا النوع يغطي البنية الفعلية القادمة من ملفي JSON المحليين

async function getLang(): Promise<Lang> {
  // قراءة كوكي اللغة بطريقة متوافقة مع Next.js 16
  const cookieStore = await cookies();

  // إذا كانت اللغة en نرجع الإنجليزية وإلا العربية افتراضيًا
  return cookieStore.get("lang")?.value === "en" ? "en" : "ar";
}

function asArray<T>(value: unknown): T[] {
  // تحويل أي قيمة إلى Array آمنة
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeAboutAssetPath(src?: string | null): string {
  // توحيد مسارات الصور لمنع تكسرها عند اختلاف الصيغة

  if (!src) {
    return "";
  }

  const clean = src.trim();

  if (!clean) {
    return "";
  }

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    // إذا كان رابطًا خارجيًا كاملًا نرجعه كما هو
    return clean;
  }

  if (clean.startsWith("/")) {
    // إذا كان المسار يبدأ أصلًا بشرطة مائلة نكتفي بترميزه
    return encodeURI(clean);
  }

  if (clean.startsWith("pages/")) {
    // إذا جاء بالشكل pages/about/img/... نحوّله إلى /pages/about/img/...
    return encodeURI(`/${clean}`);
  }

  if (clean.startsWith("about/")) {
    // إذا جاء بالشكل about/... نحوّله إلى /about/...
    return encodeURI(`/${clean}`);
  }

  // أي اسم ملف نسبي فقط نعتبره داخل مجلد صور صفحة about
  return encodeURI(`/pages/about/img/${clean}`);
}

async function readJsonSafe<T>(filePath: string): Promise<T | null> {
  // قراءة ملف JSON محلي بشكل آمن
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read local JSON: ${filePath}`, error);
    return null;
  }
}

function mergeAboutLocalJson(
  arData: LocalAboutJson,
  enData: LocalAboutJson
): AboutPageRecord {
  // دمج الملفين العربي والإنجليزي في سجل واحد نهائي متوافق مع الواجهة

  const arSlides = asArray<LocalHeroSlide>(arData.heroSlides);
  const enSlides = asArray<LocalHeroSlide>(enData.heroSlides);
  const slidesLength = Math.max(arSlides.length, enSlides.length);

  const arServices = asArray<LocalServiceItem>(arData.services?.items);
  const enServices = asArray<LocalServiceItem>(enData.services?.items);
  const servicesLength = Math.max(arServices.length, enServices.length);

  const arStats = asArray<LocalStatItem>(arData.stats?.items);
  const enStats = asArray<LocalStatItem>(enData.stats?.items);
  const statsLength = Math.max(arStats.length, enStats.length);

  const arMembers = asArray<LocalTeamMember>(arData.team?.members);
  const enMembers = asArray<LocalTeamMember>(enData.team?.members);
  const membersLength = Math.max(arMembers.length, enMembers.length);

  const mergedSlides = Array.from({ length: slidesLength }, (_, index) => {
    const arSlide = arSlides[index] || {};
    const enSlide = enSlides[index] || {};

    return {
      image_url: normalizeAboutAssetPath(
        arSlide.image_url ||
          arSlide.img ||
          enSlide.image_url ||
          enSlide.img ||
          ""
      ),
      title_ar: arSlide.title || "",
      title_en: enSlide.title || "",
      desc_ar: arSlide.desc || "",
      desc_en: enSlide.desc || "",
    };
  });

  const mergedServices = Array.from({ length: servicesLength }, (_, index) => {
    const arItem = arServices[index] || {};
    const enItem = enServices[index] || {};

    return {
      label: arItem.label || enItem.label || `${index + 1}`,
      title_ar: arItem.title || "",
      title_en: enItem.title || "",
      text_ar: arItem.text || "",
      text_en: enItem.text || "",
      btn_ar: arItem.btn || "",
      btn_en: enItem.btn || "",
      href: arItem.href || enItem.href || "/contact",
      image_url: normalizeAboutAssetPath(
        arItem.image_url ||
          arItem.img ||
          enItem.image_url ||
          enItem.img ||
          ""
      ),
    };
  });

  const mergedStats = Array.from({ length: statsLength }, (_, index) => {
    const arItem = arStats[index] || {};
    const enItem = enStats[index] || {};

    return {
      num: arItem.num || enItem.num || "",
      title_ar: arItem.title || "",
      title_en: enItem.title || "",
      desc_ar: arItem.desc || "",
      desc_en: enItem.desc || "",
    };
  });

  const mergedMembers = Array.from({ length: membersLength }, (_, index) => {
    const arItem = arMembers[index] || {};
    const enItem = enMembers[index] || {};

    return {
      name_ar: arItem.name || "",
      name_en: enItem.name || "",
      role_ar: arItem.role || "",
      role_en: enItem.role || "",
      image_url: normalizeAboutAssetPath(
        arItem.image_url ||
          arItem.avatar ||
          arItem.img ||
          enItem.image_url ||
          enItem.avatar ||
          enItem.img ||
          ""
      ),
    };
  });

  const sections_json = {
    hero: {
      hint_ar: arData.heroHint || "نهج",
      hint_en: enData.heroHint || "Approach",
      slides: mergedSlides,
    },

    vision: {
      kicker_ar: arData.vision?.kicker || "رؤية الزهى",
      kicker_en: enData.vision?.kicker || "ALZUHA Vision",
      title_ar: arData.vision?.title || "من نحن",
      title_en: enData.vision?.title || "About Us",
      desc_ar: arData.vision?.desc || "صفحة تعريفية مؤسسية.",
      desc_en: enData.vision?.desc || "Institutional about page.",
    },

    services: {
      title_ar: arData.services?.title || "الخدمات",
      title_en: enData.services?.title || "Services",
      desc_ar: arData.services?.desc || "",
      desc_en: enData.services?.desc || "",
      items: mergedServices,
    },

    stats: {
      title_ar: arData.statsTitle || arData.stats?.title || "الإحصائيات",
      title_en: enData.statsTitle || enData.stats?.title || "Statistics",
      items: mergedStats,
    },

    team: {
      kicker_ar: arData.team?.kicker || "فريق العمل",
      kicker_en: enData.team?.kicker || "Our Team",
      title_ar: arData.team?.title || "خبراء في العقار والاستثمار",
      title_en: enData.team?.title || "Experts in real estate & investment",
      desc_ar: arData.team?.desc || "",
      desc_en: enData.team?.desc || "",
      cta_ar: arData.team?.cta || arData.team?.btn || "تواصل الآن",
      cta_en: enData.team?.cta || enData.team?.btn || "Contact Now",
      members: mergedMembers,
    },

    footer: {
      email: arData.footer?.email || enData.footer?.email || "info@zuha.us",
      location_ar: arData.footer?.location || "العراق، النجف",
      location_en: enData.footer?.location || "Iraq, Najaf",
      brand: arData.footer?.brand || enData.footer?.brand || "ALZUHA",
      copy_ar: arData.footer?.copy || "جميع الحقوق محفوظة © ALZUHA 2025",
      copy_en: enData.footer?.copy || "All rights reserved © ALZUHA 2025",
      policy_ar: arData.footer?.policy || "سياسة الخصوصية",
      policy_en: enData.footer?.policy || "Privacy Policy",
      social: arData.footer?.social || enData.footer?.social || [],
    },
  };

  return {
    slug: "about",
    title_ar: arData.vision?.title || "من نحن",
    title_en: enData.vision?.title || "About Us",
    content_ar: arData.vision?.desc || "صفحة تعريفية مؤسسية.",
    content_en: enData.vision?.desc || "Institutional about page.",
    hero_image_url: mergedSlides[0]?.image_url || null,
    is_published: true,
    page_type: "institutional",
    meta_json: {},
    sections_json,
  };
}

async function getLocalAboutFallback(): Promise<AboutPageRecord | null> {
  // تحميل fallback المحلي من ملفات JSON
  const baseDir = path.join(
    process.cwd(),
    "public",
    "pages",
    "about",
    "data"
  );

  const arPath = path.join(baseDir, "content.ar.json");
  const enPath = path.join(baseDir, "content.en.json");

  const arData = await readJsonSafe<LocalAboutJson>(arPath);
  const enData = await readJsonSafe<LocalAboutJson>(enPath);

  if (!arData && !enData) {
    return null;
  }

  return mergeAboutLocalJson(arData || {}, enData || {});
}

async function getAboutPage(): Promise<AboutPageRecord | null> {
  // جلب الصفحة من Supabase أولًا ثم fallback المحلي عند الفشل
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,hero_image_url,is_published,page_type,meta_json,sections_json"
      )
      .eq("slug", "about")
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("About page fetch error:", error.message);
      return await getLocalAboutFallback();
    }

    if (!data) {
      return await getLocalAboutFallback();
    }

    if (data.page_type && data.page_type !== "institutional") {
      console.error(`About page has unexpected page_type: ${data.page_type}`);
      return await getLocalAboutFallback();
    }

    return {
      ...(data as AboutPageRecord),
      hero_image_url: normalizeAboutAssetPath(data.hero_image_url),
    };
  } catch (error) {
    console.error("About page crashed while fetching:", error);
    return await getLocalAboutFallback();
  }
}

export default async function AboutPage() {
  // هذه هي الصفحة الرئيسية لـ About
  const lang = await getLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const page = await getAboutPage();

  if (!page) {
    return (
      <main dir={dir} className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-3xl font-semibold">
          {lang === "ar" ? "من نحن" : "About"}
        </h1>

        <p className="mt-4 text-white/70">
          {lang === "ar"
            ? "تعذر تحميل صفحة من نحن حاليًا من قاعدة البيانات أو من النسخة المحلية."
            : "Failed to load the About page from both database and local fallback."}
        </p>
      </main>
    );
  }

  return <AboutInstitutional page={page} lang={lang} />;
  // تمرير الصفحة النهائية إلى المكوّن العميل
}