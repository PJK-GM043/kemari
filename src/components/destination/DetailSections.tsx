import type { AspekDTO, SentimentDistributionDTO } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HeroCarousel } from "./HeroCarousel";

interface HeroSectionProps {
  imageUrl: string | null;
  galeri?: string[];
  nama: string;
  kota: string;
  skor: number;
  predikatLabel: string;
  totalUlasan: number;
}

export function HeroSection({ imageUrl, galeri = [], nama, kota, skor, predikatLabel, totalUlasan }: HeroSectionProps) {
  const images = galeri.length > 0 ? galeri : imageUrl ? [imageUrl] : [];

  return (
    <section className="mb-xl">
      {images.length > 0 ? (
        <HeroCarousel images={images} nama={nama} />
      ) : (
        <div className="aspect-[16/9] max-h-[400px] rounded-hero bg-surface-elevated flex items-center justify-center text-foreground-secondary text-caption mb-xl">
          No Image Available
        </div>
      )}

      <Metadata nama={nama} kota={kota} skor={skor} predikatLabel={predikatLabel} totalUlasan={totalUlasan} />
    </section>
  );
}

function Metadata({ nama, kota, skor, predikatLabel, totalUlasan }: Omit<HeroSectionProps, "imageUrl" | "galeri">) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-lg mt-lg">
      <div>
        <h1 className="text-heading text-foreground">{nama}</h1>
        <p className="text-label text-foreground-secondary mt-xs">{kota}</p>
      </div>
      <div className="flex items-center gap-xl">
        <MetricCard label="Skor" value={skor.toFixed(1)} highlight />
        <MetricCard label="Predikat" value={predikatLabel} />
        <MetricCard label="Ulasan" value={totalUlasan.toLocaleString("id-ID")} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-hero ${highlight ? "text-accent" : "text-foreground"}`}>{value}</p>
      <p className="text-caption text-foreground-secondary mt-1">{label}</p>
    </div>
  );
}

// ─── Aspect Section ──────────────────────────────────

export function AspectSection({ aspek }: { aspek: AspekDTO[] }) {
  return (
    <section className="mb-2xl">
      <h2 className="text-title text-foreground mb-lg">Penilaian Per Aspek</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
        {aspek.map((a) => (
          <Card key={a.nama} className="text-center">
            <div className="flex justify-center mb-sm">
              <AspectDots skor={a.skor} />
            </div>
            <p className="text-label font-semibold text-foreground">{a.nama}</p>
            <p className="text-heading text-foreground mt-1">{a.skor.toFixed(1)}</p>
            <AspectSentimentBadge aspectName={a.nama} skor={a.skor} />
          </Card>
        ))}
      </div>
    </section>
  );
}

function AspectDots({ skor }: { skor: number }) {
  const filled = Math.round(skor);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors ${i <= filled ? "bg-brand" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function AspectSentimentBadge({ skor }: { aspectName: string; skor: number }) {
  let variant: "positive" | "neutral" | "negative" | "default" = "default";
  let label = "";
  if (skor >= 4) { variant = "positive"; label = "Baik"; }
  else if (skor >= 3) { variant = "neutral"; label = "Cukup"; }
  else if (skor >= 1) { variant = "negative"; label = "Kurang"; }

  if (!label) return null;

  return (
    <div className="mt-sm">
      <Badge variant={variant}>{label}</Badge>
    </div>
  );
}

// ─── Ringkasan Analisis ──────────────────────────────

interface RingkasanAnalisisProps {
  aspek: AspekDTO[];
  sentiment: Record<string, SentimentDistributionDTO>;
  nama: string;
  source: { googleMaps: number; tiktok: number };
  sampleReviews?: string[];
}

export function RingkasanAnalisis({ aspek, sentiment, nama, source, sampleReviews = [] }: RingkasanAnalisisProps) {
  const ASPECT_KEYS = ["fasilitas", "kebersihan", "harga", "aksesibilitas", "pelayanan"];

  const sortedBest = [...aspek].sort((a, b) => b.skor - a.skor);
  const top = sortedBest[0];
  const worst = sortedBest[sortedBest.length - 1];

  const gmDominant = source.googleMaps > source.tiktok;
  const tiktokDominant = source.tiktok > source.googleMaps;

  const paragraphParts: string[] = [];

  // Intro — natural language
  const avgSkor = sortedBest.reduce((s, a) => s + a.skor, 0) / 5;
  const kualitas = avgSkor >= 4 ? "sangat baik" : avgSkor >= 3 ? "cukup baik" : avgSkor >= 2 ? "biasa saja" : "kurang memuaskan";
  const sumberDominan = gmDominant && tiktokDominant ? "Google Maps dan TikTok" : gmDominant ? "Google Maps" : "TikTok";

  paragraphParts.push(
    `Berdasarkan ribuan ulasan dari ${sumberDominan}, ${nama} secara umum dinilai ${kualitas} oleh para pengunjung.`
  );

  // Strengths — qualitative
  if (top.skor >= 4) {
    paragraphParts.push(`Pengunjung paling sering memuji aspek ${top.nama.toLowerCase()} yang memang menjadi daya tarik utama tempat ini.`);
  } else if (top.skor >= 3) {
    paragraphParts.push(`Aspek ${top.nama.toLowerCase()} cukup diapresiasi pengunjung, meskipun masih ada ruang untuk perbaikan.`);
  }

  // Weaknesses — qualitative
  if (worst.skor < 3.5 && worst.nama !== top.nama) {
    if (worst.skor >= 2.5) {
      paragraphParts.push(`Sementara itu, ${worst.nama.toLowerCase()} dinilai masih perlu ditingkatkan oleh sebagian pengunjung.`);
    } else if (worst.skor >= 1.5) {
      paragraphParts.push(`Beberapa pengunjung mengeluhkan ${worst.nama.toLowerCase()} yang dirasa kurang memadai.`);
    } else if (worst.skor > 0) {
      paragraphParts.push(`Sayangnya, ${worst.nama.toLowerCase()} menjadi titik lemah yang cukup dikeluhkan pengunjung.`);
    }
  }

  // Overall sentiment — qualitative summary
  const avgPositive = ASPECT_KEYS.reduce((sum, k) => sum + (sentiment[k]?.positif ?? 0), 0) / 5;
  if (avgPositive >= 75) {
    paragraphParts.push(`Mayoritas besar pengunjung merasa puas dan merekomendasikan tempat ini.`);
  } else if (avgPositive >= 60) {
    paragraphParts.push(`Sebagian besar pengunjung memberikan kesan positif, meskipun ada beberapa catatan yang perlu diperhatikan.`);
  } else if (avgPositive >= 40) {
    paragraphParts.push(`Tanggapan pengunjung cukup berimbang — ada yang puas, ada juga yang kurang puas.`);
  } else {
    paragraphParts.push(`Ulasan pengunjung cukup beragam. Sebaiknya cek ulasan terbaru sebelum berkunjung.`);
  }

  const paragraph = paragraphParts.join(" ");

  return (
    <section className="mb-2xl">
      <h2 className="text-title text-foreground mb-lg">Ringkasan Analisis</h2>
      <Card className="bg-surface-elevated space-y-lg">
        <p className="text-body text-foreground-secondary leading-relaxed">
          {paragraph}
        </p>

        {sampleReviews.length > 0 && (
          <div className="space-y-sm pt-lg border-t border-border">
            <p className="text-caption text-foreground-secondary font-medium">Kata pengunjung:</p>
            {sampleReviews.map((quote, i) => (
              <p key={i} className="text-caption text-foreground-secondary italic leading-relaxed pl-4 border-l-2 border-brand/30">
                {`"${quote}${quote.length >= 120 ? "..." : ""}"`}
              </p>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

// ─── Sentiment Section ───────────────────────────────

interface SentimentSectionProps {
  source: { googleMaps: number; tiktok: number };
  distributions: Record<string, SentimentDistributionDTO>;
}

const ASPECT_NAMES = ["fasilitas", "kebersihan", "harga", "aksesibilitas", "pelayanan"];

export function SentimentSection({ source, distributions }: SentimentSectionProps) {
  const total = source.googleMaps + source.tiktok;

  return (
    <div>
      <div className="grid grid-cols-3 gap-md mb-lg">
        <Card className="text-center">
          <p className="text-heading text-foreground">{source.googleMaps.toLocaleString("id-ID")}</p>
          <p className="text-caption text-foreground-secondary mt-1">Google Maps</p>
        </Card>
        <Card className="text-center">
          <p className="text-heading text-foreground">{source.tiktok.toLocaleString("id-ID")}</p>
          <p className="text-caption text-foreground-secondary mt-1">TikTok</p>
        </Card>
        <Card className="text-center">
          <p className="text-heading text-foreground">{total.toLocaleString("id-ID")}</p>
          <p className="text-caption text-foreground-secondary mt-1">Total</p>
        </Card>
      </div>

      <div className="space-y-md">
        {ASPECT_NAMES.map((key) => {
          const dist = distributions[key];
          if (!dist) return null;
          return (
            <Card key={key}>
              <div className="flex items-center justify-between mb-sm">
                <p className="text-label font-semibold text-foreground capitalize">{key}</p>
                <Badge variant={dist.positif >= 70 ? "positive" : dist.negatif >= 30 ? "negative" : "neutral"}>
                  {dist.positif}% positif
                </Badge>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-border/30">
                <div className="bg-positive h-full transition-all" style={{ width: `${dist.positif}%` }} />
                <div className="bg-neutral h-full transition-all" style={{ width: `${dist.netral}%` }} />
                <div className="bg-negative h-full transition-all" style={{ width: `${dist.negatif}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-caption text-foreground-secondary">
                <span>{dist.positif}%</span>
                <span>{dist.netral}%</span>
                <span>{dist.negatif}%</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
