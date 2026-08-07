// app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const logger = require("./middleware/logger");
const pageRoutes = require("./routes/pageRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (login admin/kasir)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ariesta-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 jam
  })
);

// Middleware custom: logger, aktif untuk semua request
app.use(logger);

// Sediakan status login ke semua view (dipakai navbar di semua halaman)
app.use((req, res, next) => {
  res.locals.username = req.session && req.session.user ? req.session.user.username : null;
  next();
});

// Routes
app.use("/", pageRoutes);
app.use("/api", apiRoutes);

// 404 handler sederhana
app.use((req, res) => {
  res.status(404).send("Halaman tidak ditemukan");
});

app.listen(PORT, () => {
  console.log(`Server Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
