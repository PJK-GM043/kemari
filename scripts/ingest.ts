import "dotenv/config";
import { readCSV } from "./lib/csv-reader";
import { runIngestion } from "./services/ingestion.service";
import { logStep, logInfo } from "./lib/progress";

async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║   Kemari — ETL Pipeline v1.0        ║");
  console.log("╚══════════════════════════════════════╝\n");

  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: npx tsx scripts/ingest.ts <path-to-csv>\n");
    console.log("Expected CSV columns:");
    console.log("  review_id, username, nama_tempat, kota, tanggal,");
    console.log("  ulasan, ulasan_final, rating, sumber,");
    console.log("  label_fasilitas, label_kebersihan, label_harga,");
    console.log("  label_aksesibilitas, label_pelayanan,");
    console.log("  label_aspek, label_sentimen\n");
    process.exit(0);
  }

  const filePath = args[0];

  logStep(`Reading CSV: ${filePath}`);
  const records = readCSV(filePath);
  logInfo(`Parsed ${records.length} records`);

  if (records.length === 0) {
    console.error("No records found in CSV");
    process.exit(1);
  }

  const sample = records[0];
  console.log(`  Columns: ${Object.keys(sample).join(", ")}`);

  logStep("Starting ingestion...\n");
  const startTime = Date.now();

  try {
    await runIngestion(records);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log(`\nIngestion complete in ${elapsed}s`);
  } catch (err) {
    console.error("Ingestion failed:", err);
    process.exit(1);
  }
}

main();
