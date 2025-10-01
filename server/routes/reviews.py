from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Review, Session

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
                'reviewer': {'username': review.reviewer.username},
                'reviewee': {'username': review.reviewee.username},
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
        
        required_fields = ['rating', 'reviewee_id', 'session_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        if data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        session = Session.query.get(data['session_id'])
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        review = Review(
            rating=data['rating'],
            comment=data.get('comment', ''),
            reviewer_id=current_user_id,
            reviewee_id=data['reviewee_id'],
            session_id=data['session_id']
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review created successfully',
            'review': {
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create review'}), 500

@reviews_bp.route('/session/<int:session_id>', methods=['GET'])
def get_session_reviews(session_id):
    try:
        reviews = Review.query.filter_by(session_id=session_id).all()
        return jsonify({
            'reviews': [{
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment,
                'reviewer': {'username': review.reviewer.username},
                'created_at': review.created_at.isoformat()
            } for review in reviews]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reviews'}), 500