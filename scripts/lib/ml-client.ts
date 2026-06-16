const ML_BASE_URL = process.env.ML_SERVICE_URL ?? "https://deploynfl-indobert-absa-api.hf.space";

export interface MLResult {
  fasilitas: string;
  kebersihan: string;
  harga: string;
  aksesibilitas: string;
  pelayanan: string;
}

export async function analyzeReview(text: string): Promise<MLResult> {
  const response = await fetch(`${ML_BASE_URL}/predict-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`ML API error: ${response.status}`);
  }

  const raw = await response.json();

  return {
    fasilitas: raw.fasilitas ?? "neutral",
    kebersihan: raw.kebersihan ?? "neutral",
    harga: raw.harga ?? "neutral",
    aksesibilitas: raw.aksesibilitas ?? "neutral",
    pelayanan: raw.pelayanan ?? "neutral",
  };
}

export async function checkMLHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${ML_BASE_URL}/`);
    return res.ok;
  } catch {
    return false;
  }
}
