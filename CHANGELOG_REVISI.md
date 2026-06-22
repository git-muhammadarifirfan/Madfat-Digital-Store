# Changelog Revisi

## Fixed

- Memperbaiki TypeScript error di `DigitalCatalog.tsx`.
- Memperbaiki konfigurasi `vite.config.ts` yang merah.
- Memperbaiki type LCP di `usePerformanceMonitoring.ts`.
- Memperbaiki typing React dengan menambahkan `@types/react` dan `@types/react-dom`.
- Mengurangi flicker route karena Lenis tidak lagi dihancurkan/dibuat ulang setiap pindah page.

## Added

- `LiquidButton.tsx` untuk reusable GSAP liquid hover.
- Animasi slider page transition di route prefix.
- GSAP pop-in untuk `/digitalproduct` dan `/websitedetails`.
- CSS utilitas `.gsap-liquid`, `.gsap-pop-item`, `.gsap-page-pop`, dan `.page-slider-overlay`.

## Improved

- Button putih sekarang hover ke hitam/obsidian.
- Button orange hover lebih clean ke putih.
- Product logo memakai `object-contain` agar tidak kepotong.
- Product logo memakai `OptimizedImage` agar lazy-load dan decode async.
