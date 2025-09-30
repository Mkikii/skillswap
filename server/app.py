from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from database import db
import os

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-fallback-key')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-fallback-key')
    
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    
    CORS(app)
    
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    
    @app.route('/')
    def home():
        return jsonify({"message": "SkillSwap API is running!", "status": "success"})
    
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
    
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5555))
    app.run(host='0.0.0.0', port=port, debug=False)