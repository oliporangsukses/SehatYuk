// =======================
// IMPORT
// =======================
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
// REGISTER USER
// =======================
app.post('/register', async (req, res) => {
  const { nama_lengkap, email, password } = req.body;

  // Validasi
  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter!" });
  }

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (nama_lengkap, email, password) VALUES (?, ?, ?)";

    db.query(sql, [nama_lengkap, email, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Gagal daftar" });
      }

      res.json({ message: "Registrasi berhasil!" });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// =======================
// LOGIN USER
// =======================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
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
// SIMPAN MOOD
// =======================
app.post('/mood', (req, res) => {
  const { user_id, mood } = req.body;

  if (!user_id || !mood) {
    return res.status(400).json({ message: "Data tidak lengkap!" });
  }

  const today = new Date().toLocaleDateString('en-CA');

  const sql = "INSERT INTO moods (user_id, mood, tanggal) VALUES (?, ?, ?)";

  db.query(sql, [user_id, mood, today], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Gagal simpan mood" });
    }

    res.json({ message: "Mood berhasil disimpan!" });
  });
});


// =======================
// AMBIL MOOD TERBARU
// =======================
app.get('/mood/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT u.nama_lengkap AS nama, m.mood, m.tanggal
    FROM moods m
    JOIN users u ON m.user_id = u.id
    WHERE m.user_id = ?
    ORDER BY m.tanggal DESC, m.created_at DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error mengambil mood" });
    }

    res.json(result);
  });
});


// =======================
// RIWAYAT MOOD
// =======================
app.get('/moods/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT u.nama_lengkap AS nama, m.mood,
    DATE_FORMAT(m.tanggal, '%Y-%m-%d') AS tanggal
    FROM moods m
    JOIN users u ON m.user_id = u.id
    WHERE m.user_id = ?
    ORDER BY m.tanggal DESC, m.created_at DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error mengambil riwayat mood" });
    }

    res.json(result);
  });
});


// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});