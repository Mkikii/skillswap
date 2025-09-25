import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to SkillSwap</h1>
      <p>Share your skills and learn from others in your community</p>
      <Link to="/listings" style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Browse Available Skills
      </Link>
    </div>
  )
}

export default Home
