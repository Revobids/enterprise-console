import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, token } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Give some time for auth initialization before checking
    const timer = setTimeout(() => {
      console.log('🔐 Auth check (after delay):', { isAuthenticated, isLoading, hasToken: !!token });
      
      if (!isLoading && !isAuthenticated && !token) {
        console.log('❌ User not authenticated, redirecting to login');
        router.push('/login');
      } else if (isAuthenticated && token) {
        console.log('✅ User authenticated successfully');
      } else if (isLoading) {
        console.log('⏳ Authentication state still loading...');
      }
      
      setHasCheckedAuth(true);
    }, 100); // Small delay to allow auth state to initialize

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, token, router]);

  return { 
    isAuthenticated, 
    isLoading: isLoading || !hasCheckedAuth, 
    hasToken: !!token 
  };
};