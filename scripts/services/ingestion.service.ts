import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { RawReviewRecord } from "../lib/csv-reader";
import {
  slugify,
  parseRating,
  parseSource,
  parseDate,
  parseSentimentLabel,
  parseJsonArray,
} from "../lib/helpers";
import { logProgress, logDone, logStep, logInfo } from "../lib/progress";
import { computeAndSaveStatistics } from "./statistics.service";

const DB_BATCH_SIZE = 100;

export async function runIngestion(records: RawReviewRecord[]) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  logStep("Connecting to database...");
  await prisma.$connect();
  logInfo("Connected");

  const total = records.length;
  logInfo(`Total records: ${total}`);

  // ── Step 1: Collect unique kota & tempat ──
  logStep("Step 1/4 — Collecting unique cities & destinations");

  const kotaMap = new Map<string, { nama: string; slug: string }>();
  const tempatMap = new Map<
    string,
    { nama: string; slug: string; kotaNama: string }
  >();

  for (const r of records) {
    const kotaSlug = slugify(r.kota);
    if (!kotaMap.has(kotaSlug)) {
      kotaMap.set(kotaSlug, { nama: r.kota.trim(), slug: kotaSlug });
    }

    const tempatSlug = slugify(r.nama_tempat);
    const tempatKey = `${kotaSlug}:${tempatSlug}`;
    if (!tempatMap.has(tempatKey)) {
      tempatMap.set(tempatKey, {
        nama: r.nama_tempat.trim(),
        slug: tempatSlug,
        kotaNama: r.kota.trim(),
      });
    }
  }

  logInfo(`Cities: ${kotaMap.size}, Destinations: ${tempatMap.size}`);

  // ── Step 2: Insert kota ──
  logStep("Step 2/4 — Inserting cities");

  for (const [slug, kota] of kotaMap.entries()) {
    await prisma.masterKota.upsert({
      where: { slug },
      create: { nama: kota.nama, slug },
      update: { nama: kota.nama },
    });
  }

  const kotaDb = await prisma.masterKota.findMany();
  const kotaByName = new Map(kotaDb.map((k: any) => [k.nama.toLowerCase(), k]));

  logInfo(`Inserted/verified ${kotaDb.length} cities`);

  // ── Step 3: Insert tempat ──
  logStep("Step 3/4 — Inserting destinations");

  const tempatBySlug = new Map<string, number>();

  for (const [, tempat] of tempatMap.entries()) {
    const kota = kotaByName.get(tempat.kotaNama.toLowerCase());
    if (!kota) {
      console.warn(`  ⚠ Kota not found for: ${tempat.nama} (${tempat.kotaNama})`);
      continue;
    }

    const result: any = await prisma.masterTempat.upsert({
      where: { slug: tempat.slug },
      create: { nama: tempat.nama, slug: tempat.slug, kotaId: kota.id },
      update: { nama: tempat.nama, kotaId: kota.id },
    });

    tempatBySlug.set(tempat.slug, result.id);
  }

  logInfo(`${tempatBySlug.size} destinations ready`);

  // ── Step 4: Process reviews in chunks ──
  logStep("Step 4/4 — Processing reviews");

  let processed = 0;

  const recordBatches = chunkArray(records, DB_BATCH_SIZE);

  for (const batch of recordBatches) {
    const reviewRows: any[] = [];

    for (const r of batch) {
      const tempatSlug = slugify(r.nama_tempat);
      const tempatId = tempatBySlug.get(tempatSlug);

      if (!tempatId) {
        processed++;
        continue;
      }

      const labelFasilitas = parseSentimentLabel(r.label_fasilitas);
      const labelKebersihan = parseSentimentLabel(r.label_kebersihan);
      const labelHarga = parseSentimentLabel(r.label_harga);
      const labelAksesibilitas = parseSentimentLabel(r.label_aksesibilitas);
      const labelPelayanan = parseSentimentLabel(r.label_pelayanan);

      const aspekArr = parseJsonArray(r.label_aspek);
      const sentimenArr = parseJsonArray(r.label_sentimen);

      reviewRows.push({
        id: r.review_id || `REV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        tempatId,
        tanggal: parseDate(r.tanggal),
        ulasan: r.ulasan,
        ulasanTranslated: r.ulasan_translated || null,
        ulasanFinal: r.ulasan_final || r.ulasan,
        rating: parseRating(r.rating),
        sumber: parseSource(r.sumber),
        guestUsername: r.username || "Anonim",
        labelFasilitas,
        labelKebersihan,
        labelHarga,
        labelAksesibilitas,
        labelPelayanan,
        aspek: aspekArr,
        sentimen: sentimenArr,
        status: "PROCESSED",
        processedAt: new Date(),
      });
    }

    if (reviewRows.length > 0) {
      await prisma.ulasanWisata.createMany({
        data: reviewRows,
        skipDuplicates: true,
      });
    }

    processed += batch.length;
    logProgress(processed, total, "Reviews");
  }

  logDone(total, "Reviews");

  // ── Step 5: Compute statistics ──
  logStep("Computing statistics...");
  await computeAndSaveStatistics(prisma);

  await prisma.$disconnect();
  logInfo("Done — database disconnected");
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
