from app import app, db
from models import User, Skill, Listing
from datetime import datetime

def simple_seed():
    with app.app_context():
        print("Starting simple seed...")
        
        # Clear and create tables
        db.drop_all()
        db.create_all()
        
        # Create one simple user (using password_hash directly)
        user = User(
            username='testuser', 
            email='test@example.com',
            bio='Test user bio'
        )
        
        # Check if set_password method exists, otherwise set password_hash directly
        if hasattr(user, 'set_password'):
            user.set_password('test123')
        else:
            # Simple password hashing (you should use proper hashing in production)
            import hashlib
            user.password_hash = hashlib.sha256('test123'.encode()).hexdigest()
        
        # Create one simple skill
        skill = Skill(name='Python Programming', category='Technology')
        
        # Create one simple listing
        listing = Listing(
            title='Python Tutoring Session',
            description='Learn Python programming basics',
            price_per_hour=25.0,
            user=user,
            skill=skill
        )
        
        db.session.add_all([user, skill, listing])
        db.session.commit()
        
        print("✅ Simple test data created!")
        print(f"Users: {User.query.count()}")
        print(f"Skills: {Skill.query.count()}")
        print(f"Listings: {Listing.query.count()}")
        
        # Test the data
        test_listing = Listing.query.first()
        if test_listing:
            print(f"Test listing: {test_listing.title} by {test_listing.user.username}")

if __name__ == '__main__':
    simple_seed()
