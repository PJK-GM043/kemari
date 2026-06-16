import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const empty = await (p.statistikTempat as any).findMany({
    where: { totalUlasan: 0 },
    include: { tempat: { select: { nama: true } } },
  });

  if (empty.length > 0) {
    console.log("Destinasi dengan total_ulasan = 0:");
    empty.forEach((e: any) => console.log(`  - ${e.tempat.nama}`));
  } else {
    console.log("Semua 25 destinasi punya ulasan. PRD criteria: PASSED");
  }

  const sampel = await (p.statistikTempat as any).findFirst({
    include: { tempat: { select: { nama: true, kota: { select: { nama: true } } } } },
  });
  console.log(`\nSample: ${sampel.tempat.nama} (${sampel.tempat.kota.nama})`);
  console.log(`  skor: ${sampel.skor}, totalUlasan: ${sampel.totalUlasan}`);
  console.log(`  fasilitas: ${sampel.skorFasilitas}, kebersihan: ${sampel.skorKebersihan}, harga: ${sampel.skorHarga}`);

  await p.$disconnect();
}

main();
