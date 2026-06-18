import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const required = ["name", "email"];
  const missing = required.filter((key) => !String(payload[key] || "").trim());

  if (missing.length > 0) {
    return NextResponse.json({ ok: false, missing }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    status: "received",
    lead: {
      name: payload.name,
      email: payload.email,
      company: payload.company || null,
      message: payload.message || null,
    },
  });
}

