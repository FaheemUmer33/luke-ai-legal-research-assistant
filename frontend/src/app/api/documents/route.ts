import { NextResponse } from "next/server";
import { productDocuments } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(productDocuments);
}

