import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'skillswap.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'skillswap-secret-key'
    JWT_SECRET_KEY = 'jwt-skillswap-secret'