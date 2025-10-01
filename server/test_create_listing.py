import requests
import json

BASE_URL = "http://localhost:5555"

def test_create_listing():
    print("🚀 Testing Create Listing Functionality")
    print("=" * 50)
    
    # Step 1: Login
    print("1. Logging in...")
    login_data = {
        "email": "maureen@example.com",
        "password": "password123"
    }
    
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"   Login Status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print("❌ Login failed!")
        return False
        
    login_data = login_response.json()
    token = login_data["access_token"]
    user = login_data["user"]
    print(f"   ✅ Logged in as: {user['username']}")
    print(f"   Token: {token[:50]}...")
    
    # Step 2: Get skills (to get a valid skill_id)
    print("\n2. Fetching skills...")
    skills_response = requests.get(f"{BASE_URL}/api/skills")
    print(f"   Skills Status: {skills_response.status_code}")
    
    if skills_response.status_code != 200:
        print("❌ Failed to fetch skills!")
        return False
        
    skills_data = skills_response.json()
    skills = skills_data["skills"]
    print(f"   ✅ Found {len(skills)} skills")
    
    if skills:
        skill_id = skills[0]["id"]
        skill_name = skills[0]["name"]
        print(f"   Using skill: {skill_name} (ID: {skill_id})")
    else:
        print("❌ No skills found!")
        return False
    
    # Step 3: Create listing
    print("\n3. Creating listing...")
    listing_data = {
        "title": "Test Python Programming Session",
        "description": "Learn Python programming from basics to advanced topics with hands-on exercises and real-world projects.",
        "price_per_hour": 350,
        "skill_id": skill_id
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    create_response = requests.post(f"{BASE_URL}/api/listings", json=listing_data, headers=headers)
    print(f"   Create Status: {create_response.status_code}")
    
    if create_response.status_code == 201:
        result = create_response.json()
        print("✅ LISTING CREATED SUCCESSFULLY!")
        print(f"   Listing ID: {result['listing']['id']}")
        print(f"   Title: {result['listing']['title']}")
        print(f"   Price: KSh {result['listing']['price_per_hour']}/hr")
        return True
    else:
        print("❌ FAILED TO CREATE LISTING")
        print(f"   Error: {create_response.text}")
        return False

if __name__ == "__main__":
    success = test_create_listing()
    if success:
        print("\n🎉 Create listing test PASSED!")
    else:
        print("\n💥 Create listing test FAILED!")
