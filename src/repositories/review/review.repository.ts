import { prisma } from "@/lib/prisma";
import type { ReviewDTO } from "@/types";
import { formatDate } from "@/utils";

export const reviewRepository = {
  async getMany(params: {
    tempatId: number;
    page: number;
    limit: number;
    sumber?: string;
    sort?: string;
  }) {
    const { tempatId, page, limit, sumber } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { tempatId };
    if (sumber) {
      where.sumber = sumber === "google_maps" ? "GOOGLE_MAPS" : "TIKTOK";
    }

    const orderBy: Record<string, string> = { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.ulasanWisata.findMany({
        where: where as any,
        include: { user: { select: { username: true } } },
        skip,
        take: limit,
        orderBy: orderBy as any,
      }),
      prisma.ulasanWisata.count({ where: where as any }),
    ]);

    const result: ReviewDTO[] = data.map((r: any) => ({
      id: r.id,
      username: r.user?.username ?? r.guestUsername ?? "Anonim",
      tanggal: formatDate(r.tanggal),
      rating: r.rating ?? 0,
      source: r.sumber === "GOOGLE_MAPS" ? "google_maps" : r.sumber === "TIKTOK" ? "tiktok" : "web_apps",
      ulasan: r.ulasanFinal,
      detectedAspect: r.aspek,
    }));

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async create(
    tx: any,
    data: {
      id: string;
      tempatId: number;
      userId?: number;
      ulasan: string;
      rating: number;
      sumber: "WEB_APPS";
    }
  ) {
    return tx.ulasanWisata.create({
      data: {
        id: data.id,
        tempatId: data.tempatId,
        userId: data.userId,
        ulasan: data.ulasan,
        ulasanFinal: data.ulasan,
        rating: data.rating,
        sumber: data.sumber,
      },
    });
  },
};
