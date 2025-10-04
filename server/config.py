import os

class Config:
    if os.environ.get('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/skillswap.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'skillswap-secret-key'
    JWT_SECRET_KEY = 'jwt-skillswap-secret'

