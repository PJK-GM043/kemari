import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const t = await (p.masterTempat as any).findFirst({ where: { slug: "pantai-kuta" } });
  console.log("Image:", t?.imageUrl);
  console.log("Description:", t?.description?.slice(0, 200));
  console.log("---");
  console.log(t?.description);

  await p.$disconnect();
}

main();
