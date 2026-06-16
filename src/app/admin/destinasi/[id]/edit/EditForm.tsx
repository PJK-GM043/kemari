"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface EditFormProps {
  tempat: {
    id: number;
    nama: string;
    imageUrl: string | null;
    description: string | null;
    kota: { nama: string };
    statistik: { totalUlasan: number } | null;
  };
  initialGaleri: Array<{ id: number; imageUrl: string; order: number }>;
}

export function EditForm({ tempat, initialGaleri }: EditFormProps) {
  const [description, setDescription] = useState(tempat.description || "");
  const [galeri, setGaleri] = useState(initialGaleri);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadErr, setUploadErr] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadErr("");
    setUploading(true);

    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setUploadErr("Hanya file JPG dan PNG");
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        setUploadErr("Maksimal 2MB per file");
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/admin/tempat/${tempat.id}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setGaleri((prev) => [...prev, { id: Date.now(), imageUrl: data.url, order: prev.length }]);
          setMessage("Foto berhasil diupload");
        } else {
          setUploadErr(data.message || "Upload gagal");
        }
      } catch {
        setUploadErr("Gagal upload");
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(imageId: number, imageUrl: string) {
    setGaleri((prev) => prev.filter((g) => g.id !== imageId));

    try {
      await fetch(`/api/admin/tempat/${tempat.id}/galeri`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
    } catch {
      // silent
    }
  }

  async function handleSaveDesc() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/tempat/${tempat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deskripsi: description }),
      });

      const data = await res.json();
      setMessage(res.ok ? "Deskripsi berhasil disimpan" : data.message || "Gagal menyimpan");
    } catch {
      setMessage("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card>
        <h2 className="text-label font-semibold text-foreground mb-md">Info Destinasi</h2>
        <div className="space-y-sm text-body">
          <p><span className="text-foreground-secondary">Nama:</span> <span className="text-foreground">{tempat.nama}</span></p>
          <p><span className="text-foreground-secondary">Kota:</span> <span className="text-foreground">{tempat.kota.nama}</span></p>
          <p><span className="text-foreground-secondary">Total Ulasan:</span> <span className="text-foreground">{tempat.statistik?.totalUlasan?.toLocaleString("id-ID") ?? 0}</span></p>
        </div>
      </Card>

      <Card>
        <h2 className="text-label font-semibold text-foreground mb-md">
          Galeri Foto ({galeri.length})
        </h2>

        {galeri.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md mb-md">
            {galeri.map((g) => (
              <div key={g.id} className="relative group">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-border/20 relative">
                  <Image src={g.imageUrl} alt="" fill className="object-cover" sizes="33vw" />
                </div>
                <button
                  onClick={() => handleDelete(g.id, g.imageUrl)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-negative text-white text-caption flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-lg bg-border/20 flex items-center justify-center text-foreground-secondary text-caption mb-md">
            Belum ada foto
          </div>
        )}

        {uploadErr && <p className="text-negative text-caption mb-sm">{uploadErr}</p>}
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="text-caption text-foreground-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-button file:border file:border-border file:text-caption file:bg-surface file:text-foreground hover:file:bg-surface-elevated"
        />
        {uploading && <p className="text-caption text-foreground-secondary mt-2">Mengupload...</p>}
      </Card>

      <Card>
        <h2 className="text-label font-semibold text-foreground mb-md">Deskripsi</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          placeholder="Tulis deskripsi destinasi wisata ini..."
          rows={5}
          maxLength={500}
          className="w-full rounded-button border border-border bg-surface px-4 py-3 text-body text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
        />
        <div className="flex items-center justify-between mt-sm">
          <p className="text-caption text-foreground-secondary">{description.length}/500 karakter</p>
          <Button onClick={handleSaveDesc} disabled={saving} size="sm">
            {saving ? "Menyimpan..." : "Simpan Deskripsi"}
          </Button>
        </div>
      </Card>

      {message && (
        <p className="text-label text-positive mt-md text-center">{message}</p>
      )}
    </>
  );
}
