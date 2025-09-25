from flask import Flask
from config import db, api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta
from routes.auth import auth_bp
from routes.listings import listings_bp
from routes.sessions import sessions_bp
from routes.reviews import reviews_bp

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

db.init_app(app)
api.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(listings_bp, url_prefix='/listings')
app.register_blueprint(sessions_bp, url_prefix='/sessions')
app.register_blueprint(reviews_bp, url_prefix='/reviews')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
