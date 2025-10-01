import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaCalendar, FaClock, FaMoneyBillWave, FaStar, FaCheckCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function BookingPage() {
  const { user } = useAuth();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduled_date: '',
    duration_hours: 1,
    notes: ''
  });

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/listings/${listingId}`);
      const data = await response.json();
      setListing(data.listing);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setLoading(false);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to book a session');
      navigate('/auth');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listing_id: parseInt(listingId),
          scheduled_date: bookingData.scheduled_date,
          duration_hours: parseFloat(bookingData.duration_hours),
          notes: bookingData.notes
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('🎉 Session booked successfully! The teacher will contact you soon.');
        navigate('/');
      } else {
        alert('❌ Failed to book session: ' + data.error);
      }
    } catch (error) {
      console.error('Error booking session:', error);
      alert('❌ Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Link to="/listings" className="btn-primary">Back to Listings</Link>
        </div>
      </div>
    );
  }

  const totalCost = listing.price_per_hour * bookingData.duration_hours;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/listings" className="flex items-center space-x-2 text-primary-700 hover:text-primary-800">
            <FaArrowLeft />
            <span>Back to Listings</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Details */}
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(listing.teacher.average_rating))}
              </div>
              <span className="text-sm text-gray-500">
                ({listing.teacher.total_reviews} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6">{listing.description}</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-green-600" />
                <span className="text-2xl font-bold text-primary-700">
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-gray-500">/hour</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-blue-600" />
                <span className="text-gray-700">Skill: {listing.skill.name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-blue-600" />
                <span className="text-gray-700">Category: {listing.skill.category}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">About the Teacher</h3>
              <p className="text-blue-800">{listing.teacher.bio || 'Experienced teacher passionate about sharing knowledge.'}</p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Session</h2>
            
            <form onSubmit={handleBookSession} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.scheduled_date}
                  onChange={(e) => setBookingData({...bookingData, scheduled_date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2" />
                  Duration (hours)
                </label>
                <select
                  value={bookingData.duration_hours}
                  onChange={(e) => setBookingData({...bookingData, duration_hours: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any specific topics you'd like to focus on..."
                />
              </div>

              {/* Cost Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Hourly rate:</span>
                  <span className="font-semibold">KSh {listing.price_per_hour}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{bookingData.duration_hours} hours</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Cost:</span>
                    <span className="text-2xl font-bold text-primary-700">KSh {totalCost}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || !user}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50"
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Booking Session...</span>
                  </div>
                ) : user ? (
                  'Confirm Booking'
                ) : (
                  'Login to Book'
                )}
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-600">
                  You need to be logged in to book a session
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
