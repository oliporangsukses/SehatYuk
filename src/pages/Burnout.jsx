import { useState } from "react"
import { questions } from "../data/burnoutQuestions"

function Burnout() {


  const Gauge = ({ score }) => {
    const max = 32
    const percentage = score / max
    const angle = -90 + (percentage * 180)

    return (
      <div className="flex flex-col items-center justify-center">

        <div className="relative w-[200px] h-[120px]">

          <div className="absolute w-full h-full rounded-t-full border-t-[12px] border-gray-200"></div>

          <div
            className="absolute w-full h-full rounded-t-full border-t-[12px]"
            style={{
              borderImage: "linear-gradient(to right, #4ade80, #facc15, #f87171) 1",
            }}
          ></div>


          <div
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: "transform 0.8s ease"
            }}
          >
            <div className="w-[2px] h-[80px] bg-black"></div>
          </div>

          {/* Center dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full"></div>

        </div>

        {/* Score */}
        <div className="mt-2 text-center">
          <p className="text-3xl font-bold">{score}</p>
          <p className="text-sm text-gray-500">Skor</p>
        </div>

        <div className="flex justify-between w-full text-xs mt-2 px-4 text-gray-500">
          <span>Rendah</span>
          <span>Tinggi</span>
        </div>
      </div>
    )
  }

  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const options = [
    { label: "Selalu", value: 4 },
    { label: "Sering", value: 3 },
    { label: "Kadang", value: 2 },
    { label: "Jarang", value: 1 },
    { label: "Tidak", value: 0 },
  ]

  const handleSelect = (qIndex, value) => {
    setAnswers({
      ...answers,
      [qIndex]: value
    })
  }

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)

  const getResult = () => {
    if (totalScore <= 12) {
      return { level: "Rendah", desc: "Kondisi kamu masih aman 😊" }
    }
    if (totalScore <= 20) {
      return { level: "Sedang", desc: "Kamu mulai mengalami burnout 😐" }
    }
    return { level: "Tinggi", desc: "Perlu perhatian lebih 😥" }
  }

  const resetAll = () => {
    setAnswers({})
    setShowResult(false)
  }

  if (showResult) {

    const result = getResult()

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-6">

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-lg text-center animate-[fadeIn_0.5s_ease]">

          <h1 className="text-xl font-bold mb-2">Hasil Test Burnout</h1>
          <p className="text-sm text-gray-500 mb-4">
            Berikut hasil test Burnout Kamu!
          </p>


          <div className="bg-white rounded-xl p-4 mb-4 shadow">
            <Gauge score={totalScore} />
            <p className="mt-2 font-semibold">{result.level}</p>
          </div>


          <div className="text-left bg-white/70 rounded-xl p-4 text-sm">
            <p className="mb-2 font-semibold">
              Kondisi kamu berada pada tingkat burnout <b>{result.level}</b>.
            </p>

            <ul className="list-disc ml-5 text-gray-600">
              <li>Atur waktu istirahat yang cukup</li>
              <li>Hindari overthinking berlebihan</li>
              <li>Lakukan aktivitas yang kamu sukai</li>
            </ul>
          </div>

          <button
            onClick={resetAll}
            className="mt-4 bg-purple-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            Ulangi
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4">

      <h1 className="text-xl font-bold mb-2">Test Burnout</h1>
      <p className="text-sm mb-4 text-gray-600">
        Jawab Pertanyaan Berikut Untuk tes burnout
      </p>

      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-white/40 backdrop-blur-md rounded-2xl p-4 mb-4 shadow-md hover:scale-[1.02] transition"
        >
          <p className="mb-3 font-medium">
            {index + 1}. {q.question}
          </p>

          <div className="flex justify-between text-sm">

            {options.map((opt, i) => (
              <label key={i} className="flex flex-col items-center gap-1 cursor-pointer">

                <input
                  type="radio"
                  name={`q-${index}`}
                  className="accent-purple-500 scale-110 cursor-pointer"
                  onChange={() => handleSelect(index, opt.value)}
                />

                {opt.label}
              </label>
            ))}

          </div>
        </div>
      ))}


      <div className="flex justify-between mt-4">
        <button
          onClick={resetAll}
          className="bg-yellow-300 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          Hapus Semua
        </button>

        <button
          onClick={() => setShowResult(true)}
          disabled={Object.keys(answers).length !== questions.length}
          className={`px-4 py-2 rounded-lg shadow transition
          ${Object.keys(answers).length !== questions.length
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-yellow-400 hover:scale-105"}
          `}
        >
          Lihat Hasil
        </button>
      </div>

    </div>
  )
}

export default Burnout