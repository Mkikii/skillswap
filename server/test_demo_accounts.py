from app import app
from database import db
from models import User

with app.app_context():
    print("🔑 Testing demo accounts:")
    
    demo_accounts = [
        {"email": "seoyeji@example.com", "password": "password123", "role": "Teacher"},
        {"email": "maureen@example.com", "password": "password123", "role": "Student"}, 
        {"email": "malkiki@example.com", "password": "password123", "role": "Guest"}
    ]
    
    for account in demo_accounts:
        user = User.query.filter_by(email=account["email"]).first()
        if user:
            print(f"✅ {account['role']}: {account['email']} - EXISTS")
            print(f"   Username: {user.username}")
            print(f"   Bio: {user.bio}")
            # Test password
            if user.check_password(account["password"]):
                print("   ✅ Password verification: WORKS")
            else:
                print("   ❌ Password verification: FAILS")
        else:
            print(f"❌ {account['role']}: {account['email']} - NOT FOUND")
        
        print()
