"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const KATEGORI_OPTIONS = ["Pantai", "Goa", "Budaya & Tradisi", "Taman Rekreasi", "Tebing & Bukit", "Alam & Air", "Wisata Alam"];

function FilterDropdown({ label, value, onChange, options, isOpen, onToggle }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.value === value);
  const display = value ? active?.label : label;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`h-12 rounded-button border px-4 text-body flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
          value ? "bg-brand/10 border-brand/30 text-brand" : "bg-surface border-border text-foreground-secondary hover:border-brand/30"
        }`}
      >
        <span className="text-caption opacity-70">{label}:</span>
        <span className="font-medium">{display}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-card shadow-elevated z-50 min-w-[200px] overflow-hidden">
          <button
            type="button"
            className={`w-full text-left px-4 py-2.5 text-body hover:bg-surface-elevated transition-colors ${!value ? "text-brand font-medium" : "text-foreground-secondary"}`}
            onClick={() => { onChange(""); onToggle(); }}
          >
            {label === "Kategori" ? "Semua Kategori" : label === "Urut" ? "Rekomendasi" : "Semua Kota"}
          </button>
          {options.filter(o => o.value !== "").map((o) => (
            <button
              key={o.value}
              type="button"
              className={`w-full text-left px-4 py-2.5 text-body hover:bg-surface-elevated transition-colors ${value === o.value ? "text-brand font-medium bg-brand/5" : "text-foreground-secondary"}`}
              onClick={() => { onChange(o.value); onToggle(); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [openFilter, setOpenFilter] = useState<string | null>(null);

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
      if (q.length >= 3 || q.length === 0) fetchPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [q, fetchPage]);

  useEffect(() => { fetchPage(1); }, [kota, sort, kategori, fetchPage]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-xl">
        <div className="flex-1 min-w-[200px]">
          <Input value={q} onChange={setQ} placeholder="Cari destinasi..." className="w-full" />
        </div>

        {[
          { label: "Kota", value: kota, setter: setKota, options: cities.map((c) => ({ value: c.slug, label: c.nama })) },
          { label: "Kategori", value: kategori, setter: setKategori, options: KATEGORI_OPTIONS.map((k) => ({ value: k, label: k })) },
          { label: "Urut", value: sort, setter: setSort, options: SORT_OPTIONS },
        ].map((f) => (
          <FilterDropdown
            key={f.label}
            label={f.label}
            value={f.value}
            onChange={(v) => { f.setter(v); setOpenFilter(null); }}
            options={f.options}
            isOpen={openFilter === f.label}
            onToggle={() => setOpenFilter(openFilter === f.label ? null : f.label)}
          />
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="Tidak ada destinasi ditemukan" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {data.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchPage} />
    </div>
  );
}
