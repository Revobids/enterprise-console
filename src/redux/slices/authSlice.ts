import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiManager } from '../../api/ApiManager';
import { AdminAuthResponse, User } from '../../types/api';

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  phoneVerificationInProgress: boolean;
  firebaseUser: any;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,
  phoneVerificationInProgress: false,
  firebaseUser: null,
};

// Async thunks for authentication
export const authenticateAdmin = createAsyncThunk(
  'auth/authenticateAdmin',
  async (authData: { idToken: string; deviceInfo?: any }, { rejectWithValue }) => {
    try {
      const response = await ApiManager.authenticateWithFirebase(authData);
      return response as AdminAuthResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await ApiManager.logout();
      return {};
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFirebaseUser: (state, action: PayloadAction<any>) => {
      state.firebaseUser = action.payload;
    },
    setPhoneVerificationInProgress: (state, action: PayloadAction<boolean>) => {
      state.phoneVerificationInProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Initialize auth state from localStorage
    initializeAuthState: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        console.log('Initializing auth state, token found:', token ? 'Yes' : 'No');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          console.log('Auth state initialized: authenticated = true');
        } else {
          console.log('Auth state initialized: authenticated = false');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Authenticate Admin
      .addCase(authenticateAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.admin as User;
        state.token = action.payload.token;
        state.error = null;
        console.log('Auth success - Redux state updated:', { 
          isAuthenticated: true, 
          hasToken: !!action.payload.token,
          user: action.payload.admin 
        });
      })
      .addCase(authenticateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.firebaseUser = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFirebaseUser,
  setPhoneVerificationInProgress,
  clearError,
  initializeAuthState,
} = authSlice.actions;

export default authSlice.reducer;