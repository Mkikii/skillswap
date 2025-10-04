import os
import requests
import json

RAILWAY_URL = "https://skillswap-production-0e78.up.railway.app"

def create_user(username, email, password, bio):
    """Create a user and return their ID"""
    user_data = {
        "username": username,
        "email": email,
        "password": password,
        "bio": bio
    }
    
    response = requests.post(f"{RAILWAY_URL}/api/auth/register", json=user_data)
    if response.status_code == 201:
        user_id = response.json()['user']['id']
        print(f"✅ Created user: {username} (ID: {user_id})")
        return user_id
    else:
        print(f"❌ Failed to create user {username}: {response.json().get('error')}")
        return None

def create_listing(title, description, price, user_id, skill_id):
    """Create a listing using the API"""
    listing_data = {
        "title": title,
        "description": description,
        "price_per_hour": price,
        "skill_id": skill_id
    }
    
    # Get auth token for the user
    login_data = {"email": "seoyeji@example.com", "password": "password123"}
    login_response = requests.post(f"{RAILWAY_URL}/api/auth/login", json=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json()['access_token']
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{RAILWAY_URL}/api/listings", json=listing_data, headers=headers)
        if response.status_code == 201:
            print(f"✅ Created listing: {title}")
        else:
            print(f"❌ Failed to create listing {title}: {response.json().get('error')}")
    else:
        print(f"❌ Could not login to create listing: {login_response.json().get('error')}")

def seed_railway_simple():
    print("🌱 Simple Railway Seeding Started...")
    print("=" * 50)
    
    # First, let's see what's already there
    print("📊 Checking current data...")
    listings_response = requests.get(f"{RAILWAY_URL}/api/listings")
    skills_response = requests.get(f"{RAILWAY_URL}/api/skills")
    
    current_listings = len(listings_response.json().get('listings', []))
    current_skills = len(skills_response.json().get('skills', []))
    
    print(f"Current listings: {current_listings}")
    print(f"Current skills: {current_skills}")
    
    if current_listings > 0:
        print("✅ Database already has data!")
        return True
    
    print("\n🚀 Starting seeding process...")
    
    # Create users
    print("\n👥 Creating users...")
    users = []
    
    # Teachers
    users.append(create_user("Seoyeji", "seoyeji@example.com", "password123", 
                           "Software Engineering lecturer and full-stack developer with expertise in modern web technologies."))
    
    users.append(create_user("wooshik", "wooshik@example.com", "password123",
                           "Full-stack developer passionate about teaching Python and web development."))
    
    users.append(create_user("Taehyung", "taehyung@example.com", "password123",
                           "Graphic designer with 5 years of experience in UI/UX design."))
    
    users.append(create_user("Jimin", "jimin@example.com", "password123",
                           "Professional chef specializing in Italian and French cuisine."))
    
    # Students
    users.append(create_user("maureen", "maureen@example.com", "password123",
                           "Student learning web development and programming."))
    
    users.append(create_user("kikii", "kikii@example.com", "password123",
                           "Student interested in design and creative arts."))
    
    users.append(create_user("najma", "najma@example.com", "password123",
                           "Student exploring culinary arts and cooking."))
    
    # Filter out None values (failed creations)
    users = [user for user in users if user is not None]
    
    print(f"\n✅ Created {len(users)} users")
    
    # Create listings using the first teacher (Seoyeji)
    if users and len(users) >= 4:
        print("\n📋 Creating listings...")
        
        # Get skills to find their IDs
        skills_response = requests.get(f"{RAILWAY_URL}/api/skills")
        skills = skills_response.json().get('skills', [])
        
        # Find skill IDs
        skill_ids = {}
        for skill in skills:
            skill_ids[skill['name']] = skill['id']
        
        # Create listings using Seoyeji's account
        listings = [
            {
                "title": "Advanced Python & Flask Development",
                "description": "Master Python programming with Flask framework. Learn REST APIs, database integration, and deployment strategies for full-stack applications.",
                "price_per_hour": 450,
                "skill_id": skill_ids.get("Python Programming")
            },
            {
                "title": "Modern JavaScript & React Development", 
                "description": "Comprehensive JavaScript and React course covering ES6+, hooks, state management, and modern frontend development practices.",
                "price_per_hour": 400,
                "skill_id": skill_ids.get("JavaScript")
            },
            {
                "title": "Full-Stack Web Development Bootcamp",
                "description": "End-to-end web development course covering frontend, backend, databases, and deployment. Perfect for aspiring full-stack developers.",
                "price_per_hour": 500,
                "skill_id": skill_ids.get("Web Development")
            }
        ]
        
        for listing in listings:
            if listing["skill_id"]:
                create_listing(listing["title"], listing["description"], listing["price_per_hour"], users[0], listing["skill_id"])
            else:
                print(f"❌ Could not find skill for: {listing['title']}")
    
    print("\n🎉 SIMPLE SEEDING COMPLETED!")
    print("=" * 50)
    print("🔑 DEMO ACCOUNTS:")
    print("👨‍🏫 Teachers:")
    print("   - seoyeji@example.com / password123")
    print("   - wooshik@example.com / password123") 
    print("   - taehyung@example.com / password123")
    print("   - jimin@example.com / password123")
    print("👩‍🎓 Students:")
    print("   - maureen@example.com / password123")
    print("   - kikii@example.com / password123")
    print("   - najma@example.com / password123")
    print("=" * 50)
    
    # Final check
    print("\n🧪 Final check...")
    listings_response = requests.get(f"{RAILWAY_URL}/api/listings")
    final_listings = len(listings_response.json().get('listings', []))
    print(f"📊 Final listings count: {final_listings}")
    
    if final_listings > 0:
        print("✅ SUCCESS! Your production database is ready!")
        print("🌐 Visit: https://skillswap-app.netlify.app")
    else:
        print("❌ No listings created. Check the errors above.")

if __name__ == "__main__":
    seed_railway_simple()