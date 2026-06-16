import { prisma } from "@/lib/prisma";

export const adminRepository = {
  async findMany(params: { page: number; limit: number; q?: string }) {
    const { page, limit, q } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (q) where.nama = { contains: q, mode: "insensitive" };

    const [data, total] = await Promise.all([
      prisma.masterTempat.findMany({
        where: where as any,
        include: { kota: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.masterTempat.count({ where: where as any }),
    ]);

    return {
      data: data.map((t: any) => ({
        id: t.id,
        nama: t.nama,
        kota: t.kota.nama,
        published: t.isPublished,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async createPlace(data: { nama: string; kotaId: number; deskripsi?: string; imageUrl?: string; slug: string }) {
    return prisma.masterTempat.create({ data });
  },

  async updatePlace(id: number, data: { nama?: string; imageUrl?: string; deskripsi?: string }) {
    return prisma.masterTempat.update({ where: { id }, data });
  },

  async publish(id: number, isPublished: boolean) {
    return prisma.masterTempat.update({
      where: { id },
      data: { isPublished },
    });
  },

  async getDashboard() {
    const [totalTempat, totalReview, totalUser] = await Promise.all([
      prisma.masterTempat.count(),
      prisma.ulasanWisata.count(),
      prisma.user.count(),
    ]);

    return { totalTempat, totalReview, totalUser };
  },
};
