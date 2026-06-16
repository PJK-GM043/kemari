import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { resolve } from "path";

export interface RawReviewRecord {
  review_id: string;
  username: string;
  nama_tempat: string;
  kota: string;
  tanggal: string;
  ulasan: string;
  ulasan_translated: string;
  rating: string;
  sumber: string;
  ulasan_final: string;
  label_fasilitas: string;
  label_kebersihan: string;
  label_harga: string;
  label_aksesibilitas: string;
  label_pelayanan: string;
  label_aspek: string;
  label_sentimen: string;
}

export function readCSV(filePath: string): RawReviewRecord[] {
  const fullPath = resolve(filePath);
  const content = readFileSync(fullPath, "utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  return records as RawReviewRecord[];
}
