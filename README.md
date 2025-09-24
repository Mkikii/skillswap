# SkillSwap - Full-Stack Skill Sharing Platform

A comprehensive web application for skill sharing where users can offer and request skills, book sessions, and leave reviews.

## Team Members
- **Maureen Karimi**: Team Leader, Authentication System
- **Andrew Omori**: Frontend Development  
- **Omor Ochieng**: Backend Development

## Tech Stack
- **Backend**: Flask, SQLAlchemy, Flask-JWT-Extended
- **Frontend**: React, React Router, Formik
- **Database**: SQLite (development), PostgreSQL (production)

## Project Structure
\`\`\`
skillswap-app/
├── server/                 # Flask backend
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   └── seed.py
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── README.md
\`\`\`

## Setup Instructions

### Backend Setup
\`\`\`bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
\`\`\`

### Frontend Setup
\`\`\`bash
cd client
npm install
npm start
\`\`\`

## Git Collaboration Workflow

### Initial Setup (Team Leader)
\`\`\`bash
git init
git add .
git commit -m "Initial project setup"
git remote add origin https://github.com/yourusername/skillswap-app.git
git push -u origin main
\`\`\`

### Feature Branch Workflow
\`\`\`bash
# Create feature branches
git checkout -b feature/authentication  # Maureen
git checkout -b feature/frontend        # Andrew
git checkout -b feature/backend         # Omor

# Daily workflow
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
# Make changes
git add .
git commit -m "Descriptive message"
git push origin your-feature-branch
# Create pull request on GitHub
\`\`\`

## Database Schema
- **User**: User accounts with bio
- **Skill**: Skill categories and descriptions
- **Listing**: Skill offerings with pricing
- **Session**: Booked skill exchange sessions
- **Review**: Rating system for completed sessions

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/skills/*` - Skill management
- `/api/listings/*` - Listing CRUD operations
- `/api/sessions/*` - Session booking
- `/api/reviews/*` - Review system

## Features
- User registration and authentication
- Skill listing creation and browsing
- Session booking system
- Review and rating system
- User profiles with bio
- Skill categorization
