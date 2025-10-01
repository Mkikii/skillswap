from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Listing, Skill, User, Review

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('', methods=['GET'])
def get_all_listings():
    try:
        print("Fetching all listings...")
        listings = Listing.query.all()
        print(f"Found {len(listings)} listings")
        
        result = []
        for listing in listings:
            try:
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
            except Exception as e:
                print(f"Error processing listing {listing.id}: {e}")
                continue
        
        return jsonify({
            'listings': result,
            'total': len(result),
            'message': 'Listings fetched successfully'
        }), 200
    except Exception as e:
        print(f"Get listings error: {e}")
        return jsonify({'error': 'Failed to fetch listings'}), 500

@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        listing_data = {
            'id': listing.id,
            'title': listing.title,
            'description': listing.description,
            'price_per_hour': listing.price_per_hour,
            'created_at': listing.created_at.isoformat(),
            'skill': {
                'id': listing.skill.id,
                'name': listing.skill.name,
                'category': listing.skill.category
            },
            'teacher': {
                'id': listing.user.id,
                'username': listing.user.username,
                'bio': listing.user.bio,
                'created_at': listing.user.created_at.isoformat()
            }
        }
        
        reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
        listing_data['teacher']['average_rating'] = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
        listing_data['teacher']['total_reviews'] = len(reviews)
        
        return jsonify({'listing': listing_data}), 200
    except Exception as e:
        print(f"Get listing error: {e}")
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
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Create listing error: {e}")
        return jsonify({'error': 'Failed to create listing'}), 500

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
                'skill_name': listing.skill.name
            }
            result.append(listing_data)
        
        return jsonify({'listings': result}), 200
    except Exception as e:
        print(f"Get my listings error: {e}")
        return jsonify({'error': 'Failed to fetch your listings'}), 500

@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        listing = Listing.query.get(listing_id)
        
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if listing.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        if 'title' in data:
            listing.title = data['title']
        if 'description' in data:
            listing.description = data['description']
        if 'price_per_hour' in data:
            if data['price_per_hour'] <= 0:
                return jsonify({'error': 'Price must be greater than 0'}), 400
            listing.price_per_hour = data['price_per_hour']
        if 'skill_id' in data:
            skill = Skill.query.get(data['skill_id'])
            if not skill:
                return jsonify({'error': 'Skill not found'}), 404
            listing.skill_id = data['skill_id']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Listing updated successfully',
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Update listing error: {e}")
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
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({'message': 'Listing deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Delete listing error: {e}")
        return jsonify({'error': 'Failed to delete listing'}), 500