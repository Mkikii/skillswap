from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from models import User
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=10)

CORS(app, origins=[
    "https://skillswap-app.netlify.app",
    "https://mkskillswap.netlify.app", 
    "http://localhost:5173",
    "http://localhost:3000"
])

jwt = JWTManager(app)

@jwt.user_identity_loader
def user_identity_lookup(user):
    return str(user)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.get(int(identity))

# Auto-create tables for SQLite
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

@app.route('/')
def home():
    return jsonify({"message": "SkillSwap API is running!", "status": "success"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "API healthy"})

# Import and register routes
from routes.auth import auth_bp
from routes.skills import skills_bp
from routes.listings import listings_bp
from routes.sessions import sessions_bp
from routes.reviews import reviews_bp
from routes.users_routes import users_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(skills_bp, url_prefix='/api/skills')
app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
app.register_blueprint(users_bp, url_prefix='/api/users')

print("✅ All routes registered successfully")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)