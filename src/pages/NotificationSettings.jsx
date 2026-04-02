import React, { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";

const NotificationSettings = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem("daily_notify") === "true";
  });

  // Sinkronisasi status: Jika di aplikasi ON tapi di browser di-BLOCK, otomatis matikan switch
  useEffect(() => {
    const syncNotificationStatus = () => {
      if ("Notification" in window && Notification.permission !== "granted" && isEnabled) {
        setIsEnabled(false);
        localStorage.setItem("daily_notify", "false");
      }
    };

    // Jalankan pengecekan saat komponen dimuat atau saat user kembali ke tab aplikasi
    syncNotificationStatus();
    window.addEventListener("focus", syncNotificationStatus);
    
    return () => window.removeEventListener("focus", syncNotificationStatus);
  }, [isEnabled]);

  // Minta izin notifikasi saat switch dinyalakan
  const handleToggle = async () => {
    if (!isEnabled) {
      // Cek apakah browser mendukung notifikasi
      if (!("Notification" in window)) {
        alert("Browser ini tidak mendukung notifikasi desktop.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setIsEnabled(true);
        localStorage.setItem("daily_notify", "true");
        // Kirim notifikasi percobaan
        showNotification("Notifikasi Aktif! 🌿", "SehatYuk akan mengingatkanmu setiap hari.");
      } else {
        alert("Yah, izin notifikasi ditolak. Aktifkan di setting browser (ikon gembok di URL) ya!");
      }
    } else {
      setIsEnabled(false);
      localStorage.setItem("daily_notify", "false");
    }
  };

  // Fungsi untuk memicu notifikasi visual
  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico",
      });
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md rounded-[30px] p-6 border border-white/40 shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl transition-colors duration-300 ${
            isEnabled ? "bg-green-100 text-green-600 dark:bg-green-900/40" : "bg-gray-100 text-gray-400 dark:bg-slate-800"
          }`}>
            {isEnabled ? <Bell size={24} /> : <BellOff size={24} />}
          </div>
          <div className="text-left">
            <h4 className="font-bold text-green-900 dark:text-white text-sm tracking-tight">Notifikasi Harian</h4>
            <p className="text-[10px] text-green-700 dark:text-slate-400 font-medium">
              Ingatkan aku untuk isi Mood Tracker
            </p>
          </div>
        </div>

        {/* SWITCH COMPONENT */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${
            isEnabled ? "bg-green-500 shadow-lg shadow-green-200 dark:shadow-none" : "bg-gray-300 dark:bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
              isEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-green-600 dark:text-green-400" />
          <p className="text-[9px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest">
            Pengingat otomatis aktif setiap jam 20:00
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;