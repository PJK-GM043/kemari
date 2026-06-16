import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewService } from "@/services/review.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tempat = await prisma.masterTempat.findUnique({ where: { slug: params.slug } });
    if (!tempat) return errorResponse(404, "Tempat tidak ditemukan");

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const sumber = searchParams.get("sumber") ?? undefined;
    const sort = searchParams.get("sort") ?? "latest";

    const result = await reviewService.getMany({
      tempatId: tempat.id,
      page,
      limit,
      sumber,
      sort,
    });

    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tempat = await prisma.masterTempat.findUnique({ where: { slug: params.slug } });
    if (!tempat) return errorResponse(404, "Tempat tidak ditemukan");

    const body = await req.json();
    const { rating, ulasan } = body;

    if (!rating || !ulasan) {
      return errorResponse(422, "Rating dan ulasan wajib diisi");
    }

    const result = await reviewService.submit({
      tempatId: tempat.id,
      ulasan,
      rating,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
