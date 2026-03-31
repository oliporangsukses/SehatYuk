function ArticleCard({ title, desc, link }) {
  return (
    <div className="bg-purple-300 p-5 rounded-2xl">

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
        className="inline-block bg-white px-4 py-1 rounded-full text-sm font-medium text-gray-700"
      >
        Baca Selengkapnya &gt;
      </a>

    </div>
  )
}

export default ArticleCard