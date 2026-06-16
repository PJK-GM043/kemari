import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const RULES: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /pantai/i, category: "Pantai" },
  { pattern: /goa/i, category: "Goa" },
  { pattern: /pura|taman budaya|budaya/i, category: "Budaya & Tradisi" },
  { pattern: /waterbom|dreampark|farm|orchard|rekreasi/i, category: "Taman Rekreasi" },
  { pattern: /tebing|bukit/i, category: "Tebing & Bukit" },
  { pattern: /telaga|curug|air terjun|sungai|agrowisata/i, category: "Alam & Air" },
  { pattern: /sambo|ledok|nawang|klangon|sikunir|ratapan/i, category: "Wisata Alam" },
  { pattern: /the great asia|africa/i, category: "Taman Rekreasi" },
];

function categorize(nama: string): string {
  for (const rule of RULES) {
    if (rule.pattern.test(nama)) return rule.category;
  }
  return "Wisata Alam";
}

async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

  const tempat = await (p.masterTempat as any).findMany();
  console.log(`Categorizing ${tempat.length} destinations...`);

  for (const t of tempat) {
    const kategori = categorize(t.nama);
    await p.masterTempat.update({ where: { id: t.id }, data: { kategori } });
    console.log(`  ${t.nama} → ${kategori}`);
  }

  await p.$disconnect();
  console.log("Done");
}

main();
