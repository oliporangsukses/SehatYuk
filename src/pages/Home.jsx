import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry } from "lucide-react"

// Import image assets (Tanpa moodImage statis)
import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import ImageBurnout from "../assets/ImageBurnout.png"

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

function Home() {
  const navigate = useNavigate()
  
  const [userName, setUserName] = useState("Pengguna")
  const [moodData, setMoodData] = useState([3, 3, 3, 3, 3, 3, 3]) 
  const [currentMoodText, setCurrentMoodText] = useState("Belum diisi")

  // --- LOGIKA EMOJI DINAMIS ---
  // Fungsi ini untuk menentukan emoji apa yang tampil di kartu Mood
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const storedName = localStorage.getItem("userName")
    const savedMoods = localStorage.getItem("user_moods")

    if (storedName && storedName !== userName) {
      setUserName(storedName)
    }

    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods)
      if (parsedMoods.length > 0) {
        const lastSevenMoods = parsedMoods.slice(-7)
        if (JSON.stringify(lastSevenMoods) !== JSON.stringify(moodData)) {
          setMoodData(lastSevenMoods)
        }

        const latestScore = parsedMoods[parsedMoods.length - 1]
        const moodMap = { 5: "Bahagia", 4: "Senang", 3: "Netral", 2: "Sedih", 1: "Marah" }
        const newMoodText = moodMap[latestScore] || "Netral"
        if (newMoodText !== currentMoodText) {
          setCurrentMoodText(newMoodText)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const handleMoodSelection = (label, score) => {
    setCurrentMoodText(label)
    const savedMoods = localStorage.getItem("user_moods")
    let allMoods = savedMoods ? JSON.parse(savedMoods) : [3, 3, 3, 3, 3, 3] 
    const updatedMoods = [...allMoods, score]
    localStorage.setItem("user_moods", JSON.stringify(updatedMoods))
    setMoodData(updatedMoods.slice(-7))
  }

  const data = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Mood",
        data: moodData,
        fill: true,
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        tension: 0.4,
        borderColor: "#4ADE80",
        pointBackgroundColor: "#4ADE80",
        pointRadius: 5,
      },
    ],
  }

  const options = {
    scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } },
    maintainAspectRatio: false,
  }

  return (
    <div className="p-4 bg-[#F4FBF8] min-h-screen pb-24">
      <Navbar />

      {/* Section Halo */}
      <div
        className="p-5 rounded-3xl mb-4 flex justify-between items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHalo})` }}
      >
        <div>
          <h2 className="font-semibold text-lg">Halo, {userName} 👋</h2>
          <p className="text-sm text-gray-600">Bagaimana perasaanmu hari ini?</p>
        </div>
      </div>

      {/* Section Mood Status (DINAMIS) */}
      <div
        className="rounded-2xl p-4 mb-4 shadow-sm"
        style={{
          backgroundImage: `url(${bgMood})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 font-medium">Mood Kamu Hari Ini</p>
            <p className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {currentMoodText === "Belum diisi" ? "Yuk, catat perasaanmu!" : "Wah bagus! Pertahankan ya!"}
            </p>
          </div>
          <div className="flex flex-col items-end">
            {/* EMOJI BERUBAH DI SINI */}
            <span className="text-4xl mb-1">{getMoodEmoji()}</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-green-800">{currentMoodText}</span>
              <span className="text-green-800">➜</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50">
          <h4 className="text-xs font-bold mb-3 text-gray-700 uppercase tracking-wider">Mood Tracker</h4>
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

        <div
          className="p-3 rounded-3xl shadow-sm flex flex-col justify-between bg-cover bg-center border border-gray-50"
          style={{ backgroundImage: `url(${bgBurnout})` }}
        >
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tes Burnout</h4>
          <img src={ImageBurnout} alt="burnout" className="w-10 object-contain mx-auto" />
          <button 
            onClick={() => navigate("/burnout")}
            className="bg-white px-3 py-1 rounded-full text-[10px] mt-2 self-start shadow-sm font-bold text-green-600"
          >
            + Mulai Tes
          </button>
        </div>
      </div>

      <div className="p-4 rounded-3xl shadow-sm bg-white border border-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-700">Riwayat Mood</h3>
        </div>
        <div className="h-44">
          <Line data={data} options={options} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Home