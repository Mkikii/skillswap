import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionsAPI } from '../services/api';

function BookingPage() {
  const { user } = useAuth();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://skillswap-production-0e78.up.railway.app'}/api/listings`);
      const data = await response.json();
      
      if (response.ok && data.listings) {
        const foundListing = data.listings.find(l => l.id === parseInt(listingId));
        setListing(foundListing);
      } else {
        setListing(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setListing(null);
      setLoading(false);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    if (!user) {
      setBookingError('Please login to book a session');
      return;
    }

    setBookingLoading(true);
    try {
      const sessionData = {
        ...bookingData,
        listing_id: parseInt(listingId)
      };
      
      await sessionsAPI.create(sessionData);
      
      alert('Session booked successfully! The teacher will contact you soon.');
      navigate('/');
    } catch (error) {
      console.error('Error booking session:', error);
      setBookingError(error.message || 'Failed to book session. Please check all fields and try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700 mx-auto"></div>
          <p className="mt-4 text-white">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Listing not found</h2>
          <Link to="/listings" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg">Back to Listings</Link>
        </div>
      </div>
    );
  }

  const totalCost = listing.price_per_hour * bookingData.duration_hours;

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/listings" className="flex items-center space-x-2 text-pink-600 hover:text-pink-500">
            <span>Back to Listings</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-4">{listing.title}</h1>
            
            <p className="text-gray-300 mb-6">{listing.description}</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-pink-600">
                  KSh {listing.price_per_hour}
                  <span className="text-sm font-normal text-gray-400">/hour</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">Skill: {listing.skill_name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">Category: {listing.skill_category}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900 rounded-lg">
              <h3 className="font-semibold text-blue-200 mb-2">About the Teacher</h3>
              <p className="text-blue-100">{listing.teacher_username}</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Book a Session</h2>
            
            {bookingError && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
                {bookingError}
              </div>
            )}
            
            <form onSubmit={handleBookSession} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.scheduled_date}
                  onChange={(e) => setBookingData({...bookingData, scheduled_date: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (hours) *
                </label>
                <select
                  value={bookingData.duration_hours}
                  onChange={(e) => setBookingData({...bookingData, duration_hours: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  required
                >
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Select duration between 0.5 and 3 hours</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-600 text-white"
                  rows="3"
                  placeholder="Any specific topics you would like to focus on..."
                />
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Hourly rate:</span>
                  <span className="font-semibold">KSh {listing.price_per_hour}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Duration:</span>
                  <span className="font-semibold">{bookingData.duration_hours} hours</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Cost:</span>
                    <span className="text-2xl font-bold text-pink-600">KSh {totalCost}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || !user}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg font-semibold rounded-lg disabled:opacity-50 transition-all"
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
                <p className="text-center text-sm text-gray-400">
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