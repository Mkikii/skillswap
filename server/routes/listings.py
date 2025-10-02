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
        
        if not data:
            return jsonify({'error': 'No data provided'}), 422
        
        if not data.get('title') or not data.get('description') or not data.get('price_per_hour') or not data.get('skill_id'):
            return jsonify({'error': 'All fields are required'}), 422
        
        try:
            price = float(data['price_per_hour'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Price must be a valid number'}), 422
        
        if price <= 0:
            return jsonify({'error': 'Price must be greater than 0'}), 422
        
        if price > 999:
            return jsonify({'error': 'Price per hour must be 999 KSh or less'}), 422
        
        try:
            skill_id = int(data['skill_id'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Skill ID must be a valid number'}), 422
        
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        listing = Listing(
            title=data['title'].strip(),
            description=data['description'].strip(),
            price_per_hour=price,
            user_id=current_user_id,
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
                'price_per_hour': listing.price_per_hour,
                'skill_id': listing.skill_id,
                'skill_name': skill.name,
                'user_id': listing.user_id,
                'created_at': listing.created_at.isoformat()
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
        listings = Listing.query.filter_by(user_id=current_user_id).all()
        result = []
        for listing in listings:
            listing_data = {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'skill_name': listing.skill.name,
                'skill_category': listing.skill.category,
                'created_at': listing.created_at.isoformat()
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
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if listing.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized to delete this listing'}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({'message': 'Listing deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete listing'}), 500