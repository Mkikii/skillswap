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
            listing_data = listing.to_dict()
            listing_data['skill_name'] = listing.skill.name
            listing_data['skill_category'] = listing.skill.category
            listing_data['teacher_username'] = listing.user.username
            listing_data['teacher_id'] = listing.user_id
            
            reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
            avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
            listing_data['teacher_rating'] = round(avg_rating, 1)
            listing_data['teacher_review_count'] = len(reviews)
            result.append(listing_data)
        
        return jsonify({'listings': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listings'}), 500

# ... rest of your existing code