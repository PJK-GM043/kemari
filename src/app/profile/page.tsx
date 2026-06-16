import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = parseInt((session.user as any).id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, email: true, role: true, image: true, createdAt: true },
  });

  const totalReviews = await prisma.ulasanWisata.count({ where: { userId } });

  const recentReviews = await prisma.ulasanWisata.findMany({
    where: { userId },
    include: { tempat: { select: { slug: true, nama: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-xl">
        <div className="flex items-center gap-lg">
          <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center text-2xl font-bold text-brand shrink-0">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-title text-foreground">{user?.username}</h1>
            <p className="text-label text-foreground-secondary">{user?.email}</p>
            <p className="text-caption text-foreground-secondary mt-1">
              Bergabung {user?.createdAt?.toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-md mt-lg pt-lg border-t border-border">
          <div className="text-center">
            <p className="text-heading text-foreground">{totalReviews}</p>
            <p className="text-caption text-foreground-secondary">Ulasan</p>
          </div>
          <div className="text-center">
            <p className="text-heading text-foreground">{user?.role === "ADMIN" ? "Admin" : "User"}</p>
            <p className="text-caption text-foreground-secondary">Role</p>
          </div>
          <div className="text-center">
            <p className="text-heading text-foreground">
              {user?.image ? "✓" : "—"}
            </p>
            <p className="text-caption text-foreground-secondary">Foto Profil</p>
          </div>
        </div>
      </Card>

      <h2 className="text-title text-foreground mb-lg">Ulasan Saya</h2>

      {recentReviews.length === 0 ? (
        <p className="text-body text-foreground-secondary text-center py-xl">
          Belum ada ulasan. Jelajahi destinasi dan bagikan pengalamanmu!
        </p>
      ) : (
        <div className="space-y-md">
          {recentReviews.map((r: any) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/wisata/${r.tempat.slug}`} className="text-label font-semibold text-foreground hover:text-brand transition-colors">
                    {r.tempat.nama}
                  </Link>
                  <p className="text-caption text-foreground-secondary mt-0.5">
                    {r.tanggal?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                {r.rating && (
                  <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-caption font-semibold">
                    ★ {r.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-body text-foreground-secondary mt-sm leading-relaxed">
                {r.ulasanFinal.slice(0, 200)}{r.ulasanFinal.length > 200 ? "..." : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
