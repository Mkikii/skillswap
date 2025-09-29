from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)
    
    from routes.auth import auth_bp
    from routes.skills import skills_bp
    from routes.listings import listings_bp
    from routes.sessions import sessions_bp
    from routes.reviews import reviews_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(listings_bp, url_prefix='/api/listings')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)