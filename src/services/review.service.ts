import { reviewRepository } from "@/repositories/review/review.repository";
import { statisticsRepository } from "@/repositories/statistics/statistics.repository";
import { withTransaction } from "@/repositories/transaction";
import { logger } from "@/lib/logger";

export const reviewService = {
  async getMany(params: {
    tempatId: number;
    page: number;
    limit: number;
    sumber?: string;
    sort?: string;
  }) {
    return reviewRepository.getMany(params);
  },

  async submit(data: {
    tempatId: number;
    userId?: number;
    ulasan: string;
    rating: number;
  }) {
    const id = `REV-${Date.now()}`;

    await withTransaction(async (tx) => {
      await reviewRepository.create(tx, {
        id,
        tempatId: data.tempatId,
        userId: data.userId,
        ulasan: data.ulasan,
        rating: data.rating,
        sumber: "WEB_APPS",
      });

      const stats = await statisticsRepository.findByPlace(data.tempatId);
      if (stats) {
        await statisticsRepository.update(tx, data.tempatId, {
          skor: stats.skor,
          totalUlasan: stats.totalUlasan + 1,
          skorFasilitas: stats.skorFasilitas,
          skorKebersihan: stats.skorKebersihan,
          skorHarga: stats.skorHarga,
          skorAksesibilitas: stats.skorAksesibilitas,
          skorPelayanan: stats.skorPelayanan,
        });
      }
    });

    logger.info("review submitted", { reviewId: id });

    return { success: true, message: "Ulasan berhasil dikirim", reviewId: id };
  },
};
