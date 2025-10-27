# 🎂 Website Ulang Tahun Shara

Website ucapan ulang tahun interaktif yang dibuat dengan cinta oleh Naufal untuk Shara.

## ✨ Fitur

- **Login Sederhana**: Username: `shara`, Password: `28-10-2004`
- **Tema Light/Dark**: Toggle tema yang tersimpan di localStorage
- **Confetti Animation**: Efek perayaan saat login dan tombol rayakan
- **Musik Latar**: Kontrol play/pause, volume, dan durasi
- **Countdown WIB**: Hitung mundur ke 28 Oktober 00:00 WIB
- **Galeri Foto**: Grid responsif dengan modal/lightbox dan slideshow otomatis
- **Timeline Kenangan**: Scroll reveal animation untuk momen-momen spesial
- **Love Letter**: Efek typewriter dengan tombol restart
- **Kuis Mini**: 3 pertanyaan dengan hasil lucu
- **Wish Board**: Tambah dan hapus pesan yang tersimpan di localStorage

## 🚀 Cara Menggunakan

1. Buka file `indeks.html` di browser
2. Login dengan:
   - Username: `shara`
   - Password: `28-10-2004`
3. Nikmati semua fitur!

## 📁 Struktur File

```
coding-bucin/
├── indeks.html          # Struktur HTML utama
├── style.css            # Styling profesional dengan tema light/dark
├── script.js            # Logika interaksi dan animasi
├── README.md            # Dokumentasi ini
└── assets/
    ├── audio/
    │   └── backsound.mp3    # Letakkan file musik di sini
    └── photos/
        ├── photo1.jpg       # Foto 1
        ├── photo2.jpg       # Foto 2
        ├── ...
        └── photo8.jpg       # Foto 8
```

## 📸 Menambahkan Foto & Musik

### Foto
1. Siapkan 8 foto dengan nama `photo1.jpg` hingga `photo8.jpg`
2. Letakkan di folder `assets/photos/`
3. Jika foto tidak ada, akan muncul placeholder SVG otomatis

### Musik
1. Siapkan file musik dengan nama `backsound.mp3`
2. Letakkan di folder `assets/audio/`
3. Format yang didukung: MP3, WAV, OGG

## 🎨 Kustomisasi

### Mengubah Data Quiz
Edit file `script.js` bagian:
```javascript
const answers = { q1: 'b', q2: 'c', q3: 'a' };
```

### Mengubah Timeline/Kenangan
Edit file `script.js` bagian:
```javascript
const memories = [
  { date: '2023-11-05', text: 'Pertama kali nonton bareng 🍿' },
  // tambah atau edit di sini
];
```

### Mengubah Love Letter
Edit file `script.js` bagian:
```javascript
const letter = `Shara sayang,
...
`;
```

## 🌐 Browser Support

- Chrome/Edge (versi terbaru)
- Firefox (versi terbaru)
- Safari (versi terbaru)
- Mobile browsers

## 💡 Tips

- Untuk pengalaman terbaik, gunakan browser modern
- Izinkan autoplay audio jika diminta browser
- Semua data (wish board, tema) tersimpan di localStorage browser
- Tidak perlu koneksi internet setelah font Google dimuat

## 🔒 Keamanan

- Login hanya validasi sisi klien (cocok untuk proyek personal)
- Data tidak dikirim ke server manapun
- Semua data tersimpan lokal di browser

## ❤️ Dibuat Dengan

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Poppins)
- Canvas API untuk confetti
- IntersectionObserver untuk scroll reveal

---

**Made with ❤️ by Naufal for Shara**
