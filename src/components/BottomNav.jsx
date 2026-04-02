import { Link, useLocation } from "react-router-dom"
import { Home, Smile, Flame, BookOpen, User } from "lucide-react"
import bg from "../assets/BackgroundBottom.png"

function BottomNav() {
  const location = useLocation(); 

  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center transition-all duration-300 ${
      isActive 
        ? "text-green-600 dark:text-green-400 scale-110 font-bold" 
        : "text-gray-400 dark:text-gray-500 hover:text-green-500"
    }`;
  };

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] rounded-3xl shadow-2xl flex justify-around py-3 border border-white/20 dark:border-slate-800 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 bg-cover bg-center transition-colors"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <Link to="/" className={getNavClass("/")}>
        <Home size={22} strokeWidth={location.pathname === "/" ? 3 : 2} />
        <span className="text-[10px] mt-0.5">Beranda</span>
      </Link>

      <Link to="/mood" className={getNavClass("/mood")}>
        <Smile size={22} strokeWidth={location.pathname === "/mood" ? 3 : 2} />
        <span className="text-[10px] mt-0.5">Mood</span>
      </Link>

      <Link to="/burnout" className={getNavClass("/burnout")}>
        <Flame size={22} strokeWidth={location.pathname === "/burnout" ? 3 : 2} />
        <span className="text-[10px] mt-0.5">Burnout</span>
      </Link>

      <Link to="/artikel" className={getNavClass("/artikel")}>
        <BookOpen size={22} strokeWidth={location.pathname === "/artikel" ? 3 : 2} />
        <span className="text-[10px] mt-0.5">Artikel</span>
      </Link>

      <Link to="/profile" className={getNavClass("/profile")}>
        <User size={22} strokeWidth={location.pathname === "/profile" ? 3 : 2} />
        <span className="text-[10px] mt-0.5">Profil</span>
      </Link>

    </div>
  )
}

export default BottomNav
