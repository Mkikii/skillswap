from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Review, Session, User
from sqlalchemy.exc import IntegrityError

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('', methods=['GET'])
def get_all_reviews():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_id = request.args.get('user_id', type=int)
        
        query = Review.query
        
        if user_id:
            query = query.filter(Review.reviewee_id == user_id)
        
        query = query.order_by(Review.created_at.desc())
        
        reviews = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews.items],
            'total': reviews.total,
            'pages': reviews.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reviews'}), 500

@reviews_bp.route('/<int:review_id>', methods=['GET'])
def get_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        return jsonify(review.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch review'}), 500

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
        
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid rating format'}), 400
       
        session = Session.query.get(data['session_id'])
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        if session.status != 'completed':
            return jsonify({'error': 'Can only review completed sessions'}), 400
        
        # Check if user was the student in this session
        if session.student_id != current_user_id:
            return jsonify({'error': 'Only students can review sessions'}), 403
        
        # Check if review already exists for this session
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
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review.to_dict()
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Review already exists for this session'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create review'}), 500

@reviews_bp.route('/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    try:
        current_user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        # Check if user owns the review
        if review.reviewer_id != current_user_id:
            return jsonify({'error': 'Unauthorized to update this review'}), 403
        
        data = request.get_json()
        
        # Update rating if provided
        if 'rating' in data:
            try:
                rating = int(data['rating'])
                if rating < 1 or rating > 5:
                    return jsonify({'error': 'Rating must be between 1 and 5'}), 400
                review.rating = rating
            except ValueError:
                return jsonify({'error': 'Invalid rating format'}), 400
        
        # Update comment if provided
        if 'comment' in data:
            review.comment = data['comment']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Review updated successfully',
            'review': review.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update review'}), 500

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    try:
        current_user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        # Check if user owns the review
        if review.reviewer_id != current_user_id:
            return jsonify({'error': 'Unauthorized to delete this review'}), 403
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({'message': 'Review deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete review'}), 500

@reviews_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get reviews received by this user
        reviews = Review.query.filter_by(reviewee_id=user_id).order_by(Review.created_at.desc()).all()
        
        # Calculate average rating
        if reviews:
            average_rating = sum(review.rating for review in reviews) / len(reviews)
        else:
            average_rating = 0
        
        return jsonify({
            'user': user.to_dict(),
            'reviews': [review.to_dict() for review in reviews],
            'average_rating': round(average_rating, 1),
            'total_reviews': len(reviews)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user reviews'}), 500

@reviews_bp.route('/my-reviews', methods=['GET'])
@jwt_required()
def get_my_reviews():
    try:
        current_user_id = get_jwt_identity()
        
        # Get reviews written by current user
        given_reviews = Review.query.filter_by(reviewer_id=current_user_id).order_by(Review.created_at.desc()).all()
        
        # Get reviews received by current user
        received_reviews = Review.query.filter_by(reviewee_id=current_user_id).order_by(Review.created_at.desc()).all()
        
       
        if received_reviews:
            average_rating = sum(review.rating for review in received_reviews) / len(received_reviews)
        else:
            average_rating = 0
        
        return jsonify({
            'given_reviews': [review.to_dict() for review in given_reviews],
            'received_reviews': [review.to_dict() for review in received_reviews],
            'average_rating': round(average_rating, 1),
            'total_received': len(received_reviews)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch your reviews'}), 500
