from app import create_app
from database import db
from models import User, Skill, Listing

def seed_database():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        skills_data = [
            {"name": "Python Programming", "category": "Technology"},
            {"name": "JavaScript", "category": "Technology"},
            {"name": "Guitar Playing", "category": "Music"},
            {"name": "Piano", "category": "Music"},
            {"name": "Spanish Language", "category": "Language"},
            {"name": "Web Design", "category": "Design"},
            {"name": "Photography", "category": "Art"},
            {"name": "Cooking", "category": "Lifestyle"},
            {"name": "Yoga", "category": "Fitness"}
        ]
        
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            db.session.add(skill)
        
        users_data = [
            {"username": "alice_dev", "email": "alice@example.com", "bio": "Full-stack developer"},
            {"username": "bob_musician", "email": "bob@example.com", "bio": "Professional guitarist"},
            {"username": "carol_designer", "email": "carol@example.com", "bio": "UI/UX designer"}
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            user.set_password("password123")
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        
        python_skill = Skill.query.filter_by(name="Python Programming").first()
        guitar_skill = Skill.query.filter_by(name="Guitar Playing").first()
        web_skill = Skill.query.filter_by(name="Web Design").first()
        
        listings_data = [
            {
                "title": "Learn Python Programming",
                "description": "Python fundamentals for beginners",
                "price_per_hour": 25.0,
                "user_id": users[0].id,
                "skill_id": python_skill.id
            },
            {
                "title": "Guitar Lessons",
                "description": "Beginner to intermediate guitar",
                "price_per_hour": 30.0,
                "user_id": users[1].id,
                "skill_id": guitar_skill.id
            },
            {
                "title": "Web Design Basics",
                "description": "HTML, CSS and responsive design",
                "price_per_hour": 35.0,
                "user_id": users[2].id,
                "skill_id": web_skill.id
            }
        ]
        
        for listing_data in listings_data:
            listing = Listing(**listing_data)
            db.session.add(listing)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
