import { useState, useEffect } from "react" // Tambahkan useEffect
import BottomNav from "../components/BottomNav"
import { Line } from "react-chartjs-2"
// ... import ChartJS lainnya tetap sama

function Mood() {
  // 1. Ambil data awal dari localStorage jika ada
  const [moods, setMoods] = useState(() => {
    const savedMoods = localStorage.getItem("user_moods")
    return savedMoods ? JSON.parse(savedMoods) : []
  })

  // 2. Simpan ke localStorage setiap kali ada perubahan pada moods
  useEffect(() => {
    localStorage.setItem("user_moods", JSON.stringify(moods))
  }, [moods])

  const addMood = (value) => {
    // Batasi riwayat agar tidak terlalu panjang, misal 7 data terakhir
    const newMoods = [...moods, value].slice(-7)
    setMoods(newMoods)
  }

  // ... (Logika data chart & return JSX tetap sama seperti kode kamu)
  // Tapi pastikan labels-nya menarik, misal:
  const data = {
    labels: moods.map((_, i) => `Data ${i + 1}`),
    datasets: [
      {
        label: "Level Kebahagiaan",
        data: moods,
        borderColor: "#22c55e",
        tension: 0.4, // Agar garis melengkung cantik
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true
      }
    ]
  }

  return (
    <div className="p-5 bg-green-50 min-h-screen pb-24">
      {/* ... bagian header & tombol mood ... */}
      <h1 className="text-2xl font-bold mb-4 text-green-800">Mood Tracker</h1>
      
      <div className="flex justify-between bg-white p-6 rounded-3xl shadow-sm mb-8">
        <button onClick={() => addMood(5)} className="hover:scale-125 transition-transform">😁</button>
        <button onClick={() => addMood(4)} className="hover:scale-125 transition-transform">😊</button>
        <button onClick={() => addMood(3)} className="hover:scale-125 transition-transform">😐</button>
        <button onClick={() => addMood(2)} className="hover:scale-125 transition-transform">😔</button>
        <button onClick={() => addMood(1)} className="hover:scale-125 transition-transform">😢</button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 h-64 flex items-center">
        <Line data={data} options={{ maintainAspectRatio: false }} />
      </div>

      {/* ... bagian riwayat ... */}
      <BottomNav />
    </div>
  )
}

export default Mood