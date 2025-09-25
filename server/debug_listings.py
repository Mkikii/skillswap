from app import app, db
from models import Listing, User, Skill

with app.app_context():
    print("=== LISTINGS DEBUG ===")
    
    listings_count = Listing.query.count()
    print(f"Total listings in database: {listings_count}")
    
    all_listings = Listing.query.all()
    print(f"Listings from query.all(): {len(all_listings)}")
    
    for i, listing in enumerate(all_listings):
        print(f"{i+1}. ID: {listing.id}, Title: {listing.title}")
        print(f"   User: {listing.user.username if listing.user else 'No user'}")
        print(f"   Skill: {listing.skill.name if listing.skill else 'No skill'}")
    
    print(f"\n=== Testing listing ID 1 ===")
    listing_1 = Listing.query.get(1)
    if listing_1:
        print(f"Listing 1 exists: {listing_1.title}")
        print(f"User: {listing_1.user.username if listing_1.user else 'No user'}")
        print(f"Skill: {listing_1.skill.name if listing_1.skill else 'No skill'}")
    else:
        print("Listing 1 does not exist")
