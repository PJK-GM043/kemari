import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const KOTA_ALAMAT: Record<string, string> = {
  "Kabupaten Badung": "Jl. Raya Uluwatu, Kec. Kuta Selatan, Kabupaten Badung, Bali",
  "Kabupaten Bandung Barat": "Jl. Raya Lembang, Kec. Lembang, Kabupaten Bandung Barat, Jawa Barat",
  "Kabupaten Sleman": "Jl. Kaliurang, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta",
  "Kabupaten Pacitan": "Jl. Pantai Klayar, Kec. Donorojo, Kabupaten Pacitan, Jawa Timur",
  "Kabupaten Wonosobo": "Jl. Dieng, Kec. Kejajar, Kabupaten Wonosobo, Jawa Tengah",
};

function genDescription(nama: string, kota: string, kategori: string, stats: any, source: { gm: number; tt: number }): string {
  const totalUlasan = stats.totalUlasan;
  const skor = stats.skor.toFixed(1);
  const hash = nama.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jamBuka = 6 + (hash % 6);
  const jamTutup = 16 + (hash % 7);
  const durasi = 1 + (hash % 5);

  const aspects = [
    { label: "Fasilitas", skor: stats.skorFasilitas },
    { label: "Kebersihan", skor: stats.skorKebersihan },
    { label: "Harga Tiket", skor: stats.skorHarga },
    { label: "Akses", skor: stats.skorAksesibilitas },
    { label: "Pelayanan", skor: stats.skorPelayanan },
  ].sort((a, b) => b.skor - a.skor);

  const best = aspects[0];
  const worst = aspects[aspects.length - 1];
  const sumber = source.gm > source.tt ? "Google Maps" : "TikTok";

  return [
    `${nama} adalah destinasi wisata kategori ${kategori} yang terletak di ${kota}. Dengan skor ${skor}/5 dari ${totalUlasan.toLocaleString("id-ID")} ulasan di ${sumber}, tempat ini menjadi salah satu tujuan favorit di wilayahnya.`,
    "",
    `${best.label} menjadi nilai tertinggi (${best.skor.toFixed(1)}/5), sementara ${worst.label.toLowerCase()} masih bisa ditingkatkan (${worst.skor.toFixed(1)}/5).`,
    "",
    `📍 Alamat: ${KOTA_ALAMAT[kota] || kota}`,
    `🕐 Jam buka: ${String(jamBuka).padStart(2, "0")}.00–${String(jamTutup).padStart(2, "0")}.00`,
    `⏱️ Rekomendasi durasi: ${durasi}–${durasi + 2} jam`,
    `🏷️ Kategori: ${kategori}`,
    `👥 Cocok untuk: Keluarga, Pasangan, Solo traveler`,
  ].join("\n");
}

async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

  const tempat = await (p.masterTempat as any).findMany({
    include: { statistik: true, kota: true },
  });

  for (const t of tempat) {
    const stats = t.statistik;
    if (!stats) continue;

    const description = genDescription(
      t.nama,
      t.kota.nama,
      t.kategori || "Wisata Alam",
      stats,
      { gm: stats.totalGoogleMaps, tt: stats.totalTiktok }
    );

    await p.masterTempat.update({
      where: { id: t.id },
      data: { description },
    });

    console.log(`  ✓ ${t.nama}`);
  }

  await p.$disconnect();
  console.log(`\nDone — ${tempat.length} descriptions updated`);
}

main();
