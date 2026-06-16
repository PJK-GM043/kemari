"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import type { SuggestionDTO } from "@/types";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/wisata/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [query]);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-[1280px] flex items-center justify-between h-16 px-lg">
        <Link href="/" className="shrink-0 text-title">
          <Logo />
        </Link>

        <div className="flex items-center gap-lg">
          <Link href="/wisata" className="text-label text-foreground-secondary hover:text-foreground transition-colors hidden sm:block">
            Destinasi
          </Link>

          <div className="relative w-40 sm:w-56">
            <Input
              value={query}
              onChange={setQuery}
              placeholder="Cari..."
              className="h-10 w-full text-label"
            />
            {open && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-card shadow-level4 overflow-hidden">
                {suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/wisata/${s.slug}`}
                    onClick={() => { setQuery(""); setOpen(false); }}
                    className="block px-4 py-3 text-label hover:bg-surface-elevated transition-colors border-b border-border last:border-b-0"
                  >
                    <span className="text-foreground">{s.nama}</span>
                    <span className="text-foreground-secondary ml-2 text-caption">{s.kota}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm hover:bg-surface-elevated transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-label text-foreground hover:opacity-80 transition-opacity"
              >
                <span className="hidden sm:inline">{session.user?.name}</span>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-caption font-bold text-accent">
                  {(session.user?.name || "U")[0].toUpperCase()}
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-card shadow-level4 overflow-hidden min-w-[160px]">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-label hover:bg-surface-elevated transition-colors border-b border-border"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full text-left px-4 py-3 text-label text-negative hover:bg-surface-elevated transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Masuk
              </Button>
              <Button href="/login?mode=register" size="sm">
                Daftar
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
