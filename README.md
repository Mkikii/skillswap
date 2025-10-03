# SkillSwap - Full Stack Skill Sharing Platform

## Project Overview

SkillSwap is a full-stack web application that serves as a bulletin board for skill sharing. Users can create listings to offer skills they can teach or request skills they want to learn. The platform facilitates connections between learners and teachers through a modern React frontend and Flask API backend.

**Live Demo:** [Frontend](https://skillswap-app.netlify.app) | [Backend API](https://skillswap-production-0e78.up.railway.app)

**Deployment Note:** The application is deployed exclusively from the dev branch, which contains the most stable and tested version of the codebase.

## Team Members

- **Maureen Karimi** - Scrum Master & Full Stack Developer
- **Andrew Omori** - Core Frontend Developer
- **Ochieng Odour** - Initial Backend Developer

## Features

- **User Authentication** - Register, login, and logout with JWT-based security
- **Skill Marketplace** - Create, read, and delete skill listings
- **Book Learning Sessions** - Initiate and manage session bookings with teachers
- **Browsing** - Browse available skills and listings
- **Profiles** - User profiles display skills and ratings
- **Session Management** - Full booking and status management system
- **Responsive Design** - Optimized interface for all devices

## Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **React Router DOM** - For client-side routing and navigation
- **Tailwind CSS** - Utility-first framework for rapid styling
- **Axios** - Promise-based HTTP client for API calls
- **Vite** - Fast build tool for development

### Backend
- **Flask** - Lightweight Python web framework for the API
- **SQLAlchemy ORM** - Python SQL Toolkit and Object Relational Mapper
- **Flask-JWT-Extended** - For secure token-based authentication
- **Flask-CORS** - For handling cross-origin requests
- **PostgreSQL** (Production) / **SQLite** (Development) - Database solutions

### Deployment
- **Frontend:** Netlify
- **Backend:** Railway

## Project Requirements Met

### Flask Backend
- Uses routes for GET, POST, PATCH, and DELETE operations
- Returns appropriate HTTP status codes
- Implements CORS for cross-origin requests
- Separates client and server code properly

### SQLAlchemy and Serialization
- 6 data models with proper relationships
- One-to-many relationships (User-Listings, User-Reviews)
- Many-to-many relationship (User-Skills through UserSkill)
- SQLAlchemy-Serializer for JSON serialization
- Full session management for CRUD operations

### Forms and Validation
- Formik forms for all POST, PUT, PATCH routes
- Frontend validation on all inputs
- Data type validation (price ranges, required fields)
- String format validation (email, username)

### React Routes
- 6 client-side routes with React Router
- Navigation bar for route navigation
- Use of fetch() or Axios for client-server communication
- Protected routes for authenticated users

## Database Schema
Table users {
id integer [primary key]
username varchar [unique]
email varchar [unique]
password_hash varchar
bio text
created_at timestamp
}
Table skills {
id integer [primary key]
name varchar [unique]
category varchar
}
Table listings {
id integer [primary key]
title varchar
description text
price_per_hour decimal
user_id integer [ref: > users.id]
skill_id integer [ref: > skills.id]
created_at timestamp
}
Table user_skills {
id integer [primary key]
user_id integer [ref: > users.id]
skill_id integer [ref: > skills.id]
proficiency_level varchar
years_experience integer
}
Table sessions {
id integer [primary key]
student_id integer [ref: > users.id]
teacher_id integer [ref: > users.id]
listing_id integer [ref: > listings.id]
scheduled_date timestamp
duration_hours decimal
status varchar
notes text
}
Table reviews {
id integer [primary key]
rating integer
comment text
reviewer_id integer [ref: > users.id]
reviewee_id integer [ref: > users.id]
session_id integer [ref: > sessions.id]
created_at timestamp
}

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Mkikii/skillswap.git
cd skillswap/server

2. Create virtual environment and install dependencies:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

3. Set up environment variables:
cp .env.example .env
# Edit .env with your database URL and secret keys

4. Initialize the database:
python seed.py

5.Run the development server:
python app.py

Frontend Setup
1.Navigate to client directory:
cd ../client

2.Install dependencies:
npm install

3.Set up environment variables:
cp .env.example .env
# Edit .env with your API URL

4. Run the development server:

API Endpoints
Authentication

POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile

Listings

GET /api/listings - Get all listings
POST /api/listings - Create new listing
GET /api/listings/my-listings - Get user's listings
DELETE /api/listings/:id - Delete listing

Skills

GET /api/skills - Get all skills

Sessions

POST /api/sessions - Book a session
GET /api/sessions - Get user sessions

Users

GET /api/users/:id - Get user profile
GET /api/users/experts - Get expert users

Demo Accounts

Teacher Account: kikii@example.com / password123
Student Account: maureen@example.com / password123

Development Workflow
This project was developed using Git feature branch workflow:

Main branch: production-ready code
Dev branch: active development
Feature branches: individual feature development

Deployment
The application is deployed on two platforms:

Frontend: Netlify (automatically deploys from dev branch)
Backend: Railway (deploys from main branch)

Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License.
Acknowledgments

Flatiron School for project guidelines and requirements
React and Flask communities for excellent documentation
Netlify and Railway for reliable deployment platforms















