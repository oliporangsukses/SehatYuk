import { useState, useEffect } from "react"
import { questions } from "../data/burnoutQuestions"

function Burnout(){

const [startTest,setStartTest] = useState(false)
const [current,setCurrent] = useState(0)
const [score,setScore] = useState(0)
const [showResult,setShowResult] = useState(false)
const [history,setHistory] = useState([])

useEffect(()=>{

const saved = JSON.parse(localStorage.getItem("burnoutHistory")) || []
setHistory(saved)

},[])

const handleAnswer = (value)=>{

const newScore = score + value
setScore(newScore)

const next = current + 1

if(next < questions.length){

setCurrent(next)

}else{

saveResult(newScore)
setShowResult(true)

}

}

const saveResult = (finalScore)=>{

const newHistory = [
{
date:new Date().toLocaleDateString(),
score:finalScore
},
...history
]

setHistory(newHistory)

localStorage.setItem(
"burnoutHistory",
JSON.stringify(newHistory)
)

}

const getResult = ()=>{

if(score <= 12){
return {
level:"Rendah 😊",
color:"text-green-600",
desc:"Kondisi mental Anda masih cukup baik."
}
}

if(score <= 20){
return {
level:"Sedang 😐",
color:"text-yellow-600",
desc:"Anda mulai mengalami kelelahan mental."
}
}

return {
level:"Tinggi 😥",
color:"text-red-600",
desc:"Anda mungkin mengalami burnout serius."
}

}

const restartTest = ()=>{
setStartTest(false)
setCurrent(0)
setScore(0)
setShowResult(false)
}

if(!startTest){

return(

<div className="p-6 bg-green-50 min-h-screen">

<h1 className="text-2xl font-bold text-green-600 mb-4">
Burnout Test
</h1>

<div className="bg-white p-6 rounded-xl shadow mb-6">

<h2 className="font-semibold mb-2">
Apa itu Burnout?
</h2>

<p className="text-gray-600 text-sm">
Burnout adalah kondisi kelelahan fisik, emosional, dan mental yang
disebabkan oleh stres berkepanjangan. Biasanya terjadi karena tekanan
pekerjaan, tanggung jawab, atau aktivitas yang terlalu berat.
</p>

</div>

<button
onClick={()=>setStartTest(true)}
className="bg-green-500 text-white px-5 py-3 rounded-lg mb-6"
>
Mulai Burnout Test
</button>

<h2 className="font-semibold mb-3">
Riwayat Burnout Test
</h2>

{history.length === 0 && (
<p className="text-gray-500 text-sm">
Belum ada riwayat test
</p>
)}

{history.map((item,index)=>(
<div
key={index}
className="bg-white p-4 rounded-lg shadow mb-2"
>

<p className="text-sm">
Tanggal: {item.date}
</p>

<p className="font-semibold">
Skor: {item.score}
</p>

</div>
))}

</div>

)

}

if(showResult){

const result = getResult()

return(

<div className="p-6 flex items-center justify-center min-h-screen bg-green-50">

<div className="bg-white p-6 rounded-xl shadow text-center">

<h1 className="text-2xl font-bold mb-4">
Hasil Burnout Test
</h1>

<p className="text-lg mb-2">
Skor Anda
</p>

<p className="text-3xl font-bold mb-3">
{score}
</p>

<p className={`text-xl font-semibold mb-4 ${result.color}`}>
{result.level}
</p>

<p className="text-gray-600 mb-6">
{result.desc}
</p>

<button
onClick={restartTest}
className="bg-green-500 text-white px-5 py-2 rounded-lg"
>
Ulangi Test
</button>

</div>

</div>

)

}

return(

<div className="p-6 bg-green-50 min-h-screen">

<h1 className="text-2xl font-bold mb-6">
Burnout Test
</h1>

<div className="bg-white p-6 rounded-xl shadow">

<p className="text-sm text-gray-500 mb-2">
Pertanyaan {current+1} dari {questions.length}
</p>

<div className="w-full bg-gray-200 rounded-full h-2 mb-6">

<div
className="bg-green-500 h-2 rounded-full"
style={{
width:`${((current+1)/questions.length)*100}%`
}}
></div>

</div>

<h2 className="text-lg font-semibold mb-6">
{questions[current].question}
</h2>

<div className="flex flex-col gap-3">

<button
onClick={()=>handleAnswer(1)}
className="bg-green-100 p-3 rounded-lg"
>
😌 Tidak Pernah
</button>

<button
onClick={()=>handleAnswer(2)}
className="bg-green-100 p-3 rounded-lg"
>
🙂 Kadang
</button>

<button
onClick={()=>handleAnswer(3)}
className="bg-green-100 p-3 rounded-lg"
>
😓 Sering
</button>

<button
onClick={()=>handleAnswer(4)}
className="bg-green-100 p-3 rounded-lg"
>
😫 Selalu
</button>

</div>

</div>

</div>

)

}

export default Burnout
