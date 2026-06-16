export function getPredikat(skor: number) {
  const thresholds = [
    { min: 4.2, label: "Istimewa" as const, color: "accent" },
    { min: 3.5, label: "Sangat Baik" as const, color: "foreground" },
    { min: 2.8, label: "Baik" as const, color: "warning" },
    { min: 2.0, label: "Cukup" as const, color: "warning" },
    { min: 0, label: "Perlu Perhatian" as const, color: "negative" },
  ];

  return thresholds.find((t) => skor >= t.min) ?? thresholds[thresholds.length - 1];
}

export function getAspekColor(skor: number): string {
  if (skor >= 0.75) return "positive";
  if (skor >= 0.6) return "neutral";
  return "negative";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
