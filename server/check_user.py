from app import app, db
from models import User

with app.app_context():
    user = User.query.filter_by(email="test@example.com").first()
    if user:
        print(f"User: {user.username}")
        print(f"Email: {user.email}")
        print(f"Has password_hash: {hasattr(user, 'password_hash')}")
        if hasattr(user, 'password_hash'):
            print(f"Password hash length: {len(user.password_hash) if user.password_hash else 0}")
    else:
        print("User not found")
