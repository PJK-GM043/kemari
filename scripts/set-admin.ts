import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  const users = await p.user.findMany({ select: { id: true, username: true, email: true, role: true } });
  console.log("Users:");
  users.forEach((u: any) => console.log(`  ${u.id}: ${u.username} (${u.email}) — ${u.role}`));

  if (users.length > 0 && users.every((u: any) => u.role === "USER")) {
    const target = process.argv[2] || users[0].email;
    await p.user.update({ where: { email: target }, data: { role: "ADMIN" } });
    console.log(`\n${target} → ADMIN`);
  }

  await p.$disconnect();
}

main();
