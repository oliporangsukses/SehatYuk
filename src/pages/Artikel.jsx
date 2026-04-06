import { useState, useRef, useEffect } from "react"
import { articles } from "../data/articles"
import ArticleCard from "../components/ArticleCard"
import BottomNav from "../components/BottomNav"
import { MessageSquare, Bell, Search, LogOut, User, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import bgMoodPage from "../assets/MoodBackground.jpeg" 

function Artikel() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const inputRef = useRef(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  }

  const filteredArticles = articles.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundImage: `url(${bgMoodPage})` }}
    >

      <div className="min-h-screen bg-white/10 dark:bg-black/60 transition-colors duration-500">
        
        <header className="flex justify-between items-center p-4 pt-6 z-20 sticky top-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => navigate("/")}>
            <span className="text-2xl group-hover:rotate-12 transition-transform">🌿</span>
            <h1 className="text-xl font-black text-green-700 dark:text-green-400 tracking-tight">SehatYuk</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <MessageSquare className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => navigate("/mood")} />
            <Bell className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} />
            <Search className="text-green-800/60 dark:text-green-300/60 cursor-pointer hover:text-green-600" size={20} onClick={() => inputRef.current?.focus()} />
            
            <div 
              onClick={() => navigate("/profile")}
              className="w-8 h-8 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center border border-white/50 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-green-200 transition-all"
            >
                <User size={16} className="text-green-700 dark:text-green-400" />
            </div>
            <LogOut className="text-red-500/60 cursor-pointer hover:text-red-600 ml-1" size={20} onClick={handleLogout} />
          </div>
        </header>

        <div className="p-5 pb-28">
          <div className="mt-4 mb-6 px-2">
             <h3 className="font-black text-[10px] text-green-900/50 dark:text-slate-400 uppercase tracking-widest mb-1">
               Edukasi Kesehatan
             </h3>
             <h1 className="text-2xl font-black text-green-800 dark:text-white tracking-tight">
               Artikel Kesehatan
             </h1>
          </div>

          <div className="mb-8 px-1">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-[25px] bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border border-white/50 dark:border-slate-700 outline-none text-sm text-green-900 dark:text-white placeholder:text-green-700/50 dark:placeholder:text-slate-500 shadow-lg focus:ring-2 focus:ring-green-400/30 transition-all"
              />
              <div className="absolute left-5 text-green-600/60 dark:text-green-400/60">
                <Search size={18} strokeWidth={3} />
              </div>
              {search && (
                <X 
                  size={18} 
                  className="absolute right-5 text-red-400 cursor-pointer hover:text-red-600" 
                  onClick={() => setSearch("")} 
                />
              )}
            </div>
          </div>

         <div className="w-full grid grid-cols-2 gap-4 px-2"> 
  {filteredArticles.length > 0 ? (
    filteredArticles.map((item) => (
      <div 
        key={item.id} 
        className="transition-all duration-300 hover:brightness-95 active:scale-[0.98]"
      >
        <ArticleCard {...item} />
      </div>
    ))
  ) : (
    <div className="col-span-2 p-10 text-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[35px]">
      <span className="text-4xl mb-3 block">😢</span>
      <p className="text-green-800 dark:text-slate-300 font-bold text-sm">Artikel tidak ditemukan</p>
    </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default Artikel