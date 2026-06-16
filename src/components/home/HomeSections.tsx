"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero ────────────────────────────────────────────

export function HeroSection({ rankings }: { rankings: any[] }) {
  return (
    <section className="relative min-h-[85vh] flex items-center py-2xl overflow-hidden">
      {/* Dark mode glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[120px] dark:block hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center w-full">
        <div className="space-y-lg">
          <Reveal>
            <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-caption font-medium">
              Platform ulasan wisata berbasis AI
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-display leading-tight">
              Temukan wisata terbaik dari{" "}
              <span className="text-brand">pengalaman nyata.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-title text-foreground-secondary font-normal">
              Mari Kenali & Eksplorasi
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex items-center gap-md flex-wrap">
              <Button href="/wisata" size="lg" className="bg-brand hover:bg-brand-light text-white border-none">
                Jelajahi Destinasi
              </Button>
              <Button href="#rekomendasi" variant="ghost" size="lg">
                Lihat Rekomendasi →
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center gap-xl pt-lg text-foreground-secondary text-caption">
              <div><span className="block text-label text-foreground font-semibold">55.150+</span>Ulasan Dianalisis</div>
              <div className="w-px h-8 bg-border" />
              <div><span className="block text-label text-foreground font-semibold">25</span>Destinasi</div>
              <div className="w-px h-8 bg-border" />
              <div><span className="block text-label text-foreground font-semibold">5</span>Kota & Kabupaten</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="relative hidden lg:block">
            <div className="rounded-panel bg-surface border border-border shadow-elevated p-0 overflow-hidden rotate-1">
              <div className="aspect-[4/3] bg-brand/5 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                <Image
                  src={rankings[0]?.thumbnail || "https://picsum.photos/seed/hero/600/400"}
                  alt={rankings[0]?.nama || "Destinasi"}
                  fill
                  className="object-cover"
                  sizes="500px"
                />
                <div className="absolute bottom-0 left-0 right-0 p-lg z-20">
                  <span className="text-white text-label font-semibold block">{rankings[0]?.nama || "Pantai Kuta"}</span>
                  <span className="text-white/80 text-caption">{rankings[0]?.kota || "Bali"}</span>
                </div>
              </div>
              <div className="p-lg">
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-caption text-foreground-secondary">{rankings[0]?.predikat || "Sangat Baik"}</span>
                  <span className="text-label font-bold text-brand">★ {(rankings[0]?.skor ?? 4.0).toFixed(1)}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {["Kebersihan", "Fasilitas", "Pelayanan"].map((a) => (
                    <span key={a} className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-caption">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Recommendations ─────────────────────────────────

export function RecommendationSection({ rankings }: { rankings: any[] }) {
  return (
    <section id="rekomendasi" className="py-3xl">
      <Reveal>
        <h2 className="text-heading text-foreground mb-2">
          Tempat Terbaik, Dinilai dari Pengalaman Nyata
        </h2>
        <p className="text-body text-foreground-secondary mb-xl">
          Destinasi pilihan berdasarkan analisis sentimen dari ribuan ulasan pengunjung.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {rankings.map((r: any, i: number) => (
          <Reveal key={r.slug} delay={i * 0.1}>
            <Link href={`/wisata/${r.slug}`} className="block group h-full">
              <div className="rounded-panel bg-surface border border-border shadow-soft overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="aspect-[4/3] bg-brand/5 relative shrink-0">
                  {r.thumbnail ? (
                    <Image src={r.thumbnail} alt={r.nama} fill className="object-cover" sizes="400px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand text-label font-semibold">
                      {r.nama[0]}
                    </div>
                  )}
                </div>
                <div className="p-lg flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-sm">
                      <h3 className="text-label font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2">{r.nama}</h3>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-brand/10 text-brand text-caption font-semibold">
                        ★ {r.skor.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-caption text-foreground-secondary">{r.kota}</p>
                  </div>
                  <span className="text-caption text-brand font-medium mt-sm inline-block">Lihat Detail →</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Analisis Sentimen ABSA",
    desc: "Teknologi Aspect-Based Sentiment Analysis menilai destinasi dari 5 aspek spesifik — tidak hanya rating bintang kosong.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: "Rating Per Aspek",
    desc: "Lihat penilaian terpisah untuk Fasilitas, Kebersihan, Harga, Aksesibilitas, dan Pelayanan di setiap destinasi.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Insight dari Ulasan Nyata",
    desc: "Ringkasan otomatis dari ribuan ulasan Google Maps dan TikTok — tahu persis apa yang disukai dan dikeluhkan pengunjung.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2-9 7 9 7 9-7z" /><path d="M4.5 9.5v7.5a7 7 0 0 0 7 7" /><path d="M19.5 9.5v7.5a7 7 0 0 1-7 7" />
      </svg>
    ),
    title: "Multi-Kota & Kabupaten",
    desc: "Menjangkau 5 kota dan kabupaten di Indonesia — dari Bali hingga Yogyakarta, dari Bandung hingga Pacitan.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-3xl">
      <Reveal>
        <h2 className="text-heading text-foreground mb-2">
          Kenapa Kemari?
        </h2>
        <p className="text-body text-foreground-secondary mb-xl">
          Kami membantu kamu memilih destinasi dengan informasi yang lengkap dan terpercaya.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1}>
            <div className="flex gap-lg items-start p-lg rounded-panel bg-surface border border-border hover:border-brand/20 hover:shadow-soft transition-all duration-300">
              <span className="shrink-0 text-brand">{f.icon}</span>
              <div>
                <h3 className="text-label font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-caption text-foreground-secondary leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── CityTabs ────────────────────────────────────────

export function CityTabsSection({ cities }: { cities: any[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="py-3xl">
      <Reveal>
        <h2 className="text-heading text-foreground mb-2">
          Destinasi di Setiap Sudut
        </h2>
        <p className="text-body text-foreground-secondary mb-xl">
          Jelajahi destinasi favorit di setiap kota dan kabupaten yang kami cakup.
        </p>
      </Reveal>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-xl">
        {cities.map((c: any, i: number) => (
          <button
            key={c.slug}
            onClick={() => setActive(i)}
            className={`shrink-0 px-4 py-2 rounded-full text-caption font-medium transition-all ${
              active === i
                ? "bg-brand text-white"
                : "bg-surface border border-border text-foreground-secondary hover:border-brand/30 hover:text-foreground"
            }`}
          >
            {c.nama} ({c.totalTempat})
          </button>
        ))}
      </div>

      {cities[active] && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {cities[active].tempat?.slice(0, 3).map((t: any, i: number) => (
            <Reveal key={t.slug} delay={i * 0.1}>
              <Link href={`/wisata/${t.slug}`} className="block group">
                <div className="rounded-card bg-surface border border-border shadow-soft overflow-hidden hover:shadow-elevated transition-all hover:-translate-y-1">
                  <div className="aspect-[16/10] bg-brand/5 relative">
                    {t.imageUrl ? (
                      <Image src={t.imageUrl} alt={t.nama} fill className="object-cover" sizes="400px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand/30 text-4xl">🏞️</div>
                    )}
                  </div>
                  <div className="p-lg">
                    <h3 className="text-label font-semibold text-foreground group-hover:text-brand transition-colors">{t.nama}</h3>
                    <p className="text-caption text-foreground-secondary">{t.kota.nama}</p>
                    <div className="flex items-center gap-sm mt-sm">
                      <span className="text-caption text-brand font-semibold">★ {t.skor.toFixed(1)}</span>
                      <span className="text-caption text-foreground-secondary">{t.totalUlasan.toLocaleString("id-ID")} ulasan</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────

const FAQS = [
  { q: "Apa itu Kemari?", a: "Kemari adalah platform yang membantu wisatawan menemukan destinasi wisata terbaik berdasarkan analisis sentimen dari ribuan ulasan pengunjung di Google Maps dan TikTok. Kami menganalisis 5 aspek spesifik: Fasilitas, Kebersihan, Harga, Aksesibilitas, dan Pelayanan." },
  { q: "Bagaimana cara kerja penilaian di Kemari?", a: "Kami menggunakan teknologi AI bernama ABSA (Aspect-Based Sentiment Analysis) yang membaca setiap ulasan dan menilai sentimen pengunjung terhadap masing-masing aspek — bukan sekadar rating bintang." },
  { q: "Apa itu ABSA?", a: "ABSA adalah singkatan dari Aspect-Based Sentiment Analysis. Ini adalah teknik AI yang bisa memahami sentimen (positif, netral, negatif) untuk setiap aspek spesifik dalam satu teks ulasan. Misalnya, dari satu ulasan 'tempatnya bersih tapi mahal', ABSA bisa menangkap bahwa aspek kebersihan positif sementara harga negatif." },
  { q: "Dari mana data ulasan berasal?", a: "Ulasan dikumpulkan dari Google Maps dan TikTok. Data ini dianalisis menggunakan model IndoBERT yang dilatih khusus untuk memahami bahasa Indonesia." },
  { q: "Kota mana saja yang sudah tersedia?", a: "Saat ini kami mencakup 5 kota dan kabupaten: Kabupaten Badung (Bali), Kabupaten Bandung Barat, Kabupaten Pacitan, Kabupaten Sleman (Yogyakarta), dan Kabupaten Wonosobo. Kami akan terus menambah cakupan kota." },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-3xl">
      <Reveal>
        <div className="text-center">
          <h2 className="text-heading text-foreground mb-2">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-body text-foreground-secondary mb-xl">
            Semua yang perlu kamu ketahui tentang Kemari.
          </p>
        </div>
      </Reveal>

      <div className="max-w-2xl mx-auto space-y-md">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-card bg-surface border border-border overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-lg text-left text-label font-medium text-foreground hover:text-brand transition-colors"
            >
              {faq.q}
              <span className="shrink-0 ml-4 w-6 h-6 rounded-full border border-border flex items-center justify-center text-sm font-normal text-foreground-secondary">
                {openIdx === i ? "−" : "+"}
              </span>
            </button>
            {openIdx === i && (
              <div className="px-lg pb-lg text-body text-foreground-secondary leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────

export function CTABanner() {
  return (
    <section className="py-3xl">
      <div className="rounded-panel bg-brand text-white p-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/20 to-transparent" />
        <div className="relative z-10 space-y-lg">
          <h2 className="text-heading">
            Siap Menemukan Destinasi Impianmu?
          </h2>
          <p className="text-body opacity-90 max-w-xl mx-auto">
            Mari Kenali & Eksplorasi — temukan tempat terbaik yang sudah dinilai oleh ribuan pengunjung sebelumnya.
          </p>
          <Button href="/wisata" size="lg" className="bg-white text-brand hover:bg-cream border-none">
            Mulai Jelajahi →
          </Button>
        </div>
      </div>
    </section>
  );
}
