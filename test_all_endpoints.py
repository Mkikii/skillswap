import requests
import json

BASE_URL = "http://localhost:5555"

def test_endpoint(name, endpoint, method="GET", data=None):
    try:
        print(f"\n🧪 Testing {name}...")
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        
        print(f"📡 {method} {endpoint}")
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ SUCCESS")
            result = response.json()
            if 'listings' in result:
                print(f"📋 Found {len(result['listings'])} listings")
            elif 'skills' in result:
                print(f"🎯 Found {len(result['skills'])} skills")
            elif 'experts' in result:
                print(f"👥 Found {len(result['experts'])} experts")
            elif 'user' in result:
                print(f"👤 Logged in as: {result['user']['username']}")
        else:
            print("❌ FAILED")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"💥 Request failed: {e}")

print("🚀 STARTING COMPREHENSIVE BACKEND TEST")
print("=" * 50)

# Test all endpoints
test_endpoint("Health Check", "/api/health")
test_endpoint("Listings", "/api/listings")
test_endpoint("Skills", "/api/skills")
test_endpoint("Experts", "/api/users/experts")
test_endpoint("Login", "/api/auth/login", "POST", {
    "email": "maureen@example.com",
    "password": "password123"
})

print("\n" + "=" * 50)
print("�� BACKEND TESTING COMPLETED")
