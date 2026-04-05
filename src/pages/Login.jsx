import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"
import Swal from "sweetalert2"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgot, setShowForgot] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email dan password wajib diisi!",
        confirmButtonColor: "#16a34a"
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // simpan dari backend
        localStorage.setItem("userName", data.nama_lengkap)
        localStorage.setItem("userId", data.user_id)
        localStorage.setItem("isLoggedIn", "true")

        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang, ${data.nama_lengkap}`,
          confirmButtonColor: "#16a34a"
        }).then(() => {
          navigate("/")
        })

      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: data.message,
          confirmButtonColor: "#16a34a"
        })

        setShowForgot(true)
      }

    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Backend belum jalan atau error!",
        confirmButtonColor: "#16a34a"
      })
    }
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

              {showForgot && (
                <div className="flex justify-end px-2">
                  <button 
                    type="button" 
                    className="text-[10px] font-black text-green-600 underline"
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