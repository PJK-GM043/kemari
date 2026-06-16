const store = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export async function rateLimit(
  key: string,
  options: RateLimitOptions
): Promise<void> {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  entry.count++;

  if (entry.count > options.max) {
    throw new Error("Terlalu banyak permintaan");
  }
}
