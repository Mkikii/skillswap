from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from models import User, Skill, Listing, UserSkill, Session, Review
from datetime import timedelta
import os

app = Flask(__name__)
app.config.from_object(Config)

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=10)

db.init_app(app)

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

def initialize_database():
    try:
        print("🔄 Initializing database...")
        
        db.create_all()
        print("✅ Database tables created successfully!")
        
        user_count = User.query.count()
        skill_count = Skill.query.count()
        
        print(f"📊 Current data: {user_count} users, {skill_count} skills")
        
        if user_count == 0 or skill_count == 0:
            print("🌱 Seeding database with initial data...")
            from seed import setup_database
            if setup_database():
                print("✅ Database seeded successfully!")
            else:
                print("❌ Database seeding failed!")
        else:
            print("✅ Database already has data, skipping seed")
            
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        try:
            db.create_all()
            print("✅ Tables created (minimal setup)")
        except Exception as e2:
            print(f"❌ Critical database error: {e2}")

with app.app_context():
    initialize_database()

@app.route('/')
def home():
    return jsonify({"message": "SkillSwap API is running!", "status": "success"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "API healthy", "database": "initialized"})

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
    app.run(debug=True, port=5555)