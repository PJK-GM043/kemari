import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    if (q.length < 3) {
      return NextResponse.json({ query: q, suggestions: [] });
    }

    const suggestions = await destinationService.getAutocomplete(q);
    return NextResponse.json({ query: q, suggestions });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
