import { useState } from "react";
import bgDaun from "../assets/bgDaun.jpeg";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email) {
      setSuccess(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgDaun})` }}
    >
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl 
                w-full max-w-md md:max-w-lg lg:max-w-2xl text-center">
        
        <h1 className="text-3xl font-bold text-green-700 mb-1">
          🌿 SehatYuk
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          HIDUP LEBIH POSITIF
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          Lupa Password?
        </h2>
        <p className="text-gray-500 mb-6">
          Masukkan Email anda untuk reset password
        </p>

        {success && (
          <div className="bg-red-100 text-red-500 p-3 rounded-lg mb-4 text-sm">
            Kami sudah mengirim surel yang berisi tautan untuk mereset kata sandi Anda!
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left">
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-full border border-green-500 outline-none focus:ring-2 focus:ring-green-400 mb-5"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-full font-semibold"
          >
            Kirim
          </button>
        </form>

        <Link
         to="/login"
         className="mt-5 block text-green-700 text-sm hover:underline hover:text-green-900 transition">
         ← Kembali Ke Halaman Login
</Link>
      </div>
    </div>
  );
}

export default ResetPassword;