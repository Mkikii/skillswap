from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        print("=== LOGIN ATTEMPT ===")
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        print(f"Looking for user with email: {email}")
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        print(f"User found: {user}")
        
        if user:
            print(f"User ID: {user.id}, Username: {user.username}")
            password_check = user.check_password(password)
            print(f"Password check result: {password_check}")
            
            if password_check:
                access_token = create_access_token(identity=user.id)
                print("Login successful, generating token")
                return jsonify({
                    'access_token': access_token, 
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'bio': user.bio
                    },
                    'message': 'Login successful'
                }), 200
            else:
                print("Password incorrect")
                return jsonify({'error': 'Invalid email or password'}), 401
        else:
            print("User not found")
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        user = User(
            username=data['username'],
            email=data['email'],
            bio=data.get('bio', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token, 
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio
            },
            'message': 'Registration successful'
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio
        }}), 200
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'error': 'Failed to fetch profile'}), 500