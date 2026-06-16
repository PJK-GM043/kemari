"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface HeroCarouselProps {
  images: string[];
  nama: string;
}

export function HeroCarousel({ images, nama }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [fullIndex, setFullIndex] = useState<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [images.length, next]);

  if (images.length === 1) {
    return (
      <div className="relative w-full rounded-hero overflow-hidden bg-surface-elevated max-h-[420px] aspect-[16/9]">
        <div className="aspect-[16/9] relative">
          <Image src={images[0]} alt={nama} fill className="object-cover" sizes="100vw" priority />
        </div>
      </div>
    );
  }

  const getIndex = (offset: number) => (current + offset + images.length) % images.length;
  const prevIdx = getIndex(-1);
  const nextIdx = getIndex(1);

  return (
    <>
      <div className="relative w-full rounded-hero overflow-hidden bg-surface-elevated max-h-[420px] aspect-[16/9]">
        <div className="flex h-full">
          <button
            onClick={() => setCurrent(prevIdx)}
            className="w-[18%] relative group"
          >
            <Image src={images[prevIdx]} alt="" fill className="object-cover brightness-50 group-hover:brightness-75 transition-all" sizes="20vw" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ‹
              </span>
            </div>
          </button>

          <div className="flex-1 min-w-0 relative">
            <Image src={images[current]} alt={`${nama} ${current + 1}`} fill className="object-cover" sizes="70vw" priority />

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white hidden sm:flex items-center justify-center hover:bg-black/50 transition-colors text-xl"
            >
              ›
            </button>
            <button
              onClick={() => setCurrent(prevIdx)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white hidden sm:flex items-center justify-center hover:bg-black/50 transition-colors text-xl"
            >
              ‹
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
              className="absolute bottom-3 right-3 h-8 px-3 rounded-full bg-black/30 text-white text-caption hover:bg-black/50 transition-colors"
            >
              Lihat semua ({images.length})
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "bg-white w-5" : "bg-white/40 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrent(nextIdx)}
            className="w-[18%] relative group"
          >
            <Image src={images[nextIdx]} alt="" fill className="object-cover brightness-50 group-hover:brightness-75 transition-all" sizes="20vw" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ›
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Fullscreen popup */}
      {showAll && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col" onClick={() => setShowAll(false)}>
          <div className="flex items-center justify-between p-lg shrink-0">
            <span className="text-white text-label">{nama} — {images.length} foto</span>
            <button
              onClick={() => setShowAll(false)}
              className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-lg" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setFullIndex(i)}
                  className="aspect-[4/3] rounded-lg overflow-hidden relative bg-border/20 hover:ring-2 hover:ring-accent transition-all"
                >
                  <Image src={url} alt={`${nama} ${i + 1}`} fill className="object-cover" sizes="33vw" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single full image overlay */}
      {fullIndex !== null && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center" onClick={() => setFullIndex(null)}>
          <button
            onClick={() => setFullIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-sm z-10"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setFullIndex((fullIndex - 1 + images.length) % images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-2xl"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setFullIndex((fullIndex + 1) % images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-2xl"
              >
                ›
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-5xl max-h-[90vh] m-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[fullIndex]}
              alt={`${nama} ${fullIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-caption">
            {fullIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
