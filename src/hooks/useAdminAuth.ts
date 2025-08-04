'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout as logoutAction } from '@/redux/slices/adminAuthSlice';
import ApiManager from '@/api/ApiManager';

export const useAdminAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { admin, isAuthenticated, isLoading, error, sessionExpiresAt } = useAppSelector(
    (state) => state.adminAuth
  );

  const logout = useCallback(async () => {
    try {
      await ApiManager.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch(logoutAction());
      router.push('/login');
    }
  }, [dispatch, router]);

  const checkSession = useCallback(() => {
    if (!sessionExpiresAt) return true;
    
    const expiryTime = new Date(sessionExpiresAt);
    const currentTime = new Date();
    
    if (currentTime >= expiryTime) {
      logout();
      return false;
    }
    
    return true;
  }, [sessionExpiresAt, logout]);

  const hasPermission = useCallback((permission: string) => {
    if (!admin) return false;
    
    // Super admin has all permissions
    if (admin.role === 'SUPER_ADMIN') return true;
    
    // Check if admin has the specific permission
    return admin.permissions.includes(permission);
  }, [admin]);

  const hasRole = useCallback((role: string | string[]) => {
    if (!admin) return false;
    
    if (Array.isArray(role)) {
      return role.includes(admin.role);
    }
    
    return admin.role === role;
  }, [admin]);

  return {
    admin,
    isAuthenticated,
    isLoading,
    error,
    logout,
    checkSession,
    hasPermission,
    hasRole,
    isSessionValid: checkSession(),
  };
};