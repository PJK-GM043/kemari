import type { RankingDTO } from "@/types";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface RecommendationSectionProps {
  rankings: RankingDTO[];
}

export function RecommendationSection({ rankings }: RecommendationSectionProps) {
  return (
    <section className="mb-2xl">
      <h2 className="text-title text-foreground mb-lg">Rekomendasi Teratas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
        {rankings.slice(0, 5).map((r) => (
          <Link key={r.slug} href={`/wisata/${r.slug}`} className="group">
            <Card className="h-full text-center hover:-translate-y-0.5 hover:shadow-level3 transition-all duration-200">
              <p className="text-heading text-accent font-bold">#{r.rank}</p>
              <p className="text-label font-semibold text-foreground mt-sm truncate">{r.nama}</p>
              <p className="text-caption text-foreground-secondary mt-0.5">{r.kota}</p>
              <p className="text-hero text-foreground mt-md">{r.skor.toFixed(1)}</p>
              <p className="text-caption text-foreground-secondary">{r.predikat}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
