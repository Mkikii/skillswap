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

@users_bp.route('/skills', methods=['POST'])
@jwt_required()
def add_user_skill():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['skill_id', 'proficiency_level']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        skill = Skill.query.get(data['skill_id'])
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        existing = UserSkill.query.filter_by(
            user_id=current_user_id, 
            skill_id=data['skill_id']
        ).first()
        if existing:
            return jsonify({'error': 'User already has this skill'}), 400
        
        user_skill = UserSkill(
            user_id=current_user_id,
            skill_id=data['skill_id'],
            proficiency_level=data['proficiency_level'],
            years_experience=data.get('years_experience', 0)
        )
        
        db.session.add(user_skill)
        db.session.commit()
        
        return jsonify({'message': 'Skill added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add skill'}), 500

@users_bp.route('/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def remove_user_skill(skill_id):
    try:
        current_user_id = get_jwt_identity()
        
        user_skill = UserSkill.query.filter_by(
            user_id=current_user_id,
            skill_id=skill_id
        ).first()
        
        if not user_skill:
            return jsonify({'error': 'User skill not found'}), 404
        
        db.session.delete(user_skill)
        db.session.commit()
        
        return jsonify({'message': 'Skill removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove skill'}), 500

@users_bp.route('/search', methods=['GET'])
def search_users():
    try:
        query = request.args.get('q', '').strip()
        skill_id = request.args.get('skill_id', type=int)
        
        if not query and not skill_id:
            return jsonify({'users': []}), 200
        
        users_query = User.query
        
        if skill_id:
            users_query = users_query.join(UserSkill).filter(UserSkill.skill_id == skill_id)
        
        if query:
            users_query = users_query.filter(
                User.username.contains(query) | User.bio.contains(query)
            )
        
        users = users_query.limit(20).all()
        
        result = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'created_at': user.created_at.isoformat()
            }
            reviews = Review.query.filter_by(reviewee_id=user.id).all()
            user_data['average_rating'] = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
            user_data['total_reviews'] = len(reviews)
            result.append(user_data)
        
        return jsonify({'users': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to search users'}), 500

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