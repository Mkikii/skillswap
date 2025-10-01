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
        
        print(f"🎯 CREATE LISTING REQUEST from user {current_user_id}")
        print(f"📦 Request data: {data}")
        
        # Check if user exists and can create listings
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        print(f"👤 User found: {user.username}")
        
        required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
        for field in required_fields:
            if field not in data or not data[field]:
                print(f"❌ Missing field: {field}")
                return jsonify({'error': f'{field} is required'}), 422
        
        # Convert price to float and validate
        try:
            price = float(data['price_per_hour'])
            print(f"💰 Price converted: {price}")
        except (ValueError, TypeError):
            print(f"❌ Invalid price: {data['price_per_hour']}")
            return jsonify({'error': 'Price must be a valid number'}), 422
        
        if price <= 0:
            print(f"❌ Price too low: {price}")
            return jsonify({'error': 'Price must be greater than 0'}), 422
        
        if price > 999:
            print(f"❌ Price too high: {price}")
            return jsonify({'error': 'Price per hour must be 3 digits or less'}), 422
        
        skill = Skill.query.get(data['skill_id'])
        if not skill:
            print(f"❌ Skill not found: {data['skill_id']}")
            return jsonify({'error': 'Skill not found'}), 404
        
        print(f"🎯 Skill found: {skill.name}")
        
        # Create the listing
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=price,
            user_id=current_user_id,
            skill_id=data['skill_id']
        )
        
        print(f"📝 Creating listing: {listing.title}")
        
        db.session.add(listing)
        db.session.commit()
        
        print("✅ Listing created successfully!")
        
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
        print(f"💥 CREATE LISTING ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to create listing: {str(e)}'}), 500

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
        print(f"Delete listing error: {e}")
        return jsonify({'error': 'Failed to delete listing'}), 500
