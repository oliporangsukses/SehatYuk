function ArticleCard({ title, desc, link }) {
  return (
    <div 
    className="bg-white/40 backdrop-blur-md 
    p-5 rounded-2xl border-white/30 shadow-lg
    transition duration-300
    hover:scale-105 hover:shadow-2xl">

      <h3 className="font-semibold text-gray-800 mb-1">
        {title}
      </h3>

      <p className="text-sm text-gray-700 mb-4">
        {desc}
      </p>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white/80 px-4 py-1 rounded-full text-sm font-medium transition hover:bg-white"
      >
        Baca Selengkapnya &gt;
      </a>

    </div>
  )
}

export default ArticleCard