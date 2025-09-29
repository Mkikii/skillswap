# seed.py - Minimal working version
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import os

# Create a simple Flask app just for seeding
app = Flask(__name__)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "skillswap.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'temp-secret-for-seeding'

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Import models AFTER initializing db and bcrypt
from models import User, Skill, Listing, UserSkill, Session, Review, bcrypt as models_bcrypt

# Make sure the models use the same bcrypt instance
models_bcrypt.init_app(app)

def seed_database():
    print("🔥 Starting SkillSwap database setup...")
    
    with app.app_context():
        try:
            print("📤 Dropping existing tables...")
            db.drop_all()
            
            print("📦 Creating database tables...")
            db.create_all()
            
            # Verify tables were created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Created tables: {', '.join(tables)}")
            
            if 'skills' not in tables:
                print("❌ Skills table was not created! Check your models.py file.")
                return
            
            # Seed skills data
            skills_data = [
                {"name": "Python Programming", "category": "Technology", "description": "Learn Python programming from basics to advanced concepts"},
                {"name": "Guitar Playing", "category": "Music", "description": "Acoustic and electric guitar lessons for all skill levels"},
                {"name": "Web Design", "category": "Design", "description": "Modern web design using HTML, CSS, and JavaScript"},
                {"name": "Spanish Language", "category": "Language", "description": "Conversational Spanish for beginners and intermediate learners"},
                {"name": "Photography", "category": "Art", "description": "Digital photography techniques and composition"},
                {"name": "Yoga", "category": "Fitness", "description": "Hatha and Vinyasa yoga for flexibility and mindfulness"}
            ]
            
            print("🎯 Adding skills...")
            for skill_data in skills_data:
                skill = Skill(**skill_data)
                db.session.add(skill)
            
            # Create demo users
            print("👥 Creating demo users...")
            
            # Demo teacher
            demo_teacher = User(
                username="demo_teacher",
                email="teacher@demo.com",
                bio="Experienced educator with expertise in technology and music."
            )
            demo_teacher.set_password("demo123")
            db.session.add(demo_teacher)
            
            # Demo student
            demo_student = User(
                username="demo_student",
                email="student@demo.com", 
                bio="Eager to learn new skills and connect with great teachers."
            )
            demo_student.set_password("demo123")
            db.session.add(demo_student)
            
            # Commit users and skills first
            db.session.commit()
            print("✅ Users and skills added successfully")
            
            # Get created records for relationships
            teacher = User.query.filter_by(username="demo_teacher").first()
            student = User.query.filter_by(username="demo_student").first()
            python_skill = Skill.query.filter_by(name="Python Programming").first()
            guitar_skill = Skill.query.filter_by(name="Guitar Playing").first()
            
            # Add user skills
            if teacher and python_skill:
                user_skill = UserSkill(
                    user_id=teacher.id,
                    skill_id=python_skill.id,
                    proficiency_level="Expert",
                    years_experience=5
                )
                db.session.add(user_skill)
            
            # Add sample listings
            if teacher and python_skill:
                listing = Listing(
                    title="Learn Python Programming - Beginner to Advanced",
                    description="Comprehensive Python course with hands-on projects.",
                    price_per_hour=25.0,
                    user_id=teacher.id,
                    skill_id=python_skill.id
                )
                db.session.add(listing)
            
            if teacher and guitar_skill:
                listing = Listing(
                    title="Guitar Lessons - All Levels Welcome",
                    description="Learn your favorite songs and proper technique.",
                    price_per_hour=20.0,
                    user_id=teacher.id,
                    skill_id=guitar_skill.id
                )
                db.session.add(listing)
            
            # Final commit
            db.session.commit()
            
            # Print summary
            total_skills = Skill.query.count()
            total_users = User.query.count()
            total_listings = Listing.query.count()
            
            print("\n🎉 Database setup complete!")
            print(f"📊 Created: {total_skills} skills, {total_users} users, {total_listings} listings")
            print("\n🔐 Demo accounts:")
            print("   Teacher: teacher@demo.com / demo123")
            print("   Student: student@demo.com / demo123")
            print("\n🚀 Ready to test your API!")
            
        except Exception as e:
            print(f"❌ Error during database setup: {str(e)}")
            print("Make sure your models.py file is correct and contains all model classes")
            db.session.rollback()
            raise e

if __name__ == '__main__':
    seed_database()