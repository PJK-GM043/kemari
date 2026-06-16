import { destinationService } from "@/services/destination.service";
import { reviewService } from "@/services/review.service";
import { HeroSection, AspectSection, SentimentSection, RingkasanAnalisis } from "@/components/destination/DetailSections";
import { ReviewListClient } from "./ReviewListClient";
import { ToggleSection } from "@/components/ui/ToggleSection";
import type { SentimentDistributionDTO, ReviewDTO, PaginationDTO } from "@/types";
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

  let initialReviews: { data: ReviewDTO[]; pagination: PaginationDTO } = {
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
  let description: string | null = null;
  let galeri: string[] = [];
  let sampleReviews: string[] = [];

  try {
    const tempat = await prisma.masterTempat.findUnique({
      where: { slug: params.slug },
      include: { galeri: { orderBy: { order: "asc" } } },
    });
    if (tempat) {
      initialReviews = await reviewService.getMany({ tempatId: tempat.id, page: 1, limit: 10 });
      description = tempat.description;
      galeri = (tempat as any).galeri?.map((g: any) => g.imageUrl) ?? [];

      // Fetch sample review quotes (2 positive + 2 negative)
      const samples: any[] = await (prisma.ulasanWisata as any).findMany({
        where: { tempatId: tempat.id, ulasanFinal: { not: "" } },
        select: { ulasanFinal: true, aspek: true, sentimen: true },
        take: 20,
      });
      const positive = samples.filter((s: any) => s.sentimen.some((sent: string) => sent === "positive"));
      const negative = samples.filter((s: any) => s.sentimen.some((sent: string) => sent === "negative"));
      const posQuotes = positive.slice(0, 2).map((s: any) => s.ulasanFinal.slice(0, 120).trim());
      const negQuotes = negative.slice(0, 2).map((s: any) => s.ulasanFinal.slice(0, 120).trim());
      sampleReviews = [...posQuotes, ...negQuotes];
    }
  } catch {
    // fallback to empty
  }

  const totalUlasan = detail.hero.totalUlasan.toLocaleString("id-ID");

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

      <ToggleSection title="Distribusi Sentimen">
        <SentimentSection
          source={detail.sentiment.source}
          distributions={detail.sentiment as unknown as Record<string, SentimentDistributionDTO>}
        />
      </ToggleSection>

      <ToggleSection title="Ulasan Pengunjung" count={totalUlasan}>
        <ReviewListClient
          slug={params.slug}
          initialReviews={initialReviews.data}
          initialPagination={initialReviews.pagination}
        />
      </ToggleSection>
    </div>
  );
}
