from app import app, db
from models import User, Skill, Listing
from werkzeug.security import generate_password_hash

def create_test_data():
    with app.app_context():
        # Clear existing data and create tables
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create test users (with hashed passwords)
        print("Creating users...")
        user1 = User(
            username='alice', 
            email='alice@example.com',
            password=generate_password_hash('password123'),
            bio='Full-stack developer with 5 years experience'
        )
        
        user2 = User(
            username='bob', 
            email='bob@example.com',
            password=generate_password_hash('password123'),
            bio='Professional musician and guitar teacher'
        )
        
        user3 = User(
            username='charlie', 
            email='charlie@example.com',
            password=generate_password_hash('password123'),
            bio='Passionate cook and photography enthusiast'
        )
        
        # Create test skills
        print("Creating skills...")
        skill1 = Skill(name='Python Programming', category='Technology')
        skill2 = Skill(name='Web Development', category='Technology')
        skill3 = Skill(name='Guitar Lessons', category='Music')
        skill4 = Skill(name='Cooking', category='Lifestyle')
        skill5 = Skill(name='Photography', category='Creative')
        skill6 = Skill(name='JavaScript', category='Technology')
        skill7 = Skill(name='Spanish Language', category='Language')
        skill8 = Skill(name='Yoga', category='Fitness')
        
        # Add users and skills to session
        db.session.add_all([user1, user2, user3])
        db.session.add_all([skill1, skill2, skill3, skill4, skill5, skill6, skill7, skill8])
        db.session.commit()
        
        # Create test listings
        print("Creating listings...")
        listing1 = Listing(
            title='Python Tutoring for Beginners',
            description='Learn Python from scratch with hands-on projects. Perfect for complete beginners!',
            price_per_hour=30.00,
            user_id=user1.id,
            skill_id=skill1.id
        )
        
        listing2 = Listing(
            title='Full Stack Web Development',
            description='Learn HTML, CSS, JavaScript and React. Build real projects!',
            price_per_hour=35.00,
            user_id=user1.id,
            skill_id=skill2.id
        )
        
        listing3 = Listing(
            title='Guitar Lessons - All Levels',
            description='Professional guitar lessons for beginners to advanced. Learn your favorite songs!',
            price_per_hour=25.00,
            user_id=user2.id,
            skill_id=skill3.id
        )
        
        listing4 = Listing(
            title='Italian Cooking Class',
            description='Learn authentic Italian recipes and techniques. Perfect for food lovers!',
            price_per_hour=40.00,
            user_id=user3.id,
            skill_id=skill4.id
        )
        
        listing5 = Listing(
            title='Portrait Photography Workshop',
            description='Learn portrait photography and lighting techniques. Great for beginners!',
            price_per_hour=45.00,
            user_id=user3.id,
            skill_id=skill5.id
        )
        
        listing6 = Listing(
            title='Advanced JavaScript & Node.js',
            description='Master modern JavaScript, async programming, and backend development.',
            price_per_hour=40.00,
            user_id=user1.id,
            skill_id=skill6.id
        )
        
        # Add listings to session
        db.session.add_all([listing1, listing2, listing3, listing4, listing5, listing6])
        db.session.commit()
        
        print("\nTest data created successfully!")
        print(f"Users: {User.query.count()}")
        print(f"Skills: {Skill.query.count()}") 
        print(f"Listings: {Listing.query.count()}")
        
        print("\nSample Listings Created:")
        listings = Listing.query.all()
        for listing in listings:
            print(f"   • ID {listing.id}: {listing.title} (${listing.price_per_hour}/hr)")
        
        print("\nSample Users:")
        users = User.query.all()
        for user in users:
            print(f"   • {user.username} ({user.email}) - {len(user.listings)} listing(s)")

if __name__ == '__main__':
    create_test_data()
