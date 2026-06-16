import { adminRepository } from "@/repositories/admin/admin.repository";
import { slugify } from "@/utils";

export const adminService = {
  async getPlaces(params: { page: number; limit: number; q?: string }) {
    return adminRepository.findMany(params);
  },

  async createPlace(data: { nama: string; kotaId: number; deskripsi?: string; imageUrl?: string }) {
    const slug = slugify(data.nama);
    const place = await adminRepository.createPlace({ ...data, slug });
    return { success: true, id: place.id };
  },

  async updatePlace(id: number, data: { nama?: string; imageUrl?: string; deskripsi?: string }) {
    await adminRepository.updatePlace(id, data);
    return { success: true };
  },

  async publish(id: number, isPublished: boolean) {
    await adminRepository.publish(id, isPublished);
    return { success: true };
  },

  async getDashboard() {
    return adminRepository.getDashboard();
  },
};
