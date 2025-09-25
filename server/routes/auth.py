from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import api, db
from models import User
from sqlalchemy.exc import IntegrityError

class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if not data.get(field):
                    return {'error': f'{field} is required'}, 400
            
            # Check if user already exists
            if User.query.filter_by(email=data['email']).first():
                return {'error': 'Email already registered'}, 400
            
            if User.query.filter_by(username=data['username']).first():
                return {'error': 'Username already taken'}, 400
            
            # Create new user
            user = User(
                username=data['username'],
                email=data['email'],
                bio=data.get('bio', '')
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            access_token = create_access_token(identity=user.id)
            
            return {
                'message': 'User registered successfully',
                'access_token': access_token,
                'user': user.to_dict()
            }, 201
            
        except IntegrityError:
            db.session.rollback()
            return {'error': 'Username or email already exists'}, 400
        except Exception as e:
            db.session.rollback()
            return {'error': 'Registration failed'}, 500

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data.get('email') or not data.get('password'):
                return {'error': 'Email and password are required'}, 400
            
            # Find user by email
            user = User.query.filter_by(email=data['email']).first()
            
            # Check credentials
            if user and user.check_password(data['password']):
                access_token = create_access_token(identity=user.id)
                return {
                    'message': 'Login successful',
                    'access_token': access_token,
                    'user': user.to_dict()
                }, 200
            
            return {'error': 'Invalid email or password'}, 401
            
        except Exception as e:
            return {'error': 'Login failed'}, 500

class Profile(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return {'error': 'User not found'}, 404
            
            return {'user': user.to_dict()}, 200
            
        except Exception as e:
            return {'error': 'Failed to get profile'}, 500
    
    @jwt_required()
    def put(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return {'error': 'User not found'}, 404
            
            data = request.get_json()
            
            # Update allowed fields
            if 'username' in data:
                # Check if username is already taken by another user
                existing_user = User.query.filter_by(username=data['username']).first()
                if existing_user and existing_user.id != user.id:
                    return {'error': 'Username already taken'}, 400
                user.username = data['username']
            
            if 'bio' in data:
                user.bio = data['bio']
            
            db.session.commit()
            
            return {
                'message': 'Profile updated successfully',
                'user': user.to_dict()
            }, 200
            
        except IntegrityError:
            db.session.rollback()
            return {'error': 'Username already taken'}, 400
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update profile'}, 500

api.add_resource(Register, '/api/auth/register')
api.add_resource(Login, '/api/auth/login')
api.add_resource(Profile, '/api/auth/profile')
