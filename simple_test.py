#!/usr/bin/env python3

print("🔍 Testing imports...")

try:
    from flask_sqlalchemy import SQLAlchemy
    from flask_bcrypt import Bcrypt
    print("✅ Flask extensions imported")
except ImportError as e:
    print(f"❌ Error importing Flask extensions: {e}")

try:
    from database import db, bcrypt
    print("✅ database.py imports work")
except ImportError as e:
    print(f"❌ Error importing from database.py: {e}")

try:
    import models
    print("✅ models module imported")
    
    # Check if we can access the classes
    if hasattr(models, 'User'):
        print("✅ User class found")
    if hasattr(models, 'Skill'):
        print("✅ Skill class found")
    if hasattr(models, 'UserSkill'):
        print("✅ UserSkill class found")
    if hasattr(models, 'Listing'):
        print("✅ Listing class found")
    if hasattr(models, 'Session'):
        print("✅ Session class found")
    if hasattr(models, 'Review'):
        print("✅ Review class found")
        
except ImportError as e:
    print(f"❌ Error importing models: {e}")
