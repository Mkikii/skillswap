import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from flask_bcrypt import Bcrypt
from database import db

bcrypt = Bcrypt()

class UserSkill(db.Model, SerializerMixin):
    __tablename__ = 'user_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'))
    proficiency_level = db.Column(db.String(50))
    years_experience = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='user_skills')
    skill = db.relationship('Skill', backref='user_skills')
    
    serialize_rules = ('-user.user_skills', '-skill.user_skills')

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    listings = db.relationship('Listing', backref='user', lazy=True)
    reviews_given = db.relationship('Review', foreign_keys='Review.reviewer_id', backref='reviewer', lazy=True)
    reviews_received = db.relationship('Review', foreign_keys='Review.reviewee_id', backref='reviewee', lazy=True)
    
    serialize_rules = ('-password_hash', '-listings.user', '-reviews_given.reviewer', '-reviews_received.reviewee', '-user_skills.user')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Skill(db.Model, SerializerMixin):
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    
    listings = db.relationship('Listing', backref='skill', lazy=True)
    
    serialize_rules = ('-listings.skill', '-user_skills.skill')

class Listing(db.Model, SerializerMixin):
    __tablename__ = 'listings'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price_per_hour = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    serialize_rules = ('-user.listings', '-skill.listings')

class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    duration_hours = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='scheduled')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    student = db.relationship('User', foreign_keys=[student_id], backref='sessions_as_student')
    teacher = db.relationship('User', foreign_keys=[teacher_id], backref='sessions_as_teacher')
    listing = db.relationship('Listing', backref='sessions')
    
    serialize_rules = ('-student.sessions_as_student', '-teacher.sessions_as_teacher', '-listing.sessions')

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    session = db.relationship('Session', backref='reviews')
    
    serialize_rules = ('-reviewer.reviews_given', '-reviewee.reviews_received', '-session.reviews')