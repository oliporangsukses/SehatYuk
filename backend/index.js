// =======================
// IMPORT
// =======================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// CEK SERVER
// =======================
app.get("/", (req, res) => {
  res.send("Backend jalan!");
});

// =======================
// BUAT TABEL (AMAN)
// =======================
const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.log("❌ Gagal buat tabel:", err);
  } else {
    console.log("✅ Tabel users siap!");
  }
});

// =======================
// REGISTER
// =======================
app.post("/register", async (req, res) => {
  const { nama_lengkap, email, password } = req.body;

  // validasi input
  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (nama_lengkap, email, password) VALUES (?, ?, ?)";

    db.query(sql, [nama_lengkap, email, hashedPassword], (err, result) => {
      if (err) {
        console.log("❌ ERROR REGISTER:", err);

        // kalau email sudah dipakai
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email sudah terdaftar!" });
        }

        return res.status(500).json({ message: "Gagal daftar" });
      }

      return res.status(201).json({ message: "Registrasi berhasil!" });
    });
  } catch (error) {
    console.log("❌ SERVER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email dan password wajib diisi!" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log("❌ ERROR LOGIN:", err);
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

    return res.json({
      message: "Login berhasil!",
      user_id: user.id,
      nama_lengkap: user.nama_lengkap,
    });
  });
});

// =======================
// RESET PASSWORD (TAMBAHAN)
// =======================
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email dan password baru wajib diisi!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = "UPDATE users SET password = ? WHERE email = ?";

    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.log("❌ ERROR RESET PASSWORD:", err);
        return res.status(500).json({ message: "Gagal update database" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Email tidak terdaftar!" });
      }

      return res.status(200).json({ message: "Password berhasil diperbarui!" });
    });
  } catch (error) {
    console.log("❌ SERVER ERROR:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});