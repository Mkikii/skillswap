from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

@app.route('/')
def home():
    return jsonify({"message": "SkillSwap API is running!", "status": "success"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "API healthy"})

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    app.run(debug=True, port=5555)