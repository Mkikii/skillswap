#!/usr/bin/env python3

import sys
import os

print("🧪 Testing database setup...")

try:
    from database import db
    from models import User, Skill, UserSkill, Listing, Session, Review
    print("✅ All imports successful")
    
    # Test database creation
    from app import create_app
    app = create_app()
    
    with app.app_context():
        # Drop all tables
        db.drop_all()
        print("✅ Tables dropped successfully")
        
        # Create all tables
        db.create_all()
        print("✅ Tables created successfully")
        
        # Check if specific tables exist
        table_names = [table.name for table in db.metadata.tables.values()]
        expected_tables = ['users', 'skills', 'user_skills', 'listings', 'sessions', 'reviews']
        
        print(f"📊 Found tables: {table_names}")
        
        for table in expected_tables:
            if table in table_names:
                print(f"✅ Table '{table}' exists")
            else:
                print(f"❌ Table '{table}' is missing")
        
        success = all(table in table_names for table in expected_tables)
        if success:
            print("\n🎉 Database setup successful!")
        else:
            print("\n💥 Some tables are missing.")
            
except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()
