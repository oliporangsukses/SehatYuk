import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgDaun from "../assets/bgDaun.jpeg";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = () => {
    // 1. Generate kode random (hanya muncul di Step 3)
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Step 1: Input Email
    Swal.fire({
      title: "Lupa Kata Sandi?",
      text: "Masukkan email terdaftar Anda",
      input: "email",
      inputPlaceholder: "contoh@email.com",
      showCancelButton: true,
      confirmButtonText: "Kirim Kode",
      confirmButtonColor: "#16a34a",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const userEmail = result.value;

        // Step 2: Tampilan Loading
        Swal.fire({
          title: "Mengirim Kode...",
          html: "Mohon tunggu sebentar, sedang memproses permintaan Anda.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          timer: 2000,
        }).then(() => {
          // Step 3: Kasih tahu kodenya (HANYA SEKALI DI SINI)
          Swal.fire({
            icon: "success",
            title: "Kode Terkirim!",
            html: `Silakan simpan kode verifikasi Anda:<br><b style="font-size: 24px; color: #16a34a; letter-spacing: 5px;">${randomCode}</b>`,
            confirmButtonText: "Atur Ulang Password",
            confirmButtonColor: "#16a34a",
          }).then(() => {
            // Step 4: Form Reset dengan Konfirmasi Kata Sandi
            Swal.fire({
              title: "Atur Ulang Kata Sandi",
              html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <input id="swal-input-code" class="swal2-input" placeholder="Masukkan Kode Verifikasi" style="text-align:center;">
                  <input id="swal-input-pass" type="password" class="swal2-input" placeholder="Kata Sandi Baru">
                  <input id="swal-input-confirm" type="password" class="swal2-input" placeholder="Konfirmasi Kata Sandi Baru">
                </div>
              `,
              showCancelButton: true,
              confirmButtonText: "Simpan Perubahan",
              confirmButtonColor: "#16a34a",
              focusConfirm: false,
              preConfirm: async () => {
                const code = document.getElementById("swal-input-code").value;
                const pass = document.getElementById("swal-input-pass").value;
                const confirm = document.getElementById("swal-input-confirm").value;

                // Validasi Frontend
                if (code !== randomCode) {
                  Swal.showValidationMessage("Kode verifikasi salah!");
                  return false;
                }
                if (pass.length < 6) {
                  Swal.showValidationMessage("Kata sandi minimal 6 karakter!");
                  return false;
                }
                if (pass !== confirm) {
                  Swal.showValidationMessage("Konfirmasi kata sandi tidak cocok!");
                  return false;
                }

                // SINKRON KE BACKEND
                try {
                  const response = await fetch("http://localhost:5000/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail, newPassword: pass }),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message);
                  return data;
                } catch (error) {
                  Swal.showValidationMessage(`Gagal: ${error.message}`);
                }
              }
            }).then((res) => {
              if (res.isConfirmed) {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil!",
                  text: "Kata sandi Anda sudah diperbarui. Silakan login kembali.",
                  confirmButtonColor: "#16a34a",
                });
              }
            });
          });
        });
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Memproses Masuk...",
      html: "Sedang memverifikasi data login Anda.",
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); },
    });

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userName", data.nama_lengkap);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("isLoggedIn", "true");
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang kembali, ${data.nama_lengkap}!`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => { navigate("/"); });
      } else {
        Swal.fire({ icon: "error", title: "Login Gagal", text: data.message, confirmButtonColor: "#16a34a" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Server Error", text: "Tidak bisa terhubung ke server!" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4 md:p-10 font-sans w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border border-white/50">
        
        {/* SISI KIRI: INFORMASI */}
        <div 
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative p-12 flex-col justify-between text-white"
          style={{ backgroundImage: `url(${bgDaun})` }}
        >
          <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]"></div>
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-5xl">🌿</span>
            <div>
              <h2 className="text-4xl font-black tracking-tighter">SehatYuk</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Mental Health Tracker</p>
            </div>
          </div>
          <div className="relative z-10 mb-8">
            <h3 className="text-3xl font-black mb-4 leading-tight">Mulai Perjalanan <br /> Sehatmu Bersama Kami.</h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium max-w-xs">
              Kelola kesehatan mentalmu dengan fitur Mood Tracker dan Burnout Test yang didesain khusus untuk membantumu tetap stabil setiap hari.
            </p>
          </div>
        </div>

        {/* SISI KANAN: FORM LOGIN */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white relative">
          <div className="w-full max-w-sm">
            <div className="md:hidden flex flex-col items-center mb-10">
              <span className="text-5xl mb-2">🌿</span>
              <h1 className="text-3xl font-black text-green-700 tracking-tighter">SehatYuk</h1>
            </div>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-green-950 tracking-tight">Selamat Datang!</h2>
              <p className="text-sm font-bold text-green-800/40 uppercase tracking-widest mt-1">Silakan masuk ke akun Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all"
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all"
                />
                <div className="flex justify-end mt-3 px-2">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword} 
                    className="text-[10px] font-black text-green-600 hover:text-green-800 underline uppercase tracking-tighter"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-green-600 text-white p-5 rounded-[25px] hover:bg-green-700 transition-all font-black shadow-xl active:scale-95 mt-6 text-xs tracking-[0.2em]"
              >
                MASUK SEKARANG
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-green-50 text-center">
              <p className="text-[11px] text-green-900/60 font-bold mb-2">Belum punya akun SehatYuk?</p>
              <Link to="/register" className="text-xs font-black text-green-700 hover:text-green-900 transition-all uppercase">
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;