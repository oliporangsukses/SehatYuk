import React, { useState, useEffect } from "react";
import { Mail, Bell, Search, User, ChevronLeft, Play, Clock, Trash2, Check } from "lucide-react";
import { questions } from "../data/burnoutQuestions";

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
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="transparent" stroke="rgba(255,255,255,0.3)" strokeWidth={stroke} strokeLinecap="round" />
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
        <span className="text-4xl font-black text-slate-700">{score}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {score <= 12 ? "Rendah" : score <= 20 ? "Sedang" : "Tinggi"}
        </span>
      </div>
    </div>
  );
};

function Burnout() {
  const [viewMode, setViewMode] = useState("home");
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("burnout_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("burnout_history", JSON.stringify(history));
  }, [history]);

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
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score: totalScore,
      level: result.level
    };
    setHistory([newEntry, ...history]); 
    setAnswers({});
    setViewMode("home");
  };

  const Header = () => (
    <header className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
      <div className="flex items-center gap-1 text-[#7A9E6D] font-black text-xl cursor-pointer" onClick={() => setViewMode("home")}>
        <span className="text-2xl">🌿</span> SehatYuk
      </div>
      <div className="flex gap-4 text-slate-500 items-center">
        <Mail size={22} className="hover:text-[#A7D397] transition-colors cursor-pointer" />
        <Bell size={22} className="hover:text-[#A7D397] transition-colors cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-[#A7D397]/20 flex items-center justify-center border border-[#A7D397]/30 hover:scale-110 transition-transform cursor-pointer">
          <User size={18} className="text-[#7A9E6D]" />
        </div>
      </div>
    </header>
  );

  const Layout = ({ children }) => (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed max-w-md mx-auto flex flex-col font-sans relative"
      style={{ backgroundImage: "url('/assets/MoodBackground.jpeg')" }}
    >
      {/* Overlay agar konten tetap terbaca */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      <Header />
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );

  if (viewMode === "home") {
    return (
      <Layout>
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 text-center mb-8 border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <h2 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-[#7A9E6D] transition-colors">Halo, Selamat Datang!</h2>
            <p className="text-slate-600 font-medium mb-6">Sudahkah kamu mengecek kondisi burnout-mu hari ini?</p>
            <button 
              onClick={() => setViewMode("quiz")} 
              className="bg-[#A7D397] text-white px-10 py-3 rounded-full font-black shadow-lg hover:bg-[#96c286] hover:shadow-[#A7D397]/40 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              <Play size={18} fill="currentColor" /> Mulai Tes
            </button>
          </div>

          <h3 className="text-md font-black text-slate-700 mb-4 flex items-center gap-2 px-2">
            <Clock size={18} className="text-[#7A9E6D]" /> Riwayat Aktivitas
          </h3>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-[2.5rem] border border-white/40">
                <p className="text-slate-500 text-sm italic">Belum ada data tes.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-5 rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-md hover:bg-white/60 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{item.date}</p>
                    <p className="font-bold text-slate-700">Level: <span className={item.level === "Tinggi" ? "text-rose-400" : "text-[#7A9E6D]"}>{item.level}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-black text-[#7A9E6D] shadow-sm">Skor: {item.score}</div>
                    <button onClick={() => deleteHistory(item.id)} className="text-slate-400 hover:text-rose-500 hover:rotate-12 transition-all"><Trash2 size={18} /></button>
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
    return (
      <Layout>
        <div className="p-5 animate-in fade-in duration-500">
          <button onClick={() => setViewMode("home")} className="mb-4 text-slate-500 flex items-center gap-1 text-sm font-bold hover:text-slate-800 transition-colors">
            <ChevronLeft size={18} /> Kembali
          </button>
          <h2 className="text-2xl font-black text-slate-800 mb-8 px-2 tracking-tight">Kuesioner Burnout</h2>
          
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-white/40 backdrop-blur-lg rounded-[2.5rem] p-7 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[15px] font-bold text-slate-800 mb-8 leading-relaxed">{index + 1}. {q.question}</p>
                <div className="flex justify-between items-center gap-1">
                  {[
                    { label: "Selalu", val: 4 }, { label: "Sering", val: 3 }, 
                    { label: "Kadang", val: 2 }, { label: "Jarang", val: 1 }, { label: "Tidak", val: 0 }
                  ].map((opt) => (
                    <label key={opt.val} className="flex flex-col items-center cursor-pointer group">
                      <div className="relative mb-2">
                        <input type="radio" name={`q-${index}`} className="peer hidden" onChange={() => setAnswers({...answers, [index]: opt.val})} checked={answers[index] === opt.val} />
                        <div className="w-8 h-8 bg-white border-2 border-white rounded-full peer-checked:bg-[#A7D397] peer-checked:scale-110 flex items-center justify-center text-white transition-all shadow-sm group-hover:border-[#A7D397]">
                          <Check size={16} className="opacity-0 peer-checked:opacity-100 stroke-[4px]" />
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter peer-checked:text-[#7A9E6D] group-hover:text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setViewMode("result")} 
            disabled={Object.keys(answers).length !== questions.length} 
            className={`w-full mt-12 py-5 font-black rounded-3xl shadow-xl transition-all active:scale-95 mb-10 ${Object.keys(answers).length !== questions.length ? "bg-white/20 text-slate-400 cursor-not-allowed" : "bg-[#A7D397] text-white hover:bg-[#96c286]"}`}
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
      <Layout>
        <div className="p-6 text-center animate-in zoom-in duration-500">
          <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-widest px-4">Hasil Analisis Kamu</h2>
          
          <div className="rounded-[3rem] p-5 mb-8 bg-cover bg-center shadow-2xl relative overflow-hidden group" style={{ backgroundImage: "url('/bgHasil.jpeg')" }}>
             <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-all duration-500"></div>
             <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] py-8 border border-white/40 relative z-10 shadow-inner">
               <Gauge score={totalScore} />
             </div>
          </div>

          <div className="rounded-[3rem] p-8 text-left relative overflow-hidden bg-cover bg-center shadow-xl border border-white/30" style={{ backgroundImage: "url('/bgRiwayat.png')" }}>
            <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <p className="text-slate-600 text-sm mb-5 font-medium">Status saat ini: <span className="font-black text-[#7A9E6D] uppercase text-lg block">{result.level}</span></p>
              <div className="bg-white/80 p-5 rounded-3xl border border-white mb-8 shadow-sm hover:scale-[1.01] transition-transform">
                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{result.desc}"</p>
              </div>
              <h3 className="font-black text-slate-800 mb-5 tracking-tight uppercase text-[10px] flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#A7D397]"></span> Saran Perbaikan
              </h3>
              <ul className="space-y-4">
                {["Prioritaskan istirahat", "Atur jadwal lebih fleksibel", "Cari waktu untuk self-reward"].map((tip, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm text-slate-700 font-bold group">
                    <div className="w-7 h-7 rounded-full bg-[#A7D397] flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">✓</div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={saveToHistory} className="w-full mt-10 py-5 bg-[#A7D397] text-white font-black rounded-3xl shadow-lg hover:shadow-[#A7D397]/40 active:scale-95 transition-all mb-10">SIMPAN & KELUAR</button>
        </div>
      </Layout>
    );
  }
}

export default Burnout;