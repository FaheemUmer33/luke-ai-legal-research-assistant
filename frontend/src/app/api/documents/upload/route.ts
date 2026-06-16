import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const filename = file instanceof File ? file.name : "legal-upload.pdf";
  return NextResponse.json({
    id: `upload-${Date.now()}`,
    filename,
    status: "queued",
    message: "Upload accepted and queued for document intelligence processing.",
  });
}
