from flask import Flask
from config import db, jwt
from flask_cors import CORS
import os
from datetime import timedelta
from routes.auth import auth_bp
from routes.listings import listings_bp
from routes.sessions import sessions_bp
from routes.reviews import reviews_bp
from routes.skills import skills_bp


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillswap.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
jwt.init_app(app)
CORS(app)


app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
app.register_blueprint(skills_bp, url_prefix='/api/skills')

@app.route('/')
def home():
    return {
        'message': 'SkillSwap API is running!',
        'endpoints': {
            'auth': '/api/auth',
            'listings': '/api/listings',
            'sessions': '/api/sessions',
            'reviews': '/api/reviews',
            'skills': '/api/skills'
        }
    }

@app.route('/api')
def api_info():
    return {
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'POST /api/auth/register': 'User registration',
            'POST /api/auth/login': 'User login',
            'GET /api/auth/profile': 'Get user profile',
            'GET /api/listings': 'Get all listings',
            'POST /api/listings': 'Create new listing',
            'GET /api/skills': 'Get all skills'
        }
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("🚀 SkillSwap Backend running on http://localhost:5555")
    app.run(port=5555, debug=True)