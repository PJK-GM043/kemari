import { prisma } from "@/lib/prisma";

export async function withTransaction<T>(
  fn: (tx: any) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn);
}
