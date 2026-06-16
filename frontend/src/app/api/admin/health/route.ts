import { NextResponse } from "next/server";
import { productDocuments, productSources } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    sources: productSources.length,
    documents: productDocuments.length,
    chunks: 12,
    regulatory_updates: 4,
    rag_policy: "citation_first_operational",
  });
}
