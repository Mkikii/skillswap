# SkillSwap - Full Stack Skill Sharing Platform

SkillSwap is a full-stack web application that acts as a bulletin board for skill sharing. Users can create listings to offer skills they can teach or request skills they want to learn. The platform connects learners with expert teachers in various fields including technology, design, culinary arts, fitness, and more.

**Developed by:** Maureen Karimi (Scrum Master & Lead Developer), Andrew Omori (Frontend), Ochieng Odour (Backend)

## Live Deployment

- **Frontend:** [Netlify Deployment](https://skillswap-app.netlify.app)
- **Backend API:** [Railway Deployment](https://skillswap-production-0e78.up.railway.app)
- **GitHub Repository:** [SkillSwap GitHub](https://github.com/Mkikii/skillswap)

**Deployment Note:** The application is deployed *exclusively* from the **`dev` branch**, which contains the most stable and tested version of the codebase.

## Deployment Configuration

* **Process:** Automatic deployment from the GitHub **`dev` branch**.
* **Environment:** Environment variables configured for both Netlify and Railway.
* **CORS:** CORS is configured for cross-origin requests.

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Vite build tool

### Backend
- Flask (Python)
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- PostgreSQL (Production) / SQLite (Development)

## Features

### Core Functionality
- User authentication (login/register)
- Create, read, update, delete skill listings
- Book learning sessions with teachers
- User profiles with skills and ratings
- Review and rating system
- Responsive design for all devices

### User Roles
- **Students:** Browse listings, book sessions, leave reviews
- **Teachers:** Create listings, manage bookings, build reputation

### Demo Accounts
- Teacher: `kikii@example.com` / `password123`
- Student: `maureen@example.com` / `password123`

## Database Schema

```sql
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
  created_at timestamp
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
Project Requirements Met
Flask Backend 
Uses routes for GET, POST, PUT, DELETE operations

Returns appropriate HTTP status codes

Implements CORS for cross-origin requests

Separates client and server code effectively

SQLAlchemy & Serialization 
6 data models with proper relationships

One-to-many relationships (User-Listings, User-Reviews)

Many-to-many relationship (User-Skills through UserSkill)

SQLAlchemy-Serializer for JSON serialization

Full CRUD operations with session management

Forms & Validation 
Formik forms for all POST/PUT/PATCH routes

Comprehensive input validation

Data type validation (price ranges, skill IDs)

String/number format validation

React Routes 
6 client-side routes with React Router

Navigation bar for route navigation

Fetch API for client-server communication

Protected routes for authenticated users

Installation & Setup
Prerequisites
Node.js 18+

Python 3.9+

Git

Backend Setup
1. Clone the repository
git clone https://github.com/Mkikii/skillswap.git
cd skillswap/server

2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secret keys

5. Initialize database
python seed.py

6. Run the backend server

python app.py


Frontend Setup

1.Navigate to client directory


cd ../client

2.Install dependencies

npm install

3. Set up environment variables

4. Run the development server

npm run dev


Frontend will run on http://localhost:5173

Deployment
Backend Deployment (Railway)
Connect GitHub repository to Railway

Set environment variables in Railway dashboard

Deploy automatically from main branch

Frontend Deployment (Netlify)
Connect GitHub repository to Netlify

Set build command: npm run build

Set publish directory: dist

Set environment variables in Netlify dashboard

API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

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

GET /api/sessions/my-sessions - Get user's sessions

Reviews
POST /api/reviews - Create review

GET /api/reviews - Get all reviews

Users
GET /api/users/:id - Get user profile

GET /api/users/experts - Get expert users

POST /api/users/skills - Add user skill

Project Structure

skillswap/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Flask backend
│   ├── routes/           # API route handlers
│   ├── models.py         # Database models
│   ├── database.py       # Database configuration
│   ├── app.py           # Flask application
│   └── requirements.txt

Development Workflow
Branch Strategy

Dev - Production-ready code

dev - Development branch

Feature branches for new functionality

Code Standards

Follow PEP 8 for Python code

Use ESLint and Prettier for JavaScript

Write meaningful commit messages

Create pull requests for code review

Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Flatiron School for project guidelines and requirements

React and Flask communities for excellent documentation

Railway and Netlify for seamless deployment services

Support
For technical support or questions about the application:

Check terminal output for specific error messages

Verify all prerequisite software is installed

Ensure each setup step completes successfully

SkillSwap - Bridging knowledge gaps through community-driven learning experiences.















