import { createClient } from "@supabase/supabase-js";
// استيراد createClient من مكتبة Supabase الرسمية

export function supabaseServer() {
  // قراءة رابط مشروع Supabase من متغيرات البيئة
  const url = process.env.SUPABASE_URL?.trim();

  // قراءة مفتاح Service Role من متغيرات البيئة
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // التحقق من وجود الرابط
  if (!url) {
    throw new Error("SUPABASE_URL is missing in .env.local");
  }

  // التحقق من وجود مفتاح Service Role
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  }

  // التحقق من أن الرابط يبدو كرابط HTTPS صحيح
  if (!url.startsWith("https://")) {
    throw new Error(`SUPABASE_URL is invalid: ${url}`);
  }

  // إنشاء عميل Supabase خاص بالسيرفر
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}


