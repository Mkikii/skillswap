import requests
import json

BASE_URL = "http://localhost:5555"

def test_route(name, endpoint, method="GET", data=None, needs_auth=False):
    print(f"\n🧪 Testing {name}...")
    try:
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        # Add auth token if needed
        if needs_auth:
            # First login to get token
            login_data = {"email": "maureen@example.com", "password": "password123"}
            login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
            if login_resp.status_code == 200:
                token = login_resp.json()["access_token"]
                headers["Authorization"] = f"Bearer {token}"
            else:
                print(f"❌ Cannot test {name} - Login failed")
                return
        
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        
        print(f"📡 {method} {endpoint}")
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ SUCCESS")
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)[:200]}...")
        else:
            print("❌ FAILED")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"💥 Request failed: {e}")

print("🚀 COMPREHENSIVE ROUTE TESTING")
print("=" * 60)

# Test public routes
test_route("Health Check", "/api/health")
test_route("Listings", "/api/listings")
test_route("Skills", "/api/skills")
test_route("Experts", "/api/users/experts")

# Test auth routes
test_route("Login", "/api/auth/login", "POST", {
    "email": "maureen@example.com", 
    "password": "password123"
})

# Test authenticated routes (will auto-login)
test_route("Create Listing", "/api/listings", "POST", {
    "title": "Test Listing",
    "description": "This is a test listing",
    "price_per_hour": 100,
    "skill_id": 1
}, needs_auth=True)

test_route("My Listings", "/api/listings/my-listings", needs_auth=True)

print("\n" + "=" * 60)
print("🎉 ROUTE TESTING COMPLETED")
