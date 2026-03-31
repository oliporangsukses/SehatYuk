import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry, ArrowRight, MessageSquare, Bell, Search, LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import bgArt1 from "../assets/ArticleBackground.jpeg" 
import bgArt2 from "../assets/ArticleBackground.jpeg"

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

  const [userName] = useState(() => localStorage.getItem("userName") || "Pengguna")
  
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
  }

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
      case "Senang": return "😊";
      case "Marah": return "😡";
      case "Sedih": return "😢";
      case "Netral": return "😐";
      default: return "❓"; 
    }
  }

  return (
    <div className="p-4 bg-[#F4FBF8] min-h-screen pb-24 relative font-sans text-left">
      
      {/* SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-6 flex justify-center items-start pt-20">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
              <Search className="text-gray-400" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Cari fitur..."
                className="flex-1 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <X className="text-gray-400 cursor-pointer" size={20} onClick={() => {setIsSearchOpen(false); setSearchQuery("")}} />
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              {filteredPages.length > 0 ? filteredPages.map((page, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    navigate(page.path)
                    setIsSearchOpen(false)
                  }}
                  className="p-3 hover:bg-green-50 rounded-xl cursor-pointer text-sm text-gray-700 flex justify-between items-center"
                >
                  {page.name}
                  <ArrowRight size={14} className="text-green-500" />
                </div>
              )) : (
                <p className="p-4 text-center text-xs text-gray-400">Fitur tidak ditemukan...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 px-2 pt-2">
        <h1 className="text-xl font-bold text-green-600">SehatYuk</h1>
        <div className="flex items-center gap-4">
          <MessageSquare className="text-green-800/60 cursor-pointer hover:text-green-800" size={22} onClick={() => navigate("/mood")} />
          <Bell className="text-green-800/60 cursor-pointer hover:text-green-800" size={22} />
          <Search className="text-green-800/60 cursor-pointer hover:text-green-800" size={22} onClick={() => setIsSearchOpen(true)} />
          <LogOut className="text-red-500/70 cursor-pointer hover:text-red-600" size={22} onClick={handleLogout} />
        </div>
      </div>

      {/* Halo Section */}
      <div className="p-5 rounded-3xl mb-4 flex justify-between items-center bg-cover bg-center shadow-sm"
        style={{ backgroundImage: `url(${bgHalo})` }}>
        <div className="text-left">
          <h2 className="font-semibold text-lg text-green-900">Halo, {userName} 👋</h2>
          <p className="text-sm text-green-700">Bagaimana perasaanmu hari ini?</p>
        </div>
      </div>

      {/* Mood Status */}
      <div className="rounded-2xl p-4 mb-4 shadow-sm border border-white/50"
        style={{ backgroundImage: `url(${bgMood})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600 font-medium text-left">Mood Kamu Hari Ini</p>
            {/* Bagian teks yang jadi dinamis sesuai moodMessages */}
            <p className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {moodMessages[currentMoodText]}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-4xl mb-1">{getMoodEmoji()}</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-green-800">{currentMoodText}</span>
              <span className="text-green-800">➜</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Tracker & Burnout */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50 flex flex-col justify-between">
          <h4 className="text-[10px] font-bold mb-3 text-gray-400 uppercase tracking-wider text-left">Mood Tracker</h4>
          <div className="flex justify-between text-center text-[10px]">
            <div onClick={() => handleMoodSelection("Bahagia", 5)} className="cursor-pointer active:scale-90 transition-transform">
              <Smile className="mx-auto text-yellow-500 mb-1" size={24}/> bahagia
            </div>
            <div onClick={() => handleMoodSelection("Marah", 1)} className="cursor-pointer active:scale-90 transition-transform">
              <Angry className="mx-auto text-red-500 mb-1" size={24}/> marah
            </div>
            <div onClick={() => handleMoodSelection("Netral", 3)} className="cursor-pointer active:scale-90 transition-transform">
              <Meh className="mx-auto text-green-500 mb-1" size={24}/> netral
            </div>
            <div onClick={() => handleMoodSelection("Sedih", 2)} className="cursor-pointer active:scale-90 transition-transform">
              <Frown className="mx-auto text-blue-500 mb-1" size={24}/> sedih
            </div>
          </div>
        </div>

        <div className="p-3 rounded-3xl shadow-sm flex flex-col justify-between bg-cover bg-center border border-gray-50 text-left"
          style={{ backgroundImage: `url(${bgBurnout})` }}>
          <div>
            <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Tes Burnout</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight font-medium">Ukur tingkat lelahmu.</p>
          </div>
          <button onClick={() => navigate("/burnout")} className="bg-white px-3 py-1 rounded-full text-[10px] mt-2 self-start shadow-sm font-bold text-green-600 active:scale-95 transition-transform">+ Mulai Tes</button>
        </div>
      </div>

      {/* Riwayat Mood */}
      <div className="p-4 rounded-3xl shadow-sm bg-white border border-gray-50 mb-8">
        <h3 className="font-bold text-sm text-gray-700 mb-3 text-left">Riwayat Mood</h3>
        <div className="h-44">
          <Line data={{
            labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
            datasets: [{ 
              label: "Mood", 
              data: moodData, 
              fill: true, 
              backgroundColor: "rgba(74, 222, 128, 0.1)", 
              tension: 0.4, 
              borderColor: "#4ADE80", 
              pointBackgroundColor: "#4ADE80", 
              pointRadius: 5 
            }]
          }} options={{ 
            scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } }, 
            maintainAspectRatio: false 
          }} />
        </div>
      </div>

      {/* Rekomendasi Artikel */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="font-bold text-sm text-gray-700">Rekomendasi Artikel</h3>
          <button onClick={() => navigate("/artikel")} className="text-[10px] text-green-600 font-bold hover:underline">Lihat Semua →</button>
        </div>
        
        <div className="flex flex-col gap-6">
          {recommendedArticles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => navigate("/artikel")} 
              className="relative p-6 rounded-[32px] shadow-md bg-cover bg-center border border-white transition-all duration-300 cursor-pointer flex justify-between items-center min-h-[120px] hover:scale-[1.02] active:scale-[0.98] group"
              style={{ backgroundImage: `url(${article.bgImage})` }}
            >
              <div className="absolute inset-0 bg-black/5 rounded-[32px] group-hover:bg-black/10 transition-colors"></div>
              <div className="relative flex-1 pr-4 bg-white/70 backdrop-blur-[4px] p-4 rounded-2xl shadow-sm border border-white/50 text-left"> 
                <h4 className="font-bold text-sm text-green-900 mb-1">{article.title}</h4>
                <p className="text-[11px] text-green-800 font-medium line-clamp-2 leading-tight">{article.desc}</p>
              </div>
              <div className="relative p-3 rounded-full bg-white shadow-lg text-green-600 ml-3 shrink-0">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Home