import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

  const stats = await (p.statistikTempat as any).findMany();
  let updated = 0;

  for (const s of stats) {
    const avg = (
      (s.skorFasilitas || 0) +
      (s.skorKebersihan || 0) +
      (s.skorHarga || 0) +
      (s.skorAksesibilitas || 0) +
      (s.skorPelayanan || 0)
    ) / 5;

    const rounded = Math.round(avg * 10) / 10;

    if (rounded !== s.skor) {
      await p.statistikTempat.update({
        where: { id: s.id },
        data: { skor: rounded },
      });
      updated++;
    }
  }

  await p.$disconnect();
  console.log(`Updated ${updated} statistics. Skor now 0-5 scale (average of 5 aspects)`);
}

main();
