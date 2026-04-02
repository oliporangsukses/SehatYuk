import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg"; 
import { 
  Bell, 
  User, 
  MessageSquare, 
  LogOut, 
  Search,
  PlusCircle,
  History
} from "lucide-react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend);

function Mood() {
  const navigate = useNavigate();
  
  // 1. Cek Mode Gelap untuk Warna Chart (Sinkron dengan document)
  const isDark = document.documentElement.classList.contains('dark');

  // 2. State Mood (Default Kosong agar Sinkron dengan Fitur Hapus Riwayat)
  const [moods, setMoods] = useState(() => {
    const savedMoods = localStorage.getItem("user_moods_v2");
    return savedMoods ? JSON.parse(savedMoods) : []; 
  });
  
  const [note, setNote] = useState("");
  const [selectedScore, setSelectedScore] = useState(null);

  // 3. Simpan Otomatis ke LocalStorage
  useEffect(() => {
    localStorage.setItem("user_moods_v2", JSON.stringify(moods));
  }, [moods]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  const addMood = () => {
    if (selectedScore === null) {
      alert("Pilih emoji mood dulu ya!");
      return;
    }
    const newEntry = {
      score: selectedScore,
      note: note || "Tidak ada catatan",
      date: new Date().toLocaleDateString('id-ID', { weekday: 'short' }),
      fullDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    };
    
    // Batasi hanya 7 data terakhir untuk grafik mingguan
    const updatedMoods = [...moods, newEntry].slice(-7);
    setMoods(updatedMoods);
    setNote("");
    setSelectedScore(null);
  };

  // 4. Konfigurasi Data Grafik
  const data = {
    labels: moods.length > 0 ? moods.map(m => m.date) : ["-", "-", "-", "-", "-", "-", "-"],
    datasets: [{
      data: moods.length > 0 ? moods.map(m => m.score) : [0, 0, 0, 0, 0, 0, 0],
      borderColor: "#22c55e", 
      backgroundColor: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#22c55e",
      pointBorderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        min: 1, 
        max: 5, 
        ticks: { 
          stepSize: 1, 
          color: isDark ? "#94a3b8" : "#14532d",
          callback: (v) => ["", "😢", "😔", "😐", "😊", "😁"][v] 
        },
        grid: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 83, 45, 0.05)" }
      },
      x: {
        ticks: { color: isDark ? "#94a3b8" : "#14532d", font: { weight: 'bold' } },
        grid: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="min-h-screen pb-28 bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">

        {/* HEADER SECTION */}
        <header className="flex justify-between items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate("/")}>
            <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
            <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
            <Bell className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
            
            <div 
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-green-200 transition-all"
            >
                <User size={16} className="text-green-700 dark:text-green-400" />
            </div>

            <LogOut 
              className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" 
              size={20} 
              onClick={handleLogout} 
            />
          </div>
        </header>

        <div className="p-5 flex-1">
          {/* JUDUL HALAMAN */}
          <div className="flex flex-col items-start mb-6">
            <h1 className="text-2xl font-extrabold text-green-900 dark:text-white">Mood Tracker</h1>
            <p className="text-xs text-green-700 dark:text-green-400 font-medium italic">Simpan memorimu hari ini...</p>
          </div>
          
          {/* CARD INPUT */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/90 dark:to-slate-950/90 backdrop-blur-md mb-6">
            <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PlusCircle size={12} /> Bagaimana Perasaanmu?
            </h3>
            <div className="flex justify-between mb-6 px-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <button 
                  key={s}
                  onClick={() => setSelectedScore(s)} 
                  className={`text-4xl transition-all duration-300 transform ${selectedScore === s ? "scale-125 drop-shadow-md grayscale-0" : "grayscale opacity-40 hover:opacity-100 hover:scale-110"}`}
                >
                  {["", "😢", "😔", "😐", "😊", "😁"][s]}
                </button>
              ))}
            </div>

            <textarea 
              className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-green-100/50 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-700/50 dark:placeholder:text-slate-500 text-green-900 dark:text-white shadow-inner resize-none transition-colors"
              placeholder="Apa yang membuatmu merasa begini?"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            
            <button 
              onClick={addMood}
              className="w-full mt-4 bg-green-600 dark:bg-green-700 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 transition-all active:scale-95"
            >
              Simpan Cerita Hari Ini
            </button>
          </div>

          {/* CARD RIWAYAT & STATISTIK */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* STATISTIK MINGGUAN */}
            <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/90 dark:to-slate-950/90 backdrop-blur-md">
              <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 text-left px-1">Tren Mingguan</h3>
              <div className="h-44">
                <Line data={data} options={options} />
              </div>
            </div>

            {/* LIST RIWAYAT */}
            <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/90 dark:to-slate-950/90 backdrop-blur-md mb-4">
              <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 text-left px-1 flex items-center gap-2">
                  <History size={12} /> Catatan Terakhir
              </h3>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {moods.length > 0 ? moods.slice().reverse().map((m, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-left-2 transition-all">
                    <span className="text-3xl">{["", "😢", "😔", "😐", "😊", "😁"][m.score]}</span>
                    <div className="text-left flex-1">
                      <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">{m.date}, {m.fullDate}</p>
                      <p className="text-xs text-green-950 dark:text-slate-200 font-semibold leading-relaxed">"{m.note}"</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center">
                    <p className="text-xs text-green-700/40 dark:text-slate-500 font-bold uppercase tracking-widest">Belum ada riwayat...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Mood;