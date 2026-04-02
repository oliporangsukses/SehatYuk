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

    const storedEmail = localStorage.getItem("userEmail")
    const storedPassword = localStorage.getItem("userPassword")
    const storedName = localStorage.getItem("userName")

    if (!storedEmail) {
      Swal.fire({
        title: "Akun Tidak Ada",
        text: "Kamu belum terdaftar nih, daftar dulu yuk!",
        icon: "warning",
        confirmButtonColor: "#16a34a",
        borderRadius: "25px"
      })
      navigate("/register")
      return
    }

    if (email === storedEmail && password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true")
      
      Swal.fire({
        title: `Halo, ${storedName}!`,
        text: "Selamat datang kembali di SehatYuk 🌿",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        borderRadius: "25px"
      })
      
      setTimeout(() => navigate("/"), 2000)
    } else {
      setShowForgot(true)
      Swal.fire({
        title: "Ups!",
        text: "Email atau password salah. Cek lagi ya!",
        icon: "error",
        confirmButtonColor: "#16a34a",
        borderRadius: "25px"
      })
    }
  }

  // --- ALUR LUPA KATA SANDI (FULL FLOW) ---
  const handleForgotPassword = async () => {
    // Langkah 1: Minta Email
    const { value: emailInput } = await Swal.fire({
      title: 'Lupa Kata Sandi?',
      text: 'Masukkan email kamu untuk menerima kode verifikasi.',
      input: 'email',
      inputPlaceholder: 'Masukkan email terdaftar',
      showCancelButton: true,
      confirmButtonText: 'Kirim Kode',
      confirmButtonColor: '#16a34a',
      cancelButtonText: 'Batal',
      borderRadius: '25px',
    })

    if (emailInput) {
      // Validasi email terdaftar (Simulasi)
      if (emailInput !== localStorage.getItem("userEmail")) {
        Swal.fire('Error', 'Email ini tidak terdaftar di sistem kami.', 'error');
        return;
      }

      // Langkah 2: Simulasi Kirim Kode (OTP)
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      
      Swal.fire({
        title: 'Mengirim Kode...',
        html: 'Mohon tunggu sebentar ya, Lip.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
      })

      // Simulasi delay 2 detik
      setTimeout(async () => {
        // Langkah 3: Input Kode Verifikasi
        const { value: otpInput } = await Swal.fire({
          icon: 'info',
          title: 'Verifikasi Kode',
          html: `Kode telah dikirim ke <b>${emailInput}</b>.<br><br>Gunakan kode: <b class="text-green-600 text-xl">${otpCode}</b>`,
          input: 'text',
          inputPlaceholder: 'Masukkan 6 digit kode',
          showCancelButton: true,
          confirmButtonText: 'Verifikasi',
          confirmButtonColor: '#16a34a',
          borderRadius: '25px',
          inputValidator: (value) => {
            if (!value) return 'Kode harus diisi!'
            if (value !== otpCode.toString()) return 'Kode salah! Cek email lagi.'
          }
        });

        if (otpInput) {
          // Langkah 4: Buat Password Baru
          const { value: newPass } = await Swal.fire({
            title: 'Password Baru',
            text: 'Masukkan password baru yang mudah kamu ingat.',
            input: 'password',
            inputPlaceholder: 'Password baru',
            inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
            showCancelButton: true,
            confirmButtonText: 'Simpan Password',
            confirmButtonColor: '#16a34a',
            borderRadius: '25px',
            inputValidator: (value) => {
              if (value.length < 6) return 'Password minimal 6 karakter!'
            }
          });

          if (newPass) {
            // Update simulasi database
            localStorage.setItem("userPassword", newPass);
            
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Password kamu sudah diperbarui. Silakan login kembali.',
              confirmButtonColor: '#16a34a',
              borderRadius: '25px'
            });
            
            // Bersihkan input login
            setPassword("");
            setShowForgot(false);
          }
        }
      }, 2000);
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
              
              {/* TOMBOL LUPA SANDI (Hanya muncul jika salah) */}
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