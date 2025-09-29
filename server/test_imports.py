#!/usr/bin/env python3

print("🔍 Testing imports in server directory...")

try:
    from database import db, bcrypt
    print("✅ database.py imports work")
except ImportError as e:
    print(f"❌ Error importing from database.py: {e}")

try:
    from models import User, Skill, Listing, UserSkill, Session, Review
    print("✅ All models imported successfully")
    
    # Check table names
    print(f"User table: {User.__tablename__}")
    print(f"Skill table: {Skill.__tablename__}")
    print(f"UserSkill table: {UserSkill.__tablename__}")
    print(f"Listing table: {Listing.__tablename__}")
    print(f"Session table: {Session.__tablename__}")
    print(f"Review table: {Review.__tablename__}")
    
except ImportError as e:
    print(f"❌ Error importing models: {e}")
    import traceback
    traceback.print_exc()
