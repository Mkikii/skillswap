const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

console.log('🔧 API Base URL:', API_BASE_URL);

export const api = {
  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Create listing with better error handling
  async createListing(listingData, token) {
    console.log('📦 Creating listing with data:', listingData);
    console.log('🔑 Token exists:', !!token);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Failed to create listing: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Listing created successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Create listing error:', error);
      throw error;
    }
  },

  // Get all listings
  async getListings() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/listings`);
      return await response.json();
    } catch (error) {
      console.error('Get listings failed:', error);
      throw error;
    }
  },

  // Get all skills
  async getSkills() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`);
      return await response.json();
    } catch (error) {
      console.error('Get skills failed:', error);
      throw error;
    }
  }
};

export default api;