import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = (e) => {
    e.preventDefault()

    // 1. Validasi sederhana
    if (!name || !email || !password) {
      alert("Mohon isi semua data ya!")
      return
    }

    // 2. Simpan nama ke localStorage agar Home bisa membacanya
    localStorage.setItem("userName", name)
    localStorage.setItem("isLoggedIn", "true")

    // 3. Notifikasi dan Navigasi
    alert(`Daftar berhasil! Selamat bergabung, ${name}!`)
    navigate("/") // Arahkan ke Home
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      {/* CARD */}
      <div
        className="rounded-2xl shadow-lg w-80 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgDaun})`,
        }}
      >
        {/* OVERLAY */}
        <div className="p-8 bg-white/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
            🌿 SehatYuk
          </h1>

          <h2 className="text-xl font-semibold text-center mb-1">
            Daftar
          </h2>

          <p className="text-gray-600 text-center mb-6 text-sm">
            Silakan isi data untuk mendaftar.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white/90 outline-none focus:ring-2 focus:ring-green-400"
            />

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
              className="w-full bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all font-semibold shadow-md"
            >
              Daftar
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold text-green-700 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register