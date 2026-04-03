const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // kalau XAMPP biasanya kosong
  database: "sehatyuk_db"
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("Koneksi database berhasil!");
  }
});

module.exports = db;