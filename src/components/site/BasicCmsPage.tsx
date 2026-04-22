import Link from "next/link";
// Link للتنقل الداخلي بين صفحات Next

import { cookies } from "next/headers";
// قراءة الكوكيز لمعرفة اللغة الحالية وحالة الأدمن

import { notFound } from "next/navigation";
// notFound لإظهار 404 رسمي إذا الصفحة غير موجودة

import LanguageSwitch from "@/components/site/LanguageSwitch";
// مبدّل اللغة الحقيقي

import { getPublicPage } from "@/lib/get-public-page";
// دالة جلب الصفحة من قاعدة البيانات

type Props = {
  slug: string;
};
// هذا المكوّن يستقبل slug الصفحة المطلوبة مثل services أو contact

function asset(path?: string | null) {
  // ترميز رابط الصورة بشكل آمن إذا احتوى على فراغات أو أقواس
  if (!path) return "";
  return encodeURI(path);
}

export default async function BasicCmsPage({ slug }: Props) {
  // قراءة الكوكيز مرة واحدة
  const cookieStore = await cookies();

  // تحديد اللغة الحالية
  const lang = cookieStore.get("lang")?.value === "en" ? "en" : "ar";


const adminCookieName = process.env.ADMIN_COOKIE?.trim() || "zuha_admin";
// قراءة اسم كوكي الأدمن من البيئة

const isAdmin = !!cookieStore.get(adminCookieName)?.value;
// التحقق من جلسة الأدمن





  // تحديد اتجاه الصفحة بحسب اللغة
  const dir = lang === "ar" ? "rtl" : "ltr";

  // جلب الصفحة المطلوبة من قاعدة البيانات
  const page = await getPublicPage(slug);

  // إذا الصفحة غير موجودة نعرض 404
  if (!page) {
    notFound();
  }

  // تحديد النصوص بحسب اللغة
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
              {/* زر الأدمن يظهر لك فقط إذا كانت جلسة الأدمن موجودة */}
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
          {/* عرض صورة الصفحة إذا كانت موجودة */}

          <h1 className="text-3xl font-semibold text-white">
            {title || slug}
          </h1>
          {/* عنوان الصفحة */}

          <div className="mt-6 whitespace-pre-wrap leading-8 text-white/75">
            {content ||
              (lang === "ar"
                ? "لا يوجد محتوى حتى الآن."
                : "No content yet.")}
          </div>
          {/* محتوى الصفحة */}
        </section>

        <footer className="contact">
          <div className="container">
            <div className="footerMini">
              <span>
                {lang === "ar"
                  ? "ALZUHA — صفحة مرتبطة مباشرة بقاعدة البيانات"
                  : "ALZUHA — Page connected directly to the database"}
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