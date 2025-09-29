from app import create_app
from database import db
from models import User, Skill, Listing

def setup_database():
    app = create_app()
    
    with app.app_context():
        print("Dropping existing tables...")
        db.drop_all()
        
        print("Creating database tables...")
        db.create_all()
        print("✓ Tables created successfully!")
        
        skills_data = [
            {"name": "Python Programming", "category": "Technology"},
            {"name": "Guitar Playing", "category": "Music"},
            {"name": "Web Design", "category": "Design"},
            {"name": "Spanish Language", "category": "Language"},
            {"name": "Photography", "category": "Art"},
            {"name": "Yoga", "category": "Fitness"}
        ]
        
        print("Adding skills...")
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            db.session.add(skill)
        
        print("Adding demo user...")
        demo_user = User(
            username="demo_teacher",
            email="teacher@demo.com",
            bio="Demo teacher account"
        )
        demo_user.set_password("demo123")
        db.session.add(demo_user)
        
        db.session.commit()
        print("✓ Database setup complete!")
        print("Demo account: teacher@demo.com / demo123")

if __name__ == '__main__':
    setup_database()
