iimport React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaStar, FaPaperPlane } from 'react-icons/fa';
import { reviewsAPI } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function ReviewPage() {
  const { user } = useAuth();
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    session_id: '' 
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      navigate('/auth');
      return;
    }

    if (!reviewData.comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.comment,
          reviewee_id: parseInt(teacherId),
          session_id: 1 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('⭐ Thank you for your review!');
        navigate('/');
      } else {
        alert('❌ Failed to submit review: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setReviewData({...reviewData, rating: star})}
            className="focus:outline-none"
          >
            <FaStar 
              size={32}
              className={star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 text-primary-700 hover:text-primary-800">
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Share Your Experience</h1>
          <p className="text-gray-600 mb-8 text-center">Help others by sharing your learning experience</p>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you rate your experience?
              </label>
              {renderStarRating()}
              <p className="text-sm text-gray-500">
                {reviewData.rating === 5 ? 'Excellent!' : 
                 reviewData.rating === 4 ? 'Very Good' :
                 reviewData.rating === 3 ? 'Good' :
                 reviewData.rating === 2 ? 'Fair' : 'Poor'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your thoughts
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="5"
                placeholder="What did you like about the session? What could be improved? Your feedback helps both the teacher and future students..."
                required
              />
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Writing a helpful review:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about what you learned</li>
                <li>• Mention the teacher's teaching style</li>
                <li>• Note any particular strengths</li>
                <li>• Provide constructive feedback</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Submit Review</span>
                </>
              )}
            </button>

            {!user && (
              <p className="text-center text-sm text-gray-600">
                You need to be logged in to submit a review
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
