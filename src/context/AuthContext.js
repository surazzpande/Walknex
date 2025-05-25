import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  createUser, 
  signIn, 
  signInWithGoogle, 
  logout, 
  updateUserProfile 
} from '../services/firebase';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    setError('');
    try {
      const userCredential = await createUser(email, password);
      // Update the user profile with display name
      if (displayName) {
        await updateUserProfile(userCredential.user, { displayName });
      }
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setError('');
    try {
      return await signIn(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setError('');
    try {
      return await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logoutUser = async () => {
    setError('');
    try {
      await logout();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile
  const updateUser = async (profile) => {
    setError('');
    if (!currentUser) {
      setError('No user logged in');
      throw new Error('No user logged in');
    }
    
    try {
      await updateUserProfile(currentUser, profile);
      // Force refresh the user object
      setCurrentUser({ ...currentUser, ...profile });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout: logoutUser,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};