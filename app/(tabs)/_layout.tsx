import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();

  console.log('TabLayout: Render state', { 
    isLoading, 
    hasUser: !!user, 
    userEmail: user?.email,
    isAnonymous: user?.isAnonymous 
  });

  useEffect(() => {
    console.log('TabLayout: useEffect triggered', { isLoading, hasUser: !!user });
    
    // Use a timeout to ensure navigation happens after component is mounted
    const checkAuthAndNavigate = () => {
      if (!isLoading && !user) {
        console.log('TabLayout: User not authenticated, redirecting to login');
        // If user is not authenticated, redirect to login
        setTimeout(() => {
          router.replace('/auth/login');
        }, 100);
      } else if (!isLoading && user) {
        console.log('TabLayout: User is authenticated, staying on tabs');
      }
    };

    checkAuthAndNavigate();
  }, [user, isLoading]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user is not authenticated, show loading (will redirect)
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
