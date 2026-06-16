import { prisma } from "@/lib/prisma";

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true, role: true, createdAt: true },
    });

    if (!user) return null;

    const totalReview = await prisma.ulasanWisata.count({
      where: { userId },
    });

    return {
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt.toISOString().split("T")[0],
      },
      stats: { totalReview },
    };
  },

  async findReviews(userId: number, page: number) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.ulasanWisata.findMany({
        where: { userId },
        include: { tempat: { select: { slug: true, nama: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.ulasanWisata.count({ where: { userId } }),
    ]);

    return {
      data: data.map((r: any) => ({
        id: r.id,
        tempat: { slug: r.tempat.slug, nama: r.tempat.nama },
        rating: r.rating ?? 0,
        tanggal: r.tanggal.toISOString().split("T")[0],
        preview: r.ulasanFinal.slice(0, 100),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
