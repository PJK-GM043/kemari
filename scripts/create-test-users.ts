import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

  const accounts = [
    { username: "testuser", email: "user@kemari.id", password: "user123", role: "USER" },
    { username: "testadmin", email: "admin@kemari.id", password: "admin123", role: "ADMIN" },
  ];

  for (const acc of accounts) {
    const exists = await (p.user as any).findUnique({ where: { email: acc.email } });
    if (exists) {
      await p.user.update({
        where: { email: acc.email },
        data: { password: await bcrypt.hash(acc.password, 12), role: acc.role },
      });
      console.log(`  Updated: ${acc.username} (${acc.email})`);
    } else {
      await p.user.create({
        data: {
          username: acc.username,
          email: acc.email,
          password: await bcrypt.hash(acc.password, 12),
          role: acc.role,
          emailVerified: new Date(),
        },
      });
      console.log(`  Created: ${acc.username} (${acc.email})`);
    }
  }

  await p.$disconnect();
  console.log("\nTest accounts ready:");
  console.log("  User:  user@kemari.id  / user123");
  console.log("  Admin: admin@kemari.id / admin123");
}

main();
