import { NextResponse } from "next/server";
// NextResponse لإرجاع JSON منظم من Route Handler

import { cookies } from "next/headers";
// قراءة كوكي الأدمن الحالية للتحقق من الصلاحية

import { supabaseServer } from "@/lib/supabase-server";
// عميل Supabase الخاص بالسيرفر

export const dynamic = "force-dynamic";
// منع الاعتماد على الكاش لأن هذه API خاصة بالأدمن والتعديل الفوري

type PortfolioPageSections = Record<string, unknown>;
// تعريف عام مرن لـ sections_json
// نبقيه عامًا لأن البنية كبيرة وقابلة للتوسع لاحقًا

type PortfolioPageAdminRecord = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  page_type: string | null;
  sections_json: PortfolioPageSections | null;
};
// السجل الكامل الذي سنعيده إلى لوحة الأدمن

type PortfolioPagePatchPayload = {
  title_ar?: string;
  title_en?: string;
  content_ar?: string;
  content_en?: string;
  is_published?: boolean;
  sections_json?: PortfolioPageSections | null;
};
// شكل البيانات المتوقع استقباله من واجهة الأدمن عند الحفظ

function asObject(value: unknown): Record<string, unknown> {
  // تحويل أي قيمة إلى object آمن
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeText(value: unknown, fallback = "") {
  // تنظيف النصوص القادمة من الواجهة أو القاعدة
  return String(value ?? fallback).trim();
}

function getAdminCookieNames() {
  // دعم أكثر من اسم كوكي لتفادي التضارب بين النسخ السابقة والحالية
  // لأن بعض ملفاتك القديمة تعتمد admin_session وبعضها يعتمد اسمًا متغيرًا
  const envCookie = process.env.ADMIN_COOKIE?.trim();

  return Array.from(
    new Set(
      [envCookie, "admin_session", "zuha_admin"].filter(
        (value): value is string => Boolean(value)
      )
    )
  );
}

async function isAdminAuthorized() {
  // التحقق من وجود أي كوكي أدمن صالح
  const cookieStore: any = await Promise.resolve(cookies() as any);

  const cookieNames = getAdminCookieNames();

  return cookieNames.some((cookieName) => {
    const cookieValue = cookieStore?.get?.(cookieName)?.value;
    return Boolean(cookieValue);
  });
}

function createDefaultPortfolioSections(): PortfolioPageSections {
  // هذه البنية الافتراضية لصفحة portfolio
  // مأخوذ جوهرها من ملفاتك القديمة:
  // - Hero
  // - Articles / news grid مع tabs
  // - Contact block
  // - Footer
  return {
    hero: {
      kicker_ar: "ملف الأعمال العقاري",
      kicker_en: "Real Estate Portfolio",
      title_ar: "أعمال مختارة<br/>تعكس القيمة والانضباط",
      title_en: "Selected Works<br/>That Reflect Value and Discipline",
      desc_ar:
        "نستعرض هنا نماذج مختارة من المشاريع، المسارات الاستثمارية، والمخرجات العقارية التي تعبّر عن منهجنا في الجودة، التنظيم، والتمثيل الاحترافي.",
      desc_en:
        "Here we present selected projects, investment paths, and real-estate outputs that reflect our approach to quality, structure, and professional representation.",
      card_title_ar: "استكشف ملف الأعمال",
      card_title_en: "Explore the Portfolio",
      card_desc_ar:
        "محتوى منتقى يوضح كيف تتحول الفكرة العقارية إلى مخرج متماسك بصريًا وتجاريًا واستثماريًا.",
      card_desc_en:
        "Curated content showing how a real-estate idea turns into a coherent visual, commercial, and investment output.",
      card_btn_ar: "استكشف الأعمال",
      card_btn_en: "Explore Works",
      card_btn_href: "/portfolio",
      image_url: "",
    },

    showcase: {
      kicker_ar: "قصص وأعمال مختارة",
      kicker_en: "Selected Stories & Works",
      title_ar: "ملف أعمال يعكس<br/>قوة التنفيذ والتمثيل",
      title_en: "A Portfolio That Reflects<br/>Execution Strength and Representation",
      desc_ar:
        "استعرض أعمالًا ومحتوى مختارًا عبر تصنيفات مختلفة لفهم طريقة بناء القيمة، التموضع، والإخراج المهني في التجارب العقارية.",
      desc_en:
        "Explore selected works and content across multiple categories to understand how value, positioning, and professional presentation are built in real-estate experiences.",

      tabs: {
        all_ar: "الكل",
        all_en: "All",
        dev_ar: "التطوير",
        dev_en: "Development",
        inv_ar: "الاستثمار",
        inv_en: "Investment",
        mng_ar: "الإدارة",
        mng_en: "Management",
      },

      items: [
        {
          id: "portfolio-item-1",
          is_active: true,
          sort_order: 1,
          category_key: "dev",
          tag_ar: "سكني",
          tag_en: "Residential",
          title_ar: "مشروع سكني حديث بمفهوم معاصر",
          title_en: "A Contemporary Residential Project",
          desc_ar:
            "مشروع يوازن بين جودة المنتج العقاري، التوزيع، والواجهة المعمارية بما يرفع حضوره السوقي.",
          desc_en:
            "A project balancing product quality, layout, and architectural frontage to strengthen its market presence.",
          author_ar: "فريق الزُهى",
          author_en: "ALZUHA Team",
          role_ar: "تحرير الملف",
          role_en: "Portfolio Editing",
          date_ar: "مايو 2026",
          date_en: "May 2026",
          cover_image_url: "",
          author_image_url: "",
          href: "/portfolio",
        },
        {
          id: "portfolio-item-2",
          is_active: true,
          sort_order: 2,
          category_key: "inv",
          tag_ar: "استثماري",
          tag_en: "Investment",
          title_ar: "فرصة استثمارية ذات تمثيل احترافي",
          title_en: "An Investment Opportunity With Professional Positioning",
          desc_ar:
            "محتوى يعرض كيف تُبنى الجاذبية الاستثمارية عبر وضوح الرسالة، تنظيم العرض، وتحسين الانطباع العام.",
          desc_en:
            "Content showing how investment appeal is built through message clarity, structured presentation, and stronger overall impression.",
          author_ar: "فريق الزُهى",
          author_en: "ALZUHA Team",
          role_ar: "تحرير الملف",
          role_en: "Portfolio Editing",
          date_ar: "أبريل 2026",
          date_en: "April 2026",
          cover_image_url: "",
          author_image_url: "",
          href: "/portfolio",
        },
        {
          id: "portfolio-item-3",
          is_active: true,
          sort_order: 3,
          category_key: "mng",
          tag_ar: "إداري",
          tag_en: "Administrative",
          title_ar: "هيكلة أصل عقاري بصورة أوضح",
          title_en: "Structuring a Real-Estate Asset With Greater Clarity",
          desc_ar:
            "عرض يوضّح كيف ينعكس التنظيم الإداري وإدارة الأصل على جودة التمثيل والقرار النهائي.",
          desc_en:
            "A presentation showing how administrative structure and asset management influence representation quality and final decision-making.",
          author_ar: "فريق الزُهى",
          author_en: "ALZUHA Team",
          role_ar: "تحرير الملف",
          role_en: "Portfolio Editing",
          date_ar: "مارس 2026",
          date_en: "March 2026",
          cover_image_url: "",
          author_image_url: "",
          href: "/portfolio",
        },
      ],
    },

    insight: {
      kicker_ar: "رؤية تنفيذية",
      kicker_en: "Execution Insight",
      title_ar: "ملف الأعمال ليس عرضًا شكليًا",
      title_en: "A Portfolio Is Not Decorative Display",
      desc_ar:
        "ملف الأعمال القوي لا يعرض الصور فقط، بل يقدّم منطقًا واضحًا للمشروع أو الأصل، ويمنح المتلقي صورة أكثر نضجًا عن القيمة والاتجاه.",
      desc_en:
        "A strong portfolio does not merely show visuals; it communicates a clear logic for the project or asset and gives the viewer a more mature sense of value and direction.",
    },

    contact: {
      title_ar: "تواصل معنا<br/>لبحث الفرص والأعمال",
      title_en: "Connect With Us<br/>To Discuss Opportunities and Works",
      desc_ar:
        "إذا كنت ترغب في مناقشة مشروع، فرصة، أو إخراج احترافي لملف أعمال عقاري، يمكنك البدء من هذه النقطة.",
      desc_en:
        "If you want to discuss a project, opportunity, or the professional presentation of a real-estate portfolio, you can start here.",
      first_name_ar: "الاسم الأول",
      first_name_en: "First Name",
      second_name_ar: "الاسم الثاني",
      second_name_en: "Second Name",
      last_name_ar: "اسم العائلة",
      last_name_en: "Last Name",
      email_ar: "البريد الإلكتروني",
      email_en: "Email",
      message_ar: "رسالتك",
      message_en: "Message",
      submit_btn_ar: "إرسال",
      submit_btn_en: "Submit",
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

function createDefaultPortfolioRecord(): PortfolioPageAdminRecord {
  // سجل افتراضي كامل إذا لم توجد صفحة portfolio في القاعدة
  return {
    slug: "portfolio",
    title_ar: "الأعمال",
    title_en: "Portfolio",
    content_ar: "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي.",
    content_en:
      "A professional real-estate portfolio presenting selected works and strategic execution content.",
    is_published: true,
    page_type: "portfolio",
    sections_json: createDefaultPortfolioSections(),
  };
}

export async function GET() {
  // جلب بيانات صفحة portfolio كاملة للأدمن
  try {
    const authorized = await isAdminAuthorized();
    // التحقق من صلاحية الأدمن أولًا

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .eq("slug", "portfolio")
      .maybeSingle();
    // جلب صف portfolio

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    const fallbackRecord = createDefaultPortfolioRecord();
    // سجل افتراضي جاهز في حال عدم وجود الصفحة

    const item: PortfolioPageAdminRecord = data
      ? {
          slug: normalizeText(data.slug, "portfolio"),
          title_ar: normalizeText(data.title_ar, fallbackRecord.title_ar),
          title_en: normalizeText(data.title_en, fallbackRecord.title_en),
          content_ar: normalizeText(data.content_ar, fallbackRecord.content_ar),
          content_en: normalizeText(data.content_en, fallbackRecord.content_en),
          is_published:
            typeof data.is_published === "boolean"
              ? data.is_published
              : fallbackRecord.is_published,
          page_type: normalizeText(data.page_type, "portfolio") || "portfolio",
          sections_json:
            data.sections_json && typeof data.sections_json === "object"
              ? (data.sections_json as PortfolioPageSections)
              : fallbackRecord.sections_json,
        }
      : fallbackRecord;
    // إرجاع السجل الحقيقي أو fallback صالح

    return NextResponse.json({
      ok: true,
      item,
    });
  } catch (error) {
    console.error("admin portfolio-page GET error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  // حفظ تعديلات الأدمن على صفحة portfolio
  try {
    const authorized = await isAdminAuthorized();
    // التحقق من صلاحية الأدمن

    if (!authorized) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as PortfolioPagePatchPayload;
    // قراءة body بشكل آمن

    const title_ar = normalizeText(body.title_ar, "الأعمال");
    const title_en = normalizeText(body.title_en, "Portfolio");
    const content_ar = normalizeText(
      body.content_ar,
      "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي."
    );
    const content_en = normalizeText(
      body.content_en,
      "A professional real-estate portfolio presenting selected works and strategic execution content."
    );
    const is_published =
      typeof body.is_published === "boolean" ? body.is_published : true;

    const sections_json =
      body.sections_json && typeof body.sections_json === "object"
        ? asObject(body.sections_json)
        : createDefaultPortfolioSections();
    // إذا كانت sections_json غير صالحة نرجع إلى البنية الافتراضية

    const supabase = supabaseServer();
    // إنشاء عميل Supabase

    const upsertPayload = {
      slug: "portfolio",
      title_ar,
      title_en,
      content_ar,
      content_en,
      is_published,
      page_type: "portfolio",
      sections_json,
    };
    // حمولة الحفظ النهائية

    const { data, error } = await supabase
      .from("pages")
      .upsert(upsertPayload, {
        onConflict: "slug",
      })
      .select(
        "slug,title_ar,title_en,content_ar,content_en,is_published,page_type,sections_json"
      )
      .single();
    // upsert حتى نضمن:
    // - تحديث الصفحة إذا كانت موجودة
    // - أو إنشاؤها إذا لم تكن موجودة

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    const item: PortfolioPageAdminRecord = {
      slug: normalizeText(data.slug, "portfolio"),
      title_ar: normalizeText(data.title_ar, "الأعمال"),
      title_en: normalizeText(data.title_en, "Portfolio"),
      content_ar: normalizeText(
        data.content_ar,
        "ملف أعمال عقاري احترافي يعرض نماذج مختارة ومحتوى استثماري وتنفيذي."
      ),
      content_en: normalizeText(
        data.content_en,
        "A professional real-estate portfolio presenting selected works and strategic execution content."
      ),
      is_published:
        typeof data.is_published === "boolean" ? data.is_published : true,
      page_type: normalizeText(data.page_type, "portfolio") || "portfolio",
      sections_json:
        data.sections_json && typeof data.sections_json === "object"
          ? (data.sections_json as PortfolioPageSections)
          : createDefaultPortfolioSections(),
    };
    // تطبيع السجل بعد الحفظ

    return NextResponse.json({
      ok: true,
      item,
    });
  } catch (error) {
    console.error("admin portfolio-page PATCH error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}