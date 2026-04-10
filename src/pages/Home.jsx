import BottomNav from "../components/BottomNav"
import { Smile, Frown, Meh, Angry, ArrowRight, MessageSquare, Search, LogOut, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import bgArt1 from "../assets/BackgroundArtikel1.png" 
import bgArt2 from "../assets/BackgroundArtikel2.png"
import bgMoodPage from "../assets/MoodBackground.jpeg" 

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip)

const recommendedArticles = [
  { id: 1, title: "Cara Mengatasi Stres", desc: "Tips sederhana untuk mengurangi beban pikiranmu hari ini.", bgImage: bgArt1 },
  { id: 2, title: "Kesehatan Mental Remaja", desc: "Pentingnya menjaga kesehatan mental sejak usia dini.", bgImage: bgArt2 },
];

function Home() {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userName] = useState(() => localStorage.getItem("userName") || "Pengguna")

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const getLastSevenDaysLabels = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
    }
    return labels;
  };

  const [moodData, setMoodData] = useState(() => {
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    const dataPoints = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      dataPoints.push(savedMoods[ds] || 3);
    }
    return dataPoints;
  });

  const [currentMoodText, setCurrentMoodText] = useState(() => {
    const today = getTodayStr();
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    const latestScore = savedMoods[today];
    if (latestScore) {
      const map = { 5: "Bahagia", 4: "Senang", 3: "Netral", 2: "Sedih", 1: "Marah" };
      return map[latestScore] || "Belum diisi";
    }
    return "Belum diisi";
  });

  const handleMoodSelection = (label, score) => {
    setCurrentMoodText(label);
    const today = getTodayStr();
    const savedMoods = JSON.parse(localStorage.getItem("user_moods_v3") || "{}");
    savedMoods[today] = score;
    localStorage.setItem("user_moods_v3", JSON.stringify(savedMoods));

    const updatedPoints = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      updatedPoints.push(savedMoods[ds] || 3);
    }
    setMoodData(updatedPoints);
  };

  const pages = [
    { name: "Beranda", path: "/" },
    { name: "Riwayat Mood", path: "/mood" },
    { name: "Tes Burnout", path: "/burnout" },
    { name: "Profil Saya", path: "/profile" },
    { name: "Artikel Kesehatan", path: "/artikel" }
  ]

  const moodMessages = {
    "Bahagia": "Wah bagus! Pertahankan ya! ✨",
    "Senang": "Hari yang indah! Tetap bersyukur ya! 😊",
    "Netral": "Hari yang tenang. Semangat terus! 🍃",
    "Sedih": "Gak apa-apa sedih, besok pasti lebih baik. 🫂",
    "Marah": "Sabar ya, tarik napas dalam-dalam... 🧘",
    "Belum diisi": "Yuk, catat perasaanmu hari ini!"
  };

  const healthTips = [
    "Minum air putih minimal 8 gelas hari ini ya! 💧",
    "Istirahatkan mata sejenak dari layar laptopmu. 👀",
    "Jalan santai 10 menit bisa buat mood lebih baik! 🚶‍♀️",
    "Tarik napas dalam, buang perlahan... Relax. 🧘‍♀️",
    "Coba tulis 3 hal yang kamu syukuri hari ini. ✨"
  ];
  const [randomTip] = useState(() => healthTips[Math.floor(Math.random() * healthTips.length)]);

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) navigate("/login")
  }, [navigate])

  const getMoodEmoji = () => {
    const map = { "Bahagia": "😊", "Senang": "🙂", "Marah": "😡", "Sedih": "😢", "Netral": "😐" }
    return map[currentMoodText] || "❓"
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative flex flex-col font-sans"
      style={{ backgroundImage: `url(${bgMoodPage})` }}>
      
      <div className="min-h-screen bg-white/10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center px-5 py-4 z-20 sticky top-0 bg-white/20 backdrop-blur-md">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-black text-green-700 tracking-tight">SehatYuk</h1>
          </div>
          <div className="flex items-center gap-3">
            <Search className="text-green-800/60 cursor-pointer" size={20} onClick={() => setIsSearchOpen(true)} />
            <div onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-green-100 cursor-pointer">
                <User size={16} className="text-green-700" />
            </div>
            <LogOut className="text-red-500/60 cursor-pointer" size={20} onClick={() => { localStorage.removeItem("isLoggedIn"); navigate("/login"); }} />
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* KOLOM KIRI */}
            <div className="w-full lg:w-2/3 space-y-5">
              
              {/* HALO SECTION */}
              <div 
                className="p-6 md:p-10 rounded-[35px] flex justify-between items-center shadow-lg relative overflow-hidden h-[140px] md:h-[180px] border border-white/40"
                style={{ backgroundImage: `url(${bgHalo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="relative z-10 bg-white/90 p-4 md:p-6 rounded-2xl border border-white/50 shadow-md max-w-[75%]">
                  <h2 className="font-black text-lg md:text-2xl text-[#5F7161] leading-tight">Halo, {userName} 👋</h2>
                  <p className="text-[10px] md:text-sm font-bold text-[#7A9D82] mt-1 uppercase">Bagaimana perasaanmu hari ini?</p>
                </div>
              </div>

              {/* MOOD STATUS */}
              <div className="p-6 md:p-8 rounded-[35px] shadow-lg border border-white/40 bg-white/40 backdrop-blur-md relative overflow-hidden"
                style={{ backgroundImage: `url(${bgMood})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="flex justify-between items-center relative z-10">
                  <div className="text-left">
                    <p className="text-[10px] text-green-900 font-black uppercase tracking-widest mb-2">Mood Terkini</p>
                    <p className="text-[10px] md:text-xs font-bold text-green-700 bg-white/80 px-4 py-2 rounded-full inline-block shadow-sm">
                      {moodMessages[currentMoodText]}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl md:text-5xl drop-shadow-md">{getMoodEmoji()}</span>
                    <span className="font-black text-[10px] text-green-800 uppercase mt-2">{currentMoodText}</span>
                  </div>
                </div>
              </div>

              {/* CATAT PERASAAN */}
              <div className="p-6 md:p-8 rounded-[35px] shadow-lg border border-white/40 bg-white/70 backdrop-blur-md">
                <h4 className="text-[10px] font-black mb-5 text-green-800/40 uppercase tracking-widest text-left">Catat Perasaan</h4>
                <div className="flex justify-between items-center gap-1">
                  {[
                    { label: "Bahagia", score: 5, Icon: Smile, color: "text-yellow-500" },
                    { label: "Senang", score: 4, Icon: Smile, color: "text-orange-400" },
                    { label: "Netral", score: 3, Icon: Meh, color: "text-green-500" },
                    { label: "Sedih", score: 2, Icon: Frown, color: "text-blue-400" },
                    { label: "Marah", score: 1, Icon: Angry, color: "text-red-400" },
                  ].map((m, i) => (
                    <div key={i} onClick={() => handleMoodSelection(m.label, m.score)} className="cursor-pointer text-center flex-1 group transition-transform active:scale-90">
                      <div className="bg-white/50 p-2 md:p-4 rounded-2xl border border-green-50 group-hover:bg-white transition-all">
                        <m.Icon className={m.color} size={window.innerWidth < 768 ? 20 : 28} style={{margin: '0 auto'}}/>
                      </div>
                      <p className="text-[8px] md:text-[10px] font-black text-green-800/60 mt-2 uppercase">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPS HARI INI */}
              <div className="p-6 md:p-8 rounded-[35px] shadow-lg border border-white/40 bg-white/70 backdrop-blur-md flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">Tips Hari Ini</p>
                  <p className="text-xs md:text-sm font-bold text-green-800 mt-1">{randomTip}</p>
                </div>
              </div>
            </div>

            {/* KOLOM SAMPING */}
            <div className="w-full lg:w-1/3 space-y-5">
              
              {/* BURNOUT TEST */}
              <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-cover bg-center relative overflow-hidden h-[180px] md:h-[200px]"
                style={{ backgroundImage: `url(${bgBurnout})` }}>
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-green-900/60 uppercase tracking-widest">Tes Burnout</h4>
                    <p className="text-[11px] font-bold text-green-800 mt-2 leading-tight">Merasa lelah berlebihan? <br/> Yuk, cek tingkat burnout kamu sekarang.</p>
                  </div>
                  <button onClick={() => navigate("/burnout")} className="bg-green-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg self-start hover:bg-green-700 transition-colors">
                    MULAI TES →
                  </button>
                </div>
              </div>

              {/* STATISTIK */}
              <div className="p-6 rounded-[35px] shadow-lg border border-white/40 bg-white/80 backdrop-blur-md">
                <h3 className="font-black text-[10px] text-green-900/40 uppercase tracking-widest mb-4">Analisis Mingguan</h3>
                <div className="h-40">
                  <Line 
                    data={{
                      labels: getLastSevenDaysLabels(),
                      datasets: [{ 
                        data: moodData, 
                        fill: true, 
                        backgroundColor: "rgba(22, 163, 74, 0.1)", 
                        tension: 0.4, 
                        borderColor: "#16a34a", 
                        borderWidth: 3,
                        pointBackgroundColor: "#ffffff", 
                        pointBorderColor: "#16a34a", 
                        pointRadius: 4 
                      }]
                    }} 
                    options={{ 
                      scales: { 
                        y: { min: 1, max: 5, ticks: { display: false }, grid: { display: false } },
                        x: { ticks: { font: { size: 10, weight: 'bold' }, color: '#16a34a' }, grid: { display: false } }
                      }, 
                      plugins: { legend: { display: false } }, 
                      maintainAspectRatio: false 
                    }} 
                  />
                </div>
              </div>

              {/* ARTIKEL */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-green-900/30 uppercase tracking-widest px-2">Rekomendasi Artikel</p>
                {recommendedArticles.map((article) => (
                  <div key={article.id} onClick={() => navigate("/artikel")} 
                    className="relative p-5 rounded-[30px] shadow-md bg-white/70 border border-white flex flex-col gap-2 cursor-pointer group hover:bg-white transition-all">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs text-green-900 group-hover:text-green-600 transition-colors">{article.title}</h4>
                      <ArrowRight size={14} className="text-green-600" />
                    </div>
                    <p className="text-[10px] font-bold text-green-800/60 leading-relaxed italic line-clamp-2">
                      "{article.desc}"
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>

      <BottomNav />

      {/* SEARCH MODAL */}
      {isSearchOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 flex justify-center items-start pt-20">
            <div className="bg-white w-full max-w-md rounded-[30px] shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <Search className="text-green-600" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Cari fitur..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <X className="text-gray-400 cursor-pointer" size={20} onClick={() => {setIsSearchOpen(false); setSearchQuery("")}} />
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((page, index) => (
                  <div key={index} onClick={() => { navigate(page.path); setIsSearchOpen(false); }}
                    className="p-4 hover:bg-green-50 rounded-xl cursor-pointer text-sm"
                  >
                    {page.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Home;