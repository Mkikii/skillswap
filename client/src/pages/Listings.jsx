import React, { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingsAPI.getAll();
        setListings(response.data.listings);
      } catch (error) {
        setError('Failed to load listings');
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return (
    <div className="container text-center p-4">
      <div>Loading listings...</div>
    </div>
  );

  if (error) return (
    <div className="container text-center p-4">
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );

  return (
    <div className="container p-4">
      <h2>Available Skills</h2>
      <div className="mt-3">
        {listings.map(listing => (
          <div key={listing.id} className="card">
            <h3>{listing.title}</h3>
            <p className="mt-1">{listing.description}</p>
            <div className="mt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>Price:</strong> ${listing.price_per_hour}/hour</span>
              <span><strong>Teacher:</strong> {listing.user.username}</span>
              <span><strong>Skill:</strong> {listing.skill.name}</span>
            </div>
          </div>
        ))}
        
        {listings.length === 0 && (
          <div className="text-center p-4">
            <p>No listings available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;