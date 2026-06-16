import type { PrismaClient } from "../../src/generated/prisma/client";
import { logInfo, logDone } from "../lib/progress";

interface AspectAggregate {
  total: number;
  positif: number;
}

export async function computeAndSaveStatistics(prisma: PrismaClient) {
  const tempatList = await (prisma.masterTempat as any).findMany({
    where: { isPublished: true },
    select: { id: true, nama: true },
  });

  const total = tempatList.length;
  let done = 0;

  for (const tempat of tempatList) {
    const stats = await aggregateReviewStats(prisma, tempat.id);
    const insight = generateInsight(stats, tempat.nama);

    await prisma.statistikTempat.upsert({
      where: { tempatId: tempat.id },
      create: {
        tempatId: tempat.id,
        skor: stats.skor,
        totalUlasan: stats.totalUlasan,
        skorFasilitas: stats.skorFasilitas,
        skorKebersihan: stats.skorKebersihan,
        skorHarga: stats.skorHarga,
        skorAksesibilitas: stats.skorAksesibilitas,
        skorPelayanan: stats.skorPelayanan,
        insight: insight as any,
        totalGoogleMaps: stats.totalGoogleMaps,
        totalTiktok: stats.totalTiktok,
      },
      update: {
        skor: stats.skor,
        totalUlasan: stats.totalUlasan,
        skorFasilitas: stats.skorFasilitas,
        skorKebersihan: stats.skorKebersihan,
        skorHarga: stats.skorHarga,
        skorAksesibilitas: stats.skorAksesibilitas,
        skorPelayanan: stats.skorPelayanan,
        insight: insight as any,
        totalGoogleMaps: stats.totalGoogleMaps,
        totalTiktok: stats.totalTiktok,
      },
    });

    done++;
    if (done % 5 === 0 || done === total) {
      logInfo(`  Statistics: ${done}/${total}`);
    }
  }

  logDone(total, "Statistics");
}

async function aggregateReviewStats(prisma: PrismaClient, tempatId: number) {
  const reviews: any[] = await (prisma.ulasanWisata as any).findMany({
    where: { tempatId },
    select: {
      rating: true,
      sumber: true,
      labelFasilitas: true,
      labelKebersihan: true,
      labelHarga: true,
      labelAksesibilitas: true,
      labelPelayanan: true,
    },
  });

  const totalUlasan = reviews.length;

  let totalRating = 0;
  let ratingCount = 0;
  let totalGoogleMaps = 0;
  let totalTiktok = 0;

  const aspects: Record<string, AspectAggregate> = {
    Fasilitas: { total: 0, positif: 0 },
    Kebersihan: { total: 0, positif: 0 },
    Harga: { total: 0, positif: 0 },
    Aksesibilitas: { total: 0, positif: 0 },
    Pelayanan: { total: 0, positif: 0 },
  };

  for (const r of reviews) {
    if (r.rating) {
      totalRating += r.rating;
      ratingCount++;
    }

    if (r.sumber === "GOOGLE_MAPS") totalGoogleMaps++;
    if (r.sumber === "TIKTOK") totalTiktok++;

    countAspect(aspects, "Fasilitas", r.labelFasilitas);
    countAspect(aspects, "Kebersihan", r.labelKebersihan);
    countAspect(aspects, "Harga", r.labelHarga);
    countAspect(aspects, "Aksesibilitas", r.labelAksesibilitas);
    countAspect(aspects, "Pelayanan", r.labelPelayanan);
  }

  const avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;
  const skor = totalUlasan > 0 ? Math.round(((avgRating / 5) * 10) * 10) / 10 : 0;

  const calculateAspectSkor = (key: string) => {
    const a = aspects[key];
    if (a.total === 0) return 0;
    return Math.round((a.positif / a.total) * 5 * 10) / 10;
  };

  return {
    skor,
    totalUlasan,
    skorFasilitas: calculateAspectSkor("Fasilitas"),
    skorKebersihan: calculateAspectSkor("Kebersihan"),
    skorHarga: calculateAspectSkor("Harga"),
    skorAksesibilitas: calculateAspectSkor("Aksesibilitas"),
    skorPelayanan: calculateAspectSkor("Pelayanan"),
    totalGoogleMaps,
    totalTiktok,
  };
}

function countAspect(
  aspects: Record<string, AspectAggregate>,
  key: string,
  label: string
) {
  if (label === "none") return;
  aspects[key].total++;
  if (label === "positive") aspects[key].positif++;
}

function generateInsight(
  stats: Awaited<ReturnType<typeof aggregateReviewStats>>,
  namaTempat: string
): Array<{ type: "positive" | "negative" | "neutral"; text: string }> {
  const insights: Array<{ type: "positive" | "negative" | "neutral"; text: string }> = [];

  const aspectsList = [
    { key: "Fasilitas", skor: stats.skorFasilitas },
    { key: "Kebersihan", skor: stats.skorKebersihan },
    { key: "Harga", skor: stats.skorHarga },
    { key: "Aksesibilitas", skor: stats.skorAksesibilitas },
    { key: "Pelayanan", skor: stats.skorPelayanan },
  ];

  const sorted = aspectsList.sort((a, b) => b.skor - a.skor);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];

  if (top.skor >= 4) {
    insights.push({
      type: "positive",
      text: `${top.key} menjadi keunggulan utama ${namaTempat}`,
    });
  }

  if (bottom.skor < 3 && bottom.skor > 0) {
    insights.push({
      type: "negative",
      text: `${bottom.key} masih perlu ditingkatkan`,
    });
  }

  if (stats.totalUlasan > 100) {
    insights.push({
      type: "neutral",
      text: `Berdasarkan ${stats.totalUlasan.toLocaleString("id-ID")} ulasan pengunjung`,
    });
  }

  return insights;
}
