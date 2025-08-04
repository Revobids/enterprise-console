import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import developerSlice from './slices/developerSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    developer: developerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'auth/setFirebaseUser'],
        ignoredPaths: ['auth.firebaseUser'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;