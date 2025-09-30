from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Listing

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('/', methods=['GET'])
def get_listings():
    try:
        listings = Listing.query.all()
        return jsonify({
            "listings": [listing.to_dict() for listing in listings],
            "message": "Listings fetched successfully",
            "total": len(listings)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@listings_bp.route('/', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 422
        
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_hour=float(data['price_per_hour']),
            skill_id=int(data['skill_id']),
            user_id=current_user_id
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            "message": "Listing created successfully",
            "listing": listing.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@listings_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    try:
        current_user_id = get_jwt_identity()
        listings = Listing.query.filter_by(user_id=current_user_id).all()
        return jsonify({
            "listings": [listing.to_dict() for listing in listings],
            "message": "Your listings fetched successfully"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get_or_404(listing_id)
        return jsonify({"listing": listing.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        listing = Listing.query.get_or_404(listing_id)
        
        if listing.user_id != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        data = request.get_json()
        
        if 'title' in data:
            listing.title = data['title']
        if 'description' in data:
            listing.description = data['description']
        if 'price_per_hour' in data:
            listing.price_per_hour = float(data['price_per_hour'])
        if 'skill_id' in data:
            listing.skill_id = int(data['skill_id'])
        
        db.session.commit()
        
        return jsonify({
            "message": "Listing updated successfully",
            "listing": listing.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    try:
        current_user_id = get_jwt_identity()
        listing = Listing.query.get_or_404(listing_id)
        
        if listing.user_id != current_user_id:
            return jsonyseturn jsonify({"error": "Unauthorized"}), 403
        
        db.session.delete(listing)
        db.session.commit()
        
        return jsonify({"message": "Listing deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500