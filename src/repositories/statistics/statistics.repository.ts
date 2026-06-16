import { prisma } from "@/lib/prisma";

export const statisticsRepository = {
  async findByPlace(tempatId: number) {
    return prisma.statistikTempat.findUnique({
      where: { tempatId },
    });
  },

  async update(
    tx: any,
    tempatId: number,
    data: {
      skor: number;
      totalUlasan: number;
      skorFasilitas: number;
      skorKebersihan: number;
      skorHarga: number;
      skorAksesibilitas: number;
      skorPelayanan: number;
      insight?: object;
    }
  ) {
    return tx.statistikTempat.upsert({
      where: { tempatId },
      create: {
        tempatId,
        ...data,
      },
      update: data,
    });
  },
};
