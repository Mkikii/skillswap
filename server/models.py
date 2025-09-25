from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from flask_bcrypt import Bcrypt

from config import db

bcrypt = Bcrypt()

user_skills = db.Table('user_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    skills = db.relationship('Skill', secondary=user_skills, lazy='subquery',
                           backref=db.backref('users', lazy=True))
    
    listings = db.relationship('Listing', backref='user', lazy=True)
    teaching_sessions = db.relationship('Session', foreign_keys='Session.teacher_id', backref='teacher', lazy=True)
    learning_sessions = db.relationship('Session', foreign_keys='Session.student_id', backref='student', lazy=True)
    given_reviews = db.relationship('Review', foreign_keys='Review.reviewer_id', backref='reviewer', lazy=True)
    received_reviews = db.relationship('Review', foreign_keys='Review.reviewee_id', backref='reviewee', lazy=True)
    
    serialize_rules = ('-password_hash', '-teaching_sessions', '-learning_sessions', '-given_reviews', '-received_reviews')
    
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

class Listing(db.Model, SerializerMixin):
    __tablename__ = 'listings'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price_per_hour = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sessions = db.relationship('Session', backref='listing', lazy=True)
    
    serialize_rules = ('-sessions',)

class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    review = db.relationship('Review', backref='session', uselist=False, lazy=True)

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
