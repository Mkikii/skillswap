import requests
import json

BASE_URL = "http://localhost:5555"

def test_endpoint(endpoint, method="GET", data=None):
    try:
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        
        print(f"\n{method} {endpoint}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Success")
            print(json.dumps(response.json(), indent=2))
        else:
            print("❌ Error")
            print(response.text)
        
        return response
        
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing SkillSwap API Endpoints")
    print("=" * 50)
    
    test_endpoint("/api/health")
    
    test_endpoint("/api/listings")
    
    test_endpoint("/api/skills")
    
    test_endpoint("/api/users/experts")
    
    test_endpoint("/api/auth/login", "POST", {
        "email": "maureen@example.com",
        "password": "password123"
    })