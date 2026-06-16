"use client";

import { useState } from "react";
import type { ReviewDTO, PaginationDTO } from "@/types";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewFilter } from "@/components/review/ReviewFilter";
import { Pagination } from "@/components/ui/Pagination";
import { ReviewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface ReviewListClientProps {
  slug: string;
  initialReviews: ReviewDTO[];
  initialPagination: PaginationDTO;
}

export function ReviewListClient({ slug, initialReviews, initialPagination }: ReviewListClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");

  async function fetchReviews(page: number, src?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      const s = src ?? source;
      if (s) params.set("sumber", s);

      const res = await fetch(`/api/tempat/${slug}/ulasan?${params}`);
      const json = await res.json();
      setReviews(json.data);
      setPagination(json.pagination);
    } finally {
      setLoading(false);
    }
  }

  function handleSourceChange(src: string) {
    setSource(src);
    if (src !== source) fetchReviews(1, src);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-lg">
        <p className="text-label text-foreground-secondary">
          {pagination.total.toLocaleString("id-ID")} ulasan
        </p>
        <ReviewFilter activeSource={source} onChange={handleSourceChange} />
      </div>

      {loading ? (
        <div className="space-y-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState message="Belum ada ulasan" />
      ) : (
        <div className="space-y-md">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => fetchReviews(p)}
      />
    </div>
  );
}
