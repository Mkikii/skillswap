import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaUsers, FaDollarSign, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function HomePage() {
  const { user, login } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/listings`);
      const data = await response.json();
      setListings(data.listings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'maureen@example.com',
          password: 'password123'
        })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user, data.access_token);
        alert('�� Login successful! Welcome to SkillSwap!');
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <p className="mt-4 text-gray-600">Loading SkillSwap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-700 to-primary-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                SKILLSWAP
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={handleDemoLogin}
                    className="btn-secondary"
                  >
                    Try Demo
                  </button>
                  <Link
                    to="/auth"
                    className="btn-outline border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, <span className="font-semibold text-primary-700">{user.username}</span>!</span>
                  <Link
                    to="/listings"
                    className="btn-primary"
                  >
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Share Skills,
            <span className="block bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
              Learn Together
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with expert teachers in your community and discover new skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/listings"
              className="btn-primary text-lg px-8 py-4"
            >
              Explore Skills <FaArrowRight className="ml-2 inline" />
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="btn-secondary text-lg px-8 py-4"
              >
                Start Teaching
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="feature-card">
              <FaUsers className="text-primary-700 text-3xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Community</h3>
              <p className="text-gray-600">Connect with verified experts</p>
              <div className="mt-4 text-2xl font-bold text-primary-700">50+ Teachers</div>
            </div>
            
            <div className="feature-card">
              <FaDollarSign className="text-primary-700 text-3xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Teachers set their rates</p>
              <div className="mt-4 text-2xl font-bold text-primary-700">No hidden fees</div>
            </div>
            
            <div className="feature-card">
              <FaStar className="text-primary-700 text-3xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">Rate your experiences</p>
              <div className="mt-4 text-2xl font-bold text-primary-700">4.9 Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing skills from our expert community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0, 6).map((listing) => (
              <div key={listing.id} className="card group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(Math.round(listing.teacher_rating))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({listing.teacher_review_count} reviews)
                      </span>
                    </div>
                  </div>
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {listing.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-primary-700">
                    KSh {listing.price_per_hour}
                    <span className="text-sm font-normal text-gray-500">/hr</span>
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {listing.skill_name}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>by {listing.teacher_username}</span>
                  <button 
                    className="text-primary-700 hover:text-primary-800 font-medium flex items-center space-x-1"
                    onClick={() => alert('View details feature coming soon!')}
                  >
                    <span>View Details</span>
                    <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/listings"
              className="btn-outline border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-lg px-8 py-4"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of learners and teachers in our growing community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              to="/listings"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Browse Skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
