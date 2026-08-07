// routes/pageRoutes.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");
const { requireAuthPage } = require("../middleware/auth");

// GET / -> Beranda: hero section + preview beberapa produk
router.get("/", (req, res) => {
  const preview = products.getAll().slice(0, 4);
  res.render("index", {
    title: "Toko Sembako Ariesta",
    preview,
    activePage: "home",
  });
});

// GET /produk -> daftar semua produk, mendukung filter ?kategori= & ?search=
router.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  const list = products.filter({ kategori, search });

  res.render("produk", {
    title: "Daftar Produk",
    products: list,
    kategori: kategori || "",
    search: search || "",
    activePage: "produk",
  });
});

// GET /produk/:id -> detail 1 produk, route dinamis
router.get("/produk/:id", (req, res) => {
  const product = products.getById(req.params.id);

  res.render("detail", {
    title: product ? product.name : "Produk tidak ditemukan",
    product: product || null,
    activePage: "produk",
  });
});

// GET /tanya-ai -> halaman chat Tanya AI
router.get("/tanya-ai", (req, res) => {
  res.render("chat", {
    title: "Tanya AI",
    activePage: "tanya-ai",
  });
});

// GET /login -> halaman login admin/kasir
router.get("/login", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login Admin",
    activePage: "login",
  });
});

// GET /dashboard -> halaman kelola produk, wajib login
router.get("/dashboard", requireAuthPage, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard Admin",
    activePage: "dashboard",
    username: req.session.user.username,
  });
});

module.exports = router;
