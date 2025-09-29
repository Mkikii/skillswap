# app.py - Simple working version
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database import db
from models import *  # Import all models
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "skillswap.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'skillswap-jwt-secret-change-in-production'
    app.config['SECRET_KEY'] = 'skillswap-secret-change-in-production'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Configure CORS for React frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Import and register your existing route files
    # Update these import names to match your actual files
    try:
        from auth_routes import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        print("✅ Auth routes registered")
    except ImportError:
        print("⚠️ auth_routes.py not found")
    
    try:
        from skills_routes import skills_bp
        app.register_blueprint(skills_bp, url_prefix='/api/skills')
        print("✅ Skills routes registered")
    except ImportError:
        print("⚠️ skills_routes.py not found")
    
    try:
        from sessions_routes import sessions_bp
        app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
        print("✅ Sessions routes registered")
    except ImportError:
        print("⚠️ sessions_routes.py not found")
    
    try:
        from reviews_routes import reviews_bp
        app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
        print("✅ Reviews routes registered")
    except ImportError:
        print("⚠️ reviews_routes.py not found")
    
    try:
        from listings_routes import listings_bp
        app.register_blueprint(listings_bp, url_prefix='/api/listings')
        print("✅ Listings routes registered")
    except ImportError:
        print("⚠️ listings_routes.py not found")
    
    # Simple health check
    @app.route('/api/health')
    def health_check():
        return {
            'status': 'healthy',
            'message': 'SkillSwap API is running 🔥',
            'demo_accounts': {
                'teacher': 'teacher@demo.com / demo123',
                'student': 'student@demo.com / demo123'
            }
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("\n🔥 SkillSwap API Starting...")
    print("📱 API running on: http://localhost:5000")
    print("🌐 Health check: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)