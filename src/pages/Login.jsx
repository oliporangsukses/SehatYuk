import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"

function Login(){

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      
      <div
        className="rounded-2xl shadow-lg w-80 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgDaun})`,
        }}
      >
        <div className="p-8 bg-white/80 backdrop-blur-sm">

          <h1 className="text-3xl font-bold text-green-600 text-center mb-2">
            🌿 SehatYuk
          </h1>

          <p className="text-gray-600 text-center mb-6">
            Masuk untuk melanjutkan
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white/90 outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white/90 outline-none focus:ring-2 focus:ring-green-400"
            />

            <button 
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Login
            </button>

          </form>

          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-green-600 font-medium">
              Daftar
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login