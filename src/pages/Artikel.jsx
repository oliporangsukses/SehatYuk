import { articles } from "../data/articles"
import ArticleCard from "../components/ArticleCard"

function Artikel(){

return(

<div className="p-6 bg-green-50 min-h-screen">

<h1 className="text-2xl font-bold mb-6">
Artikel Kesehatan Mental
</h1>

{articles.map((item)=>(

<ArticleCard
key={item.id}
title={item.title}
desc={item.desc}
link={item.link}
/>

))}

</div>

)

}

export default Artikel
