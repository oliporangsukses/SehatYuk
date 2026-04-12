import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import bgDaun from "../assets/bgDaun.jpeg"
import Swal from "sweetalert2"
import { Eye, EyeOff } from "lucide-react" // ✅ TAMBAHAN

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // ✅ TAMBAHAN

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Data Belum Lengkap',
        text: 'Mohon isi semua kolom yang tersedia ya!',
        confirmButtonColor: '#16a34a'
      })
      return
    }

    Swal.fire({
      title: "Mendaftarkan Akun...",
      html: "Sedang menyiapkan ruang untuk Anda. ✨",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    try {
      const response = await fetch("https://sehatyuk-production.up.railway.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nama_lengkap: name,
          email: email,
          password: password
        })
      })

      const data = await response.json()

      Swal.close()

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Pendaftaran Berhasil!",
          text: `Halo ${name}, akun Anda sudah aktif. Silakan masuk!`,
          confirmButtonColor: '#16a34a'
        }).then(() => {
          navigate("/login")
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: data.message || "Terjadi kesalahan",
          confirmButtonColor: '#16a34a'
        })
      }

    } catch (error) {
      Swal.close()
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Pastikan backend berjalan di port 5000!",
        confirmButtonColor: '#16a34a'
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4 md:p-10 font-sans w-full overflow-x-hidden">
      
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border border-white/50">
        
        {/* KIRI */}
        <div 
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative p-12 flex-col justify-between text-white"
          style={{ backgroundImage: `url(${bgDaun})` }}
        >
          <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-5xl">🌿</span>
              <div>
                <h2 className="text-4xl font-black tracking-tighter">SehatYuk</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Mental Health Tracker</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-8">
            <h3 className="text-4xl font-black mb-4 leading-tight">
              Mulai Hidup <br /> Lebih Positif.
            </h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium max-w-xs">
              Bergabunglah untuk mendapatkan akses penuh ke pelacakan emosi, analisis burnout, dan tips kesehatan harian.
            </p>
          </div>
        </div>

        {/* KANAN */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white relative">
          
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-green-950 tracking-tight">
                {name ? `Halo, ${name}!` : "Daftar Akun"}
              </h2>
              <p className="text-sm font-bold text-green-800/40 uppercase tracking-widest mt-1">
                Lengkapi data untuk bergabung
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all shadow-sm"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all shadow-sm"
              />

              {/* PASSWORD + 👁️ */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all shadow-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 text-white p-5 rounded-[25px] hover:bg-green-700 transition-all font-black shadow-xl active:scale-95 mt-6 text-xs tracking-[0.2em]"
              >
                DAFTAR SEKARANG
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-green-50 text-center">
              <p className="text-[11px] text-green-900/60 font-bold mb-2">
                Sudah punya akun SehatYuk?
              </p>
              <Link 
                to="/login" 
                className="text-xs font-black text-green-700 hover:tracking-widest transition-all uppercase"
              >
                Masuk di sini
              </Link>
            </div>
          </div>
          
          <p className="absolute bottom-6 text-[9px] font-bold text-green-900/10 uppercase tracking-[0.5em]">
            SehatYuk v1.0
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register