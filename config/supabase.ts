import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Get Supabase credentials from environment
// Note: You need to set these in your .env file with EXPO_PUBLIC_ prefix
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your_project_ref.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here';

// Create platform-specific storage configuration
const supabaseOptions = {
  auth: {
    // Use AsyncStorage for React Native, localStorage for web
    storage: Platform.OS !== 'web' ? AsyncStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
};

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),

  // Sign in with email and password
  signInWithPassword: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),

  // Sign in with OAuth provider (for web)
  signInWithOAuth: (provider: 'google' | 'apple') => 
    supabase.auth.signInWithOAuth({ provider }),

  // Sign in with ID token (for native OAuth)
  signInWithIdToken: (provider: 'google' | 'apple', token: string, nonce?: string) => 
    supabase.auth.signInWithIdToken({ 
      provider, 
      token,
      nonce 
    }),

  // Sign out
  signOut: () => supabase.auth.signOut(),

  // Get current session
  getSession: () => supabase.auth.getSession(),

  // Get current user
  getUser: () => supabase.auth.getUser(),

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => 
    supabase.auth.onAuthStateChange(callback),
};

export default supabase;
