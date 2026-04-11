🌿 SehatYuk

// Deskripsi Singkat Project
SehatYuk adalah website kesehatan mental berbasis web yang ditujukan untuk pelajar. Website ini membantu pengguna dalam memahami kondisi emosional mereka melalui fitur seperti mood tracker, burnout check, serta artikel edukasi kesehatan mental. SehatYuk dirancang dengan tampilan yang sederhana dan mudah digunakan agar dapat diakses oleh semua kalangan pelajar.

// Petunjuk Setup Environment 
Berikut langkah-langkah untuk menyiapkan environment. Project ini mendukung dua jenis database: lokal (XAMPP) dan online (Railway).

/***OPSI 1: Database Lokal (XAMPP)***/
1. Pastikan sudah menginstall:
   - Node.js
   - npm (Node Package Manager)
   - XAMPP
2. Clone repository:
   git clone https://github.com/oliporangsukses/SehatYuk.git
   cd sehatyuk
3. Jalankan XAMPP:
   - Aktifkan Apache
   - Aktifkan MySQL
4. Buat database:
   - Buka: http://localhost/phpmyadmin
   - Klik New
   - Buat database: sehatyuk_db
5. Import database (jika ada file .sql):
   - Pilih database sehatyuk_db
   - Klik Import
   - Upload file .sql
6. Konfigurasi .env:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=sehatyuk_db
    DB_PORT=3306
    PORT=5000
    JWT_SECRET=your_secret_key

/***OPSI 2: Database Online (Railway)***/
1. Install:
    - Node.js
    - npm
2. Clone repository:
   git clone https://github.com/oliporangsukses/SehatYuk.git
   cd sehatyuk
3. Tidak perlu menjalankan XAMPP
4. Gunakan database Railway (sudah disediakan)
5. Konfigurasi .env:
    DB_HOST=maglev.proxy.rlwy.net
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=railway
    DB_PORT=13869
    PORT=5000
    JWT_SECRET=your_secret_key

/***Install dependencies:***/
   Frontend: 
    - cd sehatyuk-frontend
    - npm install
   Backend: 
    - cd backend
    - npm install

//Tautan Model ML (Jika Ada)
 Project SehatYuk tidak menggunakan Machine Learning, sehingga tidak terdapat model yang perlu diunduh atau dijalankan

// Cara Menjalankan Website
1. Jalankan backend:
   - cd backend
   - npm run start
2. Jalankan frontend:
   - cd sehatyuk-frontend
   - npm run dev
3. Buka browser dan akses: 
   https://localhost:5173
4. Gunakan Website: 
   - Register atau login akun
   - Pilih fitur mood tracker untuk mencatat suasana hati
   - Gunakan burnout check untuk mengecek kondisi mental
   - Baca artikel untuk mendapatkan edukasi kesehatan mental