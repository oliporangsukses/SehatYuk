const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sehatyuk_db",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal!");
    console.error("Detail error:", err.message);
    return;
  }

  console.log("✅ Database berhasil terhubung!");
  console.log("📦 Database: sehatyuk_db");
  console.log("📍 Host: localhost");
});

module.exports = db;