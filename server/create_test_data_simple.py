from app import app, db
from models import User, Skill, Listing

def create_test_data():
    with app.app_context():
        print("Clearing existing data...")
        # Clear existing data and create tables
        db.drop_all()
        db.create_all()
        
        print("Creating users...")
        # Create test users
        user1 = User(username='alice', email='alice@example.com')
        user1.set_password('password123')
        
        user2 = User(username='bob', email='bob@example.com')
        user2.set_password('password123')
        
        user3 = User(username='charlie', email='charlie@example.com')
        user3.set_password('password123')
        
        print("Creating skills...")
        # Create test skills
        skill1 = Skill(name='Python Programming', category='Technology')
        skill2 = Skill(name='Web Development', category='Technology')
        skill3 = Skill(name='Guitar Lessons', category='Music')
        skill4 = Skill(name='Cooking', category='Lifestyle')
        skill5 = Skill(name='Photography', category='Creative')
        
        print("Creating listings...")
        # Create test listings
        listing1 = Listing(
            title='Python Tutoring for Beginners',
            description='Learn Python from scratch with hands-on projects',
            price_per_hour=30.00,
            user=user1,
            skill=skill1
        )
        
        listing2 = Listing(
            title='Full Stack Web Development',
            description='Learn HTML, CSS, JavaScript and React',
            price_per_hour=35.00,
            user=user2,
            skill=skill2
        )
        
        listing3 = Listing(
            title='Guitar Lessons - All Levels',
            description='Professional guitar lessons for beginners to advanced',
            price_per_hour=25.00,
            user=user3,
            skill=skill3
        )
        
        listing4 = Listing(
            title='Italian Cooking Class',
            description='Learn authentic Italian recipes and techniques',
            price_per_hour=40.00,
            user=user1,
            skill=skill4
        )
        
        listing5 = Listing(
            title='Portrait Photography Workshop',
            description='Learn portrait photography and lighting techniques',
            price_per_hour=45.00,
            user=user2,
            skill=skill5
        )
        
        # Add all to database
        db.session.add_all([user1, user2, user3, skill1, skill2, skill3, skill4, skill5, 
                           listing1, listing2, listing3, listing4, listing5])
        db.session.commit()
        
        print("✅ Test data created successfully!")
        print(f"📊 Users: {User.query.count()}")
        print(f"🎯 Skills: {Skill.query.count()}") 
        print(f"📝 Listings: {Listing.query.count()}")
        
        # Show the listing IDs that were created
        listings = Listing.query.all()
        for listing in listings:
            print(f"   Listing {listing.id}: {listing.title}")

if __name__ == '__main__':
    create_test_data()