SkillSwap - Skill Sharing Platform
A full-stack web application for sharing and learning skills. Built with Flask backend and React frontend.

Live Deployment
Frontend: [Railway App URL]

Backend: [Railway API URL]

Demo Accounts: Available below

Tech Stack
Backend: Python, Flask, SQLAlchemy, JWT, bcrypt
Frontend: React, React Router, Axios, Formik, Yup, Tailwind CSS
Database: SQLite
Deployment: Railway

Project Structure
text
skillswap/
├── server/                 # Flask Backend
│   ├── routes/
│   │   ├── auth.py
│   │   ├── skills.py
│   │   ├── listings.py
│   │   ├── sessions.py
│   │   ├── reviews.py
│   │   ├── users_routes.py
│   │   └── __init__.py
│   ├── models.py
│   ├── database.py
│   ├── config.py
│   ├── app.py
│   ├── seed.py
│   └── requirements.txt
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── SkillsListings.jsx
│   │   │   ├── Sessions.jsx
│   │   │   └── CreateListing.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── skills-data.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
Quick Setup
Prerequisites
Python 3.8+

Node.js 16+

pip package manager

npm package manager

1. Backend Setup
bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Alternative: Install dependencies individually
pip install Flask==3.0.3 Flask-SQLAlchemy==3.1.1 Flask-JWT-Extended==4.6.0 Flask-CORS==5.0.0 Flask-Migrate==4.1.0 python-dotenv==1.0.0 sqlalchemy-serializer==1.4.12 bcrypt==4.3.0

# Setup database
python seed.py

# Start backend server
python app.py
Backend runs on: http://localhost:5555

2. Frontend Setup
bash
# Navigate to client directory
cd client

# Install Node.js dependencies
npm install

# Install Tailwind CSS and dependencies
npm install -D tailwindcss postcss autoprefixer

# Start frontend development server
npm run dev
Frontend runs on: http://localhost:5173

Database Models
User: Users with authentication and profiles

Skill: Available skills and categories

UserSkill: Many-to-many relationship between users and skills with proficiency levels

Listing: Skill listings with pricing in KSH

Session: Booking sessions between users

Review: User ratings and feedback system

Demo Accounts
Teacher: dennis@example.com / password123

Student: alice@example.com / password123

Guest: guest@gmail.com / password123

API Endpoints
Method	Endpoint	Description	Authentication
POST	/api/auth/login	User login	Public
POST	/api/auth/register	User registration	Public
GET	/api/auth/profile	Get user profile	Required
GET	/api/skills	Get all skills	Public
GET	/api/listings	Get all listings	Public
POST	/api/listings	Create new listing	Required
GET	/api/sessions	Get user sessions	Required
POST	/api/sessions	Create new session	Required
GET	/api/reviews	Get all reviews	Public
POST	/api/reviews	Create new review	Required
Features
User authentication with JWT

Skill browsing with categories and filtering

Listing creation and management

Session booking system

Review and rating system

User profiles with skills management

Protected routes and authorization

Responsive design with Tailwind CSS

KSH currency display for Kenyan market

Form validation with Formik and Yup

Frontend Components
HomePage: Landing page with application overview

Auth: Login and registration forms with demo account auto-fill

SkillsListings: Browse available skills with search and filtering

Sessions: View and manage booked sessions

CreateListing: Create and edit skill listings

Navbar: Navigation with authentication state

Footer: Application information and links

ProtectedRoute: Route protection for authenticated users

Database Schema
The application uses 6 main models with the following relationships:

One-to-Many: User -> Listings, User -> Reviews

Many-to-Many: User <-> Skills (through UserSkill with proficiency_level attribute)

One-to-Many: Skill -> Listings

One-to-Many: Session -> Reviews

Deployment
Railway Deployment
The application is configured for deployment on Railway:

Backend Deployment:

Connect GitHub repository to Railway

Set root directory to server

Add environment variables as needed

Frontend Deployment:

Create separate Railway service

Set root directory to client

Update API_BASE_URL in services/api.js to point to backend service URL

Environment Variables
Backend environment variables (in Config class):

SQLALCHEMY_DATABASE_URI

SECRET_KEY

JWT_SECRET_KEY

Testing the Application
Start both backend and frontend servers

Navigate to http://localhost:5173

Use demo accounts for testing:

Browse skills without logging in

Login with demo credentials

Create listings and book sessions

Leave reviews and ratings

Troubleshooting
Common Backend Issues
bash
# Port already in use
# Change port in server/app.py

# Database errors
cd server
rm -f skillswap.db
python seed.py

# Missing dependencies
pip install -r requirements.txt
Common Frontend Issues
bash
# White screen in browser
# Check browser console for JavaScript errors

# API connection failed
# Verify backend is running on correct port

# Build errors
cd client
rm -rf node_modules
npm install
npm run dev

# Tailwind CSS not working
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Reset and Reinstall
bash
# Complete reset
cd server
rm -f skillswap.db
python seed.py

cd ../client
rm -rf node_modules
npm install
npm run dev
Development
Adding New Features
Update backend models in server/models.py if needed

Create new API routes in server/routes/

Update frontend components in client/src/

Test both backend and frontend functionality

Database Migrations
bash
cd server
flask db migrate -m "Description of changes"
flask db upgrade
License
This project was developed for educational purposes as part of the Phase 4 Flatiron School curriculum.

 Contributors
Name	Primary Role	Branch
 maureen K	Project Lead, Authentication, Backend Integration	dev, main, Deployment
Andrew	Frontend Development	feat/frontend-setup
Odour	Initial Backend Development	feat/backend-api

Support
For issues with setup or deployment, check the troubleshooting section above or review the browser console for specific error messages.

