import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth-utils";
import { errorResponse } from "@/lib/errors/response";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return errorResponse(422, "Username, email, dan password wajib diisi");
    }

    if (password.length < 6) {
      return errorResponse(422, "Password minimal 6 karakter");
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return errorResponse(422, "Email sudah terdaftar");
    }

    const user = await createUser({ username, email, password });

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil", userId: user.id },
      { status: 201 }
    );
  } catch {
    return errorResponse(500, "Terjadi kesalahan server");
  }
}
