from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Skill
from sqlalchemy.exc import IntegrityError

skills_bp = Blueprint('skills', name)

@skills_bp.route('', methods=['GET'])
def get_all_skills():
    try:
        skills = Skill.query.all()
        return jsonify([skill.to_dict() for skill in skills]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch skills'}), 500

@skills_bp.route('/<int:skill_id>', methods=['GET'])
def get_skill(skill_id):
    try:
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        return jsonify(skill.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch skill'}), 500

@skills_bp.route('', methods=['POST'])
@jwt_required()
def create_skill():
    try:
        data = request.get_json()
        

    # Validate required fields
    required_fields = ['name', 'category']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if skill already exists
    if Skill.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Skill already exists'}), 400
    
    skill = Skill(
        name=data['name'],
        category=data['category'],
        description=data.get('description', '')
    )
    
    db.session.add(skill)
    db.session.commit()
    
    return jsonify({
        'message': 'Skill created successfully',
        'skill': skill.to_dict()
    }), 201
    
except IntegrityError:
    db.session.rollback()
    return jsonify({'error': 'Skill already exists'}), 400
except Exception as e:
    db.session.rollback()
    return jsonify({'error': 'Failed to create skill'}), 500
@skills_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Skill.category).distinct().all()
        category_list = [category[0] for category in categories]
        return jsonify(category_list), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories'}), 500

