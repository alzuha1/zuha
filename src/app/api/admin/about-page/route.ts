import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

// slug الثابت الخاص بصفحة About
const ABOUT_SLUG = "about";

// اسم كوكي الأدمن الفعلي
const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE?.trim() || "admin_session";

// دالة بسيطة لتنظيف النصوص
function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

// دالة بسيطة لضمان أن القيمة مصفوفة
function arr<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

// التحقق من جلسة الأدمن
async function hasAdminSession() {
  const store: any = await Promise.resolve(cookies() as any);
  return !!store?.get?.(ADMIN_COOKIE_NAME)?.value;
}

// البنية الافتراضية الكاملة لـ sections_json الخاصة بصفحة About
function defaultAboutSections() {
  return {
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
        {
          label: "02",
          title_ar: "إدارة الأصول العقارية",
          title_en: "Asset Management",
          text_ar:
            "منهجية تشغيلية واستراتيجية للحفاظ على القيمة ورفع الكفاءة والعائد.",
          text_en:
            "An operational and strategic approach to preserve value and improve efficiency and returns.",
          btn_ar: "عرض التفاصيل",
          btn_en: "View Details",
          href: "/services",
          image_url: "/pages/about/img/img%20(3).jpg",
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
        {
          num: "+250",
          title_ar: "عميل وشريك",
          title_en: "Clients & Partners",
          desc_ar: "علاقات مبنية على الثقة والاستمرارية.",
          desc_en: "Relationships built on trust and continuity.",
        },
        {
          num: "+10",
          title_ar: "سنوات خبرة",
          title_en: "Years of Experience",
          desc_ar: "تراكم عملي ومعرفة بالسوق المحلي والفرص النوعية.",
          desc_en:
            "Practical experience and market knowledge across local opportunities.",
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
        {
          name_ar: "سارة جابر",
          name_en: "Sarah Jaber",
          role_ar: "مستشارة استثمار",
          role_en: "Investment Advisor",
          image_url: "/pages/about/img/img%20(7).jpg",
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
        {
          label: "Instagram",
          href: "https://instagram.com/",
        },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/",
        },
      ],
    },
  };
}

// تطبيع بيانات شريحة hero
function normalizeHeroSlide(input: any) {
  return {
    title_ar: text(input?.title_ar),
    title_en: text(input?.title_en),
    desc_ar: text(input?.desc_ar),
    desc_en: text(input?.desc_en),
    image_url: text(input?.image_url),
  };
}

// تطبيع عنصر خدمة
function normalizeServiceItem(input: any) {
  return {
    label: text(input?.label),
    title_ar: text(input?.title_ar),
    title_en: text(input?.title_en),
    text_ar: text(input?.text_ar),
    text_en: text(input?.text_en),
    btn_ar: text(input?.btn_ar),
    btn_en: text(input?.btn_en),
    href: text(input?.href),
    image_url: text(input?.image_url),
  };
}

// تطبيع عنصر إحصائي
function normalizeStatItem(input: any) {
  return {
    num: text(input?.num),
    title_ar: text(input?.title_ar),
    title_en: text(input?.title_en),
    desc_ar: text(input?.desc_ar),
    desc_en: text(input?.desc_en),
  };
}

// تطبيع عضو فريق
function normalizeTeamMember(input: any) {
  return {
    name_ar: text(input?.name_ar),
    name_en: text(input?.name_en),
    role_ar: text(input?.role_ar),
    role_en: text(input?.role_en),
    image_url: text(input?.image_url),
  };
}

// تطبيع رابط اجتماعي
function normalizeSocialItem(input: any) {
  return {
    label: text(input?.label),
    href: text(input?.href),
  };
}

// تطبيع sections_json كاملة
function normalizeAboutSections(input: any) {
  const defaults = defaultAboutSections();

  const heroSlides = arr<any>(input?.hero?.slides).map(normalizeHeroSlide);
  const servicesItems = arr<any>(input?.services?.items).map(normalizeServiceItem);
  const statsItems = arr<any>(input?.stats?.items).map(normalizeStatItem);
  const teamMembers = arr<any>(input?.team?.members).map(normalizeTeamMember);
  const socialItems = arr<any>(input?.footer?.social).map(normalizeSocialItem);

  return {
    hero: {
      kicker_ar: text(input?.hero?.kicker_ar, defaults.hero.kicker_ar),
      kicker_en: text(input?.hero?.kicker_en, defaults.hero.kicker_en),
      title_ar: text(input?.hero?.title_ar, defaults.hero.title_ar),
      title_en: text(input?.hero?.title_en, defaults.hero.title_en),
      desc_ar: text(input?.hero?.desc_ar, defaults.hero.desc_ar),
      desc_en: text(input?.hero?.desc_en, defaults.hero.desc_en),
      image_url: text(input?.hero?.image_url, defaults.hero.image_url),
      primary_btn_ar: text(
        input?.hero?.primary_btn_ar,
        defaults.hero.primary_btn_ar
      ),
      primary_btn_en: text(
        input?.hero?.primary_btn_en,
        defaults.hero.primary_btn_en
      ),
      primary_btn_href: text(
        input?.hero?.primary_btn_href,
        defaults.hero.primary_btn_href
      ),
      secondary_btn_ar: text(
        input?.hero?.secondary_btn_ar,
        defaults.hero.secondary_btn_ar
      ),
      secondary_btn_en: text(
        input?.hero?.secondary_btn_en,
        defaults.hero.secondary_btn_en
      ),
      secondary_btn_href: text(
        input?.hero?.secondary_btn_href,
        defaults.hero.secondary_btn_href
      ),
      slides: heroSlides.length > 0 ? heroSlides : defaults.hero.slides,
    },

    vision: {
      kicker_ar: text(input?.vision?.kicker_ar, defaults.vision.kicker_ar),
      kicker_en: text(input?.vision?.kicker_en, defaults.vision.kicker_en),
      title_ar: text(input?.vision?.title_ar, defaults.vision.title_ar),
      title_en: text(input?.vision?.title_en, defaults.vision.title_en),
      desc_ar: text(input?.vision?.desc_ar, defaults.vision.desc_ar),
      desc_en: text(input?.vision?.desc_en, defaults.vision.desc_en),
    },

    services: {
      title_ar: text(input?.services?.title_ar, defaults.services.title_ar),
      title_en: text(input?.services?.title_en, defaults.services.title_en),
      desc_ar: text(input?.services?.desc_ar, defaults.services.desc_ar),
      desc_en: text(input?.services?.desc_en, defaults.services.desc_en),
      items: servicesItems.length > 0 ? servicesItems : defaults.services.items,
    },

    stats: {
      title_ar: text(input?.stats?.title_ar, defaults.stats.title_ar),
      title_en: text(input?.stats?.title_en, defaults.stats.title_en),
      items: statsItems.length > 0 ? statsItems : defaults.stats.items,
    },

    team: {
      title_ar: text(input?.team?.title_ar, defaults.team.title_ar),
      title_en: text(input?.team?.title_en, defaults.team.title_en),
      desc_ar: text(input?.team?.desc_ar, defaults.team.desc_ar),
      desc_en: text(input?.team?.desc_en, defaults.team.desc_en),
      members: teamMembers.length > 0 ? teamMembers : defaults.team.members,
    },

    footer: {
      title_ar: text(input?.footer?.title_ar, defaults.footer.title_ar),
      title_en: text(input?.footer?.title_en, defaults.footer.title_en),
      desc_ar: text(input?.footer?.desc_ar, defaults.footer.desc_ar),
      desc_en: text(input?.footer?.desc_en, defaults.footer.desc_en),
      email: text(input?.footer?.email, defaults.footer.email),
      phone: text(input?.footer?.phone, defaults.footer.phone),
      address_ar: text(input?.footer?.address_ar, defaults.footer.address_ar),
      address_en: text(input?.footer?.address_en, defaults.footer.address_en),
      social: socialItems.length > 0 ? socialItems : defaults.footer.social,
    },
  };
}

// تكوين الشكل النهائي للبيانات الراجعة للمحرر
function normalizeAboutPagePayload(row?: any) {
  const sections = normalizeAboutSections(row?.sections_json || {});

  return {
    slug: ABOUT_SLUG,
    title_ar: text(row?.title_ar, "من نحن"),
    title_en: text(row?.title_en, "About"),
    content_ar: text(
      row?.content_ar,
      "نبذة مؤسسية تعكس رؤية الزُهى وهويتها وخدماتها."
    ),
    content_en: text(
      row?.content_en,
      "An institutional profile reflecting ALZUHA’s vision, identity, and services."
    ),
    hero_image_url: text(row?.hero_image_url, sections.hero.image_url),
    is_published:
      typeof row?.is_published === "boolean" ? row.is_published : true,
    sections_json: sections,
  };
}

// GET: جلب بيانات صفحة About للأدمن
export async function GET() {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("pages")
    .select(
      "slug,title_ar,title_en,content_ar,content_en,hero_image_url,is_published,sections_json"
    )
    .eq("slug", ABOUT_SLUG)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    page: normalizeAboutPagePayload(data),
  });
}

// PATCH: حفظ تعديلات صفحة About
export async function PATCH(req: Request) {
  const isAdmin = await hasAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  const normalized = normalizeAboutPagePayload(body);

  const supabase = supabaseServer();

  const payload = {
    slug: ABOUT_SLUG,
    title_ar: normalized.title_ar,
    title_en: normalized.title_en,
    content_ar: normalized.content_ar,
    content_en: normalized.content_en,
    hero_image_url:
      text(normalized.hero_image_url) ||
      text(normalized.sections_json?.hero?.image_url),
    is_published: !!normalized.is_published,
    sections_json: normalized.sections_json,
  };

  const { data, error } = await supabase
    .from("pages")
    .upsert(payload, { onConflict: "slug" })
    .select("slug,title_ar,title_en,is_published,sections_json")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    page: normalizeAboutPagePayload(data || payload),
  });
}