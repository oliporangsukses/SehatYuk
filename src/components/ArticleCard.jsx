function ArticleCard({title,desc,link}){

return(

<div className="bg-white p-4 rounded-xl shadow mb-3">

<h3 className="font-semibold">
{title}
</h3>

<p className="text-gray-500 text-sm mb-2">
{desc}
</p>

<a
href={link}
target="_blank"
rel="noopener noreferrer"
className="text-green-600 text-sm font-medium"
>

Baca Artikel →

</a>

</div>

)

}

export default ArticleCard
