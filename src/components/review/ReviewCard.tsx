import type { ReviewDTO } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ReviewCardProps {
  review: ReviewDTO;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { username, tanggal, rating, source, ulasan, detectedAspect } = review;

  const sourceLabel = source === "google_maps" ? "Google Maps" : source === "tiktok" ? "TikTok" : "Web";

  return (
    <Card>
      <div className="flex items-start justify-between mb-sm">
        <div>
          <p className="text-label font-semibold text-foreground">{username}</p>
          <p className="text-caption text-foreground-secondary">{tanggal}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{sourceLabel}</Badge>
          <span className="text-label font-semibold text-foreground">★ {rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-body text-foreground-secondary leading-relaxed">{ulasan}</p>

      {detectedAspect.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-md">
          {detectedAspect.map((a) => (
            <Badge key={a} variant="accent">{a}</Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
