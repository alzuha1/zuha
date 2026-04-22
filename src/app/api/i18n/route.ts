import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // سيرفر فقط
  { auth: { persistSession: false } }
);

type Lang = "ar" | "en";

function normLang(input: unknown): Lang {
  return input === "en" ? "en" : "ar";
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * GET /api/i18n?lang=ar|en
 * يرجع dict: { [k]: v }
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = normLang(url.searchParams.get("lang"));

  const { data, error } = await supabase
    .from("i18n")
    .select("k,v")
    .eq("lang", lang);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message, dict: {} },
      { status: 500 }
    );
  }

  const dict: Record<string, string> = {};

  // ✅ حماية من null/undefined
  for (const row of data ?? []) {
    const k = (row as any)?.k;
    const v = (row as any)?.v;

    if (isString(k) && k.length) dict[k] = isString(v) ? v : "";
  }

  return NextResponse.json({ ok: true, lang, dict });
}

/**
 * PUT /api/i18n
 * body: { lang: "ar"|"en", dict: { [k]: v } }
 * يعمل upsert على (lang,k)
 */
export async function PUT(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { lang?: unknown; dict?: unknown }
      | null;

    const lang = normLang(body?.lang);

    // ✅ نتأكد dict فعلاً object وليس null/array/string
    const rawDict =
      body?.dict && typeof body.dict === "object" && !Array.isArray(body.dict)
        ? (body.dict as Record<string, unknown>)
        : {};

    const rows = Object.entries(rawDict)
      .filter(([k, v]) => isString(k) && isString(v))
      .map(([k, v]) => ({ lang, k, v }));

    // ✅ لو ماكو شيء، رجّع OK بدل ما تسوي upsert فاضي
    if (rows.length === 0) {
      return NextResponse.json({ ok: true, lang, count: 0 });
    }

    const { error } = await supabase
      .from("i18n")
      .upsert(rows, { onConflict: "lang,k" });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lang, count: rows.length });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Failed to save i18n" },
      { status: 500 }
    );
  }
}