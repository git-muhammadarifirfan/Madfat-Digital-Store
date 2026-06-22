# Dokumentasi Revisi GSAP Animasi & Routing

## Ringkasan Perubahan

Revisi ini fokus memperbaiki animasi button, transisi halaman, pop-in konten page selain homepage, dan error TypeScript/build tanpa mengubah struktur visual utama website.

## 1. Liquid Hover Button Berbasis GSAP

File baru:

- `src/components/LiquidButton.tsx`

Fungsi:

- Membuat efek hover seperti air/liquid mengisi button dari bawah.
- Efek dijalankan dengan GSAP, bukan hanya CSS `:hover`.
- Ada animasi scale ringan, fill naik dari bawah, dan wave bergerak halus.
- Bisa dipakai untuk `<button>` maupun `<a>`.

Button yang sudah diubah memakai `LiquidButton`:

- Hero: `LIHAT KATALOG`, `HUBUNGI ADMIN`
- Navbar: `MULAI ORDER`
- Mobile menu: `LIHAT KERANJANG`, `MULAI ORDER VIA WHATSAPP`
- Katalog produk: tombol plus desktop dan mobile
- Katalog produk: `LIHAT SEMUA`, `HUBUNGI ADMIN BISNIS`
- Page akun digital: filter kategori dan tombol plus
- Section jasa website: `PILIH PAKET`, `LIHAT LEBIH DETAIL`
- Page detail website: semua tombol paket
- Cart: `Mulai Belanja`, `KIRIM VIA WHATSAPP`
- CTA bawah: `ORDER VIA WHATSAPP`

## 2. Hover Button Putih Jadi Hitam/Obsidian

Sesuai request, button yang base warna putih sekarang memakai liquid fill hitam/obsidian saat hover.

Contoh konfigurasi:

```tsx
<LiquidButton
  fillColor="#1C1E1C"
  hoverTextColor="#FFFFFF"
  className="bg-white text-obsidian ..."
>
  HUBUNGI ADMIN
</LiquidButton>
```

## 3. Animasi Perpindahan Page Slider

File utama:

- `src/App.tsx`
- `src/index.css`

Perubahan:

- Menambahkan overlay `page-slider-overlay`.
- Saat pindah route `/digitalproduct` atau `/websitedetails`, overlay orange bergaya doodle/cartoon slide dari kiri, menutup layar sebentar, lalu show up ke halaman baru.
- Transisi smooth memakai GSAP timeline.
- Mengurangi bug page yang sebelumnya terlihat `tampil -> ilang -> tampil`.

## 4. GSAP Pop-in untuk Page Prefix Selain `/`

Diterapkan ke:

- `/digitalproduct`
- `/websitedetails`

Class baru:

- `.gsap-page-pop`
- `.gsap-pop-item`

Efek:

- Konten masuk dengan opacity, translateY, scale, dan sedikit rotate.
- Easing menggunakan `back.out(1.65)` agar tetap cocok dengan tema kartun/doodle.

## 5. Logo Produk Lebih Rapi, HD, dan Ringan

Perubahan render logo:

- Logo produk ditampilkan memakai `OptimizedImage`.
- `loading="lazy"` dan `decoding="async"` tetap aktif.
- Tampilan logo diganti dari `object-cover` menjadi `object-contain`, sehingga logo real produk tidak kepotong.
- Background logo dibuat putih agar logo brand terlihat jelas dan konsisten.

File yang diubah:

- `src/components/DigitalCatalog.tsx`
- `src/components/DigitalProductPage.tsx`

## 6. Error TypeScript dan Build Diperbaiki

Perbaikan utama:

- `DigitalCatalogProps` yang sebelumnya typo menjadi `DoodleStarProps` sudah diperbaiki.
- `vite.config.ts` disesuaikan agar valid untuk Vite versi saat ini.
- `usePerformanceMonitoring.ts` diperbaiki agar properti LCP tidak merah di TypeScript.
- Menambahkan `@types/react` dan `@types/react-dom` ke devDependencies.
- `LiquidButton` dibuat reusable dan type-safe.

## 7. Hasil Testing

Command yang sudah dijalankan:

```bash
npm run lint
npm run build
```

Hasil:

- `npm run lint` berhasil tanpa error.
- `npm run build` berhasil tanpa error.

## Cara Menjalankan Project

```bash
npm install
npm run dev
```

Buka URL yang muncul dari Vite, biasanya:

```bash
http://localhost:3000
```

## Cara Build Production

```bash
npm run build
```

Output production ada di folder:

```bash
dist/
```

## Catatan Penting

- Tampilan utama tetap dipertahankan.
- Dependency animasi utama tetap GSAP sesuai request.
- Tidak menambah dependency berat untuk hover button.
- Animasi page transition dibuat global dari `App.tsx`, jadi semua route prefix mudah dikembangkan lagi.
