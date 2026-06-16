import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Kemari — Mari Kenali & Eksplorasi",
  description: "Platform ulasan wisata berbasis AI. Temukan destinasi terbaik dari pengalaman nyata pengunjung.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`min-h-screen bg-background text-foreground antialiased ${dmSans.variable} font-[family-name:var(--font-dm-sans)]`}>
        <ThemeProvider>
          <SessionProvider>
            <Navbar />
            <main className="mx-auto max-w-[1280px] px-lg py-xl">
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
