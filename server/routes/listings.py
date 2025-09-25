from flask import Blueprint, request, jsonify
from config import db
from models import Listing, Skill, User
from flask_jwt_extended import jwt_required, get_jwt_identity

listings_bp = Blueprint('listings', __name__)


@listings_bp.route('/', methods=['GET'])
def get_listings():
    try:
        listings = Listing.query.all()
        result = []
        for listing in listings:
            result.append({
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'user': {
                    'id': listing.user.id,
                    'username': listing.user.username
                },
                'skill': {
                    'id': listing.skill.id,
                    'name': listing.skill.name,
                    'category': listing.skill.category
                }
            })
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@listings_bp.route('/', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
       
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=data['price_per_hour'],
            user_id=user_id,
            skill_id=data['skill_id']
        )
        
       
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing_id': listing.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get a specific listing by its ID
@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get_or_404(listing_id)
        return jsonify({
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'user': {
                    'id': listing.user.id,
                    'username': listing.user.username,
                    'bio': listing.user.bio
                },
                'skill': {
                    'id': listing.skill.id,
                    'name': listing.skill.name,
                    'category': listing.skill.category
                }
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@listings_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_listings(user_id):
    try:
        listings = Listing.query.filter_by(user_id=user_id).all()
        result = []
        for listing in listings:
            result.append({
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'skill': {
                    'id': listing.skill.id,
                    'name': listing.skill.name,
                    'category': listing.skill.category
                }
            })
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
