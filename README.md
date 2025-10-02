SkillSwap - Skill Exchange Platform
SkillSwap is a full-stack web application that connects people who want to learn new skills with experts willing to teach them. Users can browse skill listings, create their own offerings, and engage in knowledge sharing within a community-driven platform.

Live Deployment
Frontend: https://skillswap-app.netlify.app/

Backend API: https://skillswap-production-0e78.up.railway.app/

Tech Stack
Backend
Flask - Python web framework

SQLAlchemy - ORM for database management

Flask-JWT-Extended - JWT authentication

Flask-CORS - Cross-origin resource sharing

PostgreSQL - Production database (Railway)

SQLite - Development database

bcrypt - Password hashing

Gunicorn - Production WSGI server

Frontend
React - JavaScript library for building user interfaces

React Router - Client-side routing

Axios - HTTP client for API requests

Tailwind CSS - Utility-first CSS framework

Formik - Form management

Yup - Form validation

Vite - Build tool and development server

Project Structure
text
skillswap/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context for state management
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── App.jsx        # Main App component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                # Flask backend application
│   ├── routes/            # API route handlers
│   ├── models.py          # Database models
│   ├── app.py             # Flask application entry point
│   └── requirements.txt   # Python dependencies
│
└── README.md              # Project documentation
Database Schema
Core Models
Users - User accounts with authentication

Skills - Available skills and categories

Listings - Skill offerings by teachers

UserSkills - Skills associated with users and proficiency levels

Sessions - Booked learning sessions

Reviews - User ratings and feedback

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

Sessions
POST /api/sessions - Book a session (authenticated)

GET /api/sessions - Get user sessions (authenticated)

Reviews
POST /api/reviews - Create a review (authenticated)

GET /api/reviews - Get all reviews

Demo Instructions for Grading
Demo Accounts
Use these pre-registered accounts for testing:

Teacher Account:

Email: seoyeji@example.com

Password: password123

This account has existing listings and can create new ones

Student Account:

Email: maureen@example.com

Password: password123

This account can browse listings and create new offerings

Testing Scenarios
As a Teacher (Listing Creator):
Login using teacher demo account

Browse existing listings on the listings page

Create new listing using the "Create New Listing" button

Fill out listing form with:

Title: "Test Skill Session"

Description: "Comprehensive learning experience"

Price: 250 (must be between 1-999 KSh)

Skill Category: Select any skill from dropdown

View created listing in the listings grid

Delete listing - trash icon appears on listings you own

As a Student (Learner):
Login using student demo account

Browse all available listings

View teacher profiles by clicking on teacher names

Create own skill offerings (any user can create listings)

Test authentication flow by logging out and back in

Additional Testing:
User Registration - Create new account from auth page

JWT Authentication - Tokens valid for 7 days

Error Handling - Form validation and error messages

Responsive Design - Test on different screen sizes

Key Features to Verify:
User authentication and authorization

CRUD operations on skill listings

Database persistence across sessions

Frontend-backend communication

Error handling and validation

Professional user interface

Quick Start
Backend Setup
bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
python app.py
Frontend Setup
bash
cd client
npm install
npm run dev
Deployment
Frontend (Netlify)
Automatic deployment from dev branch

Base directory: client

Build command: npm run build

Publish directory: dist

Backend (Railway)
Automatic deployment from dev branch

Uses PostgreSQL database

Environment variables configured

License
This project is licensed under the MIT License.

SkillSwap - Connecting learners and teachers through skill sharing
