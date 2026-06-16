import { userRepository } from "@/repositories/user/user.repository";

export const profileService = {
  async getProfile(userId: number) {
    return userRepository.findProfile(userId);
  },

  async getReviews(userId: number, page: number) {
    return userRepository.findReviews(userId, page);
  },
};
