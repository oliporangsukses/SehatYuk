import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg"; 
import { 
  Bell, 
  User, 
  MessageSquare, 
  LogOut, 
  PlusCircle,
  History,
  ArrowRight
} from "lucide-react";

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
  const isDark = document.documentElement.classList.contains("dark");

  const getTodayStr = () => new Date().toISOString().split("T")[0];

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

  // ✅ TAMBAHAN (ambil userId dari login)
  const userId = localStorage.getItem("userId");

  const addMood = async () => {
    if (selectedScore === null) {
      alert("Pilih emoji mood dulu ya!");
      return;
    }

    const today = getTodayStr();

    console.log("USER ID:", userId);
    console.log("SCORE:", selectedScore);
    console.log("NOTE:", note);

    // =============================
    // ✅ TAMBAHAN: KIRIM KE BACKEND
    // =============================
    try {
  await fetch("http://localhost:5000/mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
   body: JSON.stringify({
  user_id: userId,
  mood: ["😡","😢","😐","🙂","😊"][selectedScore]
})
  });
} catch (error) {
  console.log("Gagal kirim ke backend:", error);
}

    // =============================
    // ❗ INI KODE ASLI KAMU (TIDAK DIUBAH)
    // =============================
    const updatedScores = { ...moodScores, [today]: selectedScore };
    setMoodScores(updatedScores);
    localStorage.setItem("user_moods_v3", JSON.stringify(updatedScores));

    const newNoteEntry = {
      score: selectedScore,
      note: note || "Tidak ada catatan",
      date: new Date().toLocaleDateString("id-ID", { weekday: "short" }),
      fullDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
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

  const getLastSevenDays = () => {
    const labels = [];
    const dataPoints = [];
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      labels.push(days[d.getDay()]);
      dataPoints.push(moodScores[ds] || 3);
    }
    return { labels, dataPoints };
  };

  const { labels, dataPoints } = getLastSevenDays();

  return (
    <div className="min-h-screen pb-28 bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">

        {/* HEADER */}
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
            <LogOut className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" size={20} onClick={handleLogout} />
          </div>
        </header>

        <div className="p-5 flex-1">
          {/* JUDUL */}
          <div className="flex flex-col items-start mb-6">
            <h1 className="text-2xl font-extrabold text-green-900 dark:text-white leading-tight">Mood Tracker</h1>
            <p className="text-xs text-green-700 dark:text-green-400 font-bold italic">Simpan memorimu hari ini...</p>
          </div>
          
          {/* INPUT CARD */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-900/90 backdrop-blur-md mb-6">
            <h3 className="font-black text-[10px] text-green-800/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PlusCircle size={12} /> Bagaimana Perasaanmu?
            </h3>
            <div className="flex justify-between mb-6 px-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <button 
                  key={s}
                  onClick={() => setSelectedScore(s)} 
                  className={`text-4xl transition-all duration-300 transform ${selectedScore === s ? "scale-125 drop-shadow-md grayscale-0" : "grayscale opacity-40 hover:opacity-100 hover:scale-110"}`}
                >
                  {["", "😡", "😢", "😐", "🙂", "😊"][s]}
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all text-green-900 dark:text-white"
              placeholder="Apa yang membuatmu merasa begini?"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            
            <button 
              onClick={addMood}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-green-700 transition-all"
            >
              SIMPAN MOOD
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
          </div>

          {/* RIWAYAT */}
          <div className="p-6 rounded-[35px] shadow-lg border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-900/90 backdrop-blur-md">
            <h3 className="font-black text-[10px] text-green-800/50 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={12} /> Catatan Terakhir
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {moodNotes.length > 0 ? moodNotes.map((m, i) => (
                <div key={i} className="flex gap-4 items-center bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="text-3xl">{["", "😡", "😢", "😐", "🙂", "😊"][m.score]}</span>
                  <div className="text-left flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">{m.date}, {m.fullDate}</p>
                      <ArrowRight size={10} className="text-green-400" />
                    </div>
                    <p className="text-xs text-green-950 dark:text-slate-200 font-bold leading-relaxed">"{m.note}"</p>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center">
                  <p className="text-[10px] text-green-800/30 dark:text-slate-500 font-black uppercase tracking-widest italic">Belum ada cerita hari ini...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Mood;