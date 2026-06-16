"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-3xl text-center">
      <div className="text-5xl mb-lg">😕</div>
      <h2 className="text-title text-foreground mb-sm">Gagal memuat halaman</h2>
      <p className="text-label text-foreground-secondary mb-lg max-w-md">
        {error.message || "Terjadi kesalahan saat mengambil data."}
      </p>
      <button
        onClick={reset}
        className="h-10 px-5 rounded-button bg-foreground text-background text-label font-medium hover:opacity-90 transition-all"
      >
        Coba lagi
      </button>
    </div>
  );
}
