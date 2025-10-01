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
            return jsonify({'error': 'No data received'}), 400
            
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        price_per_hour = data.get('price_per_hour')
        skill_id = data.get('skill_id')
        
        if not title or not description or not price_per_hour or not skill_id:
            return jsonify({'error': 'All fields are required'}), 400
        
        try:
            price = float(price_per_hour)
            skill_id_int = int(skill_id)
        except:
            return jsonify({'error': 'Invalid price or skill ID'}), 400
        
        skill = Skill.query.get(skill_id_int)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        listing = Listing(
            title=title,
            description=description,
            price_per_hour=price,
            user_id=current_user_id,
            skill_id=skill_id_int
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
        return jsonify({'error': str(e)}), 500