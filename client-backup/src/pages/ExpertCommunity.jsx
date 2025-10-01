import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

function ExpertCommunity() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/experts`);
      const data = await response.json();
      setExperts(data.experts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading experts...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Expert Community</h1>
          <p className="text-gray-600 mt-2">Connect with our verified expert teachers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map(expert => (
            <div key={expert.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {expert.username.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{expert.username}</h3>
                  <p className="text-gray-600 text-sm mb-2">{expert.bio}</p>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">Expert Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.skills.map(skill => (
                        <span 
                          key={skill.id}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="text-yellow-600">
                      ⭐ {expert.average_rating} ({expert.total_reviews} reviews)
                    </div>
                    <div className="text-gray-500">
                      {expert.listings_count} listings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No experts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpertCommunity;