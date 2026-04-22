import { supabaseServer } from "@/lib/supabase-server";
// استيراد عميل Supabase الخاص بالسيرفر

export type PublicPageRow = {
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  hero_image_url?: string | null;
  is_published: boolean;
  page_type?: string | null;
  meta_json?: Record<string, unknown> | null;
  sections_json?: Record<string, unknown> | null;
};
// هذا النوع يمثل الصفحة العامة القادمة من جدول pages

type GetPublicPageOptions = {
  allowInstitutional?: boolean;
};
// خيارات إضافية عند الجلب

export async function getPublicPage(
  slug: string,
  options: GetPublicPageOptions = {}
): Promise<PublicPageRow | null> {
  try {
    // إنشاء عميل Supabase
    const supabase = supabaseServer();

    // جلب الصفحة المطلوبة من جدول pages
    const { data, error } = await supabase
      .from("pages")
      .select(
        "slug,title_ar,title_en,content_ar,content_en,hero_image_url,is_published,page_type,meta_json,sections_json"
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    // إذا رجع Supabase خطأ نطبعه ونرجع null
    if (error) {
      console.error(`getPublicPage failed for slug=${slug}:`, error.message);
      return null;
    }

    // إذا لم نجد الصفحة نرجع null
    if (!data) {
      return null;
    }

    // إذا كانت الصفحة مؤسسية ولم نسمح بذلك نرجع null
    if (!options.allowInstitutional && data.page_type === "institutional") {
      return null;
    }

    // إرجاع الصفحة بعد التحقق
    return data as PublicPageRow;
  } catch (error) {
    // التقاط أي خطأ غير متوقع بدل تكسير الصفحة
    console.error(`getPublicPage crashed for slug=${slug}:`, error);
    return null;
  }
}