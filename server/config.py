import os

class Config:
    # FORCE SQLITE - IGNORE DATABASE_URL
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/skillswap.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'skillswap-secret-key'
    JWT_SECRET_KEY = 'jwt-skillswap-secret'