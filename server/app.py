# Auto-create tables for PostgreSQL
with app.app_context():
    try:
        print("🔄 Initializing database...")
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Seed data if empty
        from models import User, Skill
        user_count = User.query.count()
        skill_count = Skill.query.count()
        print(f"📊 Current data: {user_count} users, {skill_count} skills")
        
        if user_count == 0:
            print("🌱 Seeding database with initial data...")
            import seed
            print("✅ Database seeded successfully!")
        else:
            print("📊 Database already has data, skipping seed")
            
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        # Don't crash the app, just log the error