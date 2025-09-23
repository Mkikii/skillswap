import React from 'react';

function ListingCard({ listing }) {
  // Use a fallback for missing data to prevent errors
  const { title, description, price_per_hour, user, skill } = listing || {};

  return (
    <div className="listing-card">
      <div className="card-header">
        <h3>{title || 'No Title'}</h3>
      </div>
      <div className="card-body">
        <p><strong>Skill:</strong> {skill?.name || 'N/A'}</p>
        <p>{description || 'No description provided.'}</p>
        <p className="price"><strong>Price:</strong> ${price_per_hour || '0'}/hr</p>
      </div>
      <div className="card-footer">
        <p><strong>Offered by:</strong> {user?.username || 'Anonymous'}</p>
      </div>
    </div>
  );
}

export default ListingCard;