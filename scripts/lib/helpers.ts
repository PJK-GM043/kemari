export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseRating(raw: string): number | null {
  const num = parseFloat(raw);
  return isNaN(num) ? null : num;
}

export function parseSource(raw: string): "GOOGLE_MAPS" | "TIKTOK" | "WEB_APPS" {
  const lower = raw.toLowerCase();
  if (lower.includes("tiktok")) return "TIKTOK";
  if (lower.includes("web")) return "WEB_APPS";
  return "GOOGLE_MAPS";
}

export function parseDate(raw: string): Date {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function parseSentimentLabel(raw: string | undefined): "positive" | "neutral" | "negative" | "none" {
  if (!raw) return "none";
  const lower = raw.toLowerCase().trim();
  if (lower === "positif" || lower === "positive") return "positive";
  if (lower === "netral" || lower === "neutral") return "neutral";
  if (lower === "negatif" || lower === "negative") return "negative";
  return "none";
}

export function parseJsonArray(raw: string): string[] {
  if (!raw || raw === "[]") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return raw.split(",").map((s) => s.trim().replace(/['"\[\]]/g, ""));
  }
}
