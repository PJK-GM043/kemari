"use client";

import { useState, useEffect, useCallback } from "react";
import type { DestinationCardDTO, KotaDTO, PaginationDTO } from "@/types";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";

const SORT_OPTIONS = [
  { value: "", label: "Rekomendasi" },
  { value: "kebersihan", label: "Kebersihan" },
  { value: "fasilitas", label: "Fasilitas" },
  { value: "pelayanan", label: "Pelayanan" },
  { value: "harga", label: "Harga" },
  { value: "aksesibilitas", label: "Aksesibilitas" },
];

const KATEGORI_OPTIONS = [
  "", "Pantai", "Goa", "Budaya & Tradisi", "Taman Rekreasi", "Tebing & Bukit", "Alam & Air", "Wisata Alam",
];

interface ExploreClientProps {
  initialData: DestinationCardDTO[];
  pagination: PaginationDTO;
  cities: KotaDTO[];
}

export function ExploreClient({ initialData, pagination: initialPagination, cities }: ExploreClientProps) {
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [kota, setKota] = useState("");
  const [sort, setSort] = useState("");
  const [kategori, setKategori] = useState("");

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      if (q) params.set("q", q);
      if (kota) params.set("kota", kota);
      if (sort) params.set("sort", sort);
      if (kategori) params.set("kategori", kategori);

      const res = await fetch(`/api/tempat?${params}`);
      const json = await res.json();
      setData(json.data);
      setPagination(json.pagination);
    } finally {
      setLoading(false);
    }
  }, [q, kota, sort, kategori]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (q.length >= 3 || q.length === 0) {
        fetchPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [q, fetchPage]);

  useEffect(() => {
    fetchPage(1);
  }, [kota, sort, kategori, fetchPage]);

  return (
    <div>
      <h1 className="text-heading text-foreground mb-lg">Jelajahi Destinasi</h1>

      <div className="flex flex-wrap items-end gap-md mb-xl">
        <div className="flex-1 min-w-[200px]">
          <label className="text-caption text-foreground-secondary block mb-1">Cari</label>
          <Input
            value={q}
            onChange={setQ}
            placeholder="Nama destinasi..."
            className="w-full"
          />
        </div>

        <div>
          <label className="text-caption text-foreground-secondary block mb-1">Kota</label>
          <select
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Semua Kota</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nama} ({c.totalTempat})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-caption text-foreground-secondary block mb-1">Urut</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-caption text-foreground-secondary block mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="h-12 rounded-button border border-border bg-surface px-4 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.filter(Boolean).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="Tidak ada destinasi ditemukan" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {data.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={fetchPage}
      />
    </div>
  );
}
