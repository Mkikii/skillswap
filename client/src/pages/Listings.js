import React, { useState, useEffect } from 'react'
import { listingsAPI } from '../services/api'

const Listings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listingsAPI.getAll()
      .then(response => {
        setListings(response.data.listings)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching listings:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading listings...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Available Skills</h2>
      {listings.map(listing => (
        <div key={listing.id} style={{ border: '1px solid #ddd', margin: '1rem 0', padding: '1rem', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{listing.title}</h3>
          <p style={{ margin: '0 0 0.5rem 0' }}>{listing.description}</p>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>${listing.price_per_hour}/hour</p>
          <p style={{ margin: 0, color: '#666' }}>Taught by: {listing.user.username}</p>
        </div>
      ))}
    </div>
  )
}

export default Listings
