// data/products.js
// Data produk disimpan sebagai array in-memory.
// PENTING: array ini adalah SATU-SATUNYA sumber data.
// Baik halaman /produk (SSR) maupun endpoint /api/products (GET/POST/PUT/DELETE)
// membaca & mengubah array yang SAMA ini, jadi perubahan lewat dashboard
// langsung terlihat di halaman publik tanpa restart server.

let products = [
  { id: 1, name: "Beras Pandan Wangi 5kg", category: "sembako", price: 65000, stock: 20 },
  { id: 2, name: "Minyak Goreng Bimoli 2L", category: "sembako", price: 34000, stock: 15 },
  { id: 3, name: "Gula Pasir 1kg", category: "sembako", price: 14000, stock: 40 },
  { id: 4, name: "Telur Ayam 1kg", category: "sembako", price: 28000, stock: 25 },
  { id: 5, name: "Sabun Mandi Lifebuoy", category: "kebutuhan-rumah", price: 5000, stock: 60 },
  { id: 6, name: "Deterjen Bubuk Rinso 800g", category: "kebutuhan-rumah", price: 18000, stock: 30 },
  { id: 7, name: "Kecap Manis ABC 600ml", category: "sembako", price: 16000, stock: 18 },
  { id: 8, name: "Tepung Terigu Segitiga Biru 1kg", category: "sembako", price: 12000, stock: 22 },
];

let nextId = products.length + 1;

function getAll() {
  return products;
}

function getById(id) {
  return products.find((p) => p.id === Number(id));
}

// filter berdasarkan kategori dan/atau kata kunci pencarian nama produk
function filter({ kategori, search } = {}) {
  let result = products;

  if (kategori) {
    result = result.filter(
      (p) => p.category.toLowerCase() === String(kategori).toLowerCase()
    );
  }

  if (search) {
    const keyword = String(search).toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  return result;
}

function add({ name, category, price, stock }) {
  const newProduct = {
    id: nextId++,
    name,
    category,
    price: Number(price),
    stock: Number(stock),
  };
  products.push(newProduct);
  return newProduct;
}

function update(id, { name, category, price, stock }) {
  const product = getById(id);
  if (!product) return null;

  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  return product;
}

function remove(id) {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, filter, add, update, remove };
