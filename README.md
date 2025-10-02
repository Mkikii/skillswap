# SkillSwap - Skill Exchange Platform

A full-stack web application that connects knowledge seekers with skilled experts for personalized learning experiences. **SkillSwap** enables users to share expertise, book learning sessions, and build a community around skill development.

---

## Live Deployment

| Component | URL |
| :--- | :--- |
| **Frontend Application** | https://https://https://skillswap-app.netlify.app//// |
| **Backend API** | https://skillswap-production-0e78.up.railway.app/ |

**Deployment Note:** The application is deployed from the `dev` branch, which contains the most stable and tested version of the codebase.

---

## Key Features

* **Secure Authentication** - JWT-based login/registration system with password encryption
* **Skill Marketplace** - Browse and create detailed skill listings with pricing
* **Expert Profiles** - View teacher profiles with ratings, reviews, and skill expertise
* **Session Management** - Book and manage learning sessions with scheduling
* **Review System** - Rate and review completed learning sessions
* **Skill Management** - Add skills to your profile with proficiency levels
* **Advanced Search** - Find experts by skills, categories, or keywords

---

## Tech Stack

### Backend

* **Flask** - Python web framework with RESTful API design
* **SQLAlchemy** - ORM with model relationships and serialization
* **PostgreSQL** - Production database with **SQLite** for development
* **JWT Authentication** - Secure token-based authentication
* **Flask-CORS** - Cross-origin resource sharing
* **bcrypt** - Password hashing and security
* **Gunicorn** - Production WSGI server

### Frontend

* **React 18** - Modern React with hooks and functional components
* **React Router** - Client-side routing with navigation
* **Formik & Yup** - Form management with comprehensive validation
* **Tailwind CSS** - Utility-first CSS framework
* **Axios** - HTTP client for API communication
* **Vite** - Fast build tool and development server

---

## Prerequisites

Before running the application, ensure you have the following installed:

* **Python 3.8+** - Backend runtime environment
* **Node.js 16+** - Frontend runtime environment
* **npm** - Node package manager (comes with Node.js)
* **Git** - Version control system
* **PostgreSQL** (optional) - For production database (SQLite used in development)

---

## Quick Start Guide

Follow these steps to get the application running locally:

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd skillswap

Backend Setup & Installation

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
Database tables created successfully
Skills created successfully
Users created successfully
User skills created successfully
Listings created successfully
Sessions created successfully
Reviews created successfully

DATABASE SETUP COMPLETED SUCCESSFULLY!
Users: 10 | Skills: 17 | Listings: 9 | Sessions: 3 | Reviews: 3

 Start Backend Server

 # Start Flask development server (keep terminal open)
python app.py

Verification: Visit http://localhost:5555/api/health - you should see {"status": "API healthy"}

Frontend Setup & Installation
Open a new terminal window and run:

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

Troubleshooting

Common Issues
Issue	Solution
Backend Not Starting	Ensure port 5555 is available; Verify virtual environment is activated; Check database was seeded properly.
Frontend Connection Issues	Confirm backend is running on port 5555; Clear browser cache if seeing cached versions; Check browser console for CORS errors.
Database Issues	Run python seed.py to reset database; Verify SQLite file permissions; Check model imports in models.py.

If you paste the raw text you just provided (the one without any Markdown symbols), it will look very poor on your GitHub README.

You must paste the version that includes the formatting symbols (#, *, |, and code blocks).

I strongly recommend you copy the complete, correctly formatted Markdown from my last response, which is pasted below for your convenience.

Correct README Content to Copy
Markdown

# SkillSwap - Skill Exchange Platform

A full-stack web application that connects knowledge seekers with skilled experts for personalized learning experiences. **SkillSwap** enables users to share expertise, book learning sessions, and build a community around skill development.

---

## Live Deployment

| Component | URL |
| :--- | :--- |
| **Frontend Application** | https://mkikiiskillswap.netlify.app/ |
| **Backend API** | https://skillswap-production-0e78.up.railway.app/ |

**Deployment Note:** The application is deployed from the `dev` branch, which contains the most stable and tested version of the codebase.

---

## Key Features

* **Secure Authentication** - JWT-based login/registration system with password encryption
* **Skill Marketplace** - Browse and create detailed skill listings with pricing
* **Expert Profiles** - View teacher profiles with ratings, reviews, and skill expertise
* **Session Management** - Book and manage learning sessions with scheduling
* **Review System** - Rate and review completed learning sessions
* **Skill Management** - Add skills to your profile with proficiency levels
* **Advanced Search** - Find experts by skills, categories, or keywords

---

## Tech Stack

### Backend

* **Flask** - Python web framework with RESTful API design
* **SQLAlchemy** - ORM with model relationships and serialization
* **PostgreSQL** - Production database with **SQLite** for development
* **JWT Authentication** - Secure token-based authentication
* **Flask-CORS** - Cross-origin resource sharing
* **bcrypt** - Password hashing and security
* **Gunicorn** - Production WSGI server

### Frontend

* **React 18** - Modern React with hooks and functional components
* **React Router** - Client-side routing with navigation
* **Formik & Yup** - Form management with comprehensive validation
* **Tailwind CSS** - Utility-first CSS framework
* **Axios** - HTTP client for API communication
* **Vite** - Fast build tool and development server

---

## Prerequisites

Before running the application, ensure you have the following installed:

* **Python 3.8+** - Backend runtime environment
* **Node.js 16+** - Frontend runtime environment
* **npm** - Node package manager (comes with Node.js)
* **Git** - Version control system
* **PostgreSQL** (optional) - For production database (SQLite used in development)

---

## Quick Start Guide

Follow these steps to get the application running locally:

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd skillswap
2. Backend Setup & Installation
Bash

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

Plaintext

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
Bash

# Start Flask development server (keep terminal open)
python app.py
Verification: Visit http://localhost:5555/api/health - you should see {"status": "API healthy"}

4. Frontend Setup & Installation
Open a new terminal window and run:

Bash

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

Export to Sheets
Test Backend API Endpoints
Bash

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

Troubleshooting
Common Issues
Issue	Solution
Backend Not Starting	Ensure port 5555 is available; Verify virtual environment is activated; Check database was seeded properly.
Frontend Connection Issues	Confirm backend is running on port 5555; Clear browser cache if seeing cached versions; Check browser console for CORS errors.
Database Issues	Run python seed.py to reset database; Verify SQLite file permissions; Check model imports in models.py.

Export to Sheets
Environment Configuration
Backend Environment:

# Create .env file in server/ directory
DATABASE_URL=sqlite:///skillswap.db
JWT_SECRET_KEY=your-secret-key-here

Frontend Environment:

# .env.production in client/ directory
VITE_API_URL=[https://skillswap-production-0e78.up.railway.app](https://skillswap-production-0e78.up.railway.app)

Development Team
Team Member	Role	Contributions
Maureen	Lead Developer	Full-stack development (Authentication, Backend API, Database Design, Frontend Components, Debugging, Deployment, Git Workflow)
Andrew	Frontend Developer	Core Frontend setup and initial React components
Odour	Backend Developer	Initial backend architecture and models

License
MIT License

Copyright (c) 2025 SkillSwap
Support
For technical support or questions about the application:

Check terminal output for specific error messages

Verify all prerequisite software is installed

Ensure each setup step completes successfully

The application includes comprehensive error handling and user feedback

SkillSwap - Bridging knowledge gaps through community-driven learning experiences.


