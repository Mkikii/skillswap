#!/usr/bin/env python3

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db
from models import User, Skill, UserSkill, Listing, Session, Review
from config import Config

def test_database():
    print("🧪 Testing database setup...")
    
    try:
        from models import User, Skill, UserSkill, Listing, Session, Review
        print("✅ All models imported successfully")
    except ImportError as e:
        print(f"❌ Error importing models: {e}")
        return False
    
    try:
        from app import create_app
        app = create_app()
        
        with app.app_context():
            db.drop_all()
            print("✅ Tables dropped successfully")
            
            db.create_all()
            print("✅ Tables created successfully")
            
            table_names = [table.name for table in db.metadata.tables.values()]
            expected_tables = ['users', 'skills', 'user_skills', 'listings', 'sessions', 'reviews']
            
            print(f"📊 Found tables: {table_names}")
            
            for table in expected_tables:
                if table in table_names:
                    print(f"✅ Table '{table}' exists")
                else:
                    print(f"❌ Table '{table}' is missing")
            
            return all(table in table_names for table in expected_tables)
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_database()
    if success:
        print("\n🎉 All tests passed! Database is ready.")
    else:
        print("\n💥 Some tests failed. Check the errors above.")
        sys.exit(1)