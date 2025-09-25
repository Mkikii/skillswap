# server/app.py (SUPER SIMPLE VERSION)
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key'

# Simple in-memory storage (replace with database later)
users = []
listings = []

@app.route('/')
def home():
    return jsonify({"message": "SkillSwap API Running!"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    users.append({
        'id': len(users) + 1,
        'username': data['username'],
        'email': data['email'],
        'password': data['password']  # In real app, hash this!
    })
    return jsonify({"message": "User registered", "user_id": len(users)})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    # Simple authentication
    for user in users:
        if user['email'] == data['email'] and user['password'] == data['password']:
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({"token": token, "user": user})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/listings', methods=['GET'])
def get_listings():
    return jsonify({"listings": listings})

@app.route('/api/listings', methods=['POST'])
def create_listing():
    data = request.json
    listings.append({
        'id': len(listings) + 1,
        'title': data['title'],
        'description': data['description'],
        'price': data['price'],
        'user_id': data['user_id']
    })
    return jsonify({"message": "Listing created"})

if __name__ == '__main__':
    app.run(debug=True, port=5555)