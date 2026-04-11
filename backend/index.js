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
// BUAT TABEL USERS (AMAN)
// =======================
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createUserTable, (err) => {
  if (err) {
    console.log("❌ Gagal buat tabel users:", err);
  } else {
    console.log("✅ Tabel users siap!");
  }
});

// =======================
// BUAT TABEL MOODS (FIX)
// =======================
const createMoodTable = `
CREATE TABLE IF NOT EXISTS moods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  score INT,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createMoodTable, (err) => {
  if (err) {
    console.log("❌ Gagal buat tabel moods:", err);
  } else {
    console.log("✅ Tabel moods siap!");
  }
});

// =======================
// REGISTER
// =======================
app.post("/register", async (req, res) => {
  const { nama_lengkap, email, password } = req.body;

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

    db.query(sql, [nama_lengkap, email, hashedPassword], (err) => {
      if (err) {
        console.log("❌ ERROR REGISTER:", err);

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
      email: user.email
    });
  });
});

// =======================
// RESET PASSWORD
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
// TAMBAH MOOD
// =======================
app.post("/mood", (req, res) => {
  console.log("📥 DATA MASUK:", req.body);

  const { user_id, score, note } = req.body;

  if (!user_id || !score) {
    return res.status(400).json({ message: "Data tidak lengkap!" });
  }

  const sql = "INSERT INTO moods (user_id, score, note) VALUES (?, ?, ?)";

  db.query(sql, [user_id, score, note], (err) => {
    if (err) {
      console.log("❌ ERROR MOOD:", err);
      return res.status(500).json({ message: "Gagal simpan mood" });
    }

    return res.status(201).json({ message: "Mood berhasil disimpan!" });
  });
});

// =======================
// AMBIL MOOD
// =======================
app.get("/mood/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = "SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log("❌ ERROR GET MOOD:", err);
      return res.status(500).json({ message: "Gagal ambil data" });
    }

    return res.json(result);
  });
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});