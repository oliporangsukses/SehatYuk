import { useState, useEffect } from "react"
import BottomNav from "../components/BottomNav"
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
  // 1. Ambil data awal dari localStorage (Pastikan defaultnya 7 data agar grafik tidak kosong)
  const [moods, setMoods] = useState(() => {
    const savedMoods = localStorage.getItem("user_moods")
    // Jika kosong, berikan default 7 poin netral (skor 3)
    return savedMoods ? JSON.parse(savedMoods) : [3, 3, 3, 3, 3, 3, 3]
  })

  // 2. Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("user_moods", JSON.stringify(moods))
  }, [moods])

  const addMood = (value) => {
    // Ambil data lama, tambah baru, lalu potong jadi 7 data terakhir
    const newMoods = [...moods, value].slice(-7)
    setMoods(newMoods)
  }

  // 3. Konfigurasi Data Chart (Label disesuaikan Sen - Min)
  const data = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Level Kebahagiaan",
        data: moods,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#22c55e",
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
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
          callback: (value) => {
            const labels = { 5: "😁", 4: "😊", 3: "😐", 2: "😔", 1: "😢" }
            return labels[value] || value
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false // Sembunyikan label dataset agar lebih bersih
      }
    }
  }

  return (
    <div className="p-5 bg-[#F4FBF8] min-h-screen pb-24">
      <h1 className="text-2xl font-bold mb-2 text-green-900">Mood Tracker</h1>
      <p className="text-sm text-green-700 mb-6">Catat perasaanmu untuk melihat tren mingguan.</p>
      
      {/* Tombol Mood */}
      <div className="flex justify-between bg-white p-6 rounded-[32px] shadow-sm mb-8 border border-green-100">
        <button onClick={() => addMood(5)} className="text-4xl hover:scale-125 active:scale-90 transition-transform">😁</button>
        <button onClick={() => addMood(4)} className="text-4xl hover:scale-125 active:scale-90 transition-transform">😊</button>
        <button onClick={() => addMood(3)} className="text-4xl hover:scale-125 active:scale-90 transition-transform">😐</button>
        <button onClick={() => addMood(2)} className="text-4xl hover:scale-125 active:scale-90 transition-transform">😔</button>
        <button onClick={() => addMood(1)} className="text-4xl hover:scale-125 active:scale-90 transition-transform">😢</button>
      </div>

      {/* Grafik Mingguan */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm mb-6 border border-green-100">
        <h3 className="font-bold text-gray-700 mb-4 text-sm">Statistik Perasaan</h3>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="bg-green-100/50 p-4 rounded-2xl border border-green-200">
        <p className="text-xs text-green-800 text-center font-medium">
          💡 Tips: Klik emoji di atas setiap kali perasaanmu berubah!
        </p>
      </div>

      <BottomNav />
    </div>
  )
}

export default Mood