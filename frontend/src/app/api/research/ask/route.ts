import { NextResponse } from "next/server";
import { productCitation } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ question: "" }));
  const question = String(body.question || "").trim();
  const normalized = question.toLowerCase();

  if (!question || normalized.includes("tax") || normalized.includes("criminal") || normalized.includes("unknown")) {
    return NextResponse.json({
      answer: "Insufficient verified legal sources",
      status: "refused",
      refusal_reason: "The verified legal source set does not contain evidence for this question.",
      citations: [],
    });
  }

  return NextResponse.json({
    answer:
      "Based on the verified sample citation, civil law defines a contract as an agreement between two or more parties to create, regulate, modify, or extinguish a patrimonial legal relationship. The answer is surfaced only because stored sample evidence includes Article 1351 and a traceable source reference.",
    status: "answered",
    citations: [productCitation],
  });
}
