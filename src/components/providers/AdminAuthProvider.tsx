'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAdmin, logout } from '@/redux/slices/adminAuthSlice';
import { getCookie } from '@/api/ApiMethods';
import ApiManager from '@/api/ApiManager';

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export default function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie('admin_access_token');
      
      if (!token) {
        // No token found, user is not authenticated
        return;
      }

      try {
        // Validate token by fetching admin profile
        const response = await ApiManager.getAdminProfile();
        
        if (response.success && response.data) {
          // Token is valid, initialize admin state
          dispatch(initializeAdmin({ 
            admin: response.data,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          }));
        } else {
          // Invalid response, logout
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error validating admin token:', error);
        // Token is invalid or expired, logout
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
}