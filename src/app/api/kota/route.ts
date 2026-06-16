import { NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET() {
  try {
    const data = await destinationService.getCities();
    return NextResponse.json({ data });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
