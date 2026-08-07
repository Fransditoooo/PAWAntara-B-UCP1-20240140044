// public/js/main.js
// Toggle menu hamburger di layar mobile (vanilla JS, bukan hanya CSS show/hide)

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("show");
      hamburgerBtn.classList.toggle("open", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Tutup menu otomatis kalau salah satu link diklik (UX mobile lebih enak)
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("show");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Tombol logout (muncul di navbar kalau sudah login), ada di semua halaman
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        const data = await res.json();
        if (data.status === "success") {
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Gagal logout:", err);
      }
    });
  }
});
