from flask import Blueprint, jsonify
from config import db
from models import Skill

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    result = [{'id': s.id, 'name': s.name, 'category': s.category} for s in skills]
    return jsonify({'skills': result}), 200