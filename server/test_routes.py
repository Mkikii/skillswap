import requests
import json

BASE_URL = "http://localhost:5555"

def test_health_check():
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Health Check: {response.status_code} - {response.json()}")

def test_listings():
    response = requests.get(f"{BASE_URL}/api/listings")
    print(f"Listings: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data.get('listings', []))} listings")
        for listing in data.get('listings', [])[:3]:
            print(f"  - {listing['title']} - KSH {listing['price_per_hour']}/hr")

def test_skills():
    response = requests.get(f"{BASE_URL}/api/skills")
    print(f"Skills: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data.get('skills', []))} skills")

def test_experts():
    response = requests.get(f"{BASE_URL}/api/users/experts")
    print(f"Experts: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data.get('experts', []))} experts")

def test_login():
    login_data = {
        "email": "maureen@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Login successful!")
        return data.get('access_token')
    return None

def test_all():
    print("🧪 Testing SkillSwap API Routes...\n")
    
    test_health_check()
    print()
    
    test_listings()
    print()
    
    test_skills()
    print()
    
    test_experts()
    print()
    
    token = test_login()
    if token:
        print("✅ All basic tests passed!")
    else:
        print("❌ Login test failed")

if __name__ == "__main__":
    test_all()