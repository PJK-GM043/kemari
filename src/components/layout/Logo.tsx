"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  logoUrl?: string | null;
}

export function Logo({ size = "md", className = "", logoUrl: initialUrl }: LogoProps) {
  const [fetchedUrl, setFetchedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) return;
    fetch("/api/logo")
      .then((r) => r.json())
      .then((d) => { if (d.url) setFetchedUrl(d.url); })
      .catch(() => {});
  }, [initialUrl]);

  const logoUrl = initialUrl ?? fetchedUrl;

  const sizeMap: Record<string, string> = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt="Kemari"
        width={size === "sm" ? 24 : size === "lg" ? 40 : 32}
        height={size === "sm" ? 24 : size === "lg" ? 40 : 32}
        className={`${sizeMap[size]} w-auto ${className}`}
      />
    );
  }

  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-foreground">Kema</span>
      <span className="text-brand">ri</span>
    </span>
  );
}
