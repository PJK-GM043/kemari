import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors/response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return errorResponse(401, "Tidak memiliki akses");
  if ((session.user as any).role !== "ADMIN") return errorResponse(403, "Hanya admin");

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return errorResponse(422, "File wajib diunggah");

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return errorResponse(422, "Hanya file JPG dan PNG yang diizinkan");
    }

    if (file.size > 2 * 1024 * 1024) {
      return errorResponse(422, "Ukuran file maksimal 2MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadToCloudinary.upload(base64, {
      folder: "kemari/destinations",
      transformation: [{ width: 1200, height: 675, crop: "limit" }],
    });

    const tempatId = parseInt(params.id);

    // Count existing gallery items for ordering
    const count = await prisma.galeriFoto.count({ where: { tempatId } });

    await prisma.galeriFoto.create({
      data: { tempatId, imageUrl: result.secure_url, order: count },
    });

    // Also update main imageUrl if it's the first photo
    const existing = await prisma.masterTempat.findUnique({ where: { id: tempatId } });
    if (!existing?.imageUrl) {
      await prisma.masterTempat.update({
        where: { id: tempatId },
        data: { imageUrl: result.secure_url },
      });
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return errorResponse(500, "Gagal mengupload foto");
  }
}
