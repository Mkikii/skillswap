import requests
import json

RAILWAY_URL = "https://skillswap-production-0e78.up.railway.app"

def create_listing(title, description, price, skill_name, teacher_email):
    """Create a listing using teacher's account"""
    # Login as the teacher
    login_data = {"email": teacher_email, "password": "password123"}
    login_response = requests.post(f"{RAILWAY_URL}/api/auth/login", json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Could not login as {teacher_email}: {login_response.json().get('error')}")
        return False
    
    token = login_response.json()['access_token']
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Get skill ID
    skills_response = requests.get(f"{RAILWAY_URL}/api/skills")
    skills = skills_response.json().get('skills', [])
    
    skill_id = None
    for skill in skills:
        if skill['name'] == skill_name:
            skill_id = skill['id']
            break
    
    if not skill_id:
        print(f"❌ Could not find skill: {skill_name}")
        return False
    
    # Create listing
    listing_data = {
        "title": title,
        "description": description,
        "price_per_hour": price,
        "skill_id": skill_id
    }
    
    response = requests.post(f"{RAILWAY_URL}/api/listings", json=listing_data, headers=headers)
    
    if response.status_code == 201:
        print(f"✅ Created: {title}")
        return True
    else:
        print(f"❌ Failed to create '{title}': {response.json().get('error')}")
        return False

def create_all_listings():
    print("🚀 Creating Listings for Production...")
    print("=" * 50)
    
    # Check current listings
    listings_response = requests.get(f"{RAILWAY_URL}/api/listings")
    current_listings = len(listings_response.json().get('listings', []))
    print(f"📊 Current listings: {current_listings}")
    
    if current_listings > 0:
        print("✅ Listings already exist!")
        return True
    
    # Listings to create
    listings = [
        {
            "title": "Advanced Python & Flask Development",
            "description": "Master Python programming with Flask framework. Learn REST APIs, database integration, and deployment strategies for full-stack applications.",
            "price_per_hour": 450,
            "skill": "Python Programming",
            "teacher": "seoyeji@example.com"
        },
        {
            "title": "Modern JavaScript & React Development",
            "description": "Comprehensive JavaScript and React course covering ES6+, hooks, state management, and modern frontend development practices.",
            "price_per_hour": 400,
            "skill": "JavaScript", 
            "teacher": "seoyeji@example.com"
        },
        {
            "title": "Full-Stack Web Development Bootcamp",
            "description": "End-to-end web development course covering frontend, backend, databases, and deployment. Perfect for aspiring full-stack developers.",
            "price_per_hour": 500,
            "skill": "Web Development",
            "teacher": "seoyeji@example.com"
        },
        {
            "title": "Learn Python Programming from Scratch",
            "description": "Comprehensive Python course covering basics to advanced topics. Perfect for beginners!",
            "price_per_hour": 350,
            "skill": "Python Programming",
            "teacher": "wooshik@example.com"
        },
        {
            "title": "Graphic Design Fundamentals", 
            "description": "Master the principles of graphic design and create stunning visual content.",
            "price_per_hour": 300,
            "skill": "Graphic Design",
            "teacher": "taehyung@example.com"
        },
        {
            "title": "Italian Cooking Masterclass",
            "description": "Learn authentic Italian recipes and cooking techniques from a professional chef.",
            "price_per_hour": 450,
            "skill": "Cooking",
            "teacher": "jimin@example.com"
        }
    ]
    
    print(f"\n📋 Creating {len(listings)} listings...")
    success_count = 0
    
    for listing in listings:
        if create_listing(
            listing["title"],
            listing["description"], 
            listing["price_per_hour"],
            listing["skill"],
            listing["teacher"]
        ):
            success_count += 1
    
    print(f"\n🎉 Created {success_count}/{len(listings)} listings successfully!")
    
    # Final check
    listings_response = requests.get(f"{RAILWAY_URL}/api/listings")
    final_listings = len(listings_response.json().get('listings', []))
    print(f"📊 Final listings count: {final_listings}")
    
    if final_listings > 0:
        print("✅ SUCCESS! Your production site is ready!")
        print("🌐 Visit: https://skillswap-app.netlify.app")
        return True
    else:
        print("❌ No listings were created.")
        return False

if __name__ == "__main__":
    create_all_listings()