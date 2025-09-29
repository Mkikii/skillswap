from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Review, Session

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        required_fields = ['rating', 'session_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        session = Session.query.get(data['session_id'])
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        if session.student_id != current_user_id:
            return jsonify({'error': 'Only students can review sessions'}), 403
        existing_review = Review.query.filter_by(session_id=data['session_id']).first()
        if existing_review:
            return jsonify({'error': 'Review already exists for this session'}), 400
        review = Review(
            rating=rating,
            comment=data.get('comment', ''),
            reviewer_id=current_user_id,
            reviewee_id=session.teacher_id,
            session_id=data['session_id']
        )
        db.session.add(review)
        db.session.commit()
        return jsonify({'message': 'Review created successfully', 'review': review.to_dict()}), 201
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to create review'}), 500

@reviews_bp.route('', methods=['GET'])
def get_all_reviews():
    try:
        reviews = Review.query.all()
        return jsonify({'reviews': [review.to_dict() for review in reviews]}), 200
    except Exception:
        return jsonify({'error': 'Failed to fetch reviews'}), 500
