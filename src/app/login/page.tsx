"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "register") setMode("register");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!username.trim()) {
          setError("Username wajib diisi");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password minimal 6 karakter");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Registrasi gagal");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === "login" ? "Email atau password salah" : "Gagal login setelah registrasi");
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-title text-foreground text-center mb-2">
          {mode === "login" ? "Masuk ke Kemari" : "Daftar Akun"}
        </h1>
        <p className="text-caption text-foreground-secondary text-center mb-lg">
          {mode === "login"
            ? "Login untuk mengirim ulasan dan melihat profil"
            : "Buat akun untuk mulai berbagi pengalaman wisata"}
        </p>

        {error && (
          <div className="mb-md p-3 rounded-button bg-negative/10 border border-negative/20 text-label text-negative text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          {mode === "register" && (
            <div>
              <label className="text-caption text-foreground-secondary block mb-1">Username</label>
              <Input
                value={username}
                onChange={setUsername}
                placeholder="Username kamu"
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="text-caption text-foreground-secondary block mb-1">Email</label>
            <Input
              value={email}
              onChange={setEmail}
              placeholder="nama@email.com"
              type="email"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-caption text-foreground-secondary block mb-1">Password</label>
            <Input
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              type="password"
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <div className="mt-lg">
          <div className="relative mb-md">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-caption">
              <span className="bg-surface px-4 text-foreground-secondary">atau lanjutkan dengan</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
        </div>

        <p className="text-caption text-foreground-secondary text-center mt-lg">
          {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-accent hover:underline font-medium"
          >
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </Card>
    </div>
  );
}
