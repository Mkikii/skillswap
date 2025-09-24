import React, { useState, useEffect } from 'react';

function BrowsePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/listings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        return response.json();
      })
      .then(data => {
        setListings(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading listings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Browse Skills & Listings</h2>
      <div className="listings-grid">
        {listings.length > 0 ? (
          listings.map(listing => (
            <div key={listing.id} className="listing-card">
              <h3>{listing.title}</h3>
              <p>Offered by: {listing.user_id}</p>
              <p>Skill: {listing.skill_id}</p>
              <p>Price: ${listing.price_per_hour}/hr</p>
            </div>
          ))
        ) : (
          <p>No listings found. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
}

export default BrowsePage;