import { useState } from "react"
import BottomNav from "../components/BottomNav"
import { Line } from "react-chartjs-2"

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
)

function Mood(){

const [moods,setMoods] = useState([])

const addMood = (value)=>{
setMoods([...moods,value])
}

const data = {
labels: moods.map((_,i)=>`Day ${i+1}`),
datasets:[
{
label:"Mood Level",
data:moods,
borderColor:"#22c55e",
backgroundColor:"#86efac"
}
]
}

return(

<div className="p-5 bg-green-50 min-h-screen pb-20">

<h1 className="text-2xl font-bold mb-4">
Mood Tracker
</h1>

<p className="text-gray-500 mb-6">
Bagaimana perasaanmu hari ini?
</p>

<div className="flex justify-between text-3xl mb-8">

<button onClick={()=>addMood(5)}>😁</button>
<button onClick={()=>addMood(4)}>😊</button>
<button onClick={()=>addMood(3)}>😐</button>
<button onClick={()=>addMood(2)}>😔</button>
<button onClick={()=>addMood(1)}>😢</button>

</div>

<div className="bg-white p-4 rounded-xl shadow mb-6">

<Line data={data}/>

</div>

<div>

<h2 className="font-semibold mb-3">
Riwayat Mood
</h2>

{moods.length === 0 && (
<p className="text-gray-400 text-sm">
Belum ada data mood
</p>
)}

{moods.map((mood,index)=>(
<div
key={index}
className="bg-white p-3 rounded-lg shadow mb-2 flex justify-between"
>

<span>Hari {index+1}</span>

<span>
{mood===5 && "😁"}
{mood===4 && "😊"}
{mood===3 && "😐"}
{mood===2 && "😔"}
{mood===1 && "😢"}
</span>

</div>
))}

</div>

<BottomNav/>

</div>

)

}

export default Mood
