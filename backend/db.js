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
    console.error("❌ Koneksi database gagal:");
    console.error(err);
  } else {
    console.log("✅ Koneksi database berhasil!");
    console.log("🔥 HOST: localhost");
    console.log("🔥 DATABASE: sehatyuk_db");
  }
});

module.exports = db;