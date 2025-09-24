from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Listing, User, Skill
from sqlalchemy.exc import IntegrityError

listings_bp = Blueprint('listings', _name_)

@listings_bp.route('', methods=['GET'])
def get_all_listings():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Listing.query.join(User).join(Skill)
        
        # Filter by category
        if category:
            query = query.filter(Skill.category == category)
        
        # Search in title and description
        if search:
            query = query.filter(
                db.or_(
                    Listing.title.contains(search),
                    Listing.description.contains(search),
                    Skill.name.contains(search)
                )
            )
        
        # Order by creation date (newest first)
        query = query.order_by(Listing.created_at.desc())
        
        # Paginate results
        listings = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'listings': [listing.to_dict() for listing in listings.items],
            'total': listings.total,
            'pages': listings.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listings'}), 500

@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        return jsonify(listing.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listing'}), 500

@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate skill exists
        skill = Skill.query.get(data['skill_id'])
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        # Validate price
        try:
            price = float(data['price_per_hour'])
            if price < 0:
                return jsonify({'error': 'Price must be positive'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid price format'}), 400
        
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=price,
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
        
        # Check if user owns the listing
        if listing.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized to update this listing'}), 403
        
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            listing.title = data['title']
        if 'description' in data:
            listing.description = data['description']
        if 'price_per_hour' in data:
            try:
                price = float(data['price_per_hour'])
                if price < 0:
                    return jsonify({'error': 'Price must be positive'}), 400
                listing.price_per_hour = price
            except ValueError:
                return jsonify({'error': 'Invalid price format'}), 400
        if 'skill_id' in data:
            skill = Skill.query.get(data['skill_id'])
            if not skill:
                return jsonify({'error': 'Skill not found'}), 404
            listing.skill_id = data['skill_id']
        
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
        
        # Check if user owns the listing
        if listing.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized to delete this listing'}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({'message': 'Listing deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete listing'}), 500

@listings_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_listings(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()
        
        return jsonify({
            'user': user.to_dict(),
            'listings': [listing.to_dict() for listing in listings]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user listings'}), 500

@listings_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    try:
        current_user_id = get_jwt_identity()
        listings = Listing.query.filter_by(user_id=current_user_id).order_by(Listing.created_at.desc()).all()
        
        return jsonify([listing.to_dict() for listing in listings]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch your listings'}), 500