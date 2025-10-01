Markdown

# SkillSwap: Knowledge Exchange Platform

**SkillSwap** is a full-stack web application that connects people who want to learn new skills with experts willing to teach them. Users can browse skill listings, book sessions, and exchange knowledge in a community-driven platform.

---

## Live Deployment

| Component | URL |
| :--- | :--- |
| **Frontend** | [https://mkikiiskillswap.netlify.app/](https://mkikiiskillswap.netlify.app/) |
| **Backend API** | [https://skillswap-production-0e78.up.railway.app/](https://skillswap-production-0e78.up.railway.app/) |

---

## Features

* **User Authentication**: Secure login and registration with **JWT tokens**.
* **Skill Listings**: Browse and create listings for skills you can teach.
* **Session Booking**: Schedule and manage learning sessions with teachers.
* **Reviews & Ratings**: Leave feedback for completed sessions.
* **User Profiles**: View teacher profiles and their expertise.
* **Skill Management**: Add skills to your profile with proficiency levels.

---

## Tech Stack

### Backend

* **Flask**: Python web framework
* **SQLAlchemy**: ORM for database management
* **Flask-JWT-Extended**: JWT authentication
* **Flask-CORS**: Cross-origin resource sharing
* **PostgreSQL**: Database (with `psycopg2` driver)
* **bcrypt**: Password hashing

### Frontend

* **React**: JavaScript library for building user interfaces
* **React Router**: Client-side routing
* **Axios**: HTTP client for API requests
* **Tailwind CSS**: Utility-first CSS framework
* **Formik**: Form management
* **Yup**: Form validation
* **Vite**: Build tool and development server

---

## Team Contribution

| Team Member | Role | Final Contribution Scope |
| :--- | :--- | :--- |
| **Maureen (Me)** | Auth & Project Structure | Lead Developer (Authentication, Project Structure, Full Backend development, Merging/Gitflow, and Deployment setup) |
| **Andrew** | Frontend | Core Frontend setup and initial features |
| **Odour** | Backend | Initial contribution only |

---

## Installation

### Prerequisites

* **Python 3.8+**
* **Node.js 16+**
* **PostgreSQL** (or SQLite for development)

### Clone the Repository

```bash
git clone <repository-url>
cd skillswap
git checkout dev
Backend Setup
Bash

cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Frontend Setup
Bash

cd ../client
npm install
Configuration
Environment Variables
Create a .env file in the server directory:

Plaintext

DATABASE_URL=postgresql://username:password@localhost/skillswap
JWT_SECRET_KEY=your-secret-key
Database
Run the seed file to populate the database (optional):

Bash

cd server
python seed.py
Usage
Start the Backend
Bash

cd server
python app.py
The API will be available at http://localhost:5555

Start the Frontend
Bash

cd client
npm run dev
The app will be available at http://localhost:5173

API Endpoints
Resource	Method	Endpoint	Description
Authentication	POST	/api/auth/login	User login
POST	/api/auth/register	User registration
Skills	GET	/api/skills	Get all skills
POST	/api/skills	Create a new skill
Listings	GET	/api/listings	Get all skill listings
POST	/api/listings	Create a new listing
GET	/api/listings/<id>	Get listing details
PATCH	/api/listings/<id>	Update listing
DELETE	/api/listings/<id>	Delete listing
Sessions	GET	/api/sessions	Get user sessions
POST	/api/sessions	Book a new session
Reviews	GET	/api/reviews	Get reviews
POST	/api/reviews	Create a review
Users	GET	/api/users/<id>	Get user profile
PUT	/api/users/<id>	Update user profile
Frontend Routes
/: Home page

/auth: Authentication (login/register)

/listings: Browse skill listings

/profile/:userId: User profile page

Database Models
User: User authentication and profiles

Skill: Available skills in the system

Listing: Skill offerings by users

Session: Booked learning sessions

Review: User feedback and ratings

Testing
The project includes various test files: server/test_*.py

Run backend tests with:

Bash

python -m pytest server/
Deployment
Backend
Deployed on Railway with PostgreSQL.

Dockerfile provided for containerized deployment.

Uses Gunicorn for production.

Frontend
Deployed on Netlify.

Build for production: npm run build

Contributing
Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

License
This project is licensed under the MIT License.
