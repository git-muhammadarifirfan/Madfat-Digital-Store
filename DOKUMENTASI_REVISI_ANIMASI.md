# Dokumentasi Revisi Animasi & Bugfix Madfat Digital Store

## Ringkasan Pengerjaan

Revisi ini fokus pada 4 area utama:

1. Memperbaiki hover button besar seperti **MULAI ORDER**, **LIHAT KATALOG**, **HUBUNGI ADMIN**, **LIHAT SEMUA**, dan tombol CTA besar lain agar animasinya lebih halus seperti efek air terisi.
2. Memperbaiki bug perpindahan page **Akun Digital** dan **Jasa Website** yang sebelumnya terlihat seperti tampil → hilang → tampil ulang.
3. Menambahkan animasi perpindahan page berbentuk **slider doodle/cartoon** yang smooth dan sesuai tema website.
4. Membersihkan error TypeScript/Vite yang menyebabkan kode terlihat merah atau gagal lint.

## Perubahan Utama

### 1. Liquid Hover Button

File utama:

- `src/index.css`

Yang diubah:

- Class `.btn-liquid` dibuat ulang supaya efek air naik dari bawah lebih stabil.
- Pseudo-element `::before` dan `::after` dipakai sebagai layer gelombang cairan.
- Ditambahkan `isolation: isolate`, `z-index`, dan `will-change` supaya animasi tidak menabrak teks/icon di dalam tombol.
- Warna hover tetap mengikuti varian tombol:
  - `.btn-liquid-orange`
  - `.btn-liquid-white`
  - `.btn-liquid-obsidian`
  - `.btn-liquid-transparent`

Catatan:

- Tidak perlu dependency tambahan karena GSAP dan CSS yang sudah ada sudah cukup.
- Tampilan utama tombol tidak diubah, hanya behavior hover-nya yang dibuat lebih rapi.

### 2. Page Transition Slider

File utama:

- `src/App.tsx`
- `src/index.css`

Yang ditambahkan:

- Elemen transition global:
  - `.route-slider`
- Animasi:
  - `route-slider-swipe`
  - `route-slider-label`
  - `route-content-pop`

Efeknya:

- Saat pindah page, ada slider warna orange/peach/cream yang lewat secara cepat.
- Label `MADFAT` muncul singkat agar tetap sesuai tema kartun/doodle.
- Konten page masuk dengan pop-in sederhana, bukan flicker.

### 3. Fix Flicker di Page Akun Digital & Jasa Website

File utama:

- `src/App.tsx`
- `src/components/DigitalProductPage.tsx`
- `src/components/WebsiteDetailsPage.tsx`

Yang diubah:

- `Navbar`, `DigitalProductPage`, dan `WebsiteDetailsPage` di-load langsung, bukan lazy chunk, agar saat klik menu tidak sempat blank/hilang.
- Konten route dibungkus dengan `main` ber-key `currentPath` supaya animasi page berjalan konsisten.
- Page Akun Digital dan Jasa Website diberi class:
  - `.subpage-page`
  - `.subpage-pop-item`
  - `.subpage-pop-card`
- Card produk dan card paket website diberi stagger delay kecil agar pop-in terasa smooth.

### 4. Fix Error TypeScript dan Vite

File yang diperbaiki:

- `src/components/DigitalCatalog.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/OptimizedImage.tsx`
- `src/hooks/usePerformanceMonitoring.ts`
- `src/custom.d.ts`
- `vite.config.ts`

Detail fix:

- Mengganti tipe props salah `DoodleStarProps` menjadi `DigitalCatalogProps`.
- Mengubah `FAQAccordionItem` menjadi `React.FC` agar prop `key` tidak dianggap error.
- Menambahkan `className?: string` pada `OptimizedImageProps`.
- Mengetik ulang akses LCP `renderTime/loadTime` agar tidak merah di TypeScript.
- Menambahkan tipe `ImportMetaEnv` di `custom.d.ts`.
- Membersihkan konfigurasi Vite:
  - Menghapus opsi `fastRefresh` yang sudah tidak valid di plugin React versi sekarang.
  - Memastikan `build.minify` terbaca sebagai opsi valid.

## Cara Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Cek TypeScript/lint:

```bash
npm run lint
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Hasil Validasi

Sudah dites dengan command berikut:

```bash
npm run lint
npm run build
```

Hasil:

- TypeScript compile: **berhasil**
- Production build Vite: **berhasil**
- Tidak ada error merah dari file yang diperbaiki

## Catatan Implementasi

- Desain visual utama tetap dipertahankan.
- Animasi baru fokus pada hover tombol besar dan perpindahan page.
- Dependency baru tidak ditambahkan supaya project tetap ringan.
- Folder `dist/` sudah ikut diperbarui dari hasil build terbaru.
