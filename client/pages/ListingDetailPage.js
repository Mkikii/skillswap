"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { listingsAPI, reviewsAPI } from "../services/api"
import BookingForm from "../components/sessions/BookingForm"
import ReviewCard from "../components/reviews/ReviewCard"
import { useAuth } from "../contexts/AuthContext"

const ListingDetailPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    fetchListingDetails()
  }, [id])

  const fetchListingDetails = async () => {
    setLoading(true)
    try {
      const [listingResponse, reviewsResponse] = await Promise.all([
        listingsAPI.getById(id),
        reviewsAPI.getAll({ user_id: null }), // Get all reviews for now, filter client-side
      ])

      setListing(listingResponse.data)

      // Filter reviews for this listing's owner
      const userReviews = (reviewsResponse.data.reviews || reviewsResponse.data).filter(
        (review) => review.reviewee_id === listingResponse.data.user_id,
      )
      setReviews(userReviews)
    } catch (error) {
      setError("Failed to load listing details")
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSuccess = (session) => {
    setShowBookingForm(false)
    // Could show success message or redirect
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading listing...</div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error || "Listing not found"}</div>
          <Link to="/listings" className="text-indigo-600 hover:text-indigo-800">
            Back to Listings
          </Link>
        </div>
      </div>
    )
  }

  const isOwnListing = isAuthenticated && user.id === listing.user_id
  const averageRating = calculateAverageRating()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.skill?.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.skill?.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-green-600">${listing.price_per_hour}/hour</div>
                  <div className="text-sm text-gray-500">Posted {formatDate(listing.created_at)}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>

              {/* Teacher Info */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Teacher</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-700">
                      {listing.user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{listing.user?.username}</h3>
                    {listing.user?.bio && <p className="text-gray-600 mb-3">{listing.user.bio}</p>}
                    {reviews.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {renderStars(Math.round(averageRating))}
                        <span className="text-sm text-gray-600">
                          {averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} showReviewee={false} />
                  ))}
                </div>
                {reviews.length > 3 && (
                  <div className="mt-6 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">View All Reviews</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {showBookingForm ? (
              <BookingForm
                listing={listing}
                onSuccess={handleBookingSuccess}
                onCancel={() => setShowBookingForm(false)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">${listing.price_per_hour}</div>
                  <div className="text-gray-600">per hour</div>
                </div>

                {isAuthenticated ? (
                  isOwnListing ? (
                    <div className="space-y-3">
                      <div className="text-center text-gray-600 mb-4">This is your listing</div>
                      <Link
                        to={`/edit-listing/${listing.id}`}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors text-center block"
                      >
                        Edit Listing
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Book a Session
                    </button>
                  )
                ) : (
                  <div className="text-center">
                    <div className="text-gray-600 mb-4">Sign in to book a session</div>
                    <Link
                      to="/login"
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors text-center block"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Response time:</span>
                      <span>Usually within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skill level:</span>
                      <span>All levels welcome</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailPage
