# Dokumentasi Fix Wave Button & Home Transition

## Fokus Revisi
Revisi ini hanya fokus pada 2 task yang diminta:

1. Memperbaiki bug animasi hover button yang sebelumnya hanya terlihat mengisi sisi kiri/kanan.
2. Membuat animasi slide transition juga berlaku saat masuk/kembali ke Home dari prefix route lain.

## 1. Fix Button Liquid / Wave Hover

### Masalah Sebelumnya
Animasi fill lama memakai satu elemen oval besar yang digeser dari bawah. Pada tombol berbentuk pill yang lebar, bentuk oval itu bisa meninggalkan area kosong di bagian tengah atau sisi tertentu sehingga terlihat seperti bug.

### Perbaikan
File yang diubah:

- `src/hooks/useGsapLiquidButtons.ts`
- `src/index.css`

Implementasi baru memakai 2 layer:

- `gsap-liquid-fill`: badan cairan solid yang mengisi tombol penuh dari bawah.
- `gsap-liquid-wave`: kepala gelombang yang berputar memakai GSAP.

Hasilnya:

- Tombol orange saat hover berubah menjadi putih.
- Tombol putih/transparan saat hover berubah menjadi hitam.
- Tombol hitam/plus product tetap memakai liquid fill yang sesuai.
- Bentuk tombol tetap mengikuti desain project, tidak berubah menjadi lingkaran.
- Animasi lebih cepat dan lebih responsif.

## 2. Fix Slide Transition ke Home

### Masalah Sebelumnya
Saat pindah dari route seperti `/digitalproduct` atau `/websitedetails` ke Home/hash section, transisi tidak selalu memakai slider. Efeknya terasa seperti konten lama hilang dulu baru konten baru muncul.

### Perbaikan
File yang diubah:

- `src/App.tsx`

Perubahan utama:

- Menambahkan `pendingHashRef` untuk menyimpan target hash seperti `#home`, `#digital`, `#faq`, dan `#footer`.
- Saat route kembali ke `/`, slider overlay tetap berjalan dulu.
- Setelah konten Home selesai masuk, Lenis baru scroll ke section target.

Hasilnya:

- `/digitalproduct` → Home berjalan pakai slider.
- `/websitedetails` → Home berjalan pakai slider.
- Home section seperti `#digital`, `#faq`, dan `#footer` tetap bisa discroll smooth setelah route masuk.

## Testing
Sudah dites dengan command:

```bash
npm run lint
npm run build
```

Hasil:

- TypeScript aman.
- Build production berhasil.
- Tidak ada error merah dari proses build.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Catatan
Tidak ada perubahan desain layout utama. Revisi hanya menyentuh sistem animasi button dan route transition.
