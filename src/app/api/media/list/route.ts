import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const folder = String(url.searchParams.get("folder") ?? "uploads").trim() || "uploads";

  const supabase = supabaseServer();

  const { data, error } = await supabase.storage.from("media").list(folder, {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  // build public urls
  const items = (data ?? []).map((x) => {
    const key = `${folder}/${x.name}`;
    const { data: u } = supabase.storage.from("media").getPublicUrl(key);
    return {
      name: x.name,
      key,
      url: u.publicUrl,
      created_at: (x as any).created_at ?? null,
      updated_at: (x as any).updated_at ?? null,
    };
  });

  return NextResponse.json({ ok: true, folder, items });
}