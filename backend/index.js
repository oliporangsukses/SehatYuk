// =======================
// IMPORT
// =======================
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const bcrypt = require("bcrypt");

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// CEK SERVER HIDUP
// =======================
app.get('/', (req, res) => {
  res.send("Backend jalan!");
});

// =======================
// BUAT TABEL (TANPA HAPUS DATA)
// =======================
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.log("Gagal buat tabel:", err);
  } else {
    console.log("Tabel users siap!");
  }
});

// =======================
// REGISTER
// =======================
app.post('/register', async (req, res) => {
  const { nama_lengkap, email, password } = req.body;

  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (nama_lengkap, email, password) VALUES (?, ?, ?)";

    db.query(sql, [nama_lengkap, email, hashedPassword], (err, result) => {
      if (err) {
        console.log("ERROR REGISTER:", err);
        return res.status(500).json({ message: "Gagal daftar" });
      }

      res.json({ message: "Registrasi berhasil!" });
    });

  } catch (error) {
    console.log("ERROR SERVER:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log("ERROR LOGIN:", err);
      return res.status(500).json({ message: "Terjadi error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan!" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah!" });
    }

    res.json({
      message: "Login berhasil!",
      user_id: user.id,
      nama_lengkap: user.nama_lengkap
    });
  });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server jalan di port " + PORT);
});