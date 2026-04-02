import { Bell, Search, User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Navbar({ onSearchClick }) {
  const navigate = useNavigate()
  const [showNotif, setShowNotif] = useState(false)

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar dari SehatYuk?")
    
    if (confirmLogout) {
      localStorage.removeItem("userName")
      localStorage.removeItem("isLoggedIn")
      navigate("/login")
    }
  }

  return (
    <div className="flex items-center justify-between mb-4">

      {/* Logo */}
      <div className="flex items-center gap-2">
  
        <h1 className="font-semibold text-green-600">
          🌿 SehatYuk
        </h1>
      </div>

      {/* Menu kanan */}
      <div className="flex items-center gap-3 text-gray-500">

        {/* Notifikasi */}
        <div className="relative">
          <Bell 
            size={18} 
            className="cursor-pointer"
            onClick={() => setShowNotif(!showNotif)}
          />

          {showNotif && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow rounded-xl p-3 text-sm">
              <p className="font-semibold mb-2">Notifikasi</p>
              <p className="text-gray-500 text-xs">
                Tidak ada notifikasi 😄
              </p>
            </div>
          )}
        </div>

        {/* Search */}
        <Search 
          size={18} 
          className="cursor-pointer"
          onClick={() => onSearchClick && onSearchClick()}
        />

        {/* Profile */}
        <User
          size={18} 
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
          title="Logout"
        >
          <User size={18} />
          <LogOut size={14} />
        </button>

      </div>
    </div>
  )
}

export default Navbar