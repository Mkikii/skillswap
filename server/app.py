from config import app, db

# Import routes
from routes.auth import auth_bp
from routes.skills import skills_bp
from routes.listings import listings_bp
from routes.sessions import sessions_bp
from routes.reviews import reviews_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(skills_bp, url_prefix='/api/skills')
app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
app.register_blueprint(reviews_bp, url_prefix='/api/reviews')

@app.route('/')
def home():
    return {"message": "SkillSwap API is running!", "version": "1.0.0"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5555)
