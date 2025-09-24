from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Session, Listing, User
from datetime import datetime
from sqlalchemy.exc import IntegrityError

sessions_bp = Blueprint('sessions', _name_)

@sessions_bp.route('', methods=['GET'])
@jwt_required()
def get_user_sessions():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Get sessions where user is either teacher or student
        query = Session.query.filter(
            db.or_(
                Session.teacher_id == current_user_id,
                Session.student_id == current_user_id
            )
        )
        
        # Filter by status if provided
        if status:
            query = query.filter(Session.status == status)
        
        # Order by scheduled date
        query = query.order_by(Session.scheduled_date.desc())
        
        # Paginate results
        sessions = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'sessions': [session.to_dict() for session in sessions.items],
            'total': sessions.total,
            'pages': sessions.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch sessions'}), 500

@sessions_bp.route('/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    try:
        current_user_id = get_jwt_identity()
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check if user is involved in the session
        if session.teacher_id != current_user_id and session.student_id != current_user_id:
            return jsonify({'error': 'Unauthorized to view this session'}), 403
        
        return jsonify(session.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch session'}), 500

@sessions_bp.route('', methods=['POST'])
@jwt_required()
def create_session():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['listing_id', 'scheduled_date', 'duration']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate listing exists
        listing = Listing.query.get(data['listing_id'])
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        # Check that user is not booking their own listing
        if listing.user_id == current_user_id:
            return jsonify({'error': 'Cannot book your own listing'}), 400
        
        # Validate scheduled date
        try:
            scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
            if scheduled_date <= datetime.utcnow():
                return jsonify({'error': 'Scheduled date must be in the future'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        # Validate duration
        try:
            duration = int(data['duration'])
            if duration < 30 or duration > 480:  # 30 minutes to 8 hours
                return jsonify({'error': 'Duration must be between 30 and 480 minutes'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid duration format'}), 400
        
        session = Session(
            teacher_id=listing.user_id,
            student_id=current_user_id,
            listing_id=data['listing_id'],
            scheduled_date=scheduled_date,
            duration=duration,
            notes=data.get('notes', ''),
            status='pending'
        )
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify({
            'message': 'Session booked successfully',
            'session': session.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create session'}), 500

@sessions_bp.route('/<int:session_id>', methods=['PUT'])
@jwt_required()
def update_session(session_id):
    try:
        current_user_id = get_jwt_identity()
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check if user is involved in the session
        if session.teacher_id != current_user_id and session.student_id != current_user_id:
            return jsonify({'error': 'Unauthorized to update this session'}), 403
        
        data = request.get_json()
        
        # Update status (only teacher can confirm, both can cancel)
        if 'status' in data:
            new_status = data['status']
            if new_status == 'confirmed' and session.teacher_id != current_user_id:
                return jsonify({'error': 'Only the teacher can confirm sessions'}), 403
            if new_status in ['pending', 'confirmed', 'completed', 'cancelled']:
                session.status = new_status
            else:
                return jsonify({'error': 'Invalid status'}), 400
        
        # Update scheduled date (only if pending)
        if 'scheduled_date' in data:
            if session.status != 'pending':
                return jsonify({'error': 'Cannot change date of non-pending session'}), 400
            try:
                scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
                if scheduled_date <= datetime.utcnow():
                    return jsonify({'error': 'Scheduled date must be in the future'}), 400
                session.scheduled_date = scheduled_date
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        
        # Update duration (only if pending)
        if 'duration' in data:
            if session.status != 'pending':
                return jsonify({'error': 'Cannot change duration of non-pending session'}), 400
            try:
                duration = int(data['duration'])
                if duration < 30 or duration > 480:
                    return jsonify({'error': 'Duration must be between 30 and 480 minutes'}), 400
                session.duration = duration
            except ValueError:
                return jsonify({'error': 'Invalid duration format'}), 400
        
        # Update notes
        if 'notes' in data:
            session.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Session updated successfully',
            'session': session.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update session'}), 500

@sessions_bp.route('/<int:session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    try:
        current_user_id = get_jwt_identity()
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        
        # Check if user is involved in the session
        if session.teacher_id != current_user_id and session.student_id != current_user_id:
            return jsonify({'error': 'Unauthorized to delete this session'}), 403
        
        # Only allow deletion of pending sessions
        if session.status != 'pending':
            return jsonify({'error': 'Can only delete pending sessions'}), 400
        
        db.session.delete(session)
        db.session.commit()
        
        return jsonify({'message': 'Session deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete session'}), 500

@sessions_bp.route('/teaching', methods=['GET'])
@jwt_required()
def get_teaching_sessions():
    try:
        current_user_id = get_jwt_identity()
        sessions = Session.query.filter_by(teacher_id=current_user_id).order_by(Session.scheduled_date.desc()).all()
        
        return jsonify([session.to_dict() for session in sessions]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch teaching sessions'}), 500

@sessions_bp.route('/learning', methods=['GET'])
@jwt_required()
def get_learning_sessions():
    try:
        current_user_id = get_jwt_identity()
        sessions = Session.query.filter_by(student_id=current_user_id).order_by(Session.scheduled_date.desc()).all()
        
        return jsonify([session.to_dict() for session in sessions]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch learning sessions'}), 500