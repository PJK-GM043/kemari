import { destinationService } from "@/services/destination.service";
import { HeroSection, AspectSection, RingkasanAnalisis } from "@/components/destination/DetailSections";
import type { SentimentDistributionDTO } from "@/types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DetailPage({ params }: { params: { slug: string } }) {
  const detail = await destinationService.getDestinationDetail(params.slug);

  if (!detail) {
    return (
      <div className="text-center py-3xl">
        <h1 className="text-heading text-foreground">Destinasi tidak ditemukan</h1>
      </div>
    );
  }

  let description: string | null = null;
  let galeri: string[] = [];
  let sampleReviews: string[] = [];

  try {
    const tempatId = detail.tempat.id;

    const [tempat, samples] = await Promise.all([
      prisma.masterTempat.findUnique({
        where: { id: tempatId },
        select: { description: true, galeri: { orderBy: { order: "asc" }, take: 10 } },
      }),
      (prisma.ulasanWisata as any).findMany({
        where: { tempatId, ulasanFinal: { not: "" } },
        select: { ulasanFinal: true, sentimen: true },
        take: 20,
      }),
    ]);

    if (tempat) {
      description = tempat.description;
      galeri = (tempat as any).galeri?.map((g: any) => g.imageUrl) ?? [];
    }

    const positive = (samples as any[]).filter((s: any) => s.sentimen?.some((sent: string) => sent === "positive"));
    const negative = (samples as any[]).filter((s: any) => s.sentimen?.some((sent: string) => sent === "negative"));
    const posQuotes = positive.slice(0, 2).map((s: any) => s.ulasanFinal.slice(0, 120).trim());
    const negQuotes = negative.slice(0, 2).map((s: any) => s.ulasanFinal.slice(0, 120).trim());
    sampleReviews = [...posQuotes, ...negQuotes];
  } catch {
    // fallback to empty
  }

  return (
    <div>
      <HeroSection
        imageUrl={detail.tempat.imageUrl}
        galeri={galeri}
        nama={detail.tempat.nama}
        kota={detail.tempat.kota.nama}
        skor={detail.hero.skor}
        predikatLabel={detail.hero.predikat.label}
        totalUlasan={detail.hero.totalUlasan}
      />

      <AspectSection aspek={detail.aspek} />

      {description && (
        <section className="mb-2xl">
          <div className="rounded-card bg-surface border border-border shadow-level2 p-lg">
            <div className="text-body text-foreground-secondary leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        </section>
      )}

      <RingkasanAnalisis
        aspek={detail.aspek}
        sentiment={detail.sentiment as unknown as Record<string, SentimentDistributionDTO>}
        nama={detail.tempat.nama}
        source={detail.sentiment.source}
        sampleReviews={sampleReviews}
      />
    </div>
  );
}
