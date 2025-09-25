from app import app, db
from models import User
import bcrypt

with app.app_context():
    user = User.query.filter_by(email="test@example.com").first()
    if user:
       
        hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt())
        user.password_hash = hashed_password.decode('utf-8')
        db.session.commit()
        print("Password reset successfully for testuser")
    else:
        print("User not found")
