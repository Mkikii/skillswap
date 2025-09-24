import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Fetch user-specific data from the backend
      fetch('/me')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
          return response.json();
        })
        .then(data => {
          setProfileData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching profile data:', error);
          setIsLoading(false);
        });
    }
  }, [user, navigate]);

  if (!user) {
    // This return is a fallback, useEffect will handle the redirect
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
    return <div>Unable to load profile.</div>;
  }

  return (
    <div className="profile-page">
      <h2>Welcome, {profileData.username}!</h2>
      <p>Email: {profileData.email}</p>
      <p>Bio: {profileData.bio || "No bio provided."}</p>
      
      <hr />

      <h3>Your Listings</h3>
      {profileData.listings && profileData.listings.length > 0 ? (
        <ul>
          {profileData.listings.map(listing => (
            <li key={listing.id}>
              <h4>{listing.title}</h4>
              <p>{listing.description}</p>
              <p>Price: ${listing.price_per_hour}/hr</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any listings yet.  </p>
      )}

      <h3>Your Sessions</h3>
      <p>This section will show sessions you have scheduled as both a student and a teacher.</p>
    </div>
  );
}

export default ProfilePage;