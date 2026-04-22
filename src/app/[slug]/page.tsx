import Link from "next/link";
// Link للتنقل الداخلي بين صفحات Next

import { cookies } from "next/headers";
// قراءة الكوكيز لمعرفة اللغة الحالية وحالة الأدمن

import { notFound } from "next/navigation";
// notFound لإظهار صفحة 404 الرسمية عند الحاجة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// مبدّل اللغة الحقيقي

export const dynamic = "force-dynamic";
// منع الكاش الثابت

type PageRow = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  hero_image_url?: string | null;
  is_published: boolean;
  page_type?: string;
};
// نوع الصفحة القادمة من API العام

function baseUrl() {
  // رابط الأساس للتطبيق
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
}

function asset(path?: string | null) {
  // ترميز رابط الصورة إذا احتوى فراغات أو أقواس
  if (!path) return "";
  return encodeURI(path);
}

async function fetchPage(slug: string): Promise<PageRow | null> {
  // جلب الصفحة من API العام حسب slug
  try {
    const url = `${baseUrl()}/api/pages-public?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: "no-store" });

    // إذا فشل الطلب نرجع null
    if (!res.ok) {
      console.error("fetchPage failed:", res.status, res.statusText, url);
      return null;
    }

    const json = (await res.json()) as { page?: PageRow };
    return json?.page ?? null;
  } catch (error) {
    // إذا فشل fetch نفسه نرجع null أيضًا
    console.error("fetchPage crashed:", error);
    return null;
  }
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // استخراج slug من الرابط
  const { slug } = await params;

  // قراءة الكوكيز
  const cookieStore = await cookies();

  // تحديد اللغة الحالية
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "ar";

  // تحديد حالة الأدمن
  const isAdmin = !!cookieStore.get("admin_session")?.value;

  // تحديد اتجاه الصفحة
  const dir = lang === "ar" ? "rtl" : "ltr";

  // منع التقاط الصفحات الخاصة
  if (
    slug === "about" ||
    slug === "admin" ||
    slug === "login" ||
    slug.startsWith("api")
  ) {
    notFound();
  }

  // جلب الصفحة من API
  const page = await fetchPage(slug);

  // إذا لم نجد الصفحة نعرض 404
  if (!page) {
    notFound();
  }

  // إذا كانت الصفحة غير منشورة لا نعرضها
  if (!page.is_published) {
    notFound();
  }

  // الصفحات المؤسسية لها renderer خاص
  if (page.page_type === "institutional") {
    notFound();
  }

  // تحديد النصوص حسب اللغة
  const title = lang === "ar" ? page.title_ar : page.title_en;
  const content = lang === "ar" ? page.content_ar : page.content_en;

  // تجهيز صورة الصفحة إن وجدت
  const heroImage = asset(page.hero_image_url);

  return (
    <>
      <link rel="stylesheet" href="/pages/home/css/page.css" />
      {/* استخدام نفس CSS العام حتى تبقى الصفحة مكملة بصريًا للموقع */}

      <main dir={dir}>
        <header className="topbar">
          <div className="container topbar__inner">
            <Link href="/" className="brand" aria-label="ALZUHA Home">
              <div className="brand__mark">⌂</div>

              <div className="brand__text">
                <strong>ALZUHA</strong>
                <small>{lang === "ar" ? "العقارات" : "Real Estate"}</small>
              </div>
            </Link>

            <nav className="nav" aria-label="Main navigation">
              <ul id="navMenu" className="nav__menu">
                <li>
                  <Link className="nav__link" href="/about">
                    {lang === "ar" ? "من نحن" : "About"}
                  </Link>
                </li>
                <li>
                  <Link className="nav__link" href="/services">
                    {lang === "ar" ? "الخدمات" : "Services"}
                  </Link>
                </li>
                <li>
                  <Link className="nav__link" href="/portfolio">
                    {lang === "ar" ? "سجل الأعمال" : "Portfolio"}
                  </Link>
                </li>
                <li>
                  <Link className="nav__link" href="/faq">
                    {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                  </Link>
                </li>
                <li>
                  <Link className="nav__link" href="/contact">
                    {lang === "ar" ? "تواصل" : "Contact"}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitch />
              {/* مبدّل اللغة */}

              {isAdmin ? (
                <Link className="btn btn--white btn--sm" href="/admin">
                  Admin
                </Link>
              ) : null}
              {/* زر الأدمن يظهر لك فقط إذا كانت الجلسة موجودة */}
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-4xl px-6 py-16">
          {heroImage ? (
            <div className="mb-8 overflow-hidden rounded-3xl border border-white/10">
              <img
                src={heroImage}
                alt={title || slug}
                className="h-[320px] w-full object-cover"
              />
            </div>
          ) : null}

          <h1 className="text-3xl font-semibold text-white">
            {title || slug}
          </h1>

          <div className="mt-6 whitespace-pre-wrap leading-8 text-white/75">
            {content || (lang === "ar" ? "لا يوجد محتوى حتى الآن." : "No content yet.")}
          </div>
        </section>

        <footer className="contact">
          <div className="container">
            <div className="footerMini">
              <span>
                {lang === "ar"
                  ? "ALZUHA — صفحة مرتبطة ديناميكيًا بقاعدة البيانات"
                  : "ALZUHA — Page dynamically connected to the database"}
              </span>

              <Link className="footerMini__link" href="/contact">
                {lang === "ar" ? "طلب استشارة" : "Request Consultation"}
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}