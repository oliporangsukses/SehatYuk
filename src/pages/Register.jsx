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

    if (!name || !email || !password) {
      alert("Mohon isi semua data ya!")
      return
    }

    // 1. SIMPAN DATA KE LOCALSTORAGE
    // Kita simpan agar nanti saat Login, aplikasi bisa mencocokkan datanya
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userPassword", password) // Simpan password untuk simulasi login
    
    // Kita JANGAN set "isLoggedIn" ke true di sini, 
    // karena user harus login dulu secara manual.

    // 2. Notifikasi Sukses
    alert(`Akun berhasil dibuat, ${name}! Silakan masuk menggunakan email kamu.`);

    // 3. ARAHKAN KE LOGIN (Bukan ke Dashboard/Home)
    navigate("/login") 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
      <div
        className="rounded-3xl shadow-2xl w-80 bg-cover bg-center overflow-hidden border border-white/20"
        style={{ backgroundImage: `url(${bgDaun})` }}
      >
        <div className="p-8 bg-white/80 backdrop-blur-md">
          <h1 className="text-2xl font-black text-green-700 text-center mb-2 tracking-tight">
            🌿 SehatYuk
          </h1>

          <h2 className="text-xl font-bold text-center mb-1 text-green-900">
            Daftar Akun
          </h2>

          <p className="text-green-800/60 text-center mb-6 text-xs font-medium">
            Buat akun untuk mulai memantau kesehatanmu.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-green-100 rounded-2xl bg-white/90 outline-none focus:ring-2 focus:ring-green-400 text-sm transition-all"
            />

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
              className="w-full bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-all font-bold shadow-lg active:scale-95"
            >
              DAFTAR SEKARANG
            </button>
          </form>

          <p className="text-xs text-center mt-6 text-green-900/70 font-medium">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-bold text-green-700 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register