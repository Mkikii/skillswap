from flask import Flask
from flask_cors import CORS
from config import db
from routes.listings import listings_bp
from routes.auth import auth_bp
from routes.skills import skills_bp

app = Flask(__name__)
app.config.from_object('config')

CORS(app)
db.init_app(app)

app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(skills_bp, url_prefix='/api/skills')

@app.route('/')
def home():
    return {
        'message': 'SkillSwap API is running!',
        'endpoints': {
            'auth': '/api/auth',
            'listings': '/api/listings',
            'skills': '/api/skills'
        }
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5555)