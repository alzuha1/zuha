import "./about.css";
// استيراد تنسيق صفحة About للحفاظ على الهوية البصرية المعتمدة

import { cookies } from "next/headers";
// قراءة كوكي اللغة الحالية من جهة السيرفر

import AboutInstitutional, {
  type AboutPageRecord,
  type Lang,
} from "@/components/about/AboutInstitutional";
// مكوّن العرض النهائي لصفحة About
// مع استيراد الأنواع نفسها من نفس المصدر لتجنب تكرار التعريفات

import { getPublicPage } from "@/lib/get-public-page";
// المسار الموحّد لجلب الصفحات العامة من قاعدة البيانات

export const dynamic = "force-dynamic";
// إجبار الصفحة على العمل ديناميكيًا وعدم الاعتماد على كاش ثابت

async function getLang(): Promise<Lang> {
  // قراءة كوكي اللغة بطريقة متوافقة مع Next.js
  const cookieStore = await cookies();

  // إذا كانت اللغة en نرجع الإنجليزية، وإلا العربية افتراضيًا
  return cookieStore.get("lang")?.value === "en" ? "en" : "ar";
}

function normalizeAboutAssetPath(src?: string | null): string {
  // توحيد مسارات الصور لمنع تكسرها عند اختلاف صيغة التخزين

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
    // إذا كان المسار يبدأ بشرطة مائلة فهو جاهز
    return encodeURI(clean);
  }

  if (clean.startsWith("pages/")) {
    // تحويل pages/about/... إلى /pages/about/...
    return encodeURI(`/${clean}`);
  }

  if (clean.startsWith("about/")) {
    // تحويل about/... إلى /about/...
    return encodeURI(`/${clean}`);
  }

  // أي اسم ملف نسبي فقط نعتبره داخل مجلد صور صفحة about
  return encodeURI(`/pages/about/img/${clean}`);
}

async function getAboutPage(): Promise<AboutPageRecord | null> {
  // جلب صفحة About من قاعدة البيانات عبر المسار الموحّد
  // مع السماح الصريح بالصفحات المؤسسية مثل about
  try {
    const data = await getPublicPage("about", { allowInstitutional: true });

    if (!data) {
      console.error("About page was not found or not published.");
      return null;
    }

    return {
      ...(data as AboutPageRecord),
      hero_image_url: normalizeAboutAssetPath(data.hero_image_url),
    };
  } catch (error) {
    console.error("About page crashed while fetching:", error);
    return null;
  }
}

export default async function AboutPage() {
  // الصفحة الرئيسية الخاصة بـ About
  const lang = await getLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const page = await getAboutPage();

  if (!page) {
    // شاشة خطأ نظيفة في حال فشل الجلب من قاعدة البيانات
    return (
      <main dir={dir} className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-3xl font-semibold">
          {lang === "ar" ? "من نحن" : "About"}
        </h1>

        <p className="mt-4 text-white/70">
          {lang === "ar"
            ? "تعذر تحميل صفحة من نحن حاليًا من قاعدة البيانات."
            : "Failed to load the About page from the database."}
        </p>
      </main>
    );
  }

  // تمرير الصفحة النهائية إلى مكوّن العرض
  return <AboutInstitutional page={page} lang={lang} />;
}