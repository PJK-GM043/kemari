import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await destinationService.getDestinationDetail(params.slug);
    if (!result) {
      return errorResponse(404, "Tempat tidak ditemukan");
    }
    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
