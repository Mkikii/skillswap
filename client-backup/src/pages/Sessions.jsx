from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Session

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('', methods=['GET'])
@jwt_required()
def get_sessions():
    try:
        current_user_id = get_jwt_identity()
        sessions = Session.query.filter(
            (Session.student_id == current_user_id) | 
            (Session.teacher_id == current_user_id)
        ).all()
        
        return jsonify({'sessions': [session.to_dict() for session in sessions]}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500