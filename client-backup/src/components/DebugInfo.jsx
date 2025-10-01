import React from 'react';

const DebugInfo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const testConnection = async () => {
    try {
      console.log('Testing connection to:', apiUrl);
      const response = await fetch(`${apiUrl}/api/health`);
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      alert('✅ Backend connection successful!');
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      alert('❌ Backend connection failed. Check console for details.');
    }
  };

  return (
    <div style={{ 
      background: '#f3f4f6', 
      padding: '1rem', 
      margin: '1rem 0',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem'
    }}>
      <h3>🔧 Debug Information</h3>
      <p><strong>API URL:</strong> {apiUrl || 'Not set'}</p>
      <button 
        onClick={testConnection}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Test Backend Connection
      </button>
    </div>
  );
};

export default DebugInfo;