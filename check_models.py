from app import app
from database import db
from models import User, Skill, Listing, UserSkill, Session, Review

def check_database():
    with app.app_context():
        print("🔍 Checking database content...\n")
        
        users = User.query.all()
        print(f"👥 Users: {len(users)}")
        for user in users:
            print(f"  - {user.username} ({user.email})")
        
        skills = Skill.query.all()
        print(f"\n🛠️ Skills: {len(skills)}")
        for skill in skills[:5]:
            print(f"  - {skill.name} ({skill.category})")
        
        listings = Listing.query.all()
        print(f"\n📋 Listings: {len(listings)}")
        for listing in listings:
            print(f"  - {listing.title} - KSH {listing.price_per_hour}/hr")
        
        user_skills = UserSkill.query.all()
        print(f"\n🎯 User Skills: {len(user_skills)}")
        
        sessions = Session.query.all()
        print(f"\n📅 Sessions: {len(sessions)}")
        
        reviews = Review.query.all()
        print(f"\n⭐ Reviews: {len(reviews)}")
        
        print(f"\n✅ Database check complete!")

if __name__ == "__main__":
    check_database()