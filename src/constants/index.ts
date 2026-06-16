export const PREDIKAT_THRESHOLDS = [
  { min: 4.2, label: "Istimewa" as const, color: "accent" },
  { min: 3.5, label: "Sangat Baik" as const, color: "foreground" },
  { min: 2.8, label: "Baik" as const, color: "warning" },
  { min: 2.0, label: "Cukup" as const, color: "warning" },
  { min: 0, label: "Perlu Perhatian" as const, color: "negative" },
];

export const ASPECT_COLOR_THRESHOLDS = [
  { min: 0.75, color: "positive" },
  { min: 0.6, color: "neutral" },
  { min: 0, color: "negative" },
];

export const ASPECTS = [
  "Fasilitas",
  "Kebersihan",
  "Harga",
  "Aksesibilitas",
  "Pelayanan",
] as const;

export const SORT_OPTIONS = [
  "rekomendasi",
  "kebersihan",
  "pelayanan",
  "fasilitas",
  "harga",
  "aksesibilitas",
] as const;

export const REVIEW_SOURCES = ["google_maps", "tiktok"] as const;

export const RATE_LIMITS = {
  REVIEW: { max: 10, windowMs: 60 * 60 * 1000 },
  AUTOCOMPLETE: { max: 60, windowMs: 60 * 1000 },
  UPLOAD: { max: 20, windowMs: 60 * 60 * 1000 },
  LOGIN: { max: 10, windowMs: 15 * 60 * 1000 },
} as const;
