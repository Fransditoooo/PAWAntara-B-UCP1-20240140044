# Toko Sembako Ariesta — Website & REST API dengan Fitur Tanya AI

**Nama:** _(isi nama kamu)_
**NIM:** _(isi NIM kamu)_
**Mata Kuliah:** Pemrograman Aplikasi Web (PAW) — UCP 1

## Deskripsi Singkat

Aplikasi web full stack untuk Toko Sembako Ariesta, dibangun dengan **Node.js + Express.js**. Menyediakan halaman publik (beranda, daftar & detail produk, Tanya AI) serta dashboard admin/kasir yang dilindungi login untuk mengelola data produk (CRUD). Fitur "Tanya AI" memakai logika balasan dummy (keyword matching) di backend — **tidak memanggil API AI pihak ketiga**.

## Cara Menjalankan Project Secara Lokal

1. Clone repository ini, lalu masuk ke foldernya.
2. Salin `.env.example` menjadi `.env`, sesuaikan nilainya jika perlu:
   ```
   cp .env.example .env
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Jalankan server (mode development, auto-restart via nodemon):
   ```
   npm run dev
   ```
   atau mode biasa:
   ```
   npm start
   ```
5. Buka `http://localhost:3000` di browser.

**Akun admin/kasir (seed data, untuk keperluan pengecekan):**
- Username: `admin`
- Password: `admin123`

(Kredensial ini didefinisikan lewat file `.env` yang tidak ikut ter-commit; nilai default ada di `.env.example`.)

## Daftar Endpoint API

| Method | Endpoint             | Deskripsi                                         | Akses  |
|--------|-----------------------|----------------------------------------------------|--------|
| POST   | `/api/login`          | Login admin/kasir dengan username & password       | Publik |
| POST   | `/api/logout`         | Logout, menghapus sesi login                        | Login  |
| GET    | `/api/products`       | Ambil seluruh data produk (mendukung `?kategori=` & `?search=`) | Publik |
| GET    | `/api/products/:id`   | Ambil satu produk berdasarkan ID                    | Publik |
| POST   | `/api/products`       | Tambah produk baru                                  | Login  |
| PUT    | `/api/products/:id`   | Update produk (nama/kategori/harga/stok)            | Login  |
| DELETE | `/api/products/:id`   | Hapus produk berdasarkan ID                         | Login  |
| POST   | `/api/chat`           | Kirim pertanyaan, terima balasan AI dummy dari backend | Publik |

Semua response mengikuti format konsisten: `{ "status": "success" | "error", "message"?: string, "data"?: any }`.
Endpoint yang butuh login akan menolak akses dengan `401` dan `{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }` jika belum login.

## Penjelasan Tampilan (UI)

- **Beranda (`/`)** — hero section perkenalan toko + preview 4 produk pilihan.
- **Produk (`/produk`)** — daftar seluruh produk dalam bentuk card grid, dengan form filter kategori & pencarian nama (diproses di server lewat `req.query`, data dibaca dari sumber array yang sama dengan API sehingga otomatis ter-update begitu admin mengubah data lewat dashboard).
- **Detail Produk (`/produk/:id`)** — route dinamis, menampilkan detail satu produk; menampilkan pesan "Produk tidak ditemukan" secara wajar jika ID tidak valid.
- **Tanya AI (`/tanya-ai`)** — antarmuka chat sederhana; pesan dikirim lewat Fetch API ke `/api/chat`, balasan ditampilkan sebagai bubble chat di DOM tanpa reload halaman.
- **Login (`/login`)** — form login admin/kasir, submit lewat Fetch API ke `/api/login`, redirect ke dashboard jika berhasil.
- **Dashboard (`/dashboard`, wajib login)** — form tambah/edit produk serta tabel daftar produk dengan tombol edit & hapus, seluruhnya memanggil REST API lewat Fetch API (async/await) tanpa reload halaman.

Navbar (partial `navbar.ejs`) tampil identik di semua halaman, dengan menu hamburger yang berfungsi lewat vanilla JS (`public/js/main.js`) di layar mobile, serta styling responsif menggunakan CSS Grid/Flexbox + 2 breakpoint media query (mobile `<768px` dan desktop `>=1024px`) di `public/css/style.css`.

## Struktur Project

```
PAWAntara-A-UCP1-NIM/
├── app.js
├── package.json
├── data/
│   ├── products.js     # sumber data produk (in-memory), dipakai bersama oleh halaman & API
│   └── users.js        # akun admin/kasir (password di-hash pakai bcrypt)
├── routes/
│   ├── pageRoutes.js   # route halaman (SSR EJS)
│   └── apiRoutes.js    # REST API (login, products CRUD, chat)
├── middleware/
│   ├── auth.js         # proteksi login untuk halaman & API
│   └── logger.js        # logging request custom
├── public/
│   ├── css/style.css
│   ├── js/ (main.js, login.js, dashboard.js, chat.js)
│   └── images/
├── views/
│   ├── partials/ (navbar.ejs, footer.ejs)
│   └── index.ejs, produk.ejs, detail.ejs, login.ejs, dashboard.ejs, chat.ejs
└── README.md
```

## Catatan Implementasi

- Data produk & akun admin disimpan sebagai **array in-memory** (bebas dipilih sesuai ketentuan tugas).
- Password admin di-hash menggunakan **bcryptjs**, bukan disimpan plain text.
- Sesi login menggunakan **express-session**.
- Middleware custom: `logger.js` (mencatat method + endpoint + waktu tiap request) dan `auth.js` (proteksi akses).
- Tidak ada integrasi API AI eksternal apa pun — balasan "Tanya AI" 100% logika keyword matching buatan sendiri di `routes/apiRoutes.js`.
