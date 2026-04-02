import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    // 1. Ambil data yang sudah tersimpan di localStorage (dari pendaftaran)
    const storedEmail = localStorage.getItem("userEmail")
    const storedPassword = localStorage.getItem("userPassword")
    const storedName = localStorage.getItem("userName")

    // 2. Validasi: Cek apakah akun sudah ada dan datanya cocok
    if (!storedEmail) {
      alert("Akun belum terdaftar! Silakan daftar terlebih dahulu.")
      navigate("/register")
      return
    }

    if (email === storedEmail && password === storedPassword) {
      // Jika cocok, set status login
      localStorage.setItem("isLoggedIn", "true")
      
      alert(`Login berhasil! Selamat datang kembali, ${storedName}`)
      navigate("/") // Masuk ke Dashboard
    } else {
      // Jika tidak cocok
      alert("Email atau password salah. Coba dicek lagi ya!")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
      <div
        className="rounded-3xl shadow-2xl w-80 bg-cover bg-center overflow-hidden border border-white/20"
        style={{ backgroundImage: `url(${bgDaun})` }}
      >
        <div className="p-8 bg-white/80 backdrop-blur-md">
          <h1 className="text-3xl font-black text-green-700 text-center mb-2 tracking-tight">
            🌿 SehatYuk
          </h1>

          <p className="text-green-800/60 text-center mb-6 text-sm font-medium">
            Masuk untuk melanjutkan
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-green-100 rounded-2xl bg-white/90 outline-none focus:ring-2 focus:ring-green-400 text-sm transition-all"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-green-100 rounded-2xl bg-white/90 outline-none focus:ring-2 focus:ring-green-400 text-sm transition-all"
            />

            <button 
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-all font-bold shadow-lg active:scale-95 mt-2"
            >
              MASUK SEKARANG
            </button>
          </form>

          <p className="text-xs text-center mt-6 text-green-900/70 font-medium">
            Belum punya akun?{" "}
            <Link to="/register" className="font-bold text-green-700 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login