from app import create_app
from models import db, User, Skill, Listing, Session, Review
from datetime import datetime, timedelta

def seed_database():
    app = create_app()
    with app.app_context():

    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Create sample skills
    skills_data = [
        {"name": "Python Programming", "category": "Programming", "description": "Learn Python from basics to advanced"},
        {"name": "Guitar Playing", "category": "Music", "description": "Acoustic and electric guitar lessons"},
        {"name": "Spanish Language", "category": "Language", "description": "Conversational Spanish for beginners"},
        {"name": "Web Design", "category": "Design", "description": "HTML, CSS, and responsive design"},
        {"name": "Photography", "category": "Art", "description": "Digital photography and editing"},
        {"name": "Cooking", "category": "Lifestyle", "description": "Basic cooking techniques and recipes"},
        {"name": "Yoga", "category": "Fitness", "description": "Beginner to intermediate yoga poses"},
        {"name": "Data Analysis", "category": "Programming", "description": "Excel, SQL, and basic statistics"}
    ]
    
    skills = []
    for skill_data in skills_data:
        skill = Skill(**skill_data)
        skills.append(skill)
        db.session.add(skill)
    
    # Create sample users
    users_data = [
        {
            "username": "alice_dev",
            "email": "alice@example.com",
            "bio": "Full-stack developer with 5 years experience. Love teaching Python and web development."
        },
        {
            "username": "bob_musician",
            "email": "bob@example.com", 
            "bio": "Professional guitarist and music teacher. Been playing for 15 years."
        },
        {
            "username": "carol_designer",
            "email": "carol@example.com",
            "bio": "UI/UX designer passionate about creating beautiful, user-friendly interfaces."
        },
        {
            "username": "david_chef",
            "email": "david@example.com",
            "bio": "Professional chef specializing in Mediterranean cuisine. Love sharing cooking tips!"
        }
    ]
    
    users = []
    for user_data in users_data:
        user = User(**user_data)
        user.set_password("password123")  # Default password for demo
        users.append(user)
        db.session.add(user)
    
    db.session.commit()
    
    # Create sample listings
    listings_data = [
        {
            "title": "Learn Python Programming from Scratch",
            "description": "I'll teach you Python fundamentals, data structures, and basic web development. Perfect for beginners!",
            "price_per_hour": 25.0,
            "user_id": users[0].id,
            "skill_id": skills[0].id
        },
        {
            "title": "Guitar Lessons - Beginner to Intermediate",
            "description": "Learn to play your favorite songs! I cover chords, strumming patterns, and basic music theory.",
            "price_per_hour": 30.0,
            "user_id": users[1].id,
            "skill_id": skills[1].id
        },
        {
            "title": "Web Design Fundamentals",
            "description": "Learn HTML, CSS, and responsive design principles. Build your first website!",
            "price_per_hour": 35.0,
            "user_id": users[2].id,
            "skill_id": skills[3].id
        },
        {
            "title": "Cooking Basics - Mediterranean Style",
            "description": "Learn essential cooking techniques and prepare delicious Mediterranean dishes.",
            "price_per_hour": 40.0,
            "user_id": users[3].id,
            "skill_id": skills[5].id
        }
    ]
    
    listings = []
    for listing_data in listings_data:
        listing = Listing(**listing_data)
        listings.append(listing)
        db.session.add(listing)
    
    db.session.commit()
    
    # Create sample sessions
    sessions_data = [
        {
            "teacher_id": users[0].id,
            "student_id": users[1].id,
            "listing_id": listings[0].id,
            "scheduled_date": datetime.utcnow() + timedelta(days=7),
            "duration": 60,
            "status": "confirmed",
            "notes": "Focus on basic syntax and variables"
        },
        {
            "teacher_id": users[1].id,
            "student_id": users[2].id,
            "listing_id": listings[1].id,
            "scheduled_date": datetime.utcnow() - timedelta(days=3),
            "duration": 90,
            "status": "completed",
            "notes": "Learned basic chords and strumming"
        }
    ]
    
    sessions = []
    for session_data in sessions_data:
        session = Session(**session_data)
        sessions.append(session)
        db.session.add(session)
    
    db.session.commit()
    
    # Create sample review for completed session
    review = Review(
        rating=5,
        comment="Excellent guitar lesson! Bob is very patient and explains everything clearly.",
        reviewer_id=users[2].id,  # Carol reviewing Bob
        reviewee_id=users[1].id,
        session_id=sessions[1].id
    )
    db.session.add(review)
    
    db.session.commit()
    
    print("Database seeded successfully!")
    print(f"Created {len(skills)} skills")
    print(f"Created {len(users)} users")
    print(f"Created {len(listings)} listings")
    print(f"Created {len(sessions)} sessions")
    print("Created 1 review")
if name == 'main':
    seed_database()

