import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors/response";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const { key, value } = await req.json();
    if (!key || !value) return errorResponse(422, "Key dan value wajib diisi");

    await (prisma.pengaturan as any).upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse(500, "Gagal menyimpan pengaturan");
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await (prisma.pengaturan as any).findUnique({ where: { key } });
      return NextResponse.json({ key, value: setting?.value ?? null });
    }

    const settings = await (prisma.pengaturan as any).findMany();
    return NextResponse.json({ settings });
  } catch {
    return errorResponse(500, "Gagal membaca pengaturan");
  }
}
