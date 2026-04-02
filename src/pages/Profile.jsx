import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { 
  Camera, Edit2, LogOut, ChevronRight, BarChart2, 
  Flame, Settings as SettingsIcon, Check, Moon, Bell, Trash2, X 
} from "lucide-react";

import bgMoodPage from "../assets/MoodBackground.jpeg";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- STATE UTAMA ---
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Pengguna");
  const [userEmail] = useState(localStorage.getItem("userEmail") || "email@sehatyuk.com");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "https://i.pravatar.cc/150");
  
  // --- STATE SETTINGS ---
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // --- LOGIKA DARK MODE ---
  useEffect(() => {
    const root = window.document.documentElement; // Mengambil tag <html>
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    setUserName(tempName);
    localStorage.setItem("userName", tempName);
    setIsEditing(false);
  };

  const handleResetData = () => {
    if (window.confirm("Hapus semua riwayat Mood dan Burnout? Data tidak bisa dikembalikan.")) {
      localStorage.removeItem("user_moods_v2");
      localStorage.removeItem("burnout_history");
      alert("Data berhasil dibersihkan!");
      window.location.reload();
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >
      {/* Overlay Gelap saat Dark Mode */}
      <div className="min-h-screen backdrop-blur-md bg-white/20 dark:bg-black/60 p-5 pb-32 transition-colors duration-500">
        
        {/* HEADER PROFILE */}
        <div className="mt-8 mb-8 text-center animate-in fade-in duration-700">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full border-4 border-white/80 dark:border-slate-700 shadow-xl overflow-hidden bg-green-100">
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 active:scale-90 transition-all"
            >
              <Camera size={16} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="mt-4 flex flex-col items-center">
            {isEditing ? (
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1 pr-2 rounded-full border border-white/50 dark:border-slate-600 shadow-inner">
                <input 
                  type="text" value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-transparent outline-none px-3 py-1 font-black text-green-900 dark:text-white w-40 text-center"
                  autoFocus
                />
                <button onClick={saveName} className="bg-green-600 text-white p-1 rounded-full shadow-md">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-green-800 dark:text-green-400 tracking-tight leading-tight">{userName}</h2>
                <Edit2 
                  size={16} 
                  className="text-green-700/50 dark:text-green-400/50 cursor-pointer hover:text-green-700 transition-colors" 
                  onClick={() => setIsEditing(true)} 
                />
              </div>
            )}
            <p className="text-green-700/70 dark:text-green-300/70 font-bold text-sm mt-1 bg-white/30 dark:bg-black/30 px-4 py-1 rounded-full border border-white/20 dark:border-white/10 shadow-sm italic">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="space-y-4 px-2">
          {!showSettings ? (
            /* MENU UTAMA */
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
              <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/50 uppercase tracking-widest px-1">Aktivitas Saya</h3>
              
              <div onClick={() => navigate("/mood")} className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[30px] border border-white/50 dark:border-slate-700 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-700 dark:text-green-400 group-hover:rotate-6 transition-transform">
                    <BarChart2 size={20} />
                  </div>
                  <span className="font-bold text-green-900 dark:text-white">Riwayat Mood</span>
                </div>
                <ChevronRight size={18} className="text-green-400" />
              </div>

              <div onClick={() => navigate("/burnout")} className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[30px] border border-white/50 dark:border-slate-700 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400 group-hover:rotate-6 transition-transform">
                    <Flame size={20} />
                  </div>
                  <span className="font-bold text-green-900 dark:text-white">Hasil Burnout Test</span>
                </div>
                <ChevronRight size={18} className="text-green-400" />
              </div>

              <div 
                onClick={() => setShowSettings(true)} 
                className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[30px] border border-white/50 dark:border-slate-700 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform">
                    <SettingsIcon size={20} />
                  </div>
                  <span className="font-bold text-green-900 dark:text-white">Pengaturan Aplikasi</span>
                </div>
                <ChevronRight size={18} className="text-green-400" />
              </div>

              <button 
                onClick={handleLogout}
                className="w-full bg-red-500/10 dark:bg-red-900/20 backdrop-blur-md border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-black p-5 rounded-[30px] mt-6 flex justify-center items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={20} /> LOGOUT
              </button>
            </div>
          ) : (
            /* PANEL SETTINGS */
            <div className="animate-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/50 uppercase tracking-widest">Pengaturan Aplikasi</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 bg-white/50 dark:bg-slate-800 rounded-full text-green-800 dark:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[35px] border border-white/50 dark:border-slate-700 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Moon size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-bold text-green-900 dark:text-white">Mode Gelap</span>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-orange-500" />
                    <span className="text-sm font-bold text-green-900 dark:text-white">Notifikasi Harian</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div 
                  onClick={handleResetData}
                  className="flex items-center gap-3 p-5 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">Hapus Semua Riwayat</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <BottomNav />
      </div>
    </div>
  );
}

export default Profile;