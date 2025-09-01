import { auth } from '@/config/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up Supabase auth state listener');
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await auth.getSession();
      if (error) {
        console.error('AuthProvider: Error getting initial session:', error);
      } else {
        console.log('AuthProvider: Initial session', {
          isLoggedIn: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
        });
        setSession(session);
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Auth state changed', {
        event,
        isLoggedIn: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider: Cleaning up Supabase auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    try {
      console.log('AuthProvider: Signing out user');
      const { error } = await auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        throw error;
      }
      console.log('AuthProvider: User signed out successfully');
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
