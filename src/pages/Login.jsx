import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"
import Swal from "sweetalert2"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgot, setShowForgot] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()

    // LOGIKA PENYIMPANAN DATA USER
    // Nanti jika sudah pakai API, ambil 'name' dari response backend
    // Untuk sekarang, kita ambil bagian depan email sebagai nama
    const detectedName = email.split('@')[0] || "User"
    
    // Simpan ke localStorage agar bisa dibaca oleh komponen Home
    localStorage.setItem("userName", detectedName)
    localStorage.setItem("isLoggedIn", "true")

    alert(`Login berhasil! Selamat datang, ${detectedName}`)
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4 font-sans">
      <div
        className="rounded-[40px] shadow-2xl w-80 bg-cover bg-center overflow-hidden border border-white/20 transition-all duration-500"
        style={{ backgroundImage: `url(${bgDaun})` }}
      >
        <div className="p-9 bg-white/85 backdrop-blur-lg">
          <div className="flex flex-col items-center mb-6">
            <span className="text-4xl mb-2">🌿</span>
            <h1 className="text-3xl font-black text-green-700 tracking-tighter">
              SehatYuk
            </h1>
            <p className="text-[10px] font-bold text-green-800/50 uppercase tracking-[0.2em] mt-1">
              Mental Health Tracker
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-[22px] bg-white/90 outline-none focus:ring-2 focus:ring-green-400 text-sm transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-[22px] bg-white/90 outline-none focus:ring-2 focus:ring-green-400 text-sm transition-all shadow-sm"
              />
              
              {/* TOMBOL LUPA SANDI (muncul kalau salah sandi) */}
              {showForgot && (
                <div className="flex justify-end px-2 animate-in fade-in slide-in-from-right-2 duration-300">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black text-green-600 hover:text-green-800 underline uppercase tracking-tighter"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-all font-black shadow-lg active:scale-95 mt-4 tracking-widest text-xs"
            >
              MASUK SEKARANG
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-green-100 flex flex-col items-center">
            <p className="text-[11px] text-green-900/60 font-bold mb-1">
              Belum punya akun SehatYuk?
            </p>
            <Link to="/register" className="text-xs font-black text-green-700 hover:underline tracking-tight">
              DAFTAR AKUN BARU
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login