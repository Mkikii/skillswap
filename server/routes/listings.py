from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Listing, User

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('/', methods=['GET'])
def get_listings():
    listings = Listing.query.all()
    return jsonify({
        "listings": [listing.to_dict() for listing in listings],
        "message": "Listings fetched successfully",
        "total": len(listings)
    })

@listings_bp.route('/', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        listing = Listing(
            title=data.get('title'),
            description=data.get('description'),
            price_per_hour=data.get('price_per_hour'),
            user_id=current_user_id,
            skill_id=data.get('skill_id')
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            "message": "Listing created successfully",
            "listing": listing.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@listings_bp.route('/<int:id>', methods=['GET'])
def get_listing(id):
    listing = Listing.query.get_or_404(id)
    return jsonify({"listing": listing.to_dict()})

@listings_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_listing(id):
    listing = Listing.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    
    if listing.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    listing.title = data.get('title', listing.title)
    listing.description = data.get('description', listing.description)
    listing.price_per_hour = data.get('price_per_hour', listing.price_per_hour)
    listing.skill_id = data.get('skill_id', listing.skill_id)
    
    db.session.commit()
    return jsonify({
        "message": "Listing updated successfully",
        "listing": listing.to_dict()
    })

@listings_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_listing(id):
    listing = Listing.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    
    if listing.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(listing)
    db.session.commit()
    return jsonify({"message": "Listing deleted successfully"})

@listings_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def get_my_listings():
    current_user_id = get_jwt_identity()
    listings = Listing.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({
        "listings": [listing.to_dict() for listing in listings],
        "message": "Your listings fetched successfully",
        "total": len(listings)
    })