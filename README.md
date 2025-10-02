SkillSwap - Skill Exchange Platform
A full-stack web application that connects learners with teachers in a community-driven skill-sharing platform. Users can browse available skill listings, create their own offerings, and engage in knowledge exchange.

Live Deployment
Component	URL
Frontend Application	https://skillswap-app.netlify.app
Backend API	https://skillswap-production-0e78.up.railway.app
Deployment Note: The application is deployed from the dev branch, which contains the most stable and tested version of the codebase.

Key Features
Secure Authentication - JWT-based login/registration system with password encryption

Skill Marketplace - Create and browse skill listings with public listing visibility

Expert Profiles - View teacher profiles with ratings, reviews, and skill expertise

Session Management - Book and manage learning sessions with scheduling

Review System - Rate and review completed learning sessions

Responsive Design - Custom styling for all device sizes

API Architecture - Built on a RESTful API architecture

Advanced Search - Find experts by skills, categories, or keywords

Tech Stack
Backend
Flask - Python web framework with RESTful API design

SQLAlchemy - ORM with model relationships and serialization

PostgreSQL - Production database with SQLite for development

JWT Authentication - Secure token-based authentication

Flask-CORS - Cross-origin resource sharing

bcrypt - Password hashing and security

Gunicorn - Production WSGI server

Frontend
React 18 - Modern React with hooks and functional components

React Router - Client-side routing with navigation

Formik & Yup - Form management with comprehensive validation

Tailwind CSS - Utility-first CSS framework

Axios - HTTP client for API communication

Vite - Fast build tool and development server

Design
The application follows a clean design focused on user experience:

Color Scheme: Black background with purple and brown accents

Typography: Inter for body text, Dancing Script for the logo

Layout: Responsive layout optimized for all device sizes

Deployment Configuration
Process: Automatic deployment from the GitHub dev branch

Environment: Environment variables configured for both Netlify and Railway

CORS: CORS is configured for cross-origin requests

Prerequisites
Before running the application, ensure you have the following installed:

Python 3.8+ - Backend runtime environment

Node.js 16+ - Frontend runtime environment

npm - Node package manager (comes with Node.js)

Git - Version control system

PostgreSQL (optional) - For production database (SQLite used in development)

Quick Start Guide
Follow these steps to get the application running locally:

1. Clone and Setup Repository
bash
# Clone the repository
git clone <repository-url>
cd skillswap
2. Backend Setup & Installation
bash
# Navigate to server directory
cd server

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize database with sample data
python seed.py

# Start Flask development server (keep terminal open)
python app.py
Verification: Visit http://localhost:5555/api/health - you should see {"status": "API healthy"}

3. Frontend Setup & Installation
Open a new terminal window and run:

bash
# Navigate to client directory
cd client

# Install npm dependencies
npm install

# Start development server
npm run dev
Verification: Visit http://localhost:5173 - you should see the SkillSwap homepage

Testing the Application
Demo Accounts for Testing
Role	Email	Password	Capabilities
Teacher	seoyeji@example.com	password123	Create listings, receive sessions
Student	maureen@example.com	password123	Browse listings, book sessions
Guest	malkiki@example.com	password123	Basic browsing
Test Backend API Endpoints
bash
cd server

# Comprehensive endpoint testing
python test_all_endpoints.py

# Test listing creation flow
python test_create_listing.py

# Verify demo accounts work
python test_demo_accounts.py
Test Frontend Features
Authentication Flow

Register new account

Login with demo credentials

Access protected routes

Listing Management

Browse all skill listings

View listing details

Create new listing (requires login)

User Experience

Navigate between pages using navbar

View user profiles with ratings

Test form validation on all inputs

Database Schema
The application uses a robust relational database design:

Users - User accounts and profiles

Skills - Available skills and categories

Listings - Skill offerings by teachers

UserSkills - Many-to-many relationship with proficiency levels

Sessions - Booked learning sessions

Reviews - Ratings and feedback system

Project Structure
text
skillswap/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── services/      # API service functions
│   │   └── App.jsx        # Main application component
│   ├── package.json       # Frontend dependencies
│   └── netlify.toml       # Netlify deployment configuration
├── server/                # Flask backend application
│   ├── routes/            # API route handlers
│   ├── models.py          # Database models
│   ├── app.py             # Flask application entry point
│   ├── requirements.txt   # Python dependencies
│   └── seed.py            # Database seeding script
└── README.md              # Project documentation
API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

GET /api/auth/profile - Get user profile

Skills
GET /api/skills - Get all skills

POST /api/skills - Create a new skill (authenticated)

Listings
GET /api/listings - Get all skill listings

POST /api/listings - Create a new listing (authenticated)

GET /api/listings/my-listings - Get user's listings (authenticated)

DELETE /api/listings/:id - Delete listing (authenticated)

Users
GET /api/users/:id - Get user profile

GET /api/users/experts - Get expert users

Troubleshooting
Common Issues
Issue	Solution
Backend Not Starting	Ensure port 5555 is available; Verify virtual environment is activated; Check database was seeded properly
Frontend Connection Issues	Confirm backend is running on port 5555; Clear browser cache if seeing cached versions; Check browser console for CORS errors
Database Issues	Run python seed.py to reset database; Verify SQLite file permissions; Check model imports in models.py
Contributing
Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

License
This project is licensed under the MIT License.

SkillSwap - Bridging knowledge gaps through community-driven learning experiences.

