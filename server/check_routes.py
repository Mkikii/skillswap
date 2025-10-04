import os

class Config:
    # Use persistent SQLite on Railway (/tmp/ directory persists between deployments)
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/skillswap.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'skillswap-secret-key'
    JWT_SECRET_KEY = 'jwt-skillswap-secret'