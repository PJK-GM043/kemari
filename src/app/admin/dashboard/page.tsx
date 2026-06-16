import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalTempat, totalReview, totalKota] = await Promise.all([
    prisma.masterTempat.count(),
    prisma.ulasanWisata.count(),
    prisma.masterKota.count(),
  ]);

  const topTempat = await prisma.masterTempat.findMany({
    include: { kota: true, statistik: true },
    orderBy: { statistik: { totalUlasan: "desc" } },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-title text-foreground mb-lg">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg mb-2xl">
        <StatCard label="Total Destinasi" value={totalTempat} />
        <StatCard label="Total Ulasan" value={totalReview.toLocaleString("id-ID")} />
        <StatCard label="Total Kota" value={totalKota} />
      </div>

      <h2 className="text-title text-foreground mb-md">Destinasi Teratas</h2>

      <div className="border border-border rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="text-left p-md text-caption text-foreground-secondary font-medium">Nama Tempat</th>
              <th className="text-left p-md text-caption text-foreground-secondary font-medium">Kota</th>
              <th className="text-right p-md text-caption text-foreground-secondary font-medium">Ulasan</th>
              <th className="text-right p-md text-caption text-foreground-secondary font-medium">Skor</th>
            </tr>
          </thead>
          <tbody>
            {topTempat.map((t: any) => (
              <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-surface-elevated transition-colors">
                <td className="p-md text-label text-foreground">
                  <Link href={`/admin/destinasi/${t.id}/edit`} className="hover:text-accent transition-colors">
                    {t.nama}
                  </Link>
                </td>
                <td className="p-md text-label text-foreground-secondary">{t.kota.nama}</td>
                <td className="p-md text-label text-foreground text-right">
                  {t.statistik?.totalUlasan?.toLocaleString("id-ID") ?? 0}
                </td>
                <td className="p-md text-label text-foreground text-right">
                  {t.statistik?.skor?.toFixed(1) ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="text-center">
      <p className="text-hero text-foreground">{value}</p>
      <p className="text-caption text-foreground-secondary mt-sm">{label}</p>
    </Card>
  );
}
