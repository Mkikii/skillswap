from config import app, db
from models import User, Skill, Listing, Session, Review
from datetime import datetime, timedelta

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        skills_data = [
            {"name": "Python Programming", "category": "Programming", "description": "Learn Python from basics to advanced"},
            {"name": "JavaScript", "category": "Programming", "description": "Frontend and backend JavaScript development"},
            {"name": "Guitar Playing", "category": "Music", "description": "Acoustic and electric guitar lessons"},
            {"name": "Photography", "category": "Art", "description": "Digital photography and editing"}
        ]
        
        skills = []
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            skills.append(skill)
            db.session.add(skill)
        
        db.session.commit()
        
        users_data = [
            {
                "username": "alice_dev",
                "email": "alice@example.com",
                "bio": "Full-stack developer with 5 years experience."
            },
            {
                "username": "bob_musician",
                "email": "bob@example.com",
                "bio": "Professional guitarist and music teacher."
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            user.set_password("password123")
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        
        users[0].skills.extend([skills[0], skills[1]])
        users[1].skills.extend([skills[2], skills[3]])
        
        db.session.commit()
        
        listings_data = [
            {
                "title": "Learn Python Programming from Scratch",
                "description": "I'll teach you Python fundamentals, data structures, and basic web development.",
                "price_per_hour": 25.0,
                "user_id": users[0].id,
                "skill_id": skills[0].id
            },
            {
                "title": "Guitar Lessons - Beginner to Intermediate",
                "description": "Learn to play your favorite songs! I cover chords, strumming patterns, and basic music theory.",
                "price_per_hour": 30.0,
                "user_id": users[1].id,
                "skill_id": skills[2].id
            }
        ]
        
        listings = []
        for listing_data in listings_data:
            listing = Listing(**listing_data)
            listings.append(listing)
            db.session.add(listing)
        
        db.session.commit()
        
        sessions_data = [
            {
                "teacher_id": users[0].id,
                "student_id": users[1].id,
                "listing_id": listings[0].id,
                "scheduled_date": datetime.utcnow() + timedelta(days=7),
                "duration": 60,
                "status": "confirmed",
                "notes": "Focus on basic syntax and variables"
            }
        ]
        
        sessions = []
        for session_data in sessions_data:
            session = Session(**session_data)
            sessions.append(session)
            db.session.add(session)
        
        db.session.commit()
        
        reviews_data = [
            {
                "rating": 5,
                "comment": "Excellent lesson! Alice is a great teacher.",
                "reviewer_id": users[1].id,
                "reviewee_id": users[0].id,
                "session_id": sessions[0].id
            }
        ]
        
        for review_data in reviews_data:
            review = Review(**review_data)
            db.session.add(review)
        
        db.session.commit()
        
        print("Database seeded successfully!")

if _name_ == '_main_':
    seed_database()