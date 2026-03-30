import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"

import { Smile, Frown, Meh, Angry } from "lucide-react"

// IMPORT IMAGE
import bgHalo from "../assets/BackgroundHalo.png"
import bgMood from "../assets/BackgroundMood.png"
import bgBurnout from "../assets/BackgroundBurnout.png"
import bgRiwayat from "../assets/BackgroundRiwayatMood.png"
import ImageBurnout from "../assets/ImageBurnout.png"
import moodImage from "../assets/Image.png"

function Home() {
  return (
    <div className="p-4 bg-[#F4FBF8] min-h-screen pb-24">

      <Navbar />

      {/* ================= HALO ================= */}
      <div
        className="p-5 rounded-3xl mb-4 flex justify-between items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHalo})` }}
      >
        <div>
          <h2 className="font-semibold text-lg">
            Halo, Khiza 👋
          </h2>
          <p className="text-sm text-gray-600">
            Bagaimana perasaanmu hari ini?
          </p>
        </div>
      </div>

      {/* ================= MOOD ================= */}
   <div
  className="rounded-2xl p-4 mb-4"
  style={{
    backgroundImage: `url(${bgMood})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="flex justify-between items-center">

    {/* KIRI (TEKS) */}
    <div>
      <p className="text-sm text-gray-600">
        Mood Kamu Hari Ini
      </p>
      <p className="text-sm text-gray-600">
        Wah bagus! Pertahankan ya!
      </p>
    </div>

    {/* KANAN (GAMBAR + TEXT + PANAH) */}
    <div className="flex flex-col items-end">

      <img
        src={moodImage}
        alt="mood"
        className="w-10 mb-1"
      />

      <div className="flex items-center gap-1">
        <span className="font-semibold">
          Sangat Senang
        </span>
        <span>➜</span>
      </div>

    </div>

  </div>
</div>

      {/* ================= TRACKER + BURNOUT ================= */}
      <div className="grid grid-cols-2 gap-3 mb-4">

        {/* Mood Tracker */}
        <div className="bg-white p-3 rounded-3xl shadow">
          <h4 className="text-sm font-semibold mb-2">
            Mood Tracker
          </h4>

          <div className="flex justify-between text-center text-xs">
            <div>
              <Smile className="mx-auto text-yellow-500"/>
              bahagia
            </div>
            <div>
              <Angry className="mx-auto text-red-500"/>
              marah
            </div>
            <div>
              <Meh className="mx-auto text-green-500"/>
              netral
            </div>
            <div>
              <Frown className="mx-auto text-blue-500"/>
              sedih
            </div>
          </div>
        </div>

        {/* Burnout */}
        <div
          className="p-3 rounded-3xl shadow flex flex-col justify-between bg-cover bg-center"
          style={{ backgroundImage: `url(${bgBurnout})` }}
        >
          <h4 className="text-sm font-semibold">
            Tes Burnout
          </h4>

          <img
            src={ImageBurnout}
            alt="burnout"
            className="w-14 object-contain"
          />

          <button className="bg-white px-3 py-1 rounded-full text-xs mt-2 self-start shadow">
            + Mulai Tes
          </button>
        </div>

      </div>

      {/* ================= RIWAYAT ================= */}
      <div
        className="p-4 rounded-3xl shadow bg-cover bg-center"
        style={{ backgroundImage: `url(${bgRiwayat})` }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">
            Riwayat Mood
          </h3>

          <span className="text-xs bg-white px-3 py-1 rounded-full">
            7 Hari Terakhir →
          </span>
        </div>

        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
          Grafik Mood
        </div>
      </div>

      <BottomNav />

    </div>
  )
}

export default Home