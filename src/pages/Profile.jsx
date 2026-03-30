import BottomNav from "../components/BottomNav"

function Profile(){

return(

<div className="p-5 bg-green-50 min-h-screen pb-20">

<h1 className="text-2xl font-bold mb-6">
Profile
</h1>

<div className="bg-white rounded-2xl shadow p-6 text-center">

<img
src="https://i.pravatar.cc/100"
alt="avatar"
className="w-24 h-24 rounded-full mx-auto mb-4"
/>

<h2 className="text-lg font-semibold">
Olipia
</h2>

<p className="text-gray-500 text-sm">
olipia@email.com
</p>

</div>

<div className="mt-6 space-y-4">

<div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

<span>Riwayat Mood</span>

<span>📊</span>

</div>

<div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

<span>Hasil Burnout Test</span>

<span>🔥</span>

</div>

<div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

<span>Pengaturan</span>

<span>⚙️</span>

</div>

<button className="w-full bg-red-100 text-red-600 p-3 rounded-xl mt-3">
Logout
</button>

</div>

<BottomNav/>

</div>

)

}

export default Profile
