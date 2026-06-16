import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/errors/response";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const body = await req.json();
    const { deskripsi, isPublished } = body;

    if (deskripsi !== undefined) {
      if (typeof deskripsi !== "string" || deskripsi.length > 500) {
        return errorResponse(422, "Deskripsi maksimal 500 karakter");
      }
      await prisma.masterTempat.update({
        where: { id: parseInt(params.id) },
        data: { description: deskripsi },
      });
    }

    if (isPublished !== undefined) {
      await prisma.masterTempat.update({
        where: { id: parseInt(params.id) },
        data: { isPublished },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
