// routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");
const users = require("../data/users");
const { requireAuthApi } = require("../middleware/auth");

/* ------------------------- AUTH ------------------------- */

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username dan password wajib diisi",
    });
  }

  const user = users.findByUsername(username);

  if (!user || !users.verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  req.session.user = { id: user.id, username: user.username };

  res.json({ status: "success", message: "Login berhasil" });
});

// POST /api/logout
router.post("/logout", requireAuthApi, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal logout, coba lagi",
      });
    }
    res.clearCookie("connect.sid");
    res.json({ status: "success", message: "Logout berhasil" });
  });
});

/* ----------------------- PRODUCTS ------------------------ */

// GET /api/products -> publik
router.get("/products", (req, res) => {
  const { kategori, search } = req.query;
  const data =
    kategori || search
      ? products.filter({ kategori, search })
      : products.getAll();

  res.json({ status: "success", data });
});

// GET /api/products/:id -> publik
router.get("/products/:id", (req, res) => {
  const product = products.getById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.json({ status: "success", data: product });
});

// POST /api/products -> wajib login
router.post("/products", requireAuthApi, (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field name, category, price, dan stock wajib diisi",
    });
  }

  const newProduct = products.add({ name, category, price, stock });

  res.status(201).json({
    status: "success",
    message: "Produk ditambahkan",
    data: newProduct,
  });
});

// PUT /api/products/:id -> wajib login
router.put("/products/:id", requireAuthApi, (req, res) => {
  const updated = products.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.json({
    status: "success",
    message: "Produk diperbarui",
    data: updated,
  });
});

// DELETE /api/products/:id -> wajib login
router.delete("/products/:id", requireAuthApi, (req, res) => {
  const deleted = products.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.json({ status: "success", message: "Produk dihapus" });
});

/* -------------------------- CHAT -------------------------- */

// POST /api/chat -> balasan AI dummy (keyword matching), publik
router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      status: "error",
      message: "Pesan tidak boleh kosong",
    });
  }

  const text = message.toLowerCase();
  let reply;

  if (text.includes("jam") || text.includes("buka") || text.includes("tutup")) {
    reply = "Toko kami buka setiap hari jam 07.00 - 20.00 WIB!";
  } else if (text.includes("ongkir") || text.includes("antar") || text.includes("kirim")) {
    reply = "Kami melayani antar untuk area sekitar toko dengan ongkir mulai Rp5.000, tergantung jarak.";
  } else if (text.includes("bayar") || text.includes("pembayaran")) {
    reply = "Pembayaran bisa lewat tunai (COD) atau transfer bank ya!";
  } else if (text.includes("stok") || text.includes("ada") || text.includes("tersedia")) {
    reply = "Untuk cek stok terbaru, silakan lihat halaman Produk kami — datanya selalu ter-update.";
  } else if (text.includes("harga") || text.includes("berapa")) {
    reply = "Harga tiap produk bisa kamu lihat langsung di halaman Produk ya, lengkap sama satuannya.";
  } else if (text.includes("halo") || text.includes("hai") || text.includes("hello")) {
    reply = "Halo! Selamat datang di Toko Sembako Ariesta. Ada yang bisa aku bantu?";
  } else if (text.includes("terima kasih") || text.includes("makasih")) {
    reply = "Sama-sama! Senang bisa bantu. Jangan sungkan tanya lagi ya 😊";
  } else {
    const fallback = [
      "Maaf, aku belum paham pertanyaan itu. Coba tanya soal jam buka, ongkir, cara bayar, atau stok produk ya!",
      "Hmm, bisa tanya dengan kata lain? Misalnya tentang harga, stok, atau pengiriman.",
      "Untuk pertanyaan itu, kamu bisa hubungi admin toko langsung ya. Ada hal lain yang bisa aku bantu?",
    ];
    reply = fallback[Math.floor(Math.random() * fallback.length)];
  }

  res.json({ status: "success", data: { reply } });
});

module.exports = router;
