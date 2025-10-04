from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Session, Listing, User
from datetime import datetime

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('', methods=['POST'])
@jwt_required()
def create_session():
    try:
        data = request.get_json()
        student_id = get_jwt_identity()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if not data.get('listing_id'):
            return jsonify({'error': 'Listing ID is required'}), 400
        if not data.get('scheduled_date'):
            return jsonify({'error': 'Scheduled date is required'}), 400
        
        listing = Listing.query.get(data['listing_id'])
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if student_id == listing.user_id:
            return jsonify({'error': 'Cannot book your own listing'}), 400
        
        try:
            scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        # Validate date is in future
        if scheduled_date <= datetime.utcnow():
            return jsonify({'error': 'Scheduled date must be in the future'}), 400
        
        duration_hours = float(data.get('duration_hours', 1.0))
        if duration_hours < 0.5 or duration_hours > 8:
            return jsonify({'error': 'Duration must be between 0.5 and 8 hours'}), 400
        
        session = Session(
            student_id=student_id,
            teacher_id=listing.user_id,
            listing_id=data['listing_id'],
            scheduled_date=scheduled_date,
            duration_hours=duration_hours,
            status='scheduled',
            notes=data.get('notes', '')
        )
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            'message': 'Session booked successfully', 
            'session_id': session.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to book session: ' + str(e)}), 500

@sessions_bp.route('', methods=['GET'])
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
                'listing': {
                    'id': session.listing.id,
                    'title': session.listing.title,
                    'skill': {'name': session.listing.skill.name}
                },
                'scheduled_time': session.scheduled_date.isoformat(),
                'duration_hours': session.duration_hours,
                'status': session.status,
                'notes': session.notes
            })
        return jsonify({'sessions': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/my-sessions', methods=['GET'])
@jwt_required()
def get_my_sessions():
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
                'listing': {
                    'id': session.listing.id,
                    'title': session.listing.title,
                    'skill': {'name': session.listing.skill.name}
                },
                'scheduled_time': session.scheduled_date.isoformat(),
                'duration_hours': session.duration_hours,
                'status': session.status,
                'notes': session.notes
            })
        return jsonify({'sessions': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500