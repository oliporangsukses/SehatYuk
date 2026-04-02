import { useState, useEffect } from "react"
import BottomNav from "../components/BottomNav"
// Menggunakan MoodBackground sebagai background utama
import bgMoodPage from "../assets/MoodBackground.jpeg" 
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

function Mood() {
  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains('dark');

  // --- HELPER TANGGAL ---
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // --- STATE (SINKRON DENGAN HOME) ---
  const [moodScores, setMoodScores] = useState(() => {
    const saved = localStorage.getItem("user_moods_v3");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [moodNotes, setMoodNotes] = useState(() => {
    const saved = localStorage.getItem("user_mood_notes_v3");
    return saved ? JSON.parse(saved) : [];
  });

  const [note, setNote] = useState("");
  const [selectedScore, setSelectedScore] = useState(null);

  // --- FUNGSI SIMPAN ---
  const addMood = () => {
    if (selectedScore === null) {
      alert("Pilih emoji mood dulu ya!");
      return;
    }

    const today = getTodayStr();
    
    // 1. Simpan Score untuk Grafik
    const updatedScores = { ...moodScores, [today]: selectedScore };
    setMoodScores(updatedScores);
    localStorage.setItem("user_moods_v3", JSON.stringify(updatedScores));

    // 2. Simpan Catatan untuk Riwayat
    const newNoteEntry = {
      score: selectedScore,
      note: note || "Tidak ada catatan",
      date: new Date().toLocaleDateString('id-ID', { weekday: 'short' }),
      fullDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    };
    
    const updatedNotes = [newNoteEntry, ...moodNotes].slice(0, 20);
    setMoodNotes(updatedNotes);
    localStorage.setItem("user_mood_notes_v3", JSON.stringify(updatedNotes));

    setNote("");
    setSelectedScore(null);
    alert("Mood berhasil disimpan! ✨");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // --- DATA GRAFIK 7 HARI ---
  const getLastSevenDays = () => {
    const labels = [];
    const dataPoints = [];
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      labels.push(days[d.getDay()]);
      dataPoints.push(moodScores[ds] || 3); 
    }
    return { labels, dataPoints };
  };

  const { labels, dataPoints } = getLastSevenDays();

  return (
    // BACKGROUND UTAMA MENGGUNAKAN MoodBackground.png
    <div className="p-5 min-h-screen pb-28 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="flex flex-col items-start mb-6 pt-4">
        <h1 className="text-2xl font-extrabold text-green-900 font-sans">Mood Tracker</h1>
        <p className="text-xs text-green-700 font-medium italic">Simpan memorimu hari ini...</p>
      </div>
      
      {/* CARD INPUT: Gradasi Glassmorphism menyesuaikan background */}
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
              className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-green-100 dark:border-slate-700 text-sm focus:outline-none text-green-900 dark:text-white placeholder:text-green-700/50 resize-none transition-colors"
              placeholder="Apa yang membuatmu merasa begini?"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            
            <button 
              onClick={addMood}
              className="w-full mt-4 bg-green-600 dark:bg-green-700 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 active:scale-95 transition-all"
            >
              Simpan Cerita Hari Ini
            </button>
          </div>

          {/* TREN MINGGUAN */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-900/90 backdrop-blur-md mb-6">
            <h3 className="font-black text-[10px] text-green-800/50 dark:text-slate-400 uppercase tracking-widest mb-4">Tren Mingguan</h3>
            <div className="h-44">
              <Line 
                data={{
                  labels: labels,
                  datasets: [{
                    data: dataPoints,
                    borderColor: "#22c55e", 
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#22c55e",
                    pointBorderWidth: 2
                  }]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { min: 1, max: 5, ticks: { stepSize: 1, color: isDark ? "#94a3b8" : "#14532d" }, grid: { display: false } },
                    x: { ticks: { color: isDark ? "#94a3b8" : "#14532d", font: { weight: 'bold' } }, grid: { display: false } }
                  },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* CARD STATISTIK */}
      <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-md mb-4">
        <h3 className="font-bold text-green-900 mb-4 text-sm text-left px-1">Statistik Mingguan</h3>
        <div className="h-44">
          <Line data={data} options={options} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default Mood;