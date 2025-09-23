import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage">
      <header className="hero-section">
        <h1>Welcome to SkillSwap</h1>
        <p className="subtitle">Your peer-to-peer platform for sharing and learning new skills.</p>
        <div className="cta-buttons">
          <Link to="/browse" className="btn btn-primary">Browse Skills</Link>
          <Link to="/register" className="btn btn-secondary">Join Now</Link>
        </div>
      </header>
      
      <section className="features-section">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Find Your Next Skill</h3>
            <p>Explore a wide variety of skills offered by passionate teachers in your community.</p>
          </div>
          <div className="feature-card">
            <h3>Share What You Know</h3>
            <p>Create a listing to teach a skill you're passionate about and connect with students.</p>
          </div>
          <div className="feature-card">
            <h3>Learn and Grow</h3>
            <p>Schedule one-on-one sessions and expand your knowledge in a collaborative environment.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;