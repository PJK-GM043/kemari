import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [dbOk, mlOk] = await Promise.all([
      prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      fetch(`${process.env.ML_SERVICE_URL}/`)
        .then((r) => r.ok)
        .catch(() => false),
    ]);

    return NextResponse.json({
      db: dbOk ? "ok" : "error",
      ml: mlOk ? "ok" : "error",
    });
  } catch {
    return NextResponse.json({ db: "error", ml: "error" });
  }
}
