import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/services/destination.service";
import { errorResponse } from "@/lib/errors/response";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cityId = parseInt(params.id);

    if (isNaN(cityId)) {
      return errorResponse(422, "ID kota tidak valid");
    }

    const kota = await prisma.masterKota.findUnique({
      where: { id: cityId },
      select: { id: true, nama: true, slug: true },
    });

    if (!kota) {
      return errorResponse(404, "Kota tidak ditemukan");
    }

    const result = await destinationService.getDestinations({
      page: 1,
      limit: 50,
      kota: kota.slug,
    });

    return NextResponse.json({
      kota: { id: kota.id, nama: kota.nama, slug: kota.slug },
      ...result,
    });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
