import { useState, useEffect } from "react"
import BottomNav from "../components/BottomNav"
import bgMoodPage from "../assets/MoodBackground.jpeg" 
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend)

function Mood() {
  const [moods, setMoods] = useState(() => {
    const savedMoods = localStorage.getItem("user_moods_v2")
    return savedMoods ? JSON.parse(savedMoods) : [
      { score: 3, note: "Hari normal", date: "Sen" },
      { score: 4, note: "Senang sekali", date: "Sel" },
      { score: 3, note: "Biasa saja", date: "Rab" },
      { score: 5, note: "Luar biasa!", date: "Kam" },
      { score: 2, note: "Sedikit lelah", date: "Jum" },
      { score: 3, note: "Santai", date: "Sab" },
      { score: 4, note: "Produktif", date: "Min" }
    ]
  })
  const [note, setNote] = useState("")
  const [selectedScore, setSelectedScore] = useState(null)

  useEffect(() => {
    localStorage.setItem("user_moods_v2", JSON.stringify(moods))
  }, [moods])

  const addMood = () => {
    if (selectedScore === null) {
      alert("Pilih emoji mood dulu ya!")
      return
    }
    const newEntry = {
      score: selectedScore,
      note: note || "Tidak ada catatan",
      date: new Date().toLocaleDateString('id-ID', { weekday: 'short' }),
      fullDate: new Date().toLocaleDateString()
    }
    const updatedMoods = [...moods, newEntry].slice(-7)
    setMoods(updatedMoods)
    setNote("")
    setSelectedScore(null)
  }

  const data = {
    labels: moods.map(m => m.date),
    datasets: [{
      data: moods.map(m => m.score),
      borderColor: "#15803d", 
      backgroundColor: "rgba(34, 197, 94, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#15803d",
      pointBorderWidth: 2
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        min: 1, 
        max: 5, 
        ticks: { 
          stepSize: 1, 
          color: "#14532d",
          callback: (v) => ["", "😢", "😔", "😐", "😊", "😁"][v] 
        },
        grid: { color: "rgba(20, 83, 45, 0.05)" }
      },
      x: {
        ticks: { color: "#14532d", font: { weight: 'bold' } },
        grid: { display: false }
      }
    },
    plugins: { legend: { display: false } }
  }

  return (
    <div className="p-5 min-h-screen pb-28 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="flex flex-col items-start mb-6 pt-4">
        <h1 className="text-2xl font-extrabold text-green-900 font-sans">Mood Tracker</h1>
        <p className="text-xs text-green-700 font-medium italic">Simpan memorimu hari ini...</p>
      </div>
      
      <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-md mb-6">
        <div className="flex justify-between mb-6 px-2">
          {[5, 4, 3, 2, 1].map((s) => (
            <button 
              key={s}
              onClick={() => setSelectedScore(s)} 
              className={`text-4xl transition-all duration-300 transform ${selectedScore === s ? "scale-125 drop-shadow-md" : "grayscale opacity-40 hover:opacity-100 hover:scale-110"}`}
            >
              {["", "😢", "😔", "😐", "😊", "😁"][s]}
            </button>
          ))}
        </div>

        <textarea 
          className="w-full p-4 rounded-2xl bg-white/60 border border-green-100/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-700/50 text-green-900 shadow-inner"
          placeholder="Tulis ceritamu di sini..."
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        
        <button 
          onClick={addMood}
          className="w-full mt-4 bg-green-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
        >
          Simpan Catatan
        </button>
      </div>

      {/* CARD RIWAYAT: Warna gradasi yang konsisten */}
      <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-md mb-6">
        <h3 className="font-bold text-green-900 mb-4 text-sm text-left px-1">Riwayat Perasaan</h3>
        <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {moods.slice().reverse().map((m, i) => (
            <div key={i} className="flex gap-4 items-center bg-white/40 p-3 rounded-2xl border border-white/50 shadow-sm">
              <span className="text-2xl">{["", "😢", "😔", "😐", "😊", "😁"][m.score]}</span>
              <div className="text-left flex-1">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-tight">{m.date} • {m.fullDate || 'Terbaru'}</p>
                <p className="text-xs text-green-950 font-medium line-clamp-2">"{m.note}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-md mb-4">
        <h3 className="font-bold text-green-900 mb-4 text-sm text-left px-1">Statistik Mingguan</h3>
        <div className="h-44">
          <Line data={data} options={options} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Mood