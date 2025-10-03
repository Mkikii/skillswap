# Auto-create tables for PostgreSQL
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Seed data if empty
        from models import User, Skill
        if User.query.count() == 0:
            print("🌱 Seeding database...")
            import seed
            print("✅ Database seeded successfully!")
        else:
            print(f"📊 Database has {User.query.count()} users")
            
    except Exception as e:
        print(f"❌ Database error: {e}")