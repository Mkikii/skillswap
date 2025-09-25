"use client"

import { useState, useEffect } from "react"
import { listingsAPI, skillsAPI } from "../services/api"
import ListingCard from "../components/listings/ListingCard"

const ListingsPage = () => {
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    page: 1,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
    per_page: 10,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchListings()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await skillsAPI.getAll()
      const uniqueCategories = [...new Set(response.data.map((skill) => skill.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)
      params.append("page", filters.page)
      params.append("per_page", 10)

      const response = await listingsAPI.getAll()
      setListings(response.data.listings || response.data)
      if (response.data.total !== undefined) {
        setPagination({
          total: response.data.total,
          pages: response.data.pages,
          current_page: response.data.current_page,
          per_page: response.data.per_page,
        })
      }
    } catch (error) {
      setError("Failed to fetch listings")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading listings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Skill Listings</h1>
          <p className="text-gray-600">Discover skills to learn or find students for your expertise</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search skills, titles, or descriptions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No listings found. Try adjusting your filters.</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-md ${
                        page === filters.page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ListingsPage
