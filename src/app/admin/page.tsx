import Link from "next/link";
// نستورد Link من Next.js للتنقل الداخلي بين صفحات الأدمن بدون إعادة تحميل كاملة.

import { cookies } from "next/headers";
// نستورد cookies لقراءة كوكي تسجيل دخول الأدمن من السيرفر.

import { redirect } from "next/navigation";
// نستورد redirect لإعادة غير المصرح له إلى صفحة تسجيل الدخول.

export const dynamic = "force-dynamic";
// نجعل صفحة الأدمن ديناميكية حتى لا تعتمد على نسخة كاش قديمة.

type AdminCard = {
  // نوع بيانات كرت واحد داخل لوحة التحكم.
  label: string;
  // التصنيف الصغير أعلى عنوان الكرت.
  title: string;
  // عنوان الكرت الرئيسي.
  href: string;
  // رابط صفحة الأدمن التي يفتحها الكرت.
  desc: string;
  // وصف مختصر يشرح وظيفة الكرت.
};

async function isAdminAuthorized() {
  // دالة تتحقق من أن المستخدم مسجل دخول كأدمن.
  const cookieStore: any = await Promise.resolve(cookies() as any);
  // قراءة الكوكيز من السيرفر بطريقة متوافقة مع نسخ Next المختلفة.

  const adminCookieName = process.env.ADMIN_COOKIE || "zuha_admin";
  // اسم كوكي الأدمن من ملف البيئة، أو الاسم الافتراضي إذا لم يكن موجودًا.

  const adminCookie = cookieStore?.get?.(adminCookieName)?.value;
  // قراءة قيمة كوكي الأدمن إن كانت موجودة.

  return Boolean(adminCookie);
  // إذا كانت قيمة الكوكي موجودة نعتبر الأدمن مصرحًا له بالدخول.
}

const adminCards: AdminCard[] = [
  // قائمة كل كروت لوحة التحكم الرئيسية.
  {
    label: "Design System",
    title: "Global Theme Builder",
    href: "/admin/theme",
    desc: "تحكم عام بالهيدر، الشعار، الألوان، الخطوط، وخلفية الموقع.",
  },
  // كرت الثيم العام للموقع.

  {
    label: "CMS",
    title: "Home Page Builder",
    href: "/admin/home-page",
    desc: "تحكم كامل بالصفحة الرئيسية، النصوص، الصور، والمعاينة الحية.",
  },
  // كرت إدارة الصفحة الرئيسية.

  {
    label: "CMS",
    title: "About Page Builder",
    href: "/admin/about-page",
    desc: "إدارة محتوى صفحة النبذة المؤسسية والصور والأقسام.",
  },
  // كرت إدارة صفحة About.

  {
    label: "CMS",
    title: "Services Page Builder",
    href: "/admin/services-page",
    desc: "إدارة صفحة الخدمات والحلول الاستثمارية.",
  },
  // كرت إدارة صفحة Services.

  {
    label: "CMS",
    title: "Portfolio Page Builder",
    href: "/admin/portfolio-page",
    desc: "إدارة سجل الأعمال، المشاريع، والعروض المرئية.",
  },
  // كرت إدارة صفحة Portfolio.

  {
    label: "CMS",
    title: "FAQ Page Builder",
    href: "/admin/faq-page",
    desc: "إدارة الأسئلة الشائعة والتصنيفات والمحتوى.",
  },
  // كرت إدارة صفحة FAQ.

  {
    label: "Inbox",
    title: "Contact Messages",
    href: "/admin/contact-messages",
    desc: "إدارة رسائل التواصل الواردة من نموذج Contact.",
  },
  // كرت إدارة رسائل التواصل.

  {
    label: "Inbox",
    title: "Consultation Requests",
    href: "/admin/consultations",
    desc: "إدارة طلبات الاستشارة والحجوزات.",
  },
  // كرت إدارة طلبات الاستشارة.

  {
    label: "Media",
    title: "Images Library",
    href: "/admin/media",
    desc: "إدارة مكتبة الصور والملفات المرفوعة.",
  },
  // كرت مكتبة الصور.

  {
    label: "Settings",
    title: "Translations AR / EN",
    href: "/admin/i18n",
    desc: "إدارة الترجمة والنصوص العامة باللغتين.",
  },
  // كرت الترجمة.

  {
    label: "Settings",
    title: "Site Content",
    href: "/admin/content",
    desc: "إدارة المحتوى العام والإعدادات النصية للموقع.",
  },
  // كرت المحتوى العام.

  {
    label: "CMS",
    title: "Pages Manager",
    href: "/admin/pages",
    desc: "إدارة الصفحات العامة وسجلات CMS.",
  },
  // كرت مدير الصفحات.
];

export default async function AdminDashboardPage() {
  // صفحة لوحة التحكم الرئيسية للأدمن.
  const authorized = await isAdminAuthorized();
  // التحقق من صلاحية الدخول قبل عرض لوحة التحكم.

  if (!authorized) {
    // إذا لم يكن المستخدم مصرحًا له.
    redirect("/admin/login?next=/admin");
    // إعادة التوجيه إلى تسجيل الدخول مع حفظ وجهة الرجوع.
  }

  return (
    // بداية إخراج صفحة الأدمن.
    <main className="min-h-screen bg-[#f3f6fb] px-6 py-10 text-[#111827]">
      {/* الغلاف الرئيسي للوحة التحكم مع خلفية هادئة ومسافات داخلية. */}
      <section className="mx-auto max-w-7xl">
        {/* حاوية مركزية تحدد عرض لوحة التحكم. */}
        <header className="rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
          {/* رأس لوحة التحكم. */}
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#244fca]">
            {/* النص الصغير أعلى العنوان. */}
            ALZUHA ADMIN
          </p>
          {/* نهاية النص الصغير. */}
          <h1 className="m-0 text-4xl font-black tracking-tight md:text-5xl">
            {/* عنوان لوحة التحكم الرئيسي. */}
            Admin Dashboard
          </h1>
          {/* نهاية العنوان. */}
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {/* وصف لوحة التحكم. */}
            لوحة تحكم مركزية لإدارة الصفحات، الثيم، الصور، الرسائل، طلبات الاستشارة، والترجمة.
          </p>
          {/* نهاية الوصف. */}
        </header>
        {/* نهاية رأس لوحة التحكم. */}

        <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* شبكة كروت الأدمن. */}
          {adminCards.map((card) => (
            // توليد كرت لكل صفحة أدمن من القائمة.
            <Link
              key={card.href}
              href={card.href}
              className="group block min-h-[180px] rounded-[28px] border border-slate-200/90 bg-white/85 p-7 text-[#111827] no-underline shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-[#244fca]/50 hover:shadow-[0_26px_70px_rgba(36,79,202,0.16)]"
            >
              {/* رابط الكرت الذي ينقل إلى صفحة الأدمن المطلوبة. */}
              <span className="text-xs font-black uppercase tracking-[0.12em] text-[#244fca]">
                {/* تصنيف الكرت. */}
                {card.label}
              </span>
              {/* نهاية التصنيف. */}
              <strong className="mt-3 block text-2xl font-black">
                {/* عنوان الكرت. */}
                {card.title}
              </strong>
              {/* نهاية العنوان. */}
              <p className="mt-3 text-base leading-7 text-slate-500">
                {/* وصف وظيفة الكرت. */}
                {card.desc}
              </p>
              {/* نهاية الوصف. */}
              <span className="mt-5 inline-flex text-sm font-black text-[#244fca] opacity-80 transition group-hover:opacity-100">
                {/* مؤشر بصري بسيط للدخول. */}
                Open →
              </span>
              {/* نهاية مؤشر الدخول. */}
            </Link>
            // نهاية كرت واحد.
          ))}
          {/* نهاية توليد الكروت. */}
        </section>
        {/* نهاية شبكة الكروت. */}
      </section>
      {/* نهاية الحاوية المركزية. */}
    </main>
    // نهاية الصفحة.
  );
  // نهاية return.
}