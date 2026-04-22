import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "content", "site.json");

function readJson() {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export async function GET() {
  try {
    return NextResponse.json(readJson());
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Failed to read site.json" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? "Failed to write site.json" },
      { status: 500 }
    );
  }
}