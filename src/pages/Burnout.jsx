import React, { useState, useEffect } from "react";
import { Bell, Search, User, ChevronLeft, Play, Clock, Trash2, Check, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg"; 

// 1. LAYOUT dengan Dukungan Dark Mode
const Layout = ({ children, navigate, handleLogout }) => (
  <div 
    className="min-min-h-screen bg-cover bg-center bg-fixed flex flex-col font-sans relative pb-28 transition-colors duration-500"
    style={{ backgroundImage: `url(${bgMoodPage})` }}
  >
    {/* Overlay Gelap */}
    <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">
      <header className="flex justify-between items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate("/")}>
          <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
          <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <MessageSquare className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => navigate("/mood")} />
          <Bell className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
          <Search className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
          <div 
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-green-200 active:scale-90 transition-all"
          >
              <User size={16} className="text-green-700 dark:text-green-400" />
          </div>
          <LogOut className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" size={20} onClick={handleLogout} />
        </div>
      </header>
      <div className="relative z-10 flex-1 px-4">{children}</div>
      <BottomNav />
    </div>
  </div>
);

const Gauge = ({ score }) => {
  const max = 32;
  const percentage = Math.min(score / max, 1);
  const radius = 80;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <svg height={110} width={200}>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="transparent" stroke="url(#gaugeGradient)" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }} />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A7D397" />
            <stop offset="50%" stopColor="#F2EE9E" />
            <stop offset="100%" stopColor="#F7A4A4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-12 flex flex-col items-center">
        <span className="text-4xl font-black text-green-900 dark:text-white">{score}</span>
        <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">
          {score <= 12 ? "Rendah" : score <= 20 ? "Sedang" : "Tinggi"}
        </span>
      </div>
    </div>
  );
};

function Burnout() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("home");
  const [answers, setAnswers] = useState({});
  const [userName] = useState(() => localStorage.getItem("userName") || "Pengguna");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("burnout_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("burnout_history", JSON.stringify(history));
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getResult = (score = totalScore) => {
    if (score <= 12) return { level: "Rendah", desc: "Kondisi kamu masih cukup stabil dan aman." };
    if (score <= 20) return { level: "Sedang", desc: "Kamu mulai merasa lelah, yuk luangkan waktu istirahat." };
    return { level: "Tinggi", desc: "Tingkat burnoutmu tinggi, sebaiknya konsultasi atau ambil jeda." };
  };

  const saveToHistory = () => {
    const result = getResult();
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      score: totalScore,
      level: result.level
    };
    setHistory([newEntry, ...history]); 
    setAnswers({});
    setViewMode("home");
  };

  const deleteHistory = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  if (viewMode === "home") {
    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-4">
          <div className="bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md rounded-[35px] p-8 mb-6 border border-white/40 dark:border-slate-700 shadow-lg">
            <h2 className="text-2xl font-extrabold text-green-900 dark:text-white mb-2 text-left">Halo, {userName}! 👋</h2>
            <p className="text-green-800 dark:text-slate-300 font-medium mb-6 text-sm text-left">Sudahkah kamu mengecek kondisi burnout-mu hari ini?</p>
            <button 
              onClick={() => setViewMode("quiz")} 
              className="bg-green-600 dark:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              <Play size={18} fill="currentColor" /> Mulai Tes Sekarang
            </button>
          </div>

          <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <Clock size={12} className="text-green-600 dark:text-green-400" /> Riwayat Aktivitas
          </h3>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-[35px] border border-white/40 dark:border-slate-700">
                <p className="text-green-700/50 dark:text-slate-500 text-xs italic font-medium">Belum ada data tes.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 rounded-[30px] border border-white/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 backdrop-blur-md shadow-sm transition-colors">
                  <div className="text-left">
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase mb-1">{item.date}</p>
                    <p className="font-bold text-green-900 dark:text-slate-200 text-sm">Level: <span className={item.level === "Tinggi" ? "text-red-500" : "text-green-600 dark:text-green-400"}>{item.level}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/80 dark:bg-slate-700 px-3 py-1 rounded-full text-[10px] font-black text-green-700 dark:text-green-400 border border-green-100 dark:border-slate-600">Skor: {item.score}</div>
                    <button onClick={() => deleteHistory(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (viewMode === "quiz") {
    const displayQuestions = [
      "Apakah kamu merasa sangat lelah setelah bekerja/belajar?",
      "Apakah kamu merasa sulit untuk berkonsentrasi?",
      "Apakah kamu merasa cepat marah atau tersinggung?",
      "Apakah kamu merasa kurang motivasi untuk memulai hari?",
      "Apakah kualitas tidurmu menurun belakangan ini?",
      "Apakah kamu merasa pekerjaanmu tidak memberikan hasil?",
      "Apakah kamu sering merasa sakit kepala atau otot tegang?",
      "Apakah kamu merasa ingin menjauh dari lingkungan sosial?"
    ];

    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="animate-in fade-in duration-500 pb-10">
          <button onClick={() => setViewMode("home")} className="mt-2 mb-4 text-green-700 dark:text-green-400 flex items-center gap-1 text-xs font-bold">
            <ChevronLeft size={18} /> Kembali
          </button>
          <h2 className="text-xl font-extrabold text-green-950 dark:text-white mb-6 text-left">Kuesioner Burnout</h2>
          
          <div className="space-y-5">
            {displayQuestions.map((q, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-md rounded-[30px] p-6 border border-white/40 dark:border-slate-700 shadow-sm transition-colors">
                <p className="text-sm font-bold text-green-950 dark:text-slate-200 mb-6 leading-relaxed text-left">{index + 1}. {q}</p>
                <div className="flex justify-between items-center px-1">
                  {[{ label: "Selalu", val: 4 }, { label: "Sering", val: 3 }, { label: "Kadang", val: 2 }, { label: "Jarang", val: 1 }, { label: "Tidak", val: 0 }].map((opt) => (
                    <label key={opt.val} className="flex flex-col items-center cursor-pointer">
                      <div className="relative mb-2">
                        <input type="radio" name={`q-${index}`} className="peer hidden" onChange={() => setAnswers({...answers, [index]: opt.val})} checked={answers[index] === opt.val} />
                        <div className="w-8 h-8 bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700 rounded-full peer-checked:bg-green-500 peer-checked:scale-110 flex items-center justify-center text-white transition-all shadow-sm">
                          <Check size={14} className="opacity-0 peer-checked:opacity-100 stroke-[4px]" />
                        </div>
                      </div>
                      <span className="text-[8px] text-green-700 dark:text-slate-400 font-bold uppercase">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setViewMode("result")} 
            disabled={Object.keys(answers).length < 8} 
            className={`w-full mt-10 py-4 font-bold rounded-2xl shadow-xl transition-all ${Object.keys(answers).length < 8 ? "bg-white/30 dark:bg-slate-800/30 text-green-900/30 dark:text-white/20" : "bg-green-600 dark:bg-green-700 text-white shadow-green-200 dark:shadow-none"}`}
          >
            Lihat Hasil Test
          </button>
        </div>
      </Layout>
    );
  }

  if (viewMode === "result") {
    const result = getResult();
    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="text-center animate-in zoom-in duration-500 pb-10">
          <h2 className="text-lg font-black text-green-900 dark:text-white mb-6 uppercase tracking-widest mt-4">Hasil Analisis</h2>
          <div className="bg-gradient-to-br from-white/70 to-green-50/50 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md rounded-[40px] py-8 border border-white/40 dark:border-slate-700 shadow-lg mb-6 flex flex-col items-center">
            <Gauge score={totalScore} />
          </div>
          <div className="rounded-[40px] p-8 text-left bg-white/60 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-lg">
            <p className="text-green-800 dark:text-slate-400 text-xs mb-1 font-bold uppercase tracking-wider">Status saat ini:</p>
            <h3 className="font-black text-green-600 dark:text-green-400 text-2xl mb-5">{result.level}</h3>
            <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white dark:border-slate-700 mb-8 shadow-inner italic text-xs dark:text-slate-300">
              "{result.desc}"
            </div>
            <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-green-500"></span> Saran Untukmu
            </h3>
            <ul className="space-y-4">
              {["Prioritaskan istirahat malam", "Luangkan 15 menit untuk meditasi", "Cari hobi baru yang menyenangkan"].map((tip, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-green-900 dark:text-slate-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={saveToHistory} className="w-full mt-8 py-4 bg-green-600 dark:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 active:scale-95 transition-all mb-10">SIMPAN & SELESAI</button>
        </div>
      </Layout>
    );
  }
}

export default Burnout;