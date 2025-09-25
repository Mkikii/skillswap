"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { listingsAPI } from "../services/api"
import ListingCard from "../components/listings/ListingCard"
import { useAuth } from "../contexts/AuthContext"

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const [featuredListings, setFeaturedListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedListings()
  }, [])

  const fetchFeaturedListings = async () => {
    try {
      const response = await listingsAPI.getAll()
      // Get first 6 listings as featured
      setFeaturedListings((response.data.listings || response.data).slice(0, 6))
    } catch (error) {
      console.error("Failed to fetch featured listings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Share Skills, Learn Together</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Connect with others to teach what you know and learn what you want
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Browse Skills
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/create-listing"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Share Your Skills
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SkillSwap Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start sharing and learning skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Listings</h3>
              <p className="text-gray-600">Share your expertise by creating skill listings with your hourly rate</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Sessions</h3>
              <p className="text-gray-600">Find skills you want to learn and book sessions with experienced teachers</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Leave Reviews</h3>
              <p className="text-gray-600">Rate your experience and help others find the best teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Skills</h2>
            <p className="text-lg text-gray-600">Discover popular skills being shared in our community</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading featured skills...</div>
            </div>
          ) : featuredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/listings"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  View All Skills
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600 mb-4">
                No skills available yet. Be the first to share your expertise!
              </div>
              {isAuthenticated && (
                <Link
                  to="/create-listing"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Create First Listing
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-indigo-100">Join our community of learners and teachers today</p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
