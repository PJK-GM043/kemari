"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-background text-foreground font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-lg">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-heading text-foreground">Terjadi Kesalahan</h1>
          <p className="text-body text-foreground-secondary text-center max-w-md">
            {error.message || "Aplikasi mengalami kendala. Silakan coba lagi."}
          </p>
          <button
            onClick={reset}
            className="h-10 px-6 rounded-button bg-foreground text-background text-label font-medium hover:opacity-90 transition-all"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
