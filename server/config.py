from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillswap.db'
app.config['SECRET_KEY'] = 'skillswap-secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-skillswap-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app) 