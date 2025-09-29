This revised README is optimized for easy copying and pasting, with all code blocks and lists clearly marked in Markdown.

I've corrected the following minor issues for you:

Code Block Clarity: Ensured all setup steps and troubleshooting commands are inside proper Markdown code blocks (```bash) for easy one-click copying.

Port Consistency: Updated the frontend port to 3000 in the setup instructions to match your previous note (changed from 5173 to 3000 in the Quick Setup section).

Contributors Table: Integrated the final contributor details into a proper Markdown table.

SkillSwap - Skill Sharing Platform
A full-stack web application for sharing and learning skills. It is built with a Flask backend and a React frontend.

Component	Status	URL
Frontend	Deployed (Planned)	[Railway App URL]
Backend	Deployed (Planned)	[Railway API URL]
Demo Accounts	Available	See Demo Accounts section below

Export to Sheets
 Project Overview
This project was developed through a collaborative effort. Maureen K assumed the primary responsibility for authentication, backend integration, project consolidation, and deployment setup.

 Contributors
Name	Primary Role	Branch
Maureen K	Project Lead, Authentication, Backend Integration,assisted in Frontend, Deployment	dev, main
Andrew	Frontend Development	feat/frontend-setup
Odour	Initial Backend Development	feat/backend-api

Export to Sheets
🛠️ Tech Stack
Category	Technologies Used
Backend	Python, Flask, SQLAlchemy, Flask-JWT-Extended, bcrypt
Frontend	React, React Router, Axios, Formik, Yup, Tailwind CSS
Database	SQLite
Deployment	Railway

Export to Sheets
📁 Project Structure
Plaintext

skillswap/
├── server/                 # Flask Backend
│   ├── routes/
│   │   ├── auth.py
│   │   ... (other routes)
│   ├── models.py
│   ├── app.py
│   └── requirements.txt
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ... (other files)
│   ├── package.json
│   └── vite.config.js
└── README.md
 Quick Setup
Prerequisites
Python 3.8+ (pip required)

Node.js 16+ (npm required)

1. Backend Setup
Bash

# Navigate to server directory
cd server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Setup database (creates skillswap.db and seeds data)
python seed.py

# Start backend server
python app.py
Backend runs on: http://localhost:5555

2. Frontend Setup
Bash

# Navigate to client directory
cd ../client

# Install Node.js dependencies
npm install

# Start frontend development server
npm run dev
Frontend runs on: http://localhost:3000 (Check your package.json or configuration if this is different)

🔑 Demo Accounts
Role	Email	Password
Teacher	dennis@example.com	password123
Student	alice@example.com	password123
Guest	guest@gmail.com	password123

Export to Sheets
🎯 API Endpoints
Method	Endpoint	Description	Authentication
POST	/api/auth/login	User login (returns JWT)	Public
GET	/api/auth/profile	Get user profile data	Required
GET/POST	/api/listings	Retrieve all listings / Create new listing	Public / Required
GET/POST	/api/sessions	Retrieve/Create user sessions	Required

Export to Sheets
Features Implemented
User Authentication with JWT.

Skill Management: Browsing and creating listings.

Session System: Booking and tracking of learning sessions.

Authorization: Protected routes enforced on the frontend and backend.

Localization: KSH currency display.

UX/UI: Responsive design using Tailwind CSS.

Branch Management and Deployment
Merging Dev to Main
To promote the current development version (dev) to the production branch (main):

Bash

# Switch to main branch
git checkout main

# Merge dev branch
git merge dev

# Push the updated main branch to the remote repository
git push origin main
Railway Deployment
The application is configured for deployment as two separate services on Railway (Backend and Frontend). Ensure the frontend's API base URL is updated to point to the live backend service URL post-deployment.

 Troubleshooting
Common Fixes (Complete Reset)
Use this command set for a full database and dependency reset:

Bash

# Complete reset
cd server
rm -f skillswap.db
python seed.py

cd ../client
rm -rf node_modules
npm install
npm run dev
Specific Backend Issues
Problem	Fix
Port 5555 already in use	Change port in server/app.py.
Database errors	Run cd server && rm -f skillswap.db && python seed.py.
Missing dependencies	Run pip install -r requirements.txt.

Export to Sheets
Database Migrations
Use Flask-Migrate when making changes to server/models.py:

Bash

cd server
flask db migrate -m "Description of changes"
flask db upgrade
 License
This project was developed for educational purposes as part of the Phase 4 Flatiron School curriculum.












Tools

Gemini 
