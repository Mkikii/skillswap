"use client"

import { useState, useEffect } from "react"
import { reviewsAPI } from "../services/api"
import ReviewCard from "../components/reviews/ReviewCard"
import { useAuth } from "../contexts/AuthContext"

const ReviewsPage = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState({
    given: [],
    received: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("received")
  const [stats, setStats] = useState({
    average_rating: 0,
    total_received: 0,
  })

  useEffect(() => {
    fetchMyReviews()
  }, [])

  const fetchMyReviews = async () => {
    setLoading(true)
    try {
      const response = await reviewsAPI.getByUser(user.id)
      setReviews({
        given: response.data.given_reviews || [],
        received: response.data.received_reviews || [],
      })
      setStats({
        average_rating: response.data.average_rating || 0,
        total_received: response.data.total_received || 0,
      })
    } catch (error) {
      setError("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "received", label: "Reviews Received" },
    { id: "given", label: "Reviews Given" },
  ]

  const currentReviews = reviews[activeTab] || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Reviews</h1>
          <p className="text-gray-600">View reviews you've received and given</p>
        </div>

        {/* Stats Card */}
        {activeTab === "received" && stats.total_received > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.average_rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= Math.round(stats.average_rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.total_received}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({reviews[tab.id]?.length || 0})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Reviews Grid */}
        {currentReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {activeTab === "received" && "No reviews received yet."}
              {activeTab === "given" && "No reviews given yet."}
            </div>
            <p className="text-gray-400 mt-2">
              {activeTab === "received" && "Complete some teaching sessions to receive reviews!"}
              {activeTab === "given" && "Complete some learning sessions to give reviews!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} showReviewee={activeTab === "given"} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
