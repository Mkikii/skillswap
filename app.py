from flask import Flask
from flask_cors import CORS
from config import db
from routes.listings import listings_bp
from routes.auth import auth_bp
from routes.skills import skills_bp

app = Flask(__name__)
app.config.from_object('config')

# Enable CORS
CORS(app)

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(skills_bp, url_prefix='/api/skills')

@app.route('/')
def home():
    return {
        'message': 'SkillSwap API is running!',
        'endpoints': {
            'auth': '/api/auth',
            'listings': '/api/listings',
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
    app.run(debug=True, port=5555)
