import { useEffect } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Burnout from "./pages/Burnout";
import Artikel from "./pages/Artikel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  
  useEffect(() => {
    // 1. Logika Dark Mode (Sudah ada di kode kamu)
    const isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. LOGIKA NOTIFIKASI HARIAN (FRONT END ONLY)
    const checkNotification = setInterval(() => {
      // Cek apakah user mengaktifkan fitur notifikasi di settings
      const isNotifyEnabled = localStorage.getItem("daily_notify") === "true";
      
      if (isNotifyEnabled && "Notification" in window && Notification.permission === "granted") {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Muncul jam 20:00 (Jam 8 Malam) - Waktunya refleksi diri
        if (hours === 20 && minutes === 0) {
          new Notification("Waktunya SehatYuk! 🌿", {
            body: "Gimana harimu hari ini, Lip? Yuk, catat mood kamu sekarang supaya lebih lega.",
            icon: "/favicon.ico" // Pastikan path icon benar
          });
        }
      }
    }, 60000); // Cek setiap 60 detik (1 menit)

    return () => clearInterval(checkNotification); // Bersihkan timer saat app tertutup
  }, []); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/burnout" element={<Burnout />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;