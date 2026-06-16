import { prisma } from "@/lib/prisma";
import type { DestinationCardDTO, DestinationDetailDTO, SuggestionDTO, KotaDTO } from "@/types";
import { getPredikat, getAspekColor } from "@/utils";

export const destinationRepository = {
  async findMany(params: {
    page: number;
    limit: number;
    q?: string;
    kota?: string;
    sort?: string;
    kategori?: string;
  }) {
    const { page, limit, q, kota, sort, kategori } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isPublished: true,
    };
    if (q) where.nama = { contains: q, mode: "insensitive" };
    if (kota) where.kota = { slug: kota };
    if (kategori) where.kategori = kategori;

    let orderBy: Record<string, unknown> = { createdAt: "desc" };
    if (sort) {
      const sortMap: Record<string, Record<string, unknown>> = {
        kebersihan: { statistik: { skorKebersihan: "desc" } },
        pelayanan: { statistik: { skorPelayanan: "desc" } },
        fasilitas: { statistik: { skorFasilitas: "desc" } },
        harga: { statistik: { skorHarga: "desc" } },
        aksesibilitas: { statistik: { skorAksesibilitas: "desc" } },
        rekomendasi: { statistik: { skor: "desc" } },
      };
      orderBy = sortMap[sort] ?? orderBy;
    }

    const [data, total] = await Promise.all([
      prisma.masterTempat.findMany({
        where: where as any,
        include: { kota: true, statistik: true, galeri: { take: 1, orderBy: { order: "asc" } } },
        skip,
        take: limit,
        orderBy: orderBy as any,
      }),
      prisma.masterTempat.count({ where: where as any }),
    ]);

    const result: DestinationCardDTO[] = data.map((t: any) => ({
      id: t.id,
      slug: t.slug,
      nama: t.nama,
      kota: { id: t.kota.id, nama: t.kota.nama },
      imageUrl: t.galeri?.[0]?.imageUrl ?? t.imageUrl,
      kategori: t.kategori,
      skor: t.statistik?.skor ?? 0,
      predikat: getPredikat(t.statistik?.skor ?? 0),
      totalUlasan: t.statistik?.totalUlasan ?? 0,
    }));

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filter: { q, kota, sort },
    };
  },

  async findBySlug(slug: string): Promise<DestinationDetailDTO | null> {
    const t: any = await prisma.masterTempat.findUnique({
      where: { slug },
      include: { kota: true, statistik: true },
    });

    if (!t || !t.statistik) return null;

    const stats = t.statistik;
    const sentiment: any[] = await (prisma.ulasanWisata as any).groupBy({
      by: ["sumber"],
      where: { tempatId: t.id },
      _count: { id: true },
    });

    const googleMaps =
      sentiment.find((s: any) => s.sumber === "GOOGLE_MAPS")?._count.id ?? 0;
    const tiktok =
      sentiment.find((s: any) => s.sumber === "TIKTOK")?._count.id ?? 0;

    const aspekList = [
      { nama: "Fasilitas", skor: stats.skorFasilitas },
      { nama: "Kebersihan", skor: stats.skorKebersihan },
      { nama: "Harga", skor: stats.skorHarga },
      { nama: "Aksesibilitas", skor: stats.skorAksesibilitas },
      { nama: "Pelayanan", skor: stats.skorPelayanan },
    ];

    // Get sentiment percentages for each aspect — parallelized
    const fields = ["labelFasilitas", "labelKebersihan", "labelHarga", "labelAksesibilitas", "labelPelayanan"] as const;
    const sentDists: Record<string, { positif: number }> = {};
    const results = await Promise.all(fields.map((f) => getSentimentDistribution(t.id, f)));
    fields.forEach((f, i) => { sentDists[f] = results[i]; });

    const aspekWithSentiment = aspekList.map((a) => {
      const keyMap: Record<string, string> = {
        Fasilitas: "labelFasilitas", Kebersihan: "labelKebersihan",
        Harga: "labelHarga", Aksesibilitas: "labelAksesibilitas", Pelayanan: "labelPelayanan",
      };
      return {
        ...a,
        warna: getAspekColor(a.skor / 5),
        positif: sentDists[keyMap[a.nama]]?.positif ?? 0,
      };
    });

    const insight = (stats.insight as Array<{ type: "positive" | "negative" | "neutral"; text: string }>) ?? [];

    return {
      tempat: {
        id: t.id,
        slug: t.slug,
        nama: t.nama,
        kota: { id: t.kota.id, nama: t.kota.nama },
        imageUrl: t.imageUrl,
      },
      hero: {
        skor: stats.skor,
        predikat: getPredikat(stats.skor),
        totalUlasan: stats.totalUlasan,
      },
      aspek: aspekWithSentiment,
      insight,
      sentiment: {
        source: { googleMaps, tiktok },
        fasilitas: await getSentimentDistribution(t.id, "labelFasilitas"),
        kebersihan: await getSentimentDistribution(t.id, "labelKebersihan"),
        harga: await getSentimentDistribution(t.id, "labelHarga"),
        aksesibilitas: await getSentimentDistribution(t.id, "labelAksesibilitas"),
        pelayanan: await getSentimentDistribution(t.id, "labelPelayanan"),
      },
    };
  },

  async findAutocomplete(q: string): Promise<SuggestionDTO[]> {
    const results: any[] = await prisma.masterTempat.findMany({
      where: {
        nama: { contains: q, mode: "insensitive" },
        isPublished: true,
      },
      include: { kota: true },
      take: 5,
    });

    return results.map((t: any) => ({
      slug: t.slug,
      nama: t.nama,
      kota: t.kota.nama,
    }));
  },

  async findCities(): Promise<KotaDTO[]> {
    const cities: any[] = await prisma.masterKota.findMany({
      include: { _count: { select: { tempat: true } } },
    });

    return cities.map((c: any) => ({
      id: c.id,
      nama: c.nama,
      slug: c.slug,
      totalTempat: c._count.tempat,
    }));
  },
};

async function getSentimentDistribution(
  tempatId: number,
  field: string
) {
  const counts: any[] = await (prisma.ulasanWisata as any).groupBy({
    by: [field as "labelFasilitas"],
    where: { tempatId },
    _count: { id: true },
  });

  let positif = 0;
  let netral = 0;
  let negatif = 0;

  for (const c of counts) {
    const key = c[field as keyof typeof c] as string;
    if (key === "positive") positif = c._count.id;
    else if (key === "neutral") netral = c._count.id;
    else if (key === "negative") negatif = c._count.id;
  }

  const total = positif + netral + negatif || 1;
  return {
    positif: Math.round((positif / total) * 100),
    netral: Math.round((netral / total) * 100),
    negatif: Math.round((negatif / total) * 100),
  };
}
