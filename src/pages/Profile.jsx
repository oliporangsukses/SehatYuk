import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { Camera, Edit2, LogOut, ChevronRight, BarChart2, Flame, Settings, Check } from "lucide-react";

// Samakan background dengan halaman lain
import bgMoodPage from "../assets/MoodBackground.jpeg";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Ambil data dari localStorage (dari proses register/login)
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Pengguna");
  const [userEmail] = useState(localStorage.getItem("userEmail") || "email@sehatyuk.com");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "https://i.pravatar.cc/150");

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Proteksi Login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative flex flex-col font-sans"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >
      <div className="min-h-screen backdrop-blur-md bg-white/20 p-5 pb-28">
        
        {/* Header Profile */}
        <div className="mt-8 mb-8 text-center">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full border-4 border-white/80 shadow-xl overflow-hidden bg-green-100">
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 active:scale-90 transition-all"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="mt-4 flex flex-col items-center">
            {isEditing ? (
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1 pr-2 rounded-full border border-white/50">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-transparent outline-none px-3 py-1 font-black text-green-900 w-32"
                  autoFocus
                />
                <button onClick={saveName} className="bg-green-600 text-white p-1 rounded-full">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-green-800 tracking-tight">{userName}</h2>
                <Edit2 
                  size={16} 
                  className="text-green-700/50 cursor-pointer hover:text-green-700" 
                  onClick={() => setIsEditing(true)} 
                />
              </div>
            )}
            <p className="text-green-700/70 font-bold text-sm mt-1">{userEmail}</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-4 px-2">
          <h3 className="font-black text-[10px] text-green-900/50 uppercase tracking-widest px-1">Aktivitas Saya</h3>
          
          <div onClick={() => navigate("/mood")} className="bg-white/70 backdrop-blur-md p-5 rounded-[30px] border border-white/50 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-2xl text-green-700">
                <BarChart2 size={20} />
              </div>
              <span className="font-bold text-green-900">Riwayat Mood</span>
            </div>
            <ChevronRight size={18} className="text-green-400" />
          </div>

          <div onClick={() => navigate("/burnout")} className="bg-white/70 backdrop-blur-md p-5 rounded-[30px] border border-white/50 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Flame size={20} />
              </div>
              <span className="font-bold text-green-900">Hasil Burnout Test</span>
            </div>
            <ChevronRight size={18} className="text-green-400" />
          </div>

          <div className="bg-white/70 backdrop-blur-md p-5 rounded-[30px] border border-white/50 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white/90 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <Settings size={20} />
              </div>
              <span className="font-bold text-green-900">Pengaturan Aplikasi</span>
            </div>
            <ChevronRight size={18} className="text-green-400" />
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 backdrop-blur-md border border-red-200 text-red-600 font-black p-5 rounded-[30px] mt-6 flex justify-center items-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-[0.95] shadow-sm"
          >
            <LogOut size={20} />
            LOGOUT DARI AKUN
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

export default Profile;