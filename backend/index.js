// IMPORT
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CEK SERVER
app.get("/", (req, res) => {
  res.send("Backend jalan!");
});

// =======================
// CREATE TABLE USERS
// =======================
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  photo LONGTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createUserTable);

// =======================
// CREATE TABLE MOODS
// =======================
const createMoodTable = `
CREATE TABLE IF NOT EXISTS moods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  mood VARCHAR(10),
  note TEXT,
  tanggal DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createMoodTable);

// =======================
// REGISTER
// =======================
app.post("/register", async (req, res) => {
  const { nama_lengkap, email, password } = req.body;

  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (nama_lengkap, email, password) VALUES (?, ?, ?)",
      [nama_lengkap, email, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email sudah terdaftar!" });
          }
          return res.status(500).json({ message: "Gagal daftar" });
        }

        return res.status(201).json({ message: "Registrasi berhasil!" });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Terjadi error server" });
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
        id: user.id,
        name: user.nama_lengkap,
        email: user.email,
        photo: user.photo || null
      });
    }
  );
});

// =======================
// RESET PASSWORD
// =======================
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  console.log("RESET BODY:", req.body);

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) {
      console.log("SELECT ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          console.log("UPDATE ERROR:", err);
          return res.status(500).json({ message: err.message });
        }

        console.log("UPDATE SUCCESS:", result);

        return res.json({ message: "Password berhasil diupdate" });
      }
    );
  });
});

// =======================
// SAVE MOOD
// =======================
app.post("/mood", (req, res) => {
  const { user_id, mood, note } = req.body;

  const sql = `
    INSERT INTO moods (user_id, mood, note, tanggal)
    VALUES (?, ?, ?, CURDATE())
  `;

  db.query(sql, [user_id, mood, note], (err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal simpan mood" });
    }

    return res.status(201).json({ message: "Mood berhasil disimpan!" });
  });
});

// =======================
// GET MOOD 7 HARI
// =======================
app.get("/mood/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    `
    SELECT mood, tanggal
    FROM moods
    WHERE user_id = ?
    AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY tanggal ASC
  `,
    [user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal ambil data mood" });
      }

      return res.json(result);
    }
  );
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
});