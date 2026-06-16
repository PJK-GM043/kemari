import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors/response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse(422, "File wajib diunggah");
    }

    // TODO: implement Cloudinary upload
    return NextResponse.json({ url: "https://placeholder.example/image.jpg" });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
