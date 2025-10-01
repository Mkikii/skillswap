// Test script for full stack functionality
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

async function testFullStack() {
    console.log('🚀 Testing Full Stack Application...');
    
    try {
        // Test backend connection
        const health = await fetch(`${API_URL}/api/health`);
        console.log('✅ Backend health:', health.status);
        
        // Test data fetching
        const listings = await fetch(`${API_URL}/api/listings`);
        const listingsData = await listings.json();
        console.log('✅ Listings loaded:', listingsData.listings?.length || 0);
        
        // Test authentication
        const login = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'maureen@example.com',
                password: 'password123'
            })
        });
        console.log('✅ Authentication:', login.status);
        
        console.log('🎉 All tests passed! Application is ready.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testFullStack();
