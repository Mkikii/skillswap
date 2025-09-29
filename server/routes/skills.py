from flask import Blueprint, jsonify
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