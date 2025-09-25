import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>SkillSwap</Link>
      <div>
        <Link to="/listings" style={{ marginRight: '1rem', textDecoration: 'none' }}>Browse Listings</Link>
        <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>Register</Link>
      </div>
    </nav>
  )
}

export default Navbar
