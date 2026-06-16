import type { DestinationCardDTO, Predikat } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";

interface DestinationCardProps {
  destination: DestinationCardDTO;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { slug, nama, kota, imageUrl, kategori, skor, predikat, totalUlasan } = destination;

  return (
    <Link href={`/wisata/${slug}`} className="block group">
      <Card className="h-full hover:-translate-y-0.5 hover:shadow-level3 transition-all duration-200">
        <div className="aspect-[16/10] rounded-lg bg-border/20 mb-md overflow-hidden relative">
          {imageUrl ? (
            <Image src={imageUrl} alt={nama} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-secondary text-caption">
              No Image
            </div>
          )}
          {kategori && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-medium">
              {kategori}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-label font-semibold text-foreground truncate">{nama}</h3>
            <p className="text-caption text-foreground-secondary mt-0.5">{kota.nama}</p>
          </div>
          <ScoreBadgeMini predikat={predikat} skor={skor} />
        </div>

        <p className="text-caption text-foreground-secondary mt-sm">
          {totalUlasan.toLocaleString("id-ID")} ulasan
        </p>
      </Card>
    </Link>
  );
}

function ScoreBadgeMini({ predikat, skor }: { predikat: Predikat; skor: number }) {
  const colorMap: Record<string, string> = {
    accent: "accent",
    foreground: "default",
    warning: "neutral",
    negative: "negative",
  };

  return (
    <Badge variant={colorMap[predikat.color] as any}>
      {skor.toFixed(1)}
    </Badge>
  );
}
