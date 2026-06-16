import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoFromDB } from "@/components/layout/LogoFromDB";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Kemari" };

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/destinasi", label: "Destinasi" },
  { href: "/admin/pengaturan", label: "Pengaturan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect("/admin/login");
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-60 bg-surface border-r border-border shrink-0 flex flex-col">
        <div className="p-lg border-b border-border">
          <Link href="/admin/dashboard" className="text-title">
            <LogoFromDB size="lg" />
          </Link>
          <p className="text-caption text-foreground-secondary mt-1">Panel Admin</p>
        </div>

        <nav className="flex-1 p-md space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-button text-label text-foreground-secondary hover:bg-surface-elevated hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-lg border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-caption font-bold text-accent">
              {(session.user?.name || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-caption text-foreground truncate">{session.user?.name}</p>
              <p className="text-caption text-foreground-secondary">Admin</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="block mt-md text-caption text-foreground-secondary hover:text-negative transition-colors"
          >
            Keluar
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-2xl overflow-auto">
        {children}
      </main>
    </div>
  );
}
