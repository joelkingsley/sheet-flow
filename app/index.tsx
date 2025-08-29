import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    // Redirect to the tabs when the app starts
    router.replace('/(tabs)');
  }, []);

  return null;
}
