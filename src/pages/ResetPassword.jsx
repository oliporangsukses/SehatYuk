import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgDaun from "../assets/bgDaun.jpeg";
import Swal from "sweetalert2";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validasi Password Cocok
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Pastikan konfirmasi password sama dengan password baru Anda.",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    Swal.fire({
      title: "Memperbarui Password...",
      html: "Mohon tunggu sebentar, sedang menyimpan data baru Anda.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Ganti URL sesuai endpoint backend kamu untuk reset password
      const response = await fetch("https://sehatyuk-production.up.railway.app/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kata sandi Anda telah diperbarui. Silakan login kembali.",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Terjadi kesalahan saat mereset password.",
          confirmButtonColor: "#16a34a",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Tidak bisa terhubung ke server!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4 md:p-10 font-sans w-full overflow-x-hidden">
      
      {/* CARD UTAMA */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border border-white/50">
        
        {/* INFORMASI WEB (SISI KIRI) */}
        <div 
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative p-12 flex-col justify-between text-white"
          style={{ backgroundImage: `url(${bgDaun})` }}
        >
          <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-5xl">🌿</span>
              <div>
                <h2 className="text-4xl font-black tracking-tighter">SehatYuk</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Mental Health Tracker</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-8">
            <h3 className="text-3xl font-black mb-4 leading-tight">Amankan Kembali <br /> Akun Anda.</h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium max-w-xs">
              Buatlah kata sandi yang kuat dan unik untuk memastikan data kesehatan mental Anda tetap aman dan terjaga bersama SehatYuk.
            </p>
            
            <div className="mt-8 flex gap-3">
               <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-widest">
                 Safe & Private
               </div>
            </div>
          </div>
        </div>

        {/* FORM RESET PASSWORD (SISI KANAN) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white relative">
          
          <div className="w-full max-w-sm">
            {/* Mobile Header */}
            <div className="md:hidden flex flex-col items-center mb-10">
              <span className="text-5xl mb-2">🌿</span>
              <h1 className="text-3xl font-black text-green-700 tracking-tighter">SehatYuk</h1>
            </div>

            {/* Form Header */}
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-green-950 tracking-tight">Atur Ulang Sandi</h2>
              <p className="text-sm font-bold text-green-800/40 uppercase tracking-widest mt-1">Masukkan kata sandi baru Anda</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="group">
                <input
                  type="password"
                  placeholder="Kata Sandi Baru"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all shadow-sm"
                />
              </div>

              <div className="group">
                <input
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 border border-green-100 rounded-[25px] bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white text-sm transition-all shadow-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-green-600 text-white p-5 rounded-[25px] hover:bg-green-700 hover:shadow-green-200 transition-all font-black shadow-xl active:scale-95 mt-6 text-xs tracking-[0.2em]"
              >
                PERBARUI PASSWORD
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-green-50 text-center">
              <Link 
                to="/login" 
                className="text-xs font-black text-green-700 hover:text-green-900 hover:tracking-widest transition-all uppercase"
              >
                ← Kembali Ke Login
              </Link>
            </div>
          </div>
          
          <p className="absolute bottom-6 text-[9px] font-bold text-green-900/10 uppercase tracking-[0.5em]">
            SehatYuk v1.0
          </p>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;