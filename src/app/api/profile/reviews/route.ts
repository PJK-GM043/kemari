import { NextRequest, NextResponse } from "next/server";
import { profileService } from "@/services/profile.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");

    // TODO: get userId from session
    const result = await profileService.getReviews(1, page);
    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
