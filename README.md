# Portal Kampus Fiktif · SIAKAD POLINELA (Praktikum M5 KSI)
**Mata Kuliah:** PMI 1522 Keamanan Sistem Informasi  
**Nama Mahasiswa:** Nyken Sekar Ayu  
**NPM:** 24781020  
**Kelas:** D-III Manajemen Informatika  

Aplikasi web portal akademik kampus fiktif yang dibangun sebagai pemenuhan tugas **Praktikum M5: OWASP Top 10 dan Risiko Aplikasi Web/API**. Aplikasi ini menyediakan fitur multi-peran (Mahasiswa, Dosen, Administrator) dan **sengaja disisipkan minimal 2 (kami sediakan 4) kerentanan keamanan** untuk bahan pengujian dan audit keamanan.

---

## 👥 Akun Pengguna Sintetis (Demo Login)

| Role | Username | Password | Identitas / Nama |
| :--- | :--- | :--- | :--- |
| **Mahasiswa** | `nyken` | `mhs123` | Nyken Sekar Ayu (NIM: 24781020) |
| **Mahasiswa** | `budi` | `mhs123` | Budi Santoso (NIM: 24781001) |
| **Dosen** | `pak_redo` | `dosen123` | M. Reza Redo Islami, S.Kom., M.T.I. (NIP: 198805...) |
| **Admin** | `admin` | `admin123` | Super Administrator Kampus |

*(Tersedia juga tombol 1-Click Quick Demo Login pada halaman masuk untuk kemudahan evaluasi)*

---

## 🎯 Fitur Sesuai Spesifikasi Soal M5

1. **Mahasiswa:**
   - Masuk / Autentikasi akun mahasiswa
   - **Melihat Nilai:** Akses Kartu Hasil Studi (KHS) Semester 5
   - **Mengunggah Tugas:** Pengumpulan tugas praktikum
   - **Forum Diskusi:** Berdiskusi secara interaktif dengan rekan dan dosen
2. **Dosen:**
   - Masuk / Autentikasi akun dosen pengampu
   - **Memberi Nilai:** Mengisi dan memperbarui nilai tugas, UTS, UAS mahasiswa
   - Memeriksa berkas tugas yang dikumpulkan mahasiswa
   - Ikut berdiskusi di forum akademik
3. **Administrator:**
   - Masuk / Autentikasi akun administrator
   - **Mengelola Akun:** CRUD Akun (Tambah pengguna, hapus pengguna, manajemen hak akses)
   - Panel Audit Keamanan OWASP Top 10

---

## 🛡️ Daftar 4 Kerentanan yang Sengaja Dibuat (Intentional Vulnerabilities)

### 1. Stored XSS (Cross-Site Scripting) - OWASP A03: Injection
* **Lokasi:** Forum Diskusi Akademik
* **Penyebab:** Pesan forum disimpan di `localStorage` dan langsung dirender ke antarmuka menggunakan `innerHTML` tanpa sanitasi entitas HTML (`< > " '`).
* **Cara Pengujian:**
  1. Masuk sebagai Mahasiswa, buka tab **Forum Diskusi**.
  2. Klik tombol bantu `⚡ Uji Payload XSS Image` atau masukkan:
     ```html
     <img src="x" onerror="alert('Stored XSS Berhasil!')">
     ```
  3. Kirim pesan. Popup JavaScript langsung dieksekusi di browser siapa pun yang membuka forum.

### 2. Validasi Berkas Lemah (Unrestricted File Upload) - OWASP A04: Insecure Design
* **Lokasi:** Fitur Unggah Tugas Mahasiswa
* **Penyebab:** Tidak ada pembatasan ekstensi file (*whitelist*) atau MIME type pada form maupun validator.
* **Cara Pengujian:**
  1. Pada menu **Unggah Tugas**, unggah file berekstensi `.php`, `.exe`, `.html`, atau `.sh` (atau klik tombol `🧪 Uji Upload Payload (.php)`).
  2. Sistem menerima dan menyimpan berkas berbahaya tersebut tanpa penolakan.

### 3. IDOR / Kontrol Akses Lemah - OWASP A01: Broken Access Control
* **Lokasi:** Menu Kartu Hasil Studi (KHS & Nilai)
* **Penyebab:** Sistem mengambil data nilai hanya berdasarkan parameter ID mahasiswa tanpa memverifikasi hak kepemilikan sesi akun yang sedang aktif.
* **Cara Pengujian:**
  1. Masuk sebagai mahasiswa `Nyken` (ID: `M001`).
  2. Buka tab **KHS & Nilai**, lalu ubah dropdown ID mahasiswa ke `M002 (Budi Santoso)` atau `M003 (Siti)`.
  3. Transkrip nilai rahasia mahasiswa lain dapat dilihat secara bebas tanpa otorisasi.

### 4. SQL Injection (Bypass Login) - OWASP A03: Injection
* **Lokasi:** Form Login Utama
* **Penyebab:** Kolom username memproses ekspresi kutip tanpa sanitasi prepared statements.
* **Cara Pengujian:**
  1. Pada form login, masukkan username:
     ```sql
     admin' OR '1'='1 --
     ```
  2. Masukkan sembarang kata sandi lalu klik **Masuk**. Anda langsung masuk sebagai Administrator.

---

## 🚀 Teknologi yang Digunakan
- **HTML5:** Struktur semantik, aksesibilitas modern.
- **Vanilla CSS:** Tema modern dark mode, glassmorphism, responsive grid & flexbox, animasi micro-interaction.
- **Vanilla JavaScript:** State management terisolasi via `localStorage`, modular event handlers.
