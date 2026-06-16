import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/errors/response";
import { adminService } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const q = searchParams.get("q") ?? undefined;

    const result = await adminService.getPlaces({ page, limit, q });
    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const body = await req.json();
    const result = await adminService.createPlace(body);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
