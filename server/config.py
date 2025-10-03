import os
import re

class Config:
    # Use Railway's PostgreSQL database if available, otherwise fallback to SQLite
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        # Fix for Railway PostgreSQL URL format
        if database_url.startswith('postgres://'):
            SQLALCHEMY_DATABASE_URI = database_url.replace('postgres://', 'postgresql://')
        else:
            SQLALCHEMY_DATABASE_URI = database_url
        print(f"✅ Using PostgreSQL: {SQLALCHEMY_DATABASE_URI[:50]}...")
    else:
        # Fallback to SQLite for local development
        basedir = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'skillswap.db')
        print("✅ Using SQLite for local development")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'skillswap-secret-key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-skillswap-secret')