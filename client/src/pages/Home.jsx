import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              SkillSwap
            </h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with expert teachers in your community. Learn new skills or share your expertise with others in a vibrant learning ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/listings"
                className="btn-primary text-lg px-8 py-4"
              >
                <i className='bx bx-search-alt-2 mr-2'></i>
                Explore Skills
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <i className='bx bx-rocket mr-2'></i>
                  Start Teaching
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SkillSwap?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience learning like never before with our community-driven platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 card-hover bg-white rounded-2xl shadow-lg">
              <div className="feature-icon bg-blue-100 text-blue-600">
                <i className='bx bx-group'></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Expert Community</h3>
              <p className="text-gray-600 leading-relaxed">Connect with verified experts across various fields. Learn from passionate teachers who love sharing their knowledge.</p>
            </div>
            
            <div className="text-center p-8 card-hover bg-white rounded-2xl shadow-lg">
              <div className="feature-icon bg-green-100 text-green-600">
                <i className='bx bx-credit-card-front'></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Fair Pricing</h3>
              <p className="text-gray-600 leading-relaxed">Teachers set their own rates. Find quality education at prices that work for you, with no hidden fees.</p>
            </div>
            
            <div className="text-center p-8 card-hover bg-white rounded-2xl shadow-lg">
              <div className="feature-icon bg-purple-100 text-purple-600">
                <i className='bx bx-star'></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">Rate your experiences and help maintain our community standards. Quality education backed by real reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Skills Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of learners and teachers already transforming their skills</p>
          <Link
            to={user ? "/listings" : "/register"}
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            {user ? "Browse Listings" : "Get Started Today"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;