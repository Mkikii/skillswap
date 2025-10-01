from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import db
from models import Skill

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('', methods=['GET'])
def get_all_skills():
    try:
        skills = Skill.query.all()
        return jsonify({
            'skills': [{
                'id': skill.id,
                'name': skill.name,
                'category': skill.category,
                'description': skill.description
            } for skill in skills]
        }), 200
    except Exception as e:
        print(f"Skills error: {e}")
        return jsonify({'error': 'Failed to fetch skills'}), 500

@skills_bp.route('', methods=['POST'])
@jwt_required()
def create_skill():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        existing_skill = Skill.query.filter_by(name=data['name']).first()
        if existing_skill:
            return jsonify({'error': 'Skill with this name already exists'}), 400
        
        skill = Skill(
            name=data['name'],
            category=data['category'],
            description=data.get('description', '')
        )
        
        db.session.add(skill)
        db.session.commit()
        
        return jsonify({
            'message': 'Skill created successfully',
            'skill': {
                'id': skill.id,
                'name': skill.name,
                'category': skill.category,
                'description': skill.description
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Create skill error: {e}")
        return jsonify({'error': 'Failed to create skill'}), 500