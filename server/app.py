from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from models import User
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)

# CORS Configuration - THIS IS CRITICAL
CORS(app, 
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Or for production, be more specific:
# CORS(app, 
#      resources={r"/api/*": {"origins": "https://skillswap-app.netlify.app"}},
#      supports_credentials=True,
#      allow_headers=["Content-Type", "Authorization"],
#      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

jwt = JWTManager(app)

# Rest of your app code...