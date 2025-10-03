#!/usr/bin/env python3

import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import db
from models import User, Skill, Listing, UserSkill, Session, Review

def setup_database():
    with app.app_context():
        try:
            db.drop_all()
            db.create_all()
            print("✅ Database tables created successfully")
            
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
            print("✅ Skills created successfully")
            
            teachers_data = [
                {
                    "username": "Kikii", 
                    "email": "kikii@example.com", 
                    "password": "password123",
                    "bio": "Software Engineering lecturer and full-stack developer with expertise in modern web technologies."
                },
                {
                    "username": "Vanessa", 
                    "email": "vanessa@example.com", 
                    "password": "password123",
                    "bio": "Full-stack developer passionate about teaching Python and web development."
                },
                {
                    "username": "Dominique", 
                    "email": "dominique@example.com", 
                    "password": "password123",
                    "bio": "Graphic designer with 5 years of experience in UI/UX design."
                },
                {
                    "username": "Koech", 
                    "email": "koech@example.com", 
                    "password": "password123",
                    "bio": "Professional chef specializing in African and international cuisine."
                },
                {
                    "username": "Samini", 
                    "email": "samini@example.com", 
                    "password": "password123",
                    "bio": "Photography expert with expertise in digital art and creative design."
                },
                {
                    "username": "Ndungu", 
                    "email": "ndungu@example.com", 
                    "password": "password123",
                    "bio": "Yoga and meditation instructor focused on wellness and mindfulness."
                },
                {
                    "username": "Wangari", 
                    "email": "wangari@example.com", 
                    "password": "password123",
                    "bio": "Financial planning expert and business consultant."
                }
            ]
            
            students_data = [
                {
                    "username": "maureen", 
                    "email": "maureen@example.com", 
                    "password": "password123",
                    "bio": "Student learning web development and programming."
                },
                {
                    "username": "Najma", 
                    "email": "najma@example.com", 
                    "password": "password123",
                    "bio": "Student interested in design and creative arts."
                },
                {
                    "username": "Tim", 
                    "email": "tim@example.com", 
                    "password": "password123",
                    "bio": "Student exploring culinary arts and cooking."
                },
                {
                    "username": "Tecra", 
                    "email": "tecra@example.com", 
                    "password": "password123",
                    "bio": "Student passionate about photography and digital arts."
                },
                {
                    "username": "Njeri", 
                    "email": "njeri@example.com", 
                    "password": "password123",
                    "bio": "Student focusing on fitness and wellness studies."
                },
                {
                    "username": "Mkikii", 
                    "email": "mkikii@example.com", 
                    "password": "password123",
                    "bio": "Student learning business and financial skills."
                }
            ]
            
            users_data = teachers_data + students_data
            
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
            print("✅ Users created successfully")
            
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
                {"user_id": 5, "skill_id": 9, "proficiency_level": "advanced"},
                {"user_id": 6, "skill_id": 10, "proficiency_level": "expert"},
                {"user_id": 6, "skill_id": 11, "proficiency_level": "advanced"},
                {"user_id": 7, "skill_id": 15, "proficiency_level": "expert"},
                {"user_id": 8, "skill_id": 1, "proficiency_level": "beginner"},
                {"user_id": 8, "skill_id": 2, "proficiency_level": "beginner"},
                {"user_id": 9, "skill_id": 4, "proficiency_level": "intermediate"},
                {"user_id": 9, "skill_id": 5, "proficiency_level": "beginner"},
                {"user_id": 10, "skill_id": 6, "proficiency_level": "intermediate"},
                {"user_id": 10, "skill_id": 7, "proficiency_level": "beginner"},
                {"user_id": 11, "skill_id": 8, "proficiency_level": "intermediate"},
                {"user_id": 11, "skill_id": 9, "proficiency_level": "beginner"},
                {"user_id": 12, "skill_id": 10, "proficiency_level": "intermediate"},
                {"user_id": 12, "skill_id": 11, "proficiency_level": "beginner"},
                {"user_id": 13, "skill_id": 15, "proficiency_level": "beginner"},
            ]
            
            for us_data in user_skills_data:
                user_skill = UserSkill(**us_data)
                db.session.add(user_skill)
            
            db.session.commit()
            print("✅ User skills created successfully")
            
            listings_data = [
                {
                    "title": "Advanced Python & Flask Development",
                    "description": "Master Python programming with Flask framework. Learn REST APIs, database integration, and deployment strategies for full-stack applications.",
                    "price_per_hour": 450,
                    "user_id": 1,
                    "skill_id": 1
                },
                {
                    "title": "Modern JavaScript & React Development",
                    "description": "Comprehensive JavaScript and React course covering ES6+, hooks, state management, and modern frontend development practices.",
                    "price_per_hour": 400,
                    "user_id": 1,
                    "skill_id": 2
                },
                {
                    "title": "Full-Stack Web Development Bootcamp",
                    "description": "End-to-end web development course covering frontend, backend, databases, and deployment. Perfect for aspiring full-stack developers.",
                    "price_per_hour": 500,
                    "user_id": 1,
                    "skill_id": 3
                },
                {
                    "title": "Learn Python Programming from Scratch",
                    "description": "Comprehensive Python course covering basics to advanced topics. Perfect for beginners!",
                    "price_per_hour": 350,
                    "user_id": 2,
                    "skill_id": 1
                },
                {
                    "title": "Web Development Bootcamp",
                    "description": "Learn full-stack web development with modern technologies and best practices.",
                    "price_per_hour": 400,
                    "user_id": 2,
                    "skill_id": 3
                },
                {
                    "title": "Graphic Design Fundamentals",
                    "description": "Master the principles of graphic design and create stunning visual content.",
                    "price_per_hour": 300,
                    "user_id": 3,
                    "skill_id": 4
                },
                {
                    "title": "UI/UX Design Masterclass",
                    "description": "Learn user interface and user experience design principles for modern applications.",
                    "price_per_hour": 350,
                    "user_id": 3,
                    "skill_id": 5
                },
                {
                    "title": "African Cooking Masterclass",
                    "description": "Learn authentic African recipes and cooking techniques from a professional chef.",
                    "price_per_hour": 450,
                    "user_id": 4,
                    "skill_id": 6
                },
                {
                    "title": "Artisan Baking Workshop",
                    "description": "Master the art of baking with traditional techniques and modern recipes.",
                    "price_per_hour": 400,
                    "user_id": 4,
                    "skill_id": 7
                },
                {
                    "title": "Digital Photography Course",
                    "description": "Learn professional photography techniques and digital editing skills.",
                    "price_per_hour": 380,
                    "user_id": 5,
                    "skill_id": 8
                },
                {
                    "title": "Yoga & Meditation for Beginners",
                    "description": "Start your wellness journey with guided yoga and meditation sessions.",
                    "price_per_hour": 250,
                    "user_id": 6,
                    "skill_id": 10
                },
                {
                    "title": "Financial Planning Basics",
                    "description": "Learn essential financial planning skills for personal and business success.",
                    "price_per_hour": 420,
                    "user_id": 7,
                    "skill_id": 15
                }
            ]
            
            for listing_data in listings_data:
                listing = Listing(**listing_data)
                db.session.add(listing)
            
            db.session.commit()
            print("✅ Listings created successfully")
            
            sessions_data = [
                {
                    "student_id": 8,
                    "teacher_id": 1,
                    "listing_id": 1,
                    "scheduled_date": datetime.utcnow() + timedelta(days=3),
                    "duration_hours": 2.0,
                    "status": "scheduled",
                    "notes": "Looking forward to learning advanced Flask development!"
                },
                {
                    "student_id": 9,
                    "teacher_id": 1,
                    "listing_id": 2,
                    "scheduled_date": datetime.utcnow() + timedelta(days=5),
                    "duration_hours": 1.5,
                    "status": "scheduled",
                    "notes": "Excited to improve my JavaScript skills"
                },
                {
                    "student_id": 10,
                    "teacher_id": 4,
                    "listing_id": 8,
                    "scheduled_date": datetime.utcnow() + timedelta(days=7),
                    "duration_hours": 1.0,
                    "status": "scheduled",
                    "notes": "Want to improve my cooking skills"
                }
            ]
            
            for session_data in sessions_data:
                session = Session(**session_data)
                db.session.add(session)
            
            db.session.commit()
            print("✅ Sessions created successfully")
            
            reviews_data = [
                {
                    "session_id": 1,
                    "reviewer_id": 8,
                    "reviewee_id": 1,
                    "rating": 5,
                    "comment": "Kikii is an exceptional teacher! Her explanations are clear and she provides great real-world examples."
                },
                {
                    "session_id": 2, 
                    "reviewer_id": 9,
                    "reviewee_id": 1,
                    "rating": 5,
                    "comment": "Excellent JavaScript course. Kikii's teaching style makes complex concepts easy to understand."
                },
                {
                    "session_id": 3,
                    "reviewer_id": 10,
                    "reviewee_id": 4,
                    "rating": 4,
                    "comment": "Great cooking tips, learned a lot about African cuisine and techniques from Koech."
                }
            ]
            
            for review_data in reviews_data:
                review = Review(**review_data)
                db.session.add(review)
            
            db.session.commit()
            print("✅ Reviews created successfully")
            
            user_count = User.query.count()
            skill_count = Skill.query.count()
            listing_count = Listing.query.count()
            session_count = Session.query.count()
            review_count = Review.query.count()
            
            print("\n🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
            print("=" * 50)
            print(f"📊 Users: {user_count}")
            print(f"📊 Skills: {skill_count}")
            print(f"📊 Listings: {listing_count}")
            print(f"📊 Sessions: {session_count}")
            print(f"📊 Reviews: {review_count}")
            print("=" * 50)
            print("\n🔑 DEMO ACCOUNTS:")
            print("👨‍🏫 Teacher: kikii@example.com / password123")
            print("👩‍🎓 Student: maureen@example.com / password123")
            print("=" * 50)
            print("\n🚀 Backend is ready!")
            
            return True
            
        except Exception as e:
            print(f"❌ Error during database setup: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == "__main__":
    success = setup_database()
    if not success:
        sys.exit(1)