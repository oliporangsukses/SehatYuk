const mysql = require("mysql2");

// =======================
// CONFIG DATABASE
// =======================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sehatyuk_db",
  port: process.env.DB_PORT || 3306,
});

// =======================
// CONNECT DATABASE
// =======================
db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal!");
    console.error("Detail error:", err.message);
    return;
  }

  console.log("✅ Database berhasil terhubung!");
  console.log("📦 Database:", process.env.DB_NAME || "sehatyuk_db");
  console.log("📍 Host:", process.env.DB_HOST || "localhost");
});

module.exports = db;