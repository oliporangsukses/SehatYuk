import React, { useState, useEffect } from "react";
import { User, Play, Clock, Trash2, Check, MessageSquare, LogOut, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import bgMoodPage from "../assets/MoodBackground.jpeg"; 

// Data burnoutQuestions.js
const questions = [
  { id: 1, question: "Saya merasa lelah secara emosional karena pekerjaan atau aktivitas sehari-hari." },
  { id: 2, question: "Saya merasa kehilangan motivasi untuk melakukan aktivitas yang biasanya saya sukai." },
  { id: 3, question: "Saya merasa pekerjaan atau tugas terasa sangat berat." },
  { id: 4, question: "Saya merasa sulit berkonsentrasi saat bekerja atau belajar." },
  { id: 5, question: "Saya merasa mudah marah atau frustrasi." },
  { id: 6, question: "Saya merasa energi saya cepat habis." },
  { id: 7, question: "Saya merasa tidak dihargai atas usaha yang saya lakukan." },
  { id: 8, question: "Saya merasa tertekan dengan tanggung jawab yang ada." }
];

const Layout = ({ children, navigate, handleLogout }) => (
  <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center items-start overflow-x-hidden transition-colors duration-500">
    <div 
      className="w-full min-h-screen bg-cover bg-center bg-fixed flex flex-col font-sans relative shadow-2xl"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >
      <div className="flex-1 bg-white/20 dark:bg-black/60 backdrop-blur-[2px] flex flex-col pb-28 text-slate-900 dark:text-white">
        <header className="w-full flex justify-between items-center p-5 pt-7 z-20 sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate("/")}>
            <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
            <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => navigate("/mood")} />
            <div onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 cursor-pointer shadow-sm">
                <User size={16} className="text-green-700 dark:text-green-400" />
            </div>
            <LogOut className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" size={20} onClick={handleLogout} />
          </div>
        </header>

        {/* Konten Utama */}
        <div className="relative z-10 flex-1 px-5 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
            {children}
        </div>
        
        <div className="fixed bottom-0 left-0 w-full z-30">
            <BottomNav />
        </div>
      </div>
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
  const strokeDashoffset = circumference - (percentage * circumference);

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <svg height={110} width={200}>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="transparent" stroke="url(#gaugeGradient)" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }} />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A7D397" /><stop offset="50%" stopColor="#F2EE9E" /><stop offset="100%" stopColor="#F7A4A4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-12 flex flex-col items-center">
        <span className="text-4xl font-black text-green-950 dark:text-white">{score}</span>
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
  const [userName] = useState(() => localStorage.getItem("userName") || "Olipia"); // Default ke namamu jika kosong
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("burnout_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem("burnout_history", JSON.stringify(history)); }, [history]);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  const getResult = (score = totalScore) => {
    if (score <= 12) return { level: "Rendah", desc: "Kondisi Anda stabil. Tetap jaga keseimbangan ya!" };
    if (score <= 20) return { level: "Sedang", desc: "Anda mulai merasa lelah. Luangkan waktu sejenak untuk istirahat." };
    return { level: "Tinggi", desc: "Tingkat burnout tinggi. Disarankan untuk mengambil jeda sejenak." };
  };

  const saveToHistory = () => {
    const result = getResult();
    const newEntry = { id: Date.now(), date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), score: totalScore, level: result.level };
    setHistory([newEntry, ...history]); setAnswers({}); setViewMode("home");
  };

  if (viewMode === "home") {
    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="mt-8 md:mt-12 max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[40px] p-8 md:p-12 mb-8 border border-white/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-green-950 dark:text-white mb-2">Halo, {userName}! 👋</h2>
                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-[0.2em] mb-6">Cek tingkat burnout Anda hari ini</p>
                <button onClick={() => setViewMode("quiz")} className="w-full md:w-max px-10 bg-green-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3"><Play size={18} fill="currentColor" /> MULAI TES SEKARANG</button>
            </div>
            <div className="hidden md:block w-48 h-48 bg-green-100/50 rounded-full flex items-center justify-center border border-white shadow-inner"><span className="text-6xl">📊</span></div>
          </div>
          <h3 className="font-black text-[10px] text-green-900/50 uppercase tracking-widest mb-6 flex items-center gap-2 px-2"><Clock size={14} /> RIWAYAT AKTIVITAS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.length === 0 ? (<div className="col-span-full text-center py-16 bg-white/40 rounded-[40px] border border-white/40 shadow-sm"><p className="text-[10px] font-black uppercase tracking-widest text-green-900/30">Belum ada data tes.</p></div>) : 
            (history.map((item) => (
                <div key={item.id} className="flex flex-col p-6 rounded-[35px] border border-white/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div><p className="text-[9px] text-green-600 font-black uppercase mb-1">{item.date}</p><p className="font-bold text-sm">Level: <span className={item.level === "Tinggi" ? "text-red-500" : "text-green-600"}>{item.level}</span></p></div>
                    <button onClick={() => setHistory(history.filter(h => h.id !== item.id))} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                  <div className="mt-auto bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-xl text-[10px] font-black text-green-700 text-center shadow-sm">Skor: {item.score}</div>
                </div>
            )))}
          </div>
        </div>
      </Layout>
    );
  }

  if (viewMode === "quiz") {
    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="max-w-3xl mx-auto py-10">
          <button onClick={() => setViewMode("home")} className="mb-6 text-green-700 dark:text-green-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-[-4px] transition-transform"><ChevronLeft size={16} /> Kembali</button>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-[30px] p-8 border border-white/40 shadow-sm">
                <p className="text-sm font-bold text-green-950 dark:text-white mb-6 text-left">{q.id}. {q.question}</p>
                <div className="flex justify-between px-2">
                  {[4, 3, 2, 1, 0].map((v) => (
                    <label key={v} className="flex flex-col items-center gap-2 cursor-pointer group">
                      <input type="radio" name={`q-${i}`} className="hidden peer" onChange={() => setAnswers({...answers, [i]: v})} checked={answers[i] === v} />
                      <div className="w-8 h-8 rounded-full border-2 border-green-200 peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center text-white"><Check size={14} strokeWidth={4} className={answers[i] === v ? "block" : "hidden"} /></div>
                      <span className="text-[8px] font-black uppercase text-green-900/40 dark:text-white/40 group-hover:text-green-600 transition-colors">
                        {v === 4 ? "Selalu" : v === 0 ? "Tidak" : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setViewMode("result")} 
            disabled={Object.keys(answers).length < questions.length} 
            className={`w-full mt-10 py-5 rounded-2xl font-black text-xs shadow-xl transition-all ${Object.keys(answers).length < questions.length ? "bg-white/20 text-green-900/20" : "bg-green-600 text-white hover:scale-[1.02] active:scale-[0.98]"}`}
          >
            LIHAT HASIL TEST
          </button>
        </div>
      </Layout>
    );
  }

  if (viewMode === "result") {
    const result = getResult();
    return (
      <Layout navigate={navigate} handleLogout={handleLogout}>
        <div className="max-w-2xl mx-auto py-10 text-center">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[40px] py-12 border border-white/40 shadow-xl mb-8 flex flex-col items-center">
            <Gauge score={totalScore} />
            <h3 className="text-2xl font-black text-green-600 mt-6 tracking-tight">{result.level}</h3>
            <p className="px-10 mt-4 italic text-sm text-green-900/70 dark:text-slate-300">"{result.desc}"</p>
          </div>
          <button onClick={saveToHistory} className="w-full py-5 bg-green-600 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-green-700 transition-all">SIMPAN & SELESAI</button>
        </div>
      </Layout>
    );
  }
}

export default Burnout;