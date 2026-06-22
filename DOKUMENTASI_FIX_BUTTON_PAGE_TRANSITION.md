# Dokumentasi Fix Button Liquid + Page Transition

## Scope Revisi
Revisi ini fokus pada 2 masalah utama:

1. **Bug hover button liquid**
   - Button orange harus berubah menjadi putih saat hover.
   - Button putih/transparan harus berubah menjadi hitam saat hover.
   - Efek hover dibuat seperti cairan/air naik dan bergoyang.
   - Implementasi menggunakan GSAP, bukan pseudo-element CSS lama yang menyebabkan efek hitam/putih nyangkut di bawah button.

2. **Bug animasi pindah page**
   - Sebelumnya page terlihat muncul lalu hilang lagi.
   - Sekarang transisi route ditutup dulu dengan slider overlay, konten page diganti saat layar tertutup, lalu konten baru muncul dengan pop-in smooth.
   - Pop-in subpage memakai `useLayoutEffect` agar tidak ada flash tampil → hilang → tampil.

---

## File yang Diubah

### 1. `src/hooks/useGsapLiquidButtons.ts`
File baru untuk mengatur semua hover `.btn-liquid`.

Fungsi utama:
- Scan semua elemen `.btn-liquid`.
- Inject layer `.gsap-liquid-fill` ke dalam button.
- Jalankan GSAP saat `mouseenter` dan `mouseleave`.
- Warna otomatis mengikuti class:
  - `.btn-liquid-orange` → fill putih.
  - `.btn-liquid-white` pada button putih/transparan → fill hitam.
  - `.btn-liquid-white` pada button hitam/icon product → fill putih.
  - `.btn-liquid-obsidian` → fill putih.

### 2. `src/index.css`
Perubahan utama:
- Menghapus logic `::before` liquid lama.
- Menambahkan CSS baru untuk `.gsap-liquid-fill`.
- Menambahkan `.page-slider-overlay` untuk animasi slider perpindahan page.

### 3. `src/App.tsx`
Perubahan utama:
- Menambahkan route transition GSAP.
- Menambahkan overlay slider fixed.
- Menambahkan pop-in GSAP untuk subpage `/digitalproduct` dan `/websitedetails`.
- Memastikan scroll selalu reset ke atas saat pindah page.

### 4. `src/components/DigitalProductPage.tsx`
Perubahan utama:
- Menambahkan class target animasi:
  - `.page-pop-target`
  - `.subpage-filter-button`
  - `.subpage-card`

### 5. `src/components/WebsiteDetailsPage.tsx`
Perubahan utama:
- Menambahkan class target animasi:
  - `.page-pop-target`
  - `.subpage-card`

### 6. TypeScript/Vite cleanup
Perbaikan error merah:
- `DigitalCatalogProps` typo.
- `vite.config.ts` plugin React dan minify typing.
- `import.meta.env` type.
- `PerformanceEntry` type.
- Menambahkan `@types/react` dan `@types/react-dom`.

---

## Testing
Command yang sudah dijalankan:

```bash
npm run lint
npm run build
```

Hasil:
- TypeScript check: berhasil.
- Production build: berhasil.

---

## Catatan Implementasi

Untuk menerapkan efek liquid ke button baru, cukup tambahkan class:

```tsx
className="btn-liquid btn-liquid-orange"
```

atau:

```tsx
className="btn-liquid btn-liquid-white"
```

Tidak perlu menambahkan span manual karena hook akan otomatis membuat layer liquid di runtime.
