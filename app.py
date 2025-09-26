from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)
    
    with app.app_context():
        db.create_all()
        
        from routes.listings import listings_bp
        from routes.auth import auth_bp
        from routes.skills import skills_bp
        
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
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5555)