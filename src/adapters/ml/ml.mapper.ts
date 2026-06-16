export type SentimentResult = "positive" | "neutral" | "negative";

export interface MLResult {
  fasilitas: SentimentResult;
  kebersihan: SentimentResult;
  harga: SentimentResult;
  aksesibilitas: SentimentResult;
  pelayanan: SentimentResult;
}

export function mapMLResponse(raw: Record<string, string>): MLResult {
  return {
    fasilitas: (raw.fasilitas as SentimentResult) || "neutral",
    kebersihan: (raw.kebersihan as SentimentResult) || "neutral",
    harga: (raw.harga as SentimentResult) || "neutral",
    aksesibilitas: (raw.aksesibilitas as SentimentResult) || "neutral",
    pelayanan: (raw.pelayanan as SentimentResult) || "neutral",
  };
}
