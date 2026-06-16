import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditForm } from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditDestinasiPage({ params }: { params: { id: string } }) {
  const tempat = await prisma.masterTempat.findUnique({
    where: { id: parseInt(params.id) },
    include: { kota: true, statistik: true, galeri: { orderBy: { order: "asc" } } },
  });

  if (!tempat) notFound();

  return (
    <div>
      <h1 className="text-title text-foreground mb-lg">Edit Destinasi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl">
        <EditForm
          tempat={tempat as any}
          initialGaleri={(tempat as any).galeri || []}
        />
      </div>
    </div>
  );
}
