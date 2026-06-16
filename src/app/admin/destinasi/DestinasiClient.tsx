"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import Image from "next/image";

interface Tempat {
  id: number;
  slug: string;
  nama: string;
  imageUrl: string | null;
  description: string | null;
  kota: { nama: string };
  statistik: { totalUlasan: number } | null;
}

export function DestinasiClient({ initial }: { initial: Tempat[] }) {
  const [q, setQ] = useState("");
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!q) {
        setData(initial);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/tempat?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setData(json.data);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, initial]);

  return (
    <div>
      <div className="flex items-center justify-between mb-lg">
        <h1 className="text-title text-foreground">Kelola Destinasi</h1>
      </div>

      <div className="mb-lg max-w-md">
        <Input
          value={q}
          onChange={setQ}
          placeholder="Cari nama destinasi..."
          className="w-full"
        />
      </div>

      {loading ? (
        <p className="text-foreground-secondary text-label py-xl text-center">Mencari...</p>
      ) : data.length === 0 ? (
        <EmptyState message="Tidak ada destinasi ditemukan" />
      ) : (
        <div className="border border-border rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-elevated">
                <th className="text-left p-md text-caption text-foreground-secondary font-medium">Nama Tempat</th>
                <th className="text-left p-md text-caption text-foreground-secondary font-medium">Kota</th>
                <th className="text-right p-md text-caption text-foreground-secondary font-medium">Ulasan</th>
                <th className="text-center p-md text-caption text-foreground-secondary font-medium w-12">Foto</th>
                <th className="text-left p-md text-caption text-foreground-secondary font-medium">Deskripsi</th>
                <th className="text-center p-md text-caption text-foreground-secondary font-medium w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-surface-elevated transition-colors">
                  <td className="p-md text-label text-foreground">{t.nama}</td>
                  <td className="p-md text-label text-foreground-secondary">{t.kota.nama}</td>
                  <td className="p-md text-label text-foreground text-right">
                    {t.statistik?.totalUlasan?.toLocaleString("id-ID") ?? 0}
                  </td>
                  <td className="p-md text-center">
                    {t.imageUrl ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden relative mx-auto">
                        <Image src={t.imageUrl} alt={t.nama} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <span className="text-caption text-foreground-secondary">—</span>
                    )}
                  </td>
                  <td className="p-md text-label text-foreground-secondary max-w-[200px] truncate">
                    {t.description?.slice(0, 50) || <span className="text-caption italic">Belum ada</span>}
                    {t.description && t.description.length > 50 ? "..." : ""}
                  </td>
                  <td className="p-md text-center">
                    <Link
                      href={`/admin/destinasi/${t.id}/edit`}
                      className="text-caption text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
