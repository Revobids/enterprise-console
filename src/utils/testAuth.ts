// Development utility to test authentication flow
export const testAuthFlow = async () => {
  console.log('🔧 Testing authentication flow...');
  
  // Test API endpoint connectivity
  try {
    const response = await fetch('http://localhost:3000/admin/auth/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: 'test-token-for-connectivity-check'
      })
    });
    
    console.log('📡 API Response status:', response.status);
    
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      console.log('✅ API endpoint is reachable (expected auth error)');
    } else {
      console.log('❓ Unexpected response:', response.status);
    }
    
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
};

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// Log authentication attempts for debugging
export const logAuthAttempt = (step: string, data: any) => {
  if (isDevelopment) {
    console.log(`🔐 Auth Step: ${step}`, data);
  }
};