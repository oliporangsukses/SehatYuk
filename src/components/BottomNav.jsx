import { Link } from "react-router-dom"
import { Home, Smile, Flame, BookOpen, User } from "lucide-react"

function BottomNav() {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl shadow-lg flex justify-around py-3">

      <Link to="/" className="flex flex-col items-center text-green-600">
        <Home size={22}/>
        <span className="text-xs">Beranda</span>
      </Link>

      <Link to="/mood" className="flex flex-col items-center text-gray-500">
        <Smile size={22}/>
        <span className="text-xs">Mood</span>
      </Link>

      <Link to="/burnout" className="flex flex-col items-center text-gray-500">
        <Flame size={22}/>
        <span className="text-xs">Burnout</span>
      </Link>

      <Link to="/artikel" className="flex flex-col items-center text-gray-500">
        <BookOpen size={22}/>
        <span className="text-xs">Artikel</span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center text-gray-500">
        <User size={22}/>
        <span className="text-xs">Profil</span>
      </Link>

    </div>
  )
}

export default BottomNav