from flask import Blueprint, request, jsonify
from config import db
from models import Session, Listing, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/', methods=['POST'])
@jwt_required()
def create_session():
    try:
        data = request.get_json()
        student_id = get_jwt_identity()
        
        listing = Listing.query.get(data['listing_id'])
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        session = Session(
            student_id=student_id,
            teacher_id=listing.user_id,
            listing_id=data['listing_id'],
            scheduled_time=datetime.fromisoformat(data['scheduled_time']),
            status='pending'
        )
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            'message': 'Session booked successfully',
            'session_id': session.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_sessions():
    try:
        user_id = get_jwt_identity()
        sessions = Session.query.filter(
            (Session.student_id == user_id) | (Session.teacher_id == user_id)
        ).all()
        
        result = []
        for session in sessions:
            result.append({
                'id': session.id,
                'student': {'id': session.student.id, 'username': session.student.username},
                'teacher': {'id': session.teacher.id, 'username': session.teacher.username},
                'listing_title': session.listing.title,
                'scheduled_time': session.scheduled_time.isoformat(),
                'status': session.status
            })
        
        return jsonify({'sessions': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500