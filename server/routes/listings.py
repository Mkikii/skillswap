from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Listing, Skill, User, Review

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('', methods=['GET'])
def get_all_listings():
    try:
        skill_id = request.args.get('skill_id', type=int)
        category = request.args.get('category')
        max_price = request.args.get('max_price', type=float)
        min_price = request.args.get('min_price', type=float)
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'desc')
        
        query = Listing.query
        
        if skill_id:
            query = query.filter_by(skill_id=skill_id)
        if category:
            query = query.join(Skill).filter(Skill.category == category)
        if max_price:
            query = query.filter(Listing.price_per_hour <= max_price)
        if min_price:
            query = query.filter(Listing.price_per_hour >= min_price)
        
        if sort_by == 'price':
            if order == 'asc':
                query = query.order_by(Listing.price_per_hour.asc())
            else:
                query = query.order_by(Listing.price_per_hour.desc())
        else:
            if order == 'asc':
                query = query.order_by(Listing.created_at.asc())
            else:
                query = query.order_by(Listing.created_at.desc())
        
        listings = query.all()
        
        result = []
        for listing in listings:
            listing_data = listing.to_dict()
            listing_data['skill_name'] = listing.skill.name
            listing_data['skill_category'] = listing.skill.category
            listing_data['teacher_username'] = listing.user.username
            
            reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
            avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
            listing_data['teacher_rating'] = round(avg_rating, 1)
            listing_data['teacher_review_count'] = len(reviews)
            
            result.append(listing_data)
        
        return jsonify({
            'listings': result,
            'total': len(result),
            'filters_applied': {
                'skill_id': skill_id,
                'category': category,
                'price_range': [min_price, max_price],
                'sort_by': sort_by,
                'order': order
            }
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listings'}), 500

@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        listing_data = listing.to_dict()
        listing_data['skill'] = listing.skill.to_dict()
        listing_data['teacher'] = {
            'id': listing.user.id,
            'username': listing.user.username,
            'bio': listing.user.bio,
            'created_at': listing.user.created_at.isoformat()
        }
        
        reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
        listing_data['teacher']['average_rating'] = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
        listing_data['teacher']['total_reviews'] = len(reviews)
        listing_data['teacher']['recent_reviews'] = [
            {
                'rating': r.rating,
                'comment': r.comment,
                'created_at': r.created_at.isoformat(),
                'reviewer_username': r.reviewer.username
            } for r in reviews[-3:]
        ]
        
        return jsonify({'listing': listing_data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listing'}), 500

@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        if data['price_per_hour'] <= 0:
            return jsonify({'error': 'Price must be greater than 0'}), 400
        
        skill = Skill.query.get(data['skill_id'])
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=data['price_per_hour'],
            user_id=current_user_id,
            skill_id=data['skill_id']
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing': listing.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create listing'}), 500

@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if listing.user_id != current_user_id:
            return jsonify({'error': 'You can only edit your own listings'}), 403
        
        data = request.get_json()
        
        if 'title' in data:
            listing.title = data['title']
        if 'description' in data:
            listing.description = data['description']
        if 'price_per_hour' in data:
            if data['price_per_hour'] <= 0:
                return jsonify({'error': 'Price must be greater than 0'}), 400
            listing.price_per_hour = data['price_per_hour']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Listing updated successfully',
            'listing': listing.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update listing'}), 500

@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if listing.user_id != current_user_id:
            return jsonify({'error': 'You can only delete your own listings'}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({'message': 'Listing deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete listing'}), 500

@listings_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    try:
        current_user_id = get_jwt_identity()
        listings = Listing.query.filter_by(user_id=current_user_id).all()
        
        result = []
        for listing in listings:
            listing_data = listing.to_dict()
            listing_data['skill_name'] = listing.skill.name
            result.append(listing_data)
        
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch your listings'}), 500