// Admin Authentication Redux Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Admin } from '@/types/api';

interface IAdminAuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Firebase authentication flow state
  firebaseStep: 'initial' | 'phone_verification' | 'completed';
  sessionExpiresAt: string | null;
}

const initialState: IAdminAuthState = {
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  firebaseStep: 'initial',
  sessionExpiresAt: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Firebase phone verification step
    phoneVerificationStart: (state) => {
      state.firebaseStep = 'phone_verification';
      state.isLoading = false;
      state.error = null;
    },

    // Firebase authentication
    firebaseAuthStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    firebaseAuthSuccess: (state, action: PayloadAction<{ admin: Admin; expiresAt?: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.sessionExpiresAt = action.payload.expiresAt || null;
      state.error = null;
      state.firebaseStep = 'completed';
    },
    
    firebaseAuthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.admin = null;
      state.firebaseStep = 'initial';
    },

    // Profile management
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    updateProfileSuccess: (state, action: PayloadAction<Admin>) => {
      state.isLoading = false;
      state.admin = action.payload;
      state.error = null;
    },
    
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Initialize admin from token
    initializeAdmin: (state, action: PayloadAction<{ admin: Admin; expiresAt?: string }>) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.sessionExpiresAt = action.payload.expiresAt || null;
      state.firebaseStep = 'completed';
    },

    // Update session expiry
    updateSessionExpiry: (state, action: PayloadAction<string>) => {
      state.sessionExpiresAt = action.payload;
    },

    // Logout
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.firebaseStep = 'initial';
      state.sessionExpiresAt = null;
    },

    // Reset authentication state
    resetAuthState: (state) => {
      state.firebaseStep = 'initial';
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  phoneVerificationStart,
  firebaseAuthStart,
  firebaseAuthSuccess,
  firebaseAuthFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  initializeAdmin,
  updateSessionExpiry,
  logout,
  resetAuthState,
} = adminAuthSlice.actions;

export default adminAuthSlice;