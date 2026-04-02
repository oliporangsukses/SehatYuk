import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry, ArrowRight, MessageSquare, Bell, Search, LogOut, X, User } from "lucide-react"
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
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler)

const recommendedArticles = [
  { id: 1, title: "Cara Mengatasi Stres", desc: "Tips sederhana untuk mengurangi stres.", bgImage: bgArt1 },
  { id: 2, title: "Kesehatan Mental Remaja", desc: "Pentingnya menjaga mental sejak dini.", bgImage: bgArt2 },
];

function Home() {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userName] = useState(() => localStorage.getItem("userName") || "Pengguna")
  
  const pages = [
    { name: "Home / Beranda", path: "/" },
    { name: "Mood Tracker / Riwayat", path: "/mood" },
    { name: "Tes Burnout", path: "/burnout" },
    { name: "Profile / Pengaturan", path: "/profile" },
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

  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [moodData, setMoodData] = useState(() => {
    const saved = localStorage.getItem("user_moods")
    return saved ? JSON.parse(saved).slice(-7) : [3, 3, 3, 3, 3, 3, 3]
  })

  const [currentMoodText, setCurrentMoodText] = useState(() => {
    const saved = localStorage.getItem("user_moods")
    if (saved) {
      const parsed = JSON.parse(saved)
      const latestScore = parsed[parsed.length - 1]
      const moodMap = { 5: "Bahagia", 4: "Senang", 3: "Netral", 2: "Sedih", 1: "Marah" }
      return moodMap[latestScore] || "Netral"
    }
    return "Belum diisi"
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  };

  const handleMoodSelection = (label, score) => {
    setCurrentMoodText(label)
    const savedMoods = localStorage.getItem("user_moods")
    let allMoods = savedMoods ? JSON.parse(savedMoods) : [3, 3, 3, 3, 3, 3] 
    const updatedMoods = [...allMoods, score].slice(-7)
    localStorage.setItem("user_moods", JSON.stringify(updatedMoods))
    setMoodData(updatedMoods)
  }

  const getMoodEmoji = () => {
    switch (currentMoodText) {
      case "Bahagia": return "😊";
      case "Senang": return "🙂";
      case "Marah": return "😡";
      case "Sedih": return "😢";
      case "Netral": return "😐";
      default: return "❓"; 
    }
  }

  return (
    <div className="min-h-screen pb-28 bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      {/* Overlay Gelap Global */}
      <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">
        
        {/* SEARCH MODAL OVERLAY */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-6 flex justify-center items-start pt-20">
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-md w-full max-w-md rounded-[35px] shadow-xl overflow-hidden border border-white/40 dark:border-slate-700">
              <div className="p-5 border-b border-green-100 dark:border-slate-800 flex items-center gap-3">
                <Search className="text-green-600 dark:text-green-400" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Cari fitur SehatYuk..."
                  className="flex-1 bg-transparent outline-none text-sm text-green-900 dark:text-white placeholder:text-green-700/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <X className="text-green-400 cursor-pointer hover:text-red-400" size={20} onClick={() => {setIsSearchOpen(false); setSearchQuery("")}} />
              </div>
              <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredPages.length > 0 ? filteredPages.map((page, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      navigate(page.path)
                      setIsSearchOpen(false)
                    }}
                    className="p-4 hover:bg-green-50/50 dark:hover:bg-slate-800 rounded-2xl cursor-pointer text-sm text-green-800 dark:text-slate-200 flex justify-between items-center transition-colors"
                  >
                    {page.name}
                    <ArrowRight size={14} className="text-green-500" />
                  </div>
                )) : (
                  <p className="p-6 text-center text-xs text-green-700/50 italic">Fitit tidak ditemukan...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HEADER SECTION */}
        <header className="flex justify-between items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate("/")}>
            <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
            <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => navigate("/mood")} />
            <Bell className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
            <Search className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => setIsSearchOpen(true)} />
            
            <div 
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-green-200 active:scale-90 transition-all"
            >
                <User size={16} className="text-green-700 dark:text-green-400" />
            </div>

            <LogOut className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" size={20} onClick={handleLogout} />
          </div>
        </header>

        <div className="p-5 flex-1">
          {/* Halo Section */}
          <div 
            className="p-5 rounded-[35px] mb-4 flex justify-between items-center shadow-lg relative overflow-hidden h-[130px] border border-white/40 dark:border-slate-700"
            style={{ 
              backgroundImage: `url(${bgHalo})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'right' 
            }}
          >
            <div className="relative z-10 text-left bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-white/50 dark:border-slate-700 shadow-md max-w-[65%] transition-colors duration-500">
              <h2 className="font-extrabold text-lg text-[#5F7161] dark:text-green-400">
                Halo, {userName} 👋
              </h2>
              <p className="text-xs font-bold text-[#7A9D82] dark:text-slate-300">
                Bagaimana perasaanmu hari ini?
              </p>
            </div>
          </div>

          {/* Mood Status */}
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
              <h4 className="text-[10px] font-black mb-3 text-green-800/50 dark:text-white/40 uppercase tracking-widest text-left">Mood Tracker</h4>
              <div className="grid grid-cols-5 gap-1 text-center">
                {/* Ikon Mood disesuaikan warnanya jika perlu, tapi Lucide biasanya sudah kontras */}
                <div onClick={() => handleMoodSelection("Bahagia", 5)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Smile className="mx-auto text-yellow-500" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Bahagia</p>
                </div>
                <div onClick={() => handleMoodSelection("Senang", 4)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Smile className="mx-auto text-orange-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Senang</p>
                </div>
                <div onClick={() => handleMoodSelection("Netral", 3)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Meh className="mx-auto text-green-500" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Netral</p>
                </div>
                <div onClick={() => handleMoodSelection("Sedih", 2)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Frown className="mx-auto text-blue-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Sedih</p>
                </div>
                <div onClick={() => handleMoodSelection("Marah", 1)} className="cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                  <Angry className="mx-auto text-red-400" size={18}/>
                  <p className="text-[7px] font-bold text-green-900 dark:text-slate-200 mt-1">Marah</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-cover bg-center flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundImage: `url(${bgBurnout})` }}>
              <div className="absolute inset-0 bg-white/20 dark:bg-black/50"></div>
              <div className="relative z-10">
                <h4 className="text-[10px] font-black text-green-900/50 dark:text-white/60 uppercase tracking-widest text-left">Tes Burnout</h4>
                <p className="text-[9px] text-green-800 dark:text-slate-200 mt-1 font-bold leading-tight">Ukur tingkat lelahmu.</p>
              </div>
              <button onClick={() => navigate("/burnout")} className="relative z-10 bg-green-600 dark:bg-green-700 text-white px-4 py-1.5 rounded-full text-[10px] mt-2 self-start shadow-md font-black hover:bg-green-700 active:scale-95 transition-all">
                + MULAI TES
              </button>
            </div>
          </div>

          {/* Riwayat Mood / Chart */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md mb-8">
            <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/40 uppercase tracking-widest mb-4 text-left px-1">Statistik Mingguan</h3>
            <div className="h-44">
              <Line data={{
                labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
                datasets: [{ 
                  data: moodData, 
                  fill: true, 
                  backgroundColor: isSearchOpen ? "rgba(34, 197, 94, 0.05)" : "rgba(34, 197, 94, 0.1)", 
                  tension: 0.4, 
                  borderColor: "#16a34a", 
                  pointBackgroundColor: "#ffffff",
                  pointBorderColor: "#16a34a",
                  pointBorderWidth: 2,
                  pointRadius: 5 
                }]
              }} options={{ 
                scales: { 
                  y: { 
                    min: 1, 
                    max: 5, 
                    ticks: { stepSize: 1, color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#14532d" }, 
                    grid: { color: "rgba(20, 83, 45, 0.05)" } 
                  },
                  x: { 
                    ticks: { color: document.documentElement.classList.contains('dark') ? "#94a3b8" : "#14532d", font: { weight: 'bold' } }, 
                    grid: { display: false } 
                  }
                }, 
                plugins: { legend: { display: false } },
                maintainAspectRatio: false 
              }} />
            </div>
          </div>

          {/* Rekomendasi Artikel */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-5 px-2">
              <h3 className="font-black text-[10px] text-green-900/50 dark:text-white/40 uppercase tracking-widest">Rekomendasi Artikel</h3>
              <button onClick={() => navigate("/artikel")} className="text-[10px] text-green-600 dark:text-green-400 font-black hover:underline tracking-tighter">LIHAT SEMUA →</button>
            </div>
            
            <div className="flex flex-col gap-6">
              {recommendedArticles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => navigate("/artikel")} 
                  className="relative p-6 rounded-[35px] shadow-lg bg-cover bg-center border border-white/40 dark:border-slate-700 transition-all duration-300 cursor-pointer flex justify-between items-center min-h-[130px] hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
                  style={{ backgroundImage: `url(${article.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-white/10 dark:bg-black/30 group-hover:bg-transparent transition-colors"></div>
                  <div className="relative flex-1 pr-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[25px] shadow-sm border border-white/50 dark:border-slate-700 text-left transition-colors duration-500"> 
                    <h4 className="font-black text-sm text-green-900 dark:text-green-400 mb-1 leading-tight">{article.title}</h4>
                    <p className="text-[10px] text-green-800 dark:text-slate-300 font-bold line-clamp-2 leading-snug opacity-70">{article.desc}</p>
                  </div>
                  <div className="relative p-3 rounded-2xl bg-green-600 shadow-lg text-white ml-3 shrink-0 group-hover:rotate-12 transition-transform">
                    <ArrowRight size={18} />
                  </div>
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