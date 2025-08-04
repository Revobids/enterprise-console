import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setFirebaseUser, initializeAuthState } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize auth state on client side
    if (typeof window !== 'undefined' && !isInitialized) {
      console.log('🚀 Initializing auth state...');
      dispatch(initializeAuthState());
      setIsInitialized(true);
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Firebase auth state changed:', user ? 'User present' : 'No user');
      dispatch(setFirebaseUser(user));
    });

    return () => unsubscribe();
  }, [dispatch, isInitialized]);

  return {
    ...authState,
    firebaseAuth: auth,
    isLoading: authState.isLoading || !isInitialized,
  };
};