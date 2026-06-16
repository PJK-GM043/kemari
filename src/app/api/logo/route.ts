import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await (prisma.pengaturan as any).findUnique({ where: { key: "logo_url" } });
    return NextResponse.json({ url: setting?.value ?? null });
  } catch {
    return NextResponse.json({ url: null });
  }
}
