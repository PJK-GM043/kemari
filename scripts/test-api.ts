import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { destinationService } from "../src/services/destination.service";
import { reviewService } from "../src/services/review.service";

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name} ${detail ? `— ${detail}` : ""}`);
    failed++;
  }
}

async function main() {
  console.log("═".repeat(50));
  console.log("API Routes Verification — Tahap 3");
  console.log("═".repeat(50));

  // ─── 1. GET /api/kota ───
  console.log("\n📋 GET /api/kota");
  const cities = await destinationService.getCities();
  check("Returns array", Array.isArray(cities));
  check("Has 5 cities", cities.length === 5, `got ${cities.length}`);
  check("Has id, nama, slug, totalTempat", cities.every((c) => "id" in c && "nama" in c && "slug" in c && "totalTempat" in c));
  check("totalTempat > 0 for all", cities.every((c) => c.totalTempat > 0));
  console.log(`    Cities: ${cities.map((c) => `${c.nama}(${c.totalTempat})`).join(", ")}`);

  // ─── 2. GET /api/tempat (explore) ───
  console.log("\n📋 GET /api/tempat (explore)");

  const all = await destinationService.getDestinations({ page: 1, limit: 5 });
  check("Returns data array", Array.isArray(all.data));
  check("Has pagination", "pagination" in all);
  check("Page 1 limit 5 = 5 items", all.data.length === 5, `got ${all.data.length}`);
  check("Has skor & predikat", all.data.every((d) => "skor" in d && "predikat" in d && d.totalUlasan > 0));
  check("Total 25 destinations", all.pagination.total === 25, `got ${all.pagination.total}`);
  check("totalPages = 5 (25/5)", all.pagination.totalPages === 5, `got ${all.pagination.totalPages}`);

  // Filter by kota (use actual slug)
  const firstKota = cities[0].slug;
  const kotaFilter = await destinationService.getDestinations({ page: 1, limit: 12, kota: firstKota });
  check(`Filter kota=${firstKota} returns subset`, kotaFilter.data.length > 0);

  // Sort
  const sorted = await destinationService.getDestinations({ page: 1, limit: 5, sort: "kebersihan" });
  check("Sort by kebersihan returns data", sorted.data.length === 5);
  check("Filter returned in response", "filter" in sorted && sorted.filter.sort === "kebersihan");

  // Search
  const search = await destinationService.getDestinations({ page: 1, limit: 5, q: "pantai" });
  check("Search q=pantai returns matches", search.data.length > 0 && search.data.every((d) => d.nama.toLowerCase().includes("pantai")));

  // ─── 3. GET /api/tempat/[slug] (detail) ───
  console.log("\n📋 GET /api/tempat/[slug] (detail)");

  const slug = all.data[0].slug;
  const detail = await destinationService.getDestinationDetail(slug);
  check("Returns detail object", detail !== null, `slug: ${slug}`);
  check("Has tempat info", "tempat" in detail!);
  check("Has hero with skor", detail!.hero.skor > 0, `skor: ${detail!.hero.skor}`);
  check("Has 5 aspek", detail!.aspek.length === 5, `got ${detail!.aspek.length}`);
  check("Has sentiment distributions", "sentiment" in detail!);
  check("Has insight array", Array.isArray(detail!.insight));

  if (detail) {
    console.log(`    ${detail.tempat.nama} — skor: ${detail.hero.skor}, predikat: ${detail.hero.predikat.label}, ulasan: ${detail.hero.totalUlasan}`);
    console.log(`    Aspek: ${detail.aspek.map((a) => `${a.nama}=${a.skor}`).join(", ")}`);
  }

  // ─── 4. GET /api/tempat/[slug]/ulasan ───
  console.log("\n📋 GET /api/tempat/[slug]/ulasan");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
  const tempat = await prisma.masterTempat.findUnique({ where: { slug } });
  await prisma.$disconnect();

  const reviews = await reviewService.getMany({
    tempatId: tempat!.id,
    page: 1,
    limit: 10,
  });
  check("Returns data array", Array.isArray(reviews.data));
  check("Has 10 reviews per page", reviews.data.length === 10, `got ${reviews.data.length}`);
  check("Has pagination", "pagination" in reviews);
  check("Pagination total matches", reviews.pagination.total > 0);
  check("Pagination totalPages calculated", reviews.pagination.totalPages === Math.ceil(reviews.pagination.total / 10));
  check("Review has detectedAspect", reviews.data.every((r) => Array.isArray(r.detectedAspect)));

  // Test page 2
  const reviewsPage2 = await reviewService.getMany({
    tempatId: tempat!.id,
    page: 2,
    limit: 10,
  });
  check("Page 2 returns different data", reviewsPage2.data.length > 0 && reviewsPage2.data[0].id !== reviews.data[0].id);

  // Test sumber filter
  const gmOnly = await reviewService.getMany({
    tempatId: tempat!.id,
    page: 1,
    limit: 5,
    sumber: "google_maps",
  });
  check("Filter sumber=google_maps works", gmOnly.data.every((r) => r.source === "google_maps"));

  // ─── 5. GET /api/rekomendasi ───
  console.log("\n📋 GET /api/rekomendasi");

  const rec = await destinationService.getRecommendations({});
  check("Returns ranking array", Array.isArray(rec));
  check("Has 10 items default", rec.length === 10, `got ${rec.length}`);
  check("Items have rank", rec.every((r) => "rank" in r && r.rank > 0));
  check("Items have skor", rec.every((r) => r.skor > 0));

  // Filter by aspek
  const recKebersihan = await destinationService.getRecommendations({ aspek: "kebersihan" });
  const recHarga = await destinationService.getRecommendations({ aspek: "harga" });
  const topKebersihan = recKebersihan[0].slug;
  const topHarga = recHarga[0].slug;
  check("Sort by kebersihan vs harga gives different #1", topKebersihan !== topHarga, `${topKebersihan} vs ${topHarga}`);

  // Filter by kota (use actual slug)
  const recByKota = await destinationService.getRecommendations({ kota: firstKota });
  check(`Filter kota=${firstKota} works`, recByKota.length > 0);

  // ─── 6. GET /api/wisata/autocomplete ───
  console.log("\n📋 GET /api/wisata/autocomplete");

  const acShort = await destinationService.getAutocomplete("pa");
  check("Query < 3 chars returns empty", acShort.length === 0);

  const ac = await destinationService.getAutocomplete("pantai");
  check("Query >= 3 chars returns results", ac.length > 0 && ac.length <= 5, `got ${ac.length}`);
  check("Results have slug, nama, kota", ac.every((s) => "slug" in s && "nama" in s && "kota" in s));

  // ─── 7. Error cases ───
  console.log("\n📋 Error handling");

  const notFound = await destinationService.getDestinationDetail("tempat-tidak-ada");
  check("404 on invalid slug returns null", notFound === null);

  // ─── SUMMARY ───
  console.log("\n" + "═".repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
  console.log("═".repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

main();
