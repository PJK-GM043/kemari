"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function AdminPengaturanPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/pengaturan?key=logo_url");
        const data = await res.json();
        if (data.value) {
          setLogoUrl(data.value);
          setPreview(data.value);
        }
      } catch {}
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "logo_url", value: logoUrl }),
      });

      if (res.ok) {
        setMessage("Logo berhasil disimpan. Refresh halaman untuk melihat perubahan.");
        setPreview(logoUrl);
      } else {
        setMessage("Gagal menyimpan");
      }
    } catch {
      setMessage("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/tempat/1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setLogoUrl(data.url);
        setPreview(data.url);
        setMessage("Logo diupload ke Cloudinary. Klik Simpan untuk menyimpan.");
      }
    } catch {
      setMessage("Upload gagal");
    }
  }

  return (
    <div>
      <h1 className="text-title text-foreground mb-lg">Pengaturan Website</h1>

      <Card className="max-w-xl">
        <h2 className="text-label font-semibold text-foreground mb-md">Logo Website</h2>

        {preview && (
          <div className="mb-md p-lg bg-surface-elevated rounded-lg flex items-center justify-center">
            <Image src={preview} alt="Logo Preview" width={120} height={40} className="h-10 w-auto object-contain" />
          </div>
        )}

        <div className="space-y-md">
          <div>
            <label className="text-caption text-foreground-secondary block mb-1">URL Logo</label>
            <Input
              value={logoUrl}
              onChange={setLogoUrl}
              placeholder="https://res.cloudinary.com/.../logo.png"
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-md">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleUpload}
              className="text-caption text-foreground-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-button file:border file:border-border file:text-caption file:bg-surface file:text-foreground hover:file:bg-surface-elevated"
            />
            <Button onClick={handleSave} disabled={saving || !logoUrl} size="sm">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>

        {message && (
          <p className="text-label text-positive mt-md">{message}</p>
        )}
      </Card>
    </div>
  );
}
