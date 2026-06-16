import { prisma } from "@/lib/prisma";
import { DestinasiClient } from "./DestinasiClient";

export const dynamic = "force-dynamic";

export default async function AdminDestinasiPage() {
  const tempat = await prisma.masterTempat.findMany({
    include: { kota: true, statistik: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <DestinasiClient initial={tempat as any} />;
}
