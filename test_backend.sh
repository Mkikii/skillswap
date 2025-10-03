#!/bin/bash

API_URL="https://skillswap-production-0e78.up.railway.app"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 COMPREHENSIVE BACKEND TESTING"
echo "=================================="

test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" -w "%{http_code}")
    else
        response=$(curl -s "$API_URL$endpoint" -w "%{http_code}")
    fi
    
    status_code=${response: -3}
    body=${response%???}
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ SUCCESS ($status_code)${NC}"
    else
        echo -e "${RED}❌ FAILED ($status_code)${NC}"
        echo "Response: $body"
    fi
}

# Test all endpoints
test_endpoint "Health Check" "/api/health"
test_endpoint "All Listings" "/api/listings"
test_endpoint "Single Listing" "/api/listings/1"
test_endpoint "Skills" "/api/skills"
test_endpoint "Experts" "/api/users/experts"
test_endpoint "User Search" "/api/users/search?q=maureen"
test_endpoint "User Profile" "/api/users/1"

# Get token for authenticated endpoints
echo -n "Getting auth token... "
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "maureen@example.com", "password": "password123"}')
    
TOKEN=$(echo $TOKEN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    exit 1
fi

# Test authenticated endpoints
test_endpoint "My Listings" "/api/listings/my-listings" "GET" "" "$TOKEN"
test_endpoint "Sessions" "/api/sessions" "GET" "" "$TOKEN"
test_endpoint "Reviews" "/api/reviews" "GET"

echo "=================================="
echo "🎉 Backend testing completed!"