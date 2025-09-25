import { Link } from "react-router-dom"

const ListingCard = ({ listing }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{listing.skill?.category}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{listing.skill?.name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">${listing.price_per_hour}</div>
          <div className="text-sm text-gray-500">per hour</div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{listing.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">{listing.user?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{listing.user?.username}</div>
            <div className="text-xs text-gray-500">Posted {formatDate(listing.created_at)}</div>
          </div>
        </div>

        <Link
          to={`/listings/${listing.id}`}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ListingCard
