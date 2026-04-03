import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIX
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg";

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

  const addMood = () => {
    if (selectedScore === null) {
      alert("Pilih emoji mood dulu ya!");
      return;
    }

    const today = getTodayStr();

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
    <div
      className="p-5 min-h-screen pb-28 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >
      <div className="flex flex-col items-start mb-6 pt-4">
        <h1 className="text-2xl font-extrabold text-green-900">Mood Tracker</h1>
        <p className="text-xs text-green-700 italic">Simpan memorimu hari ini...</p>
      </div>

      {/* INPUT */}
      <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-gradient-to-br from-white/70 to-green-50/50 backdrop-blur-md mb-6">
        <div className="flex justify-between mb-6 px-2">
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedScore(s)}
              className={`text-4xl transition-all ${
                selectedScore === s
                  ? "scale-125"
                  : "grayscale opacity-40 hover:opacity-100"
              }`}
            >
              {["", "😢", "😔", "😐", "😊", "😁"][s]}
            </button>
          ))}
        </div>

        <textarea
          className="w-full p-4 rounded-2xl bg-white/60 border text-sm"
          placeholder="Apa yang membuatmu merasa begini?"
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={addMood}
          className="w-full mt-4 bg-green-600 text-white py-4 rounded-2xl font-bold"
        >
          Simpan Cerita Hari Ini
        </button>
      </div>

      {/* GRAFIK */}
      <div className="p-6 rounded-[35px] shadow-lg border bg-white/70 backdrop-blur-md mb-6">
        <h3 className="text-xs mb-4">Tren Mingguan</h3>
        <div className="h-44">
          <Line
            data={{
              labels,
              datasets: [
                {
                  data: dataPoints,
                  borderColor: "#22c55e",
                  backgroundColor: "rgba(34,197,94,0.1)",
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Mood;