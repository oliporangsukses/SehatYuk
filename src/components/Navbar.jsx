import { Bell, Search, User } from "lucide-react"

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-4">

      <h1 className="text-lg font-bold text-green-600">
        SehatYuk
      </h1>

      <div className="flex gap-3 text-gray-600">
        <Bell />
        <Search />
        <User />
      </div>

    </div>
  )
}

export default Navbar