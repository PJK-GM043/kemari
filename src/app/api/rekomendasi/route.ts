import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kota = searchParams.get("kota") ?? undefined;
    const aspek = searchParams.get("aspek") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const ranking = await destinationService.getRecommendations({ kota, aspek, limit });
    return NextResponse.json({ ranking });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
