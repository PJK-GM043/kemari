import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const q = searchParams.get("q") ?? undefined;
    const kota = searchParams.get("kota") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const kategori = searchParams.get("kategori") ?? undefined;

    const result = await destinationService.getDestinations({ page, limit, q, kota, sort, kategori });
    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
