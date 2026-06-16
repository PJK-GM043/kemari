import { prisma } from "@/lib/prisma";
import { Logo } from "./Logo";

export async function LogoFromDB({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  let logoUrl: string | null = null;
  try {
    const setting = await (prisma.pengaturan as any).findUnique({ where: { key: "logo_url" } });
    logoUrl = setting?.value ?? null;
  } catch {}

  return <Logo size={size} className={className} logoUrl={logoUrl} />;
}
