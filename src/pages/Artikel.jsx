import { useState, useRef } from "react"
import { articles } from "../data/articles"
import ArticleCard from "../components/ArticleCard"
import Navbar from "../components/Navbar"
import BottomNav from "../components/BottomNav"

function Artikel() {
  const [search, setSearch] = useState("")
  const inputRef = useRef(null)

  const filteredArticles = articles.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearchClick = () => {
    console.log("SEARCH DIKLIK")
    inputRef.current.focus()
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-24">

      <Navbar onSearchClick={handleSearchClick} />

      <h1 className="text-xl font-semibold mb-4">
        Artikel Kesehatan
      </h1>

      <div className="mb-5">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-gray-200 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((item) => (
            <ArticleCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              link={item.link}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            Artikel tidak ditemukan 😢
          </p>
        )}
      </div>

      <BottomNav />

    </div>
  )
}

export default Artikel