import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Moon, 
  Bell, 
  Trash2, 
  ShieldCheck, 
  ChevronRight,
  Save
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg"; 

function Settings() {
  const navigate = useNavigate();
  
  // 1. State Management (Ambil dari LocalStorage)
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Pengguna");
  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem("daily_notify")) || false);

  // 2. Efek Sinkronisasi Dark Mode ke Elemen HTML
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 3. Fungsi Simpan Nama
  const handleSaveName = () => {
    if (userName.trim() === "") {
      alert("Nama tidak boleh kosong ya!");
      return;
    }
    localStorage.setItem("userName", userName);
    alert("Nama berhasil diperbarui! ✨");
  };

  // 4. Fungsi Toggle Notifikasi (Front End Logic)
  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    
    if (newValue) {
      // Minta izin browser jika baru dinyalakan
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
        localStorage.setItem("daily_notify", "true");
        new Notification("SehatYuk", { body: "Notifikasi harian diaktifkan! 🌿" });
      } else {
        alert("Izin notifikasi ditolak. Aktifkan manual di setting browser ya.");
      }
    } else {
      setNotifications(false);
      localStorage.setItem("daily_notify", "false");
    }
  };

  // 5. Fungsi Hapus Semua Riwayat (Sangat Sinkron)
  const handleResetData = () => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus semua riwayat Mood dan Burnout? Kamu juga akan otomatis Logout demi keamanan data."
    );
    
    if (confirmDelete) {
      // Hapus semua key yang digunakan aplikasi
      localStorage.removeItem("user_moods_v2");
      localStorage.removeItem("burnout_history");
      localStorage.removeItem("userName");
      localStorage.removeItem("daily_notify");
      localStorage.removeItem("isLoggedIn"); // Reset status login
      
      // Opsional: Jika ingin reset Dark Mode juga, hapus ini:
      // localStorage.removeItem("darkMode");

      alert("Semua data riwayat telah dibersihkan. ✨");
      
      // Redirect ke Login agar data di state React ter-reset total
      window.location.href = "/login"; 
    }
  };

  return (
    <div 
      className="min-h-screen pb-28 bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >
      {/* Dark Overlay untuk Mode Gelap */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/60 transition-colors duration-500 pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="flex items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-full text-green-800 dark:text-green-400 mr-3 hover:bg-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-green-900 dark:text-white tracking-tight">Pengaturan</h1>
      </header>

      <div className="p-5 flex-1 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* PROFIL SECTION */}
        <section className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[35px] p-6 mb-6 border border-white/40 dark:border-slate-700 shadow-lg text-left">
          <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={12} className="text-green-600" /> Profil Pengguna
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-green-800 dark:text-slate-300 ml-1">Nama Panggilan</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-green-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 dark:text-white"
                  placeholder="Masukkan namamu..."
                />
                <button 
                  onClick={handleSaveName}
                  className="p-3 bg-green-600 text-white rounded-2xl shadow-md active:scale-90 hover:bg-green-700 transition-all flex items-center justify-center"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PREFERENCES SECTION */}
        <section className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[35px] p-6 mb-6 border border-white/40 dark:border-slate-700 shadow-lg text-left">
          <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Preferensi Aplikasi
          </h3>
          
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <div 
              className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Moon size={18} />
                </div>
                <span className="text-sm font-bold text-green-900 dark:text-slate-200">Mode Gelap</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </div>
            </div>

            {/* Notification Toggle */}
            <div 
              className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer"
              onClick={handleToggleNotifications}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Bell size={18} />
                </div>
                <span className="text-sm font-bold text-green-900 dark:text-slate-200">Notifikasi Harian</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-green-600' : 'bg-gray-300 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${notifications ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & DATA SECTION */}
        <section className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[35px] p-6 mb-6 border border-white/40 dark:border-slate-700 shadow-lg text-left">
          <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Privasi & Data
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-bold text-green-900 dark:text-slate-200">Kebijakan Privasi</span>
              </div>
              <ChevronRight size={18} className="text-green-700/50" />
            </div>

            <div 
              onClick={handleResetData}
              className="flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                  <Trash2 size={18} />
                </div>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">Hapus Semua Riwayat</span>
              </div>
            </div>
          </div>
        </section>

        <p className="text-[10px] text-center text-green-800/40 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-4">
          SehatYuk v1.0.0 • SMKN 3 TEGAL
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default Settings;