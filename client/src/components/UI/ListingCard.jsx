import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
            {listing.title}
          </h3>
          <p style={{ margin: '0 0 1rem 0', color: '#666', lineHeight: '1.4' }}>
            {listing.description}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ 
              background: '#e3f2fd', 
              color: '#1976d2', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {listing.skill.name}
            </span>
            
            <span style={{ 
              background: '#f3e5f5', 
              color: '#7b1fa2', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.875rem'
            }}>
              {listing.skill.category}
            </span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right', minWidth: '120px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
            ${listing.price_per_hour}
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#666' }}>/hour</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#2196f3',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginRight: '0.5rem'
          }}>
            {listing.user.username.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: '500' }}>{listing.user.username}</span>
        </div>
        
        <Link 
          to={`/listing/${listing.id}`} 
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;