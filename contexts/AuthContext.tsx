import { auth } from '@/config/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOutUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthProvider: Auth state changed', {
        isLoggedIn: !!user,
        uid: user?.uid,
        email: user?.email,
        isAnonymous: user?.isAnonymous,
        providerId: user?.providerData?.[0]?.providerId
      });
      
      // Add additional debugging
      if (user) {
        console.log('AuthProvider: User is authenticated');
        console.log('AuthProvider: User metadata:', {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        });
      } else {
        console.log('AuthProvider: No authenticated user found');
      }
      
      setUser(user);
      setIsLoading(false);
    }, (error) => {
      console.error('AuthProvider: Auth state change error:', error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    try {
      console.log('AuthProvider: Signing out user');
      await signOut(auth);
      console.log('AuthProvider: User signed out successfully');
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
