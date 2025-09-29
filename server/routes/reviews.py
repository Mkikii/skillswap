from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Review

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('', methods=['GET'])
def get_all_reviews():
    try:
        reviews = Review.query.all()
        return jsonify({
            'reviews': [{
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment,
                'session_id': review.session_id
            } for review in reviews]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reviews'}), 500

@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        review = Review(
            rating=data['rating'],
            comment=data.get('comment', ''),
            reviewer_id=current_user_id,
            reviewee_id=data['reviewee_id'],
            session_id=data['session_id']
        )
        db.session.add(review)
        db.session.commit()
        return jsonify({'message': 'Review created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create review'}), 500
