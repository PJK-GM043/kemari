import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User, UserRole } from "@/generated/prisma/client";

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  image?: string;
}): Promise<User> {
  const hashed = data.password ? await bcrypt.hash(data.password, 12) : null;
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashed,
      image: data.image,
      emailVerified: new Date(),
    },
  }) as Promise<User>;
}

export async function createOAuthUser(data: {
  username: string;
  email: string;
  image?: string;
}): Promise<User> {
  const base = data.username;
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = attempt > 0 ? `_${Math.random().toString(36).slice(2, 5)}` : "";
    const candidate = base + suffix;
    const existing = await prisma.user.findUnique({ where: { username: candidate } }) as User | null;
    if (!existing) {
      return prisma.user.create({
        data: {
          username: candidate,
          email: data.email,
          image: data.image,
          emailVerified: new Date(),
        },
      }) as Promise<User>;
    }
  }
  throw new Error("Failed to generate unique username");
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  if (!user.password) return false;
  return bcrypt.compare(password, user.password);
}

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}
