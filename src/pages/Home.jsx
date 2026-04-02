import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry, ArrowRight, MessageSquare, Search, LogOut, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import bgArt1 from "../assets/BackgroundArtikel1.png" 
import bgArt2 from "../assets/BackgroundArtikel2.png"
import bgMoodPage from "../assets/MoodBackground.jpeg" 

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip)

const recommendedArticles = [
  { id: 1, title: "Cara Mengatasi Stres", desc: "Tips sederhana untuk mengurangi stres.", bgImage: bgArt1 },
  { id: 2, title: "Kesehatan Mental Remaja", desc: "Pentingnya menjaga mental sejak dini.", bgImage: bgArt2 },
];

function Home() {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userName] = useState(() => localStorage.getItem("userName") || "Pengguna")

  // --- HELPER: AMBIL TANGGAL HARI INI (Format YYYY-MM-DD) ---
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // --- HELPER: AMBIL LABEL 7 HARI TERAKHIR ---
  const getLastSevenDaysLabels = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
    }
    return labels;
  };

  // --- LOGIC STATISTIK AKURAT (BERDASARKAN KALENDER) ---
  const [moodData, setMoodData] = useState(() => {
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    const dataPoints = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      // Jika tidak ada data, kasih nilai 3 (Netral) agar grafik tidak putus
      dataPoints.push(savedMoods[ds] || 3);
    }
    return dataPoints;
  });

  const [currentMoodText, setCurrentMoodText] = useState(() => {
    const today = getTodayStr();
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    const latestScore = savedMoods[today];
    
    if (latestScore) {
      const map = { 5: "Bahagia", 4: "Senang", 3: "Netral", 2: "Sedih", 1: "Marah" };
      return map[latestScore] || "Belum diisi";
    }
    return "Belum diisi";
  });

  const handleMoodSelection = (label, score) => {
    setCurrentMoodText(label);
    const today = getTodayStr();
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    
    // Simpan score terbaru untuk hari ini
    savedMoods[today] = score;
    localStorage.setItem("user_moods_v3", JSON.stringify(savedMoods));

    // Update state grafik secara instan
    const updatedPoints = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      updatedPoints.push(savedMoods[ds] || 3);
    }
    setMoodData(updatedPoints);
  };

  const pages = [
    { name: "Beranda", path: "/" },
    { name: "Riwayat Mood", path: "/mood" },
    { name: "Tes Burnout", path: "/burnout" },
    { name: "Profil Saya", path: "/profile" },
    { name: "Artikel Kesehatan", path: "/artikel" }
  ]

  const moodMessages = {
    "Bahagia": "Wah bagus! Pertahankan ya! ✨",
    "Senang": "Hari yang indah! Tetap bersyukur ya! 😊",
    "Netral": "Hari yang tenang. Semangat terus! 🍃",
    "Sedih": "Gak apa-apa sedih, besok pasti lebih baik. 🫂",
    "Marah": "Sabar ya, tarik napas dalam-dalam... 🧘",
    "Belum diisi": "Yuk, catat perasaanmu hari ini!"
  };

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/login")
  }, [navigate])

  const getMoodEmoji = () => {
    const map = { "Bahagia": "😊", "Senang": "🙂", "Marah": "😡", "Sedih": "😢", "Netral": "😐" }
    return map[currentMoodText] || "❓"
  }

  return (
    <div className="min-h-screen pb-28 bg-cover bg-center bg-fixed relative flex flex-col font-sans"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">
        
        {/* SEARCH MODAL */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-6 flex justify-center items-start pt-20">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[30px] shadow-2xl overflow-hidden border border-white/20">
              <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
                <Search className="text-green-600" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Cari fitur..."
                  className="flex-1 bg-transparent outline-none text-sm text-green-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <X className="text-gray-400 cursor-pointer" size={20} onClick={() => {setIsSearchOpen(false); setSearchQuery("")}} />
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((page, index) => (
                  <div key={index} onClick={() => { navigate(page.path); setIsSearchOpen(false); }}
                    className="p-4 hover:bg-green-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-sm text-green-800 dark:text-slate-200"
                  >
                    {page.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className="flex justify-between items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-800/60 dark:text-green-300/60" size={20} onClick={() => navigate("/mood")} />
            <Search className="text-green-800/60 dark:text-green-300/60" size={20} onClick={() => setIsSearchOpen(true)} />
            <div onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 cursor-pointer">
                <User size={16} className="text-green-700 dark:text-green-400" />
            </div>
            <LogOut className="text-red-500/60" size={20} onClick={() => { localStorage.removeItem("isLoggedIn"); navigate("/login"); }} />
          </div>
        </header>

        <div className="p-5 flex-1">
          {/*  HALO SECTION */}
          <div 
            className="p-5 rounded-[35px] mb-4 flex justify-between items-center shadow-lg relative overflow-hidden h-[130px] border border-white/40 dark:border-slate-700"
            style={{ 
              backgroundImage: `url(${bgHalo})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'right' 
            }}
          >
            <div className="relative z-10 text-left bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-white/50 dark:border-slate-700 shadow-md max-w-[65%] transition-colors duration-500">
              <h2 className="font-extrabold text-lg text-[#5F7161] dark:text-green-400 leading-tight">
                Halo, {userName} 👋
              </h2>
              <p className="text-xs font-bold text-[#7A9D82] dark:text-slate-300">
                Bagaimana perasaanmu hari ini?
              </p>
            </div>
          </div>

          {/* MOOD STATUS */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md mb-4 overflow-hidden relative"
            style={{ backgroundImage: `url(${bgMood})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="text-left">
                <p className="text-xs text-green-900 dark:text-green-300 font-bold uppercase tracking-wider">Mood Kamu Hari Ini</p>
                <p className="text-[10px] font-bold text-green-700 dark:text-green-400 bg-white/60 dark:bg-black/50 px-3 py-1 rounded-full inline-block mt-2 shadow-sm border border-white/50 dark:border-slate-700">
                  {moodMessages[currentMoodText]}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-4xl drop-shadow-md">{getMoodEmoji()}</span>
                <div className="flex items-center gap-1 mt-1 bg-green-600/10 dark:bg-green-400/20 px-2 py-0.5 rounded-lg">
                  <span className="font-black text-xs text-green-800 dark:text-green-400 uppercase">{currentMoodText}</span>
                  <ArrowRight size={12} className="text-green-800 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

{/* Grid Tracker & Burnout */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-between">
              <h4 className="text-[10px] font-black mb-3 text-green-800/50 dark:text-white/40 uppercase tracking-widest text-left font-bold">Catat Mood</h4>
              <div className="grid grid-cols-5 gap-1 text-center">
                
                {/* Bahagia */}
                <div onClick={() => handleMoodSelection("Bahagia", 5)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Smile className="mx-auto text-yellow-500" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Bahagia</p>
                </div>

                {/* Senang */}
                <div onClick={() => handleMoodSelection("Senang", 4)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Smile className="mx-auto text-orange-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Senang</p>
                </div>

                {/* Netral */}
                <div onClick={() => handleMoodSelection("Netral", 3)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Meh className="mx-auto text-green-500" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Netral</p>
                </div>

                {/* Sedih */}
                <div onClick={() => handleMoodSelection("Sedih", 2)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Frown className="mx-auto text-blue-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Sedih</p>
                </div>

                {/* Marah */}
                <div onClick={() => handleMoodSelection("Marah", 1)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Angry className="mx-auto text-red-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Marah</p>
                </div>

              </div>
            </div>

            <div className="p-4 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-cover bg-center flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundImage: `url(${bgBurnout})` }}>
              <div className="absolute inset-0 bg-white/20 dark:bg-black/50"></div>
              <div className="relative z-10 text-left">
                <h4 className="text-[10px] font-black text-green-900/50 dark:text-white/60 uppercase tracking-widest text-left">Tes Burnout</h4>
                <p className="text-[9px] text-green-800 dark:text-slate-200 mt-1 font-bold">Ukur tingkat lelahmu.</p>
              </div>
              <button onClick={() => navigate("/burnout")} className="relative z-10 bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] mt-2 self-start shadow-md font-black hover:bg-green-700 transition-all">
                + MULAI TES
              </button>
            </div>
          </div>

          {/* Chart Section (100% AKURAT) */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md mb-8">
            <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/40 uppercase tracking-widest mb-4 text-left">Progress Minggu Ini</h3>
            <div className="h-44">
              <Line 
                data={{
                  labels: getLastSevenDaysLabels(), // Label Hari Dinamis
                  datasets: [{ 
                    data: moodData, // Data per tanggal
                    fill: true, 
                    backgroundColor: "rgba(22, 163, 74, 0.1)", 
                    tension: 0.4, 
                    borderColor: "#16a34a", 
                    borderWidth: 3,
                    pointBackgroundColor: "#ffffff", 
                    pointBorderColor: "#16a34a", 
                    pointBorderWidth: 2, 
                    pointRadius: 4 
                  }]
                }} 
                options={{ 
                  scales: { 
                    y: { min: 1, max: 5, ticks: { stepSize: 1, color: "#16a34a" }, grid: { color: "rgba(22, 163, 74, 0.05)" } },
                    x: { ticks: { color: "#16a34a", font: { weight: 'bold' } }, grid: { display: false } }
                  }, 
                  plugins: { legend: { display: false } }, 
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>

          {/* Artikel */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/40 uppercase tracking-widest text-left">Rekomendasi Artikel</h3>
              <button onClick={() => navigate("/artikel")} className="text-[10px] text-green-600 font-black hover:underline tracking-tighter">LIHAT SEMUA →</button>
            </div>
            <div className="flex flex-col gap-6">
              {recommendedArticles.map((article) => (
                <div key={article.id} onClick={() => navigate("/artikel")} className="relative p-6 rounded-[35px] shadow-lg bg-cover bg-center border border-white/40 dark:border-slate-700 transition-all flex justify-between items-center min-h-[130px] hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
                  style={{ backgroundImage: `url(${article.bgImage})` }}>
                  <div className="absolute inset-0 bg-white/10 dark:bg-black/30 group-hover:bg-transparent transition-colors"></div>
                  <div className="relative flex-1 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[25px] text-left border border-white/50"> 
                    <h4 className="font-black text-sm text-green-900 dark:text-green-400 mb-1 leading-tight">{article.title}</h4>
                    <p className="text-[10px] text-green-800 dark:text-slate-300 font-bold opacity-70">{article.desc}</p>
                  </div>
                  <div className="relative p-3 rounded-2xl bg-green-600 shadow-lg text-white ml-3 shrink-0"><ArrowRight size={18} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default Home