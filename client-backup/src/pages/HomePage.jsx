import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function HomePage() {
  const { user, login } = useAuth();
  const [listings, setListings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, skillsRes, expertsRes] = await Promise.all([
        fetch(`${API_URL}/api/listings`),
        fetch(`${API_URL}/api/skills`),
        fetch(`${API_URL}/api/users/experts`)
      ]);

      const listingsData = await listingsRes.json();
      const skillsData = await skillsRes.json();
      const expertsData = await expertsRes.json();

      setListings(listingsData.listings || []);
      setSkills(skillsData.skills || []);
      setExperts(expertsData.experts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        alert('Demo login successful!');
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">SkillSwap</Link>
            <div className="flex gap-4">
              {!user ? (
                <>
                  <button
                    onClick={handleDemoLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Try Demo
                  </button>
                  <Link
                    to="/auth"
                    className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <div className="flex gap-4 items-center">
                  <span className="text-green-600">Welcome, {user.username}!</span>
                  <Link
                    to="/listings"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Learn New Skills from Expert Teachers
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with skilled professionals and expand your knowledge in various fields
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/listings"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
            >
              Browse All Listings
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold"
              >
                Sign Up to Teach
              </Link>
            )}
          </div>
        </div>

        {/* Quality Features */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose SkillSwap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">Learn from verified experts with proven teaching skills and positive reviews.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Competitive rates in Kenyan Shillings. No hidden fees, transparent pricing.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-xl font-semibold mb-2">Expert Community</h3>
              <p className="text-gray-600">Join a network of skilled professionals and passionate learners.</p>
            </div>
          </div>
        </div>

        {/* Featured Listings */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Listings</h2>
            <Link to="/listings" className="text-blue-500 hover:text-blue-600">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map(listing => (
              <div key={listing.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-600 font-bold">KSh {listing.price_per_hour}/hr</span>
                  <span className="text-sm text-gray-500">by {listing.teacher_username}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {listing.skill_name} • {listing.teacher_rating} ⭐ ({listing.teacher_review_count} reviews)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Community */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Expert Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.slice(0, 4).map(expert => (
              <div key={expert.id} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">
                    {expert.username.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{expert.username}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{expert.bio}</p>
                <div className="text-xs text-blue-600 mb-1">
                  {expert.average_rating} ⭐ • {expert.total_reviews} reviews
                </div>
                <div className="text-xs text-gray-500">
                  {expert.listings_count} listings • {expert.skills.length} skills
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
