from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Listing, Skill, User, Review

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('', methods=['GET'])
def get_all_listings():
    try:
        listings = Listing.query.all()
        result = []
        for listing in listings:
            listing_data = {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'created_at': listing.created_at.isoformat(),
                'skill_name': listing.skill.name,
                'skill_category': listing.skill.category,
                'teacher_username': listing.user.username,
                'teacher_id': listing.user_id
            }
            reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
            avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
            listing_data['teacher_rating'] = round(avg_rating, 1)
            listing_data['teacher_review_count'] = len(reviews)
            result.append(listing_data)
        
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listings'}), 500

@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('title') or not data.get('description') or not data.get('price_per_hour') or not data.get('skill_id'):
            return jsonify({'error': 'All fields are required'}), 422
        
        price = float(data['price_per_hour'])
        skill_id = int(data['skill_id'])
        user_id = int(current_user_id)
        
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=price,
            user_id=user_id,
            skill_id=skill_id
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error: ' + str(e)}), 500

@listings_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    try:
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id)
        listings = Listing.query.filter_by(user_id=user_id).all()
        result = []
        for listing in listings:
            listing_data = {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'skill_name': listing.skill.name
            }
            result.append(listing_data)
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch your listings'}), 500

@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id)
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if listing.user_id != user_id:
            return jsonify({'error': 'Unauthorized to delete this listing'}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({'message': 'Listing deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete listing'}), 500