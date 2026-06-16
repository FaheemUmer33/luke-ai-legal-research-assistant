import { NextResponse } from "next/server";
import { productSources } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(productSources);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({
    id: `source-${Date.now()}`,
    ...payload,
    is_active: true,
    mode: "source_governance",
  });
}
