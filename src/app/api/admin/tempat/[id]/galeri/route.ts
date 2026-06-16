import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors/response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const { imageUrl } = await req.json();

    await prisma.galeriFoto.deleteMany({
      where: { tempatId: parseInt(params.id), imageUrl },
    });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse(500, "Gagal menghapus foto");
  }
}
