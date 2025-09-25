from app import app, db
from models import Listing
from flask import jsonify

with app.app_context():
    print("=== TESTING ROUTE LOGIC ===")
    
    # Simulate what the route does
    try:
        listings = Listing.query.all()
        result = []
        for listing in listings:
            result.append({
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'user': {
                    'id': listing.user.id,
                    'username': listing.user.username
                },
                'skill': {
                    'id': listing.skill.id,
                    'name': listing.skill.name,
                    'category': listing.skill.category
                }
            })
        print(f"Route would return {len(result)} listings")
        print("Sample of first listing:", result[0] if result else "No listings")
        
    except Exception as e:
        print(f"Error in route logic: {e}")
        import traceback
        traceback.print_exc()
