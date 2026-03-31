import { Bell, Search, User, LogOut } from "lucide-react" // Tambah LogOut icon
import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Tampilkan konfirmasi sederhana agar tidak sengaja terpencet
    const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar dari SehatYuk?")
    
    if (confirmLogout) {
      // 1. Hapus data dari localStorage
      localStorage.removeItem("userName")
      localStorage.removeItem("isLoggedIn")
      
      // 2. Arahkan kembali ke Login
      navigate("/login")
    }
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-green-600 tracking-tight">
        SehatYuk
      </h1>

      <div className="flex gap-4 text-gray-500 items-center">
        <button className="hover:text-green-600 transition-colors">
          <Search size={22} />
        </button>
        
        <button className="hover:text-green-600 transition-colors">
          <Bell size={22} />
        </button>

        {/* Ikon User berfungsi untuk Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
          title="Logout"
        >
          <User size={20} />
          <LogOut size={14} className="ml-0.5" />
        </button>
      </div>
    </div>
  )
}

export default Navbar