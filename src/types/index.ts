export type PredikatLabel = "Istimewa" | "Sangat Baik" | "Baik" | "Cukup" | "Perlu Perhatian";
export type PredikatColor = "accent" | "foreground" | "warning" | "warning" | "negative";

export interface Predikat {
  label: PredikatLabel;
  color: string;
}

export interface KotaDTO {
  id: number;
  nama: string;
  slug: string;
  totalTempat: number;
}

export interface DestinationCardDTO {
  id: number;
  slug: string;
  nama: string;
  kota: { id: number; nama: string };
  imageUrl: string | null;
  kategori: string | null;
  skor: number;
  predikat: Predikat;
  totalUlasan: number;
}

export interface AspekDTO {
  nama: string;
  skor: number;
  warna: string;
  positif: number;
}

export interface InsightDTO {
  type: "positive" | "negative" | "neutral";
  text: string;
}

export interface SentimentSourceDTO {
  googleMaps: number;
  tiktok: number;
}

export interface SentimentDistributionDTO {
  positif: number;
  netral: number;
  negatif: number;
}

export interface DestinationDetailDTO {
  tempat: {
    id: number;
    slug: string;
    nama: string;
    kota: { id: number; nama: string };
    imageUrl: string | null;
  };
  hero: {
    skor: number;
    predikat: Predikat;
    totalUlasan: number;
  };
  aspek: AspekDTO[];
  insight: InsightDTO[];
  sentiment: {
    source: SentimentSourceDTO;
    fasilitas: SentimentDistributionDTO;
    kebersihan: SentimentDistributionDTO;
    harga: SentimentDistributionDTO;
    aksesibilitas: SentimentDistributionDTO;
    pelayanan: SentimentDistributionDTO;
  };
}

export interface ReviewDTO {
  id: string;
  username: string;
  tanggal: string;
  rating: number;
  source: string;
  ulasan: string;
  detectedAspect: string[];
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuggestionDTO {
  slug: string;
  nama: string;
  kota: string;
}

export interface RankingDTO {
  rank: number;
  slug: string;
  nama: string;
  kota: string;
  skor: number;
  predikat: string;
  thumbnail: string | null;
}

export interface ProfileDTO {
  user: {
    username: string;
    email: string;
    role: string;
    joinedAt: string;
  };
  stats: {
    totalReview: number;
  };
}

export interface ProfileReviewDTO {
  id: string;
  tempat: {
    slug: string;
    nama: string;
  };
  rating: number;
  tanggal: string;
  preview: string;
}
