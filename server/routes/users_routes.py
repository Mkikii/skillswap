from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import User, UserSkill, Skill, Listing, Review

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_skills = []
        for us in user.user_skills:
            skill_data = {
                'id': us.skill.id,
                'name': us.skill.name,
                'category': us.skill.category,
                'proficiency_level': us.proficiency_level,
                'years_experience': us.years_experience
            }
            user_skills.append(skill_data)
        
        listings_data = []
        for listing in user.listings:
            listing_data = {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'skill_name': listing.skill.name
            }
            listings_data.append(listing_data)
        
        reviews = Review.query.filter_by(reviewee_id=user_id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'created_at': user.created_at.isoformat(),
            'skills': user_skills,
            'listings': listings_data,
            'average_rating': round(avg_rating, 1),
            'total_reviews': len(reviews)
        }
        
        return jsonify({'user': user_data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user profile'}), 500

@users_bp.route('/experts', methods=['GET'])
def get_experts():
    try:
        experts = User.query.join(UserSkill).filter(
            UserSkill.proficiency_level.in_(['expert', 'advanced'])
        ).distinct().all()
        
        result = []
        for expert in experts:
            expert_data = {
                'id': expert.id,
                'username': expert.username,
                'email': expert.email,
                'bio': expert.bio,
                'created_at': expert.created_at.isoformat()
            }
            
            user_skills = []
            for us in expert.user_skills:
                if us.proficiency_level in ['expert', 'advanced']:
                    skill_data = {
                        'id': us.skill.id,
                        'name': us.skill.name,
                        'category': us.skill.category,
                        'proficiency_level': us.proficiency_level,
                        'years_experience': us.years_experience
                    }
                    user_skills.append(skill_data)
            
            listings = Listing.query.filter_by(user_id=expert.id).all()
            reviews = Review.query.filter_by(reviewee_id=expert.id).all()
            
            expert_data['skills'] = user_skills
            expert_data['listings_count'] = len(listings)
            expert_data['average_rating'] = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
            expert_data['total_reviews'] = len(reviews)
            
            result.append(expert_data)
        
        return jsonify({'experts': result}), 200
    except Exception as e:
        print(f"Get experts error: {e}")
        return jsonify({'error': 'Failed to fetch experts'}), 500