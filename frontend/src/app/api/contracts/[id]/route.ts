import { NextResponse } from "next/server";
import { productContract } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ ...productContract, id });
}

