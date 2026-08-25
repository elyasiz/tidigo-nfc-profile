# TIDIGO NFC Profile

Website MVP untuk Workshop TIDIGO Sesi 4 — NFC Tag. Coach dapat membuat profil anak dengan data minimum yang aman, menghasilkan tautan publik acak, menampilkan QR code, dan menulis tautan tersebut ke NFC tag.

## Fitur

- Dashboard profil murid
- Form dengan preview langsung
- Pilihan ikon dan tema warna
- Tautan publik unik dan QR code
- Aktifkan/nonaktifkan serta reset link
- Halaman profil mobile-first dengan `noindex`
- Penyimpanan profil sementara untuk keperluan demo

## Demo

Tautan demo tersedia melalui deployment Vercel pada bagian **Deployments** repositori GitHub.

> Demo dapat dibuka tanpa login ChatGPT. Data profil baru disimpan sementara dan dapat kembali ke data contoh ketika layanan dimulai ulang. Untuk penggunaan nyata, hubungkan database permanen, tambahkan autentikasi coach, dan tinjau kebijakan persetujuan orang tua/wali.

## Menjalankan secara lokal

Gunakan Node.js 22 dan pnpm, lalu jalankan:

```bash
pnpm install
pnpm dev
```

Build produksi:

```bash
pnpm build
```

