import { Link } from "react-router-dom"

function FeatureCard({title,desc,icon,to}){

return(

<Link to={to}>

<div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition text-center">

<div className="text-green-600 text-2xl mb-2 flex justify-center">
{icon}
</div>

<h3 className="font-semibold text-sm">
{title}
</h3>

<p className="text-xs text-gray-500">
{desc}
</p>

</div>

</Link>

)

}

export default FeatureCard
