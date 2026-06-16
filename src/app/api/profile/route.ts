import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { profileService } from "@/services/profile.service";
import { errorResponse } from "@/lib/errors/response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return errorResponse(401, "Login diperlukan");

    const userId = parseInt((session.user as any).id);
    const result = await profileService.getProfile(userId);
    if (!result) return errorResponse(404, "User tidak ditemukan");
    return NextResponse.json(result);
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
