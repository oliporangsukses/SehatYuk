import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry, ArrowRight } from "lucide-react"

// Import assets
import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import bgArt1 from "../assets/ArticleBackground.jpeg" 
import bgArt2 from "../assets/ArticleBackground.jpeg"

// chart
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler)

const recommendedArticles = [
  { id: 1, title: "Cara Mengatasi Stres", desc: "Tips sederhana untuk mengurangi stres.", bgImage: bgArt1 },
  { id: 2, title: "Kesehatan Mental Remaja", desc: "Pentingnya menjaga mental sejak dini.", bgImage: bgArt2 },
];

function Home() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("Pengguna")
  const [moodData, setMoodData] = useState([3, 3, 3, 3, 3, 3, 3]) 
  const [currentMoodText, setCurrentMoodText] = useState("Belum diisi")

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

  // FIX: Menggunakan useEffect dengan dependensi kosong agar hanya jalan sekali saat mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const storedName = localStorage.getItem("userName")
    const savedMoods = localStorage.getItem("user_moods")

    if (storedName) {
      setUserName(storedName)
    }

    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods)
      if (parsedMoods.length > 0) {
        // Ambil 7 data terakhir
        const lastSevenMoods = parsedMoods.slice(-7)
        setMoodData(lastSevenMoods)
        
        const latestScore = parsedMoods[parsedMoods.length - 1]
        const moodMap = { 5: "Bahagia", 4: "Senang", 3: "Netral", 2: "Sedih", 1: "Marah" }
        setCurrentMoodText(moodMap[latestScore] || "Netral")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Biarkan kosong agar tidak terjadi cascading render

  const handleMoodSelection = (label, score) => {
    setCurrentMoodText(label)
    const savedMoods = localStorage.getItem("user_moods")
    let allMoods = savedMoods ? JSON.parse(savedMoods) : [3, 3, 3, 3, 3, 3] 
    const updatedMoods = [...allMoods, score].slice(-7)
    localStorage.setItem("user_moods", JSON.stringify(updatedMoods))
    setMoodData(updatedMoods)
  }

  return (
    <div className="p-4 bg-[#F4FBF8] min-h-screen pb-24">
      <Navbar />

      {/* Halo Section */}
      <div className="p-5 rounded-3xl mb-4 flex justify-between items-center bg-cover bg-center shadow-sm"
        style={{ backgroundImage: `url(${bgHalo})` }}>
        <div>
          <h2 className="font-semibold text-lg text-green-900">Halo, {userName} 👋</h2>
          <p className="text-sm text-green-700">Bagaimana perasaanmu hari ini?</p>
        </div>
      </div>

      {/* Mood Status */}
      <div className="rounded-2xl p-4 mb-4 shadow-sm border border-white/50"
        style={{ backgroundImage: `url(${bgMood})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 font-medium">Mood Kamu Hari Ini</p>
            <p className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {currentMoodText === "Belum diisi" ? "Yuk, catat perasaanmu!" : "Wah bagus! Pertahankan ya!"}
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
          <h4 className="text-[10px] font-bold mb-3 text-gray-400 uppercase tracking-wider">Mood Tracker</h4>
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

        {/* Card Burnout Bersih */}
        <div className="p-3 rounded-3xl shadow-sm flex flex-col justify-between bg-cover bg-center border border-gray-50"
          style={{ backgroundImage: `url(${bgBurnout})` }}>
          <div>
            <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Tes Burnout</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">Ukur tingkat lelahmu.</p>
          </div>
          <button onClick={() => navigate("/burnout")} className="bg-white px-3 py-1 rounded-full text-[10px] mt-2 self-start shadow-sm font-bold text-green-600 active:scale-95 transition-transform">+ Mulai Tes</button>
        </div>
      </div>

      {/* Riwayat Mood */}
      <div className="p-4 rounded-3xl shadow-sm bg-white border border-gray-50 mb-8">
        <h3 className="font-bold text-sm text-gray-700 mb-3">Riwayat Mood</h3>
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
              <div className="relative flex-1 pr-4 bg-white/70 backdrop-blur-[4px] p-4 rounded-2xl shadow-sm border border-white/50"> 
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