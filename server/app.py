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

# Fix CORS configuration - allow all origins or specific ones
CORS(app, origins=[
    "https://skillswap-app.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000"
], supports_credentials=True)

# Or for development, you can allow all origins:
# CORS(app, origins="*", supports_credentials=True)

jwt = JWTManager(app)

# ... rest of your app.py code remains the same