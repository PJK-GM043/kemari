import { destinationRepository } from "@/repositories/destination/destination.repository";
import type {
  DestinationDetailDTO,
  SuggestionDTO,
  KotaDTO,
  RankingDTO,
} from "@/types";
import { getPredikat } from "@/utils";
import { prisma } from "@/lib/prisma";

export const destinationService = {
  async getDestinations(params: {
    page: number;
    limit: number;
    q?: string;
    kota?: string;
    sort?: string;
    kategori?: string;
  }) {
    return destinationRepository.findMany(params);
  },

  async getDestinationDetail(slug: string): Promise<DestinationDetailDTO | null> {
    return destinationRepository.findBySlug(slug);
  },

  async getAutocomplete(q: string): Promise<SuggestionDTO[]> {
    if (q.length < 3) return [];
    return destinationRepository.findAutocomplete(q);
  },

  async getCities(): Promise<KotaDTO[]> {
    return destinationRepository.findCities();
  },

  async getRecommendations(params: {
    kota?: string;
    aspek?: string;
    limit?: number;
  }): Promise<RankingDTO[]> {
    const { kota, aspek, limit = 10 } = params;

    const aspekFieldMap: Record<string, string> = {
      kebersihan: "skorKebersihan",
      pelayanan: "skorPelayanan",
      fasilitas: "skorFasilitas",
      harga: "skorHarga",
      aksesibilitas: "skorAksesibilitas",
    };

    const orderField = aspek ? aspekFieldMap[aspek] : "skor";

    const tempat = await prisma.masterTempat.findMany({
      where: {
        isPublished: true,
        ...(kota && { kota: { slug: kota } }),
        statistik: { isNot: null },
      } as any,
      include: { kota: true, statistik: true, galeri: { take: 1, orderBy: { order: "asc" } } },
      orderBy: { statistik: { [orderField]: "desc" } } as any,
      take: limit,
    });

    return tempat.map((t: any, i: number) => ({
      rank: i + 1,
      slug: t.slug,
      nama: t.nama,
      kota: t.kota.nama,
      skor: t.statistik?.skor ?? 0,
      predikat: getPredikat(t.statistik?.skor ?? 0).label,
      thumbnail: t.galeri?.[0]?.imageUrl ?? t.imageUrl,
    }));
  },
};
