
  const handleDemoLogin = async () => {
    try {
      console.log('Attempting demo login...');
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'maureen@example.com',
          password: 'password123'
        })
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Login successful, user data:', data.user);
        login(data.user, data.access_token);
        alert('🎉 Demo login successful! Welcome to SkillSwap!');
        // Refresh the page to update all components
        window.location.reload();
      } else {
        console.error('Login failed:', data.error);
        alert('❌ Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Login failed. Please check your connection and try again.');
    }
  };
