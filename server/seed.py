#!/usr/bin/env python3

import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import db
from models import User, Skill, Listing, UserSkill, Session, Review

def setup_database():
    app = create_app()
    
    with app.app_context():
        try:
            if os.path.exists("skillswap.db"):
                os.remove("skillswap.db")
            
            db.create_all()
            
            skills_data = [
                {"name": "Python Programming", "category": "Technology"},
                {"name": "JavaScript", "category": "Technology"},
                {"name": "Web Development", "category": "Technology"},
                {"name": "Graphic Design", "category": "Design"},
                {"name": "UI/UX Design", "category": "Design"},
                {"name": "Cooking", "category": "Culinary"},
                {"name": "Baking", "category": "Culinary"},
                {"name": "Photography", "category": "Arts"},
                {"name": "Digital Art", "category": "Arts"},
                {"name": "Yoga", "category": "Fitness"},
                {"name": "Meditation", "category": "Fitness"},
                {"name": "Public Speaking", "category": "Communication"},
                {"name": "Spanish Language", "category": "Language"},
                {"name": "French Language", "category": "Language"},
                {"name": "Financial Planning", "category": "Business"},
                {"name": "Gardening", "category": "Lifestyle"},
                {"name": "Home Organization", "category": "Lifestyle"}
            ]
            
            for skill_data in skills_data:
                skill = Skill(**skill_data)
                db.session.add(skill)
            
            db.session.commit()
            
            users_data = [
                {
                    "username": "dennis_teacher", 
                    "email": "dennis@example.com", 
                    "password": "password123",
                    "bio": "Software Engineering lecturer and full-stack developer with expertise in modern web technologies."
                },
                {
                    "username": "alice_dev", 
                    "email": "alice@example.com", 
                    "password": "password123",
                    "bio": "Full-stack developer passionate about teaching Python and web development."
                },
                {
                    "username": "bob_design", 
                    "email": "bob@example.com", 
                    "password": "password123",
                    "bio": "Graphic designer with 5 years of experience in UI/UX design."
                },
                {
                    "username": "carol_chef", 
                    "email": "carol@example.com", 
                    "password": "password123",
                    "bio": "Professional chef specializing in Italian and French cuisine."
                },
                {
                    "username": "dave_photo", 
                    "email": "dave@example.com", 
                    "password": "password123",
                    "bio": "Award-winning photographer with expertise in portrait and landscape photography."
                },
                {
                    "username": "eve_yoga", 
                    "email": "eve@example.com", 
                    "password": "password123",
                    "bio": "Certified yoga instructor focusing on mindfulness and meditation."
                },
                {
                    "username": "frank_finance", 
                    "email": "frank@example.com", 
                    "password": "password123",
                    "bio": "Financial advisor helping people with investment strategies and retirement planning."
                }
            ]
            
            users = []
            for user_data in users_data:
                user = User(
                    username=user_data["username"],
                    email=user_data["email"],
                    bio=user_data["bio"]
                )
                user.set_password(user_data["password"])
                db.session.add(user)
                users.append(user)
            
            db.session.commit()
            
            user_skills_data = [
                {"user_id": 1, "skill_id": 1, "proficiency_level": "expert"},
                {"user_id": 1, "skill_id": 2, "proficiency_level": "expert"},
                {"user_id": 1, "skill_id": 3, "proficiency_level": "expert"},
                {"user_id": 2, "skill_id": 1, "proficiency_level": "expert"},
                {"user_id": 2, "skill_id": 2, "proficiency_level": "advanced"},
                {"user_id": 2, "skill_id": 3, "proficiency_level": "expert"},
                {"user_id": 3, "skill_id": 4, "proficiency_level": "expert"},
                {"user_id": 3, "skill_id": 5, "proficiency_level": "advanced"},
                {"user_id": 4, "skill_id": 6, "proficiency_level": "expert"},
                {"user_id": 4, "skill_id": 7, "proficiency_level": "advanced"},
                {"user_id": 5, "skill_id": 8, "proficiency_level": "expert"},
                {"user_id": 5, "skill_id": 9, "proficiency_level": "intermediate"},
                {"user_id": 6, "skill_id": 10, "proficiency_level": "expert"},
                {"user_id": 6, "skill_id": 11, "proficiency_level": "advanced"},
                {"user_id": 7, "skill_id": 15, "proficiency_level": "expert"},
            ]
            
            for us_data in user_skills_data:
                user_skill = UserSkill(**us_data)
                db.session.add(user_skill)
            
            db.session.commit()
            
            listings_data = [
                {
                    "title": "Advanced Python & Flask Development",
                    "description": "Master Python programming with Flask framework. Learn REST APIs, database integration, and deployment strategies for full-stack applications.",
                    "price_per_hour": 45.00,
                    "user_id": 1,
                    "skill_id": 1
                },
                {
                    "title": "Modern JavaScript & React Development",
                    "description": "Comprehensive JavaScript and React course covering ES6+, hooks, state management, and modern frontend development practices.",
                    "price_per_hour": 40.00,
                    "user_id": 1,
                    "skill_id": 2
                },
                {
                    "title": "Full-Stack Web Development Bootcamp",
                    "description": "End-to-end web development course covering frontend, backend, databases, and deployment. Perfect for aspiring full-stack developers.",
                    "price_per_hour": 50.00,
                    "user_id": 1,
                    "skill_id": 3
                },
                {
                    "title": "Learn Python Programming from Scratch",
                    "description": "Comprehensive Python course covering basics to advanced topics. Perfect for beginners!",
                    "price_per_hour": 30.00,
                    "user_id": 2,
                    "skill_id": 1
                },
                {
                    "title": "Web Development Bootcamp",
                    "description": "Learn full-stack web development with modern technologies and best practices.",
                    "price_per_hour": 35.00,
                    "user_id": 2,
                    "skill_id": 3
                },
                {
                    "title": "Graphic Design Fundamentals",
                    "description": "Master the principles of graphic design and create stunning visual content.",
                    "price_per_hour": 40.00,
                    "user_id": 3,
                    "skill_id": 4
                },
                {
                    "title": "Italian Cooking Masterclass",
                    "description": "Learn authentic Italian recipes and cooking techniques from a professional chef.",
                    "price_per_hour": 50.00,
                    "user_id": 4,
                    "skill_id": 6
                },
                {
                    "title": "Portrait Photography Workshop",
                    "description": "Learn lighting, composition, and editing techniques for professional portraits.",
                    "price_per_hour": 45.00,
                    "user_id": 5,
                    "skill_id": 8
                },
                {
                    "title": "Yoga for Beginners",
                    "description": "Gentle yoga sessions focusing on flexibility, strength, and mindfulness.",
                    "price_per_hour": 25.00,
                    "user_id": 6,
                    "skill_id": 10
                },
                {
                    "title": "Financial Planning 101",
                    "description": "Learn how to manage your finances, invest wisely, and plan for retirement.",
                    "price_per_hour": 60.00,
                    "user_id": 7,
                    "skill_id": 15
                }
            ]
            
            for listing_data in listings_data:
                listing = Listing(**listing_data)
                db.session.add(listing)
            
            db.session.commit()
            
            sessions_data = [
                {
                    "student_id": 2,
                    "teacher_id": 1,
                    "listing_id": 1,
                    "scheduled_date": datetime.utcnow() + timedelta(days=3),
                    "duration_hours": 2.0,
                    "status": "scheduled",
                    "notes": "Looking forward to learning advanced Flask development!"
                },
                {
                    "student_id": 3,
                    "teacher_id": 1,
                    "listing_id": 2,
                    "scheduled_date": datetime.utcnow() + timedelta(days=5),
                    "duration_hours": 1.5,
                    "status": "scheduled",
                    "notes": "Excited to improve my JavaScript skills"
                },
                {
                    "student_id": 4,
                    "teacher_id": 5,
                    "listing_id": 8,
                    "scheduled_date": datetime.utcnow() + timedelta(days=7),
                    "duration_hours": 1.0,
                    "status": "scheduled",
                    "notes": "Want to improve my food photography skills"
                }
            ]
            
            for session_data in sessions_data:
                session = Session(**session_data)
                db.session.add(session)
            
            db.session.commit()
            
            reviews_data = [
                {
                    "session_id": 1,
                    "reviewer_id": 2,
                    "reviewee_id": 1,
                    "rating": 5,
                    "comment": "Dennis is an exceptional teacher! His explanations are clear and he provides great real-world examples."
                },
                {
                    "session_id": 2, 
                    "reviewer_id": 3,
                    "reviewee_id": 1,
                    "rating": 5,
                    "comment": "Excellent JavaScript course. Dennis's teaching style makes complex concepts easy to understand."
                },
                {
                    "session_id": 3,
                    "reviewer_id": 4,
                    "reviewee_id": 5,
                    "rating": 4,
                    "comment": "Great photography tips, learned a lot about lighting and composition."
                }
            ]
            
            for review_data in reviews_data:
                review = Review(**review_data)
                db.session.add(review)
            
            db.session.commit()
            
            user_count = User.query.count()
            skill_count = Skill.query.count()
            listing_count = Listing.query.count()
            session_count = Session.query.count()
            review_count = Review.query.count()
            
            print("DATABASE SETUP COMPLETED")
            print(f"Users: {user_count}")
            print(f"Skills: {skill_count}")
            print(f"Listings: {listing_count}")
            print(f"Sessions: {session_count}")
            print(f"Reviews: {review_count}")
            print("DEMO ACCOUNT FOR DENNIS:")
            print("Email: dennis@example.com")
            print("Password: password123")
            print("OTHER DEMO ACCOUNT:")
            print("Email: alice@example.com")
            print("Password: password123")
            
            return True
            
        except Exception as e:
            print(f"Error during database setup: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == "__main__":
    success = setup_database()
    if not success:
        sys.exit(1)
