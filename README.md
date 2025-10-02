# SkillSwap - Skill Exchange Platform

A full-stack web application that connects learners with teachers in a community-driven skill-sharing platform. Users can browse available skill listings, create their own offerings, and engage in knowledge exchange.

## Live Deployment

| Component | URL |
| :--- | :--- |
| **Frontend Application** | [https://skillswap-app.netlify.app/](https://skillswap-app.netlify.app/) |
| **Backend API** | [https://skillswap-production-0e78.up.railway.app/](https://skillswap-production-0e78.up.railway.app/) |

**Deployment Note:** The application is deployed from the **`dev` branch**, which contains the most stable and tested version of the codebase.

## Key Features

- **User Authentication** - Secure JWT-based login/registration system with 7-day JWT tokens and password encryption
- **Skill Marketplace** - Create and browse detailed skill listings with pricing and public visibility
- **Expert Profiles** - View teacher profiles with ratings, reviews, and skill expertise
- **Session Management** - Book and manage learning sessions with scheduling
- **Review System** - Rate and review completed learning sessions
- **Skill Management** - Add skills to your profile with proficiency levels
- **Responsive Design** - Responsive design with custom styling for all device sizes
- **API Architecture** - Built on a RESTful API architecture
- **Advanced Search** - Find experts by skills, categories, or keywords

## Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Vite, React Router, Formik & Yup, Axios |
| **Backend** | Flask, SQLAlchemy, JWT Authentication, Flask-CORS, bcrypt, Gunicorn |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **Deployment** | Netlify (Frontend), Railway (Backend) |

### Backend Detail

- **Flask** - Python web framework with RESTful API design
- **SQLAlchemy** - ORM with model relationships and serialization
- **PostgreSQL** - Production database with SQLite for development
- **JWT Authentication** - Secure token-based authentication
- **Flask-CORS** - Cross-origin resource sharing
- **bcrypt** - Password hashing and security
- **Gunicorn** - Production WSGI server

### Frontend Detail

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing with navigation
- **Formik & Yup** - Form management with comprehensive validation
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server

## Design

The application follows a clean design focused on user experience:

- **Color Scheme:** Black background with purple and brown accents
- **Typography:** Inter for body text, Dancing Script for the logo
- **Layout:** Responsive layout optimized for all device sizes

## Deployment Configuration

- **Process:** Automatic deployment from the GitHub `dev` branch
- **Environment:** Environment variables configured for both Netlify and Railway
- **CORS:** CORS is configured for cross-origin requests

## Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.8+** - Backend runtime environment
- **Node.js 16+** - Frontend runtime environment
- **npm** - Node package manager (comes with Node.js)
- **Git** - Version control system
- **PostgreSQL** (optional) - For production database (SQLite used in development)

## Quick Start Guide

Follow these steps to get the application running locally:

### 1. Clone and Setup Repository

```bash
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
Expected Output:

text
Database tables created successfully
Skills created successfully
Users created successfully
User skills created successfully
Listings created successfully
Sessions created successfully
Reviews created successfully

DATABASE SETUP COMPLETED SUCCESSFULLY!
Users: 10 | Skills: 17 | Listings: 9 | Sessions: 3 | Reviews: 3
3. Start Backend Server
bash
# Start Flask development server (keep terminal open)
python app.py
Verification: Visit http://localhost:5555/api/health — you should see {"status": "API healthy"}

4. Frontend Setup & Installation
Open a new terminal window and run:

bash
# Navigate to client directory
cd client

# Install npm dependencies
npm install

# Start development server
npm run dev
Verification: Visit http://localhost:5173 — you should see the SkillSwap homepage

Testing the Application
Demo Accounts
Role	Email	Password	Capabilities
Teacher	seoyeji@example.com	password123	Create listings, receive sessions
Student	maureen@example.com	password123	Browse listings, book sessions
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

Project Structure
The application follows a clean separation between frontend (client/) and backend (server/) with proper environment configuration for deployment.

Database Schema
The application uses a robust relational database design:

Users – User accounts and profiles

Skills – Available skills and categories

Listings – Skill offerings by teachers

UserSkills – Many-to-many relationship with proficiency levels

Sessions – Booked learning sessions

Reviews – Ratings and feedback system

Troubleshooting
Issue	Solution
Backend Not Starting	Ensure port 5555 is available; Verify virtual environment is activated; Check database was seeded properly
Frontend Connection Issues	Confirm backend is running on port 5555; Clear browser cache; Check browser console for CORS errors
Database Issues	Run python seed.py to reset database; Verify SQLite file permissions; Check model imports in models.py
Environment Configuration
Backend Environment
text
DATABASE_URL=sqlite:///skillswap.db
JWT_SECRET_KEY=your-secret-key-here
Frontend Environment
text
VITE_API_URL=https://skillswap-production-0e78.up.railway.app
Development Team
Name	Role	Contributions
Maureen	Lead Developer	Full-stack development (Authentication, Backend API, Database Design, Frontend Components, Debugging, Deployment, Git Workflow)
Andrew	Frontend Developer	Core Frontend setup and initial React components
Odour	Backend Developer	Initial backend architecture and models
Contributing & Git Workflow
Our team uses a feature-branch workflow based on the following process:

Initial Setup: The repository was cloned by all team members after the project was initialized

Branching: Each team member created a dedicated branch from the main or dev branch for their features

Code Review: All new features are merged into the dev branch via pull requests after thorough review and testing

Deployment: The live application is deployed directly from the stable dev branch

License
MIT License Copyright (c) 2025 SkillSwap

Support
For technical support or questions about the application:

Check terminal output for specific error messages

Verify all prerequisite software is installed

Ensure each setup step completes successfully

SkillSwap - Bridging knowledge gaps through community-driven learning experiences.
