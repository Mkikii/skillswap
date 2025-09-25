"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { listingsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const MyListingsPage = () => {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMyListings()
  }, [])

  const fetchMyListings = async () => {
    setLoading(true)
    try {
      const response = await listingsAPI.getByUser(user.id)
      setListings(response.data.listings || response.data)
    } catch (error) {
      setError("Failed to fetch your listings")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteListing = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await listingsAPI.delete(listingId)
        setListings(listings.filter((listing) => listing.id !== listingId))
      } catch (error) {
        setError("Failed to delete listing")
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your listings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your skill offerings</p>
          </div>
          <Link
            to="/create-listing"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Create New Listing
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">You haven't created any listings yet.</div>
            <Link
              to="/create-listing"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {listing.skill?.category}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{listing.skill?.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${listing.price_per_hour}</div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{listing.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">Created {formatDate(listing.created_at)}</div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/listings/${listing.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-listing/${listing.id}`}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListingsPage
